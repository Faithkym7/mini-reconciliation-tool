# 💳 Transaction Reconciliation Tool

A slick React + TypeScript + Vite app for reconciling internal and provider transaction files.

## 🔧 Features

* Upload and process `.csv` transaction files (internal & provider)
* Map columns (reference and amount) per file
* Match records and highlight unmatched transactions
* Export results for further use
* Responsive, fast, and minimal UI

## ⚙️ Stack

* **React** + **TypeScript**
* **Vite** (fast build & HMR)
* **MUI** (Material UI for components)
* **PapaParse** (CSV parsing)
* **ESLint** with advanced TypeScript support

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the dev server

```bash
npm run dev
```

The app runs at `http://localhost:5173` (or whatever Vite tells you).

---

## 📁 File Structure

```bash
.
├── public/
│   ├── emoji-favicon.svg       # 💳 tab icon
│   └── ...
├── src/
│   ├── components/             # React components
│   ├── utils/                  # CSV processing, matching logic
│   ├── App.tsx
│   └── main.tsx
├── index.html                  # Entry HTML
└── README.md
```

---

## 🧠 ESLint + TypeScript Setup

If you're expanding this into a production-grade app, we recommend strict linting with type-awareness.

### Install ESLint config dependencies

```bash
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint
```

### Example config with type-checking

```ts
// eslint.config.js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

### Optional: Add React-specific linting

```ts
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      reactX.configs['recommended-typescript'],
      reactDom.configs.recommended,
    ],
  },
])
```

---

## 📦 Build

```bash
npm run build
```

---

## 📄 License

MIT — do what you want, just don’t sue if it blows up your transactions 😅

---

## 🔗 Live Demo

You can deploy this on platforms like:

* [Replit](https://replit.com)
* [bolt.new](https://bolt.new)
* [Lovable.co](https://lovable.co)

---

## 👀 Todo

* Matching rules config (thresholds, fuzzy matching)
* Highlight differences visually
* Persistent upload history
