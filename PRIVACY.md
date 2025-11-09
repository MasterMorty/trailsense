# Privacy Statement

TrailSense is built with privacy in mind.  
The device uses WiFi probe requests and Bluetooth Low Energy (BLE) advertisements to estimate how many people pass a location. MAC addresses are read and processed on the ESP32 to make these counts.

No data that could identify a person or device is ever stored or shared. Everything is processed locally in the ESP32’s memory, and only the total number of detected signals is sent to the server.  
Nothing that can be traced back to an individual leaves the device.
