# Digital Patro 🇳🇵📅

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Status](https://img.shields.io/badge/status-active-success.svg) ![PWA](https://img.shields.io/badge/PWA-Ready-purple)

**Digital Patro** is a lightweight, beautiful Nepali Calendar (Bikram Sambat) designed for the modern web. It runs as a fast Progressive Web App (PWA), meaning you can install it on your phone and check dates even when you are offline.

**[🔴 Live Demo](https://sanjeev40084.github.io/digital-patro)**
*(Click the link above to see the app in action!)*

## ✨ Key Features

* **📱 Installable App (PWA):** Works like a native app on iOS and Android. No app store required.
* **🌙 Smart Dark Mode:** Automatically adapts to your system theme (Light/Dark) with a manual toggle.
* **📶 Offline Ready:** Caches resources so the calendar loads instantly, even without internet.
* **🔄 Bilingual Dates:** Clear display of Nepali (BS) dates with English (AD) conversion.
* **👆 Touch Gestures:** Swipe left or right to navigate between months on mobile.
* **⚡ Blazing Fast:** Built with vanilla JavaScript and Tailwind CSS—no heavy frameworks.

## 🚀 How to Use

### On the Web
Simply visit the [Live Demo](https://your-username.github.io/digital-patro) link.

### Installing on Mobile
1.  Open the link in Chrome (Android) or Safari (iOS).
2.  **Android:** Tap the menu (three dots) -> "Add to Home Screen".
3.  **iOS:** Tap the "Share" button -> "Add to Home Screen".
4.  Launch **Digital Patro** from your home screen just like any other app!

## 🛠️ Local Development

To run this project on your own machine:

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/digital-patro.git](https://github.com/your-username/digital-patro.git)
    ```
2.  **Navigate to the folder**
    ```bash
    cd digital-patro
    ```
3.  **Run a local server**
    * *Note: PWA features (Service Workers) require HTTPS or Localhost.*
    * If using VS Code, install the "Live Server" extension and click "Go Live".
    * Or use Python: `python3 -m http.server`

## 📂 Project Structure

* `index.html` - The main application structure and logic.
* `sw.js` - Service Worker for offline caching and PWA functionality.
* `manifest.json` - Configuration file for app installation (icons, names, colors).

## 🤝 Contributing

Contributions are welcome! If you want to add festivals (Tithis), improve the UI, or fix bugs:

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/NewFeature`)
3.  Commit your Changes (`git commit -m 'Add NewFeature'`)
4.  Push to the Branch (`git push origin feature/NewFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
