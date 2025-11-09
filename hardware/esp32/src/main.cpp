#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <esp_wifi.h>
#include <NimBLEDevice.h>
#include <DHT.h>
#include <set>
#include <tuple>
#include <list>

#ifndef WIFI_SSID
#error "WIFI_SSID not defined! Please create secrets.ini file. See secrets.ini.example"
#endif
#ifndef WIFI_PASS
#error "WIFI_PASS not defined! Please create secrets.ini file. See secrets.ini.example"
#endif
#ifndef SERVER_URL
#warning "SERVER_URL not defined! Please create secrets.ini file. See secrets.ini.example"
#endif

const String WIFI_SSID_STR = WIFI_SSID;
const String WIFI_PASS_STR = WIFI_PASS;
const String SERVER_URL_STR = String(SERVER_URL);

const int TEMP_SENSOR_PIN = 4;
const int DHT_TYPE = DHT11;

const unsigned long UPLOAD_INTERVAL_MS = 5UL * 60UL * 1000UL; // 5 minutes
const unsigned long READ_INTERVAL_MS = 1UL * 60UL * 1000UL;   // 1 minute

const unsigned int BLE_SCAN_DURATION_SEC = 5;
const uint16_t BLE_SCAN_INTERVAL = 100;
const uint16_t BLE_SCAN_WINDOW = 50;

const unsigned int WIFI_SNIFF_DURATION_SEC = 20;

const unsigned int WIFI_STOP_DELAY_MS = 100;
const unsigned int WIFI_START_DELAY_MS = 200;
const unsigned int BLE_DEINIT_DELAY_MS = 100;

// Global State
std::set<String> wifiDevicesSeen;
int bleRandomMacCount = 0;

std::list<std::pair<float, float>> temperatureHumidityReadings;

unsigned long lastUploadTime = 0;
unsigned long lastReadTime = (unsigned long)(0 - READ_INTERVAL_MS);

DHT dhtSensor(TEMP_SENSOR_PIN, DHT_TYPE);

class BleDeviceResultHandler : public NimBLEAdvertisedDeviceCallbacks
{
  void onResult(NimBLEAdvertisedDevice *advertisedDevice) override
  {
    std::string macAddress = advertisedDevice->getAddress().toString();

    if (macAddress.length() < 2)
      return;

    // Filter random MAC addresses (check README for explanation)
    char secondChar = tolower(macAddress[1]);
    if (secondChar == '2' || secondChar == '6' || secondChar == 'a' || secondChar == 'e')
      bleRandomMacCount++;

    return;
  }
};

// BLE Scanning
int scanBLE(unsigned durationSeconds)
{
  if (WiFi.status() == WL_CONNECTED)
  {
    WiFi.disconnect(true, true);
    delay(WIFI_STOP_DELAY_MS);
  }

  esp_wifi_stop();
  delay(WIFI_STOP_DELAY_MS);

  WiFi.mode(WIFI_OFF);
  delay(WIFI_START_DELAY_MS);

  esp_wifi_deinit();
  delay(300);

  NimBLEDevice::init("");
  delay(100);

  NimBLEScan *pScan = NimBLEDevice::getScan();

  static BleDeviceResultHandler bleDeviceResultHandler;
  pScan->setAdvertisedDeviceCallbacks(&bleDeviceResultHandler);
  pScan->setActiveScan(false);
  pScan->setInterval(BLE_SCAN_INTERVAL);
  pScan->setWindow(BLE_SCAN_WINDOW);

  pScan->start(durationSeconds, false);

  NimBLEDevice::deinit(true);
  delay(BLE_DEINIT_DELAY_MS);

  return bleRandomMacCount;
}

// WiFi Packet Sniffing
void wifiSnifferPacketHandler(void *buf, wifi_promiscuous_pkt_type_t type)
{
  const wifi_promiscuous_pkt_t *packet = (wifi_promiscuous_pkt_t *)buf;
  const uint8_t *payload = packet->payload;

  char macAddressStr[18];
  sprintf(macAddressStr, "%02X:%02X:%02X:%02X:%02X:%02X",
          payload[10], payload[11], payload[12],
          payload[13], payload[14], payload[15]);

  wifiDevicesSeen.insert(String(macAddressStr));
}

int sniffWiFi(unsigned durationSeconds)
{
  wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();
  esp_wifi_init(&cfg);
  delay(100);

  esp_wifi_start();
  delay(WIFI_STOP_DELAY_MS);

  WiFi.mode(WIFI_MODE_STA);
  delay(WIFI_START_DELAY_MS);

  esp_wifi_set_promiscuous(true);
  esp_wifi_set_promiscuous_rx_cb(&wifiSnifferPacketHandler);

  delay(durationSeconds * 1000);

  esp_wifi_set_promiscuous(false);
  esp_wifi_set_promiscuous_rx_cb(NULL);

  return wifiDevicesSeen.size();
}

// Environmental Sensors
void readTemperatureHumidity()
{
  float temperature = isnan(dhtSensor.readTemperature()) ? -999.0f : dhtSensor.readTemperature();
  float humidity = isnan(dhtSensor.readHumidity()) ? -999.0f : dhtSensor.readHumidity();

  temperatureHumidityReadings.emplace_back(temperature, humidity);

  Serial.printf("Temperature: %.1f C, Humidity: %.1f %%\n", temperature, humidity);
}

