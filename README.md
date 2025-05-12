# 🩺 Remote Health Monitoring System 📊

A real-time health monitoring dashboard that collects data from sensors via ESP32 and AWS IoT, stores it in DynamoDB, and visualizes it live in the browser using WebSocket + Chart.js. 🚀
>✅ Deployed on AWS EC2 with Elastic an IP!
> 🔗 [http://13.203.253.242/](http://13.203.253.242/)

---

## 📌 Features

- 🌡️ Live Temperature & Pressure Monitoring (DS18B20, BMP280)
- 📶 ESP32-based Wireless Sensor Network
- 💾 Storage on AWS DynamoDB
- 🧠 Backend: Flask + WebSocket to serve live data
- 💻 Frontend: React + Chart.js for beautiful, responsive charts

---

## 🧱 Tech Stack

| Layer          | Technology |
|----------------|------------|
| 👨‍🔬 Sensors       | DS18B20 (Temp), BMP280 (Pressure/Alt.) |
| 🔌 Microcontroller | ESP32 (Wi-Fi + BLE) |
| ☁️ Cloud         | AWS IoT Core, AWS DynamoDB |
| 🧠 Backend       | Flask + WebSocket + Boto3 |
| 💻 Frontend      | React.js + Chart.js |

---
## 🤝 Contributors

Made with ❤️ by:

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Subratkb02">
        <img src="https://avatars.githubusercontent.com/Subratkb02" width="100px;" alt="Subrat Kumar Behra"/><br />
        <sub><b>Subrat Kumar Behra</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/sayan922">
        <img src="https://avatars.githubusercontent.com/sayan922" width="100px;" alt="Sayan Chakraborty"/><br />
        <sub><b>Sayan Chakraborty</b></sub>
      </a>
    </td>
  </tr>
</table>

---
## 📸 Images

Here are some visuals from the Remote Health Monitoring System in action:

<p align="center">
  <img src="images/dashboard.png" alt="Dashboard Screenshot" width="80%" />
  <br/><br/>

  <img src="images/img.jpg" alt="Live Sensor Data Graph" width="80%" />
  <br/><br/>

  <img src="images/circuit.jpg" alt="Circuit Diagram (ESP32 + Sensors)" width="60%" />
</p>
