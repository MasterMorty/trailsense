# TrailSense - Hardware Code

This part of the codebase contains all of the code that is necessary to measure the amount of users that access a specific trail.
To do this both WiFi Probe Request Sniffing and BLE Advertisement Scanning is being used for crowd counting. The hardware also measures temperature and humidity using a DHT sensor.

## Prerequisites

- ESP32 board
- DHT sensor (DHT11 or DHT22)
- Some jumper wires (actually just 3)

## Wiring

- Connect the DHT sensor's VCC pin to the ESP32's 3.3V pin
- Connect the DHT sensor's GND pin to the ESP32's GND pin
- Connect the DHT sensor's Data pin to the ESP32's (default is GPIO 4, can be changed in the code)

## Configuration

Before uploading the code to the ESP32, you need to create a `secrets.ini` file in the root directory of the ESP32. Take a look at the `secrets.ini.example` file for reference. The file should contain the following information:

```
wifi_ssid=your_wifi_ssid
wifi_pass=your_wifi_password
server_url=http://your.server.url/endpoint
```