std::tuple<float, float> averageTemperatureHumidity()
{
  if (temperatureHumidityReadings.empty())
    return std::make_tuple(0.0f, 0.0f);

  float sumTemp = 0.0f;
  float sumHum = 0.0f;
  for (const auto &reading : temperatureHumidityReadings)
  {
    sumTemp += reading.first;
    sumHum += reading.second;
  }

  int count = temperatureHumidityReadings.size();
  float avgTemp = sumTemp / count;
  float avgHum = sumHum / count;

  temperatureHumidityReadings.clear();

  return std::make_tuple(avgTemp, avgHum);
}

// Network Connectivity
void connectToWiFi()
{
  if (WiFi.status() == WL_CONNECTED)
    return;

  Serial.print("Connecting to WiFi");
  WiFi.mode(WIFI_MODE_STA);
  WiFi.begin(WIFI_SSID_STR, WIFI_PASS_STR);
  const int maxRetries = 20;
  int retryCount = 0;
  while (WiFi.status() != WL_CONNECTED && retryCount < maxRetries)
  {
    delay(500);
    Serial.print(".");
    retryCount++;
  }
  if (WiFi.status() == WL_CONNECTED)
  {
    Serial.println(" connected!");
  }
  else
  {
    Serial.println(" failed to connect to WiFi!");
  }
}

// Data Upload
void uploadData(int bleDeviceCount, int wifiDeviceCount, float avgTemperature, float avgHumidity)
{
  if (WiFi.status() != WL_CONNECTED)
  {
    Serial.println("Cannot upload: WiFi not connected");
    return;
  }

  String jsonPayload = "{\"ble\":" + String(bleDeviceCount) +
                       ",\"wifi\":" + String(wifiDeviceCount) +
                       ",\"temperature\":" + String(avgTemperature, 1) +
                       ",\"humidity\":" + String(avgHumidity, 1) + "}";

  Serial.printf("Uploading data: %s\n", jsonPayload.c_str());

  const int maxRetries = 3;
  const int retryDelays[] = {1000, 2000, 5000};

  for (int attempt = 0; attempt < maxRetries; attempt++)
  {
    HTTPClient http;
    http.begin(SERVER_URL_STR);
    http.addHeader("Content-Type", "application/json");
    http.setTimeout(10000);

    int httpCode = http.POST(jsonPayload);

    if (httpCode == 200 || httpCode == 201)
    {
      Serial.printf("Upload successful (HTTP %d): %s\n", httpCode, http.getString().c_str());
      http.end();
      return;
    }
    else if (httpCode > 0)
    {
      Serial.printf("Upload failed (HTTP %d): %s\n", httpCode, http.getString().c_str());
    }
    else
    {
      Serial.printf("Upload failed: %s\n", http.errorToString(httpCode).c_str());
    }

    http.end();

    if (attempt < maxRetries - 1)
    {
      Serial.printf("Retrying in %dms... (attempt %d/%d)\n",
                    retryDelays[attempt], attempt + 2, maxRetries);
      delay(retryDelays[attempt]);
    }
  }

  Serial.println("Upload failed after all retries");
}

// Main Program
void setup()
{
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n--------------------------------------------");
  Serial.println("Trail Traffic Monitor - Starting");
  Serial.println("--------------------------------------------\n");

  dhtSensor.begin();
  connectToWiFi();

  Serial.println("System ready. Beginning data collection...\n");
}

void loop()
{
  unsigned long currentTime = millis();

  if (currentTime - lastReadTime >= READ_INTERVAL_MS)
  {
    readTemperatureHumidity();
    lastReadTime = currentTime;

    Serial.println("\n--- Starting BLE scan ---");
    int bleCount = scanBLE(BLE_SCAN_DURATION_SEC);
    Serial.printf("BLE scan complete: %d static MAC addresses detected\n", bleCount);

    Serial.println("\n--- Starting WiFi sniff ---");
    int wifiCount = sniffWiFi(WIFI_SNIFF_DURATION_SEC);
    Serial.printf("WiFi sniff complete: %d unique MAC addresses detected\n", wifiCount);

    Serial.printf("\nCycle totals -> BLE: %d  WiFi: %d\n", bleCount, wifiCount);
  }

  if (currentTime - lastUploadTime >= UPLOAD_INTERVAL_MS)
  {
    Serial.println("\n--------------------------------------------");
    Serial.println("5-minute upload cycle");
    Serial.println("--------------------------------------------");

    float avgTemp, avgHum;
    std::tie(avgTemp, avgHum) = averageTemperatureHumidity();

    Serial.printf("Period totals -> BLE: %d  WiFi: %d\n",
                  bleRandomMacCount, wifiDevicesSeen.size());
    Serial.printf("Environmental averages -> Temperature: %.1f °C, Humidity: %.1f %%\n",
                  avgTemp, avgHum);

    connectToWiFi();
    if (WiFi.status() == WL_CONNECTED)
    {
      uploadData(bleRandomMacCount, wifiDevicesSeen.size(), avgTemp, avgHum);
    }
    else
    {
      Serial.println("WARNING: Upload skipped - WiFi not connected");
    }

    lastUploadTime = currentTime;
    bleRandomMacCount = 0;
    wifiDevicesSeen.clear();
  }
}
