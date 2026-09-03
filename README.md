# 💰 Spendly

> Manage your money smarter.

Spendly is a simple and clean personal expense tracker built with React Native and Expo.

🌐 **Live Web App:** https://spendlypro.vercel.app/

## ✨ Features

- 💰 Track total spending
- ➕ Add expenses
- 🗂️ Organize expenses by category
- 🔍 Search expenses
- 📊 View spending by category
- 🧾 View recent expenses
- 🗑️ Delete expenses
- 💾 Store expenses locally
- 📱 Android app
- 🌐 Web version

## 📱 Android APK

The Android APK is available in the GitHub Releases section.

👉 **[Download Spendly APK](../../releases)**

> The APK is currently provided for testing and personal use.

## 🌐 Live Demo

Try Spendly directly in your browser:

👉 **https://spendlypro.vercel.app/**

## 🛠️ Tech Stack

- React Native
- Expo
- Expo Router
- TypeScript
- AsyncStorage
- Vercel
- GitHub

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Nadeemxsalar/Spendly.git
```

### 2. Open the project

```bash
cd Spendly
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npx expo start
```

## 🌐 Run on Web

```bash
npx expo start --web
```

## 📱 Build Android APK

```bash
eas build --platform android --profile preview
```

## 📂 Project Structure

```text
Spendly/
├── assets/
├── src/
│   └── app/
│       ├── _layout.tsx
│       ├── index.tsx
│       └── add-expense.tsx
├── app.json
├── eas.json
├── package.json
├── README.md
└── LICENSE
```

## 💾 Data Storage

Spendly currently stores expense data locally using AsyncStorage.

No account or cloud database is required for the current version.

## 📸 Screenshots

_Add screenshots of the Spendly app here._

## 📄 License

This project is licensed under the MIT License.

---

Made with ❤️ using React Native & Expo.