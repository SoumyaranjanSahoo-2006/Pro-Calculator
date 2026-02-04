🧮 Pro Calculator App

A modern, mobile-friendly Calculator Web App built using HTML, CSS, and JavaScript, designed to work smoothly on desktop and Android devices.
It includes a splash screen, sidebar navigation, and multiple calculator tools.

🚀 Live Demo

👉 (Add your Netlify link here after deploy)
Example:

https://pro-calculator.netlify.app

✨ Features

🎯 Splash screen shown only once when the app opens

📱 Fully responsive (mobile-first design)

📐 Normal Calculator

🛒 Grocery Calculator

🍔 Sidebar navigation with smooth UI

🎨 Modern color theme (Blue & Green modes)

📦 PWA-ready (manifest included)

⚡ Fast and lightweight

🛠️ Technologies Used

HTML5

CSS3 (Flexbox & Grid)

JavaScript (Vanilla JS)

Font Awesome Icons

PWA (Manifest + Icons)

📁 Project Folder Structure
project/
│
├── index.html
├── normal-calculator.html
├── grocery-calculator.html
├── manifest.json
├── README.md
│
├── assets/
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── app.js
│   │   ├── normal-calculator.js
│   │   └── grocery-calculator.js
│   │
│   ├── images/
│   │   └── splash.png
│   │
│   └── icons/
│       ├── icon-192.png
│       └── icon-512.png

🖼️ Splash Screen Behavior

Splash screen appears only on first app load

It will NOT appear again when:

Navigating between pages

Returning to Home

Controlled using sessionStorage

⚙️ How Splash Works

HTML displays splash by default

JavaScript hides splash after 1.5 seconds

A session flag prevents repeat display

sessionStorage.setItem("splashShown", "true");

📱 Mobile Optimization

Designed for Android devices (tested on Vivo Y20 G)

No fixed widths

Mobile-safe layouts

Touch-friendly buttons

🌐 How to Deploy on Netlify

Push project to GitHub

Go to 👉 https://www.netlify.com

Click Add New Site → Import from GitHub

Select your repository

Build settings:

Build command: (leave empty)

Publish directory: /

Click Deploy

✅ Done!

📦 PWA Support

This app includes:

manifest.json

App icons (192x192, 512x512)

Theme color support

You can Add to Home Screen on Android.

🧪 Common Issues & Fixes
Splash not showing after deploy?

Check image path (./assets/images/splash.png)

Ensure file name case matches exactly

Check browser Network tab for 404

UI broken on mobile?

Avoid width: 100vw

Avoid overflow: hidden on body

Use responsive units (%, auto, min-height)

👨‍💻 Author

Soumyaranjan Sahoo
📍 India
💻 Frontend Developer

⭐ Future Improvements

Calculation History

Unit Converter

Dark Mode

Offline Support (Service Worker)

📜 License

This project is open-source and free to use for learning and personal projects.
