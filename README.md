# Sneaky DZ — Premium Sneaker Store (Monorepo)

Welcome to **Sneaky DZ**, a premium, high-fidelity e-commerce application designed to showcase modern footwear collections. The project is organized as a monorepo workspace containing clean separation between the user-facing web interface and the server-side API.

---

## 📂 Repository Workspace Structure

The project is structured into two main layers to support future scalability and clean deployment boundaries:

```
Sneaky-Dz/ (Root)
├── package.json            # Root Workspace Orchestrator (delegates npm scripts)
├── README.md               # English Documentation
├── README_AR.md            # Arabic Documentation (RTL)
├── frontend/               # Client-Side Application (Vanilla JS / Vite)
│   ├── index.html          # Main Web Entrypoint
│   ├── vite.config.ts      # Vite Dev Configuration
│   ├── package.json        # Frontend Dependencies
│   ├── css/                # Modular Styling System
│   │   └── main.css        # CSS Imports Registry
│   ├── js/                 # Application Logical Modules
│   │   ├── app.js          # App Bootstrapper & Main Controller
│   │   ├── core/           # Core Framework Layer (Router & State Store)
│   │   │   ├── router.js   # Custom Hash-based Client-Side Router
│   │   │   └── store.js    # Pub/Sub Reactive State Management Store
│   │   ├── data/           # Local Data Catalogs (products.js)
│   │   └── pages/          # View Controllers (Home, Shop, Cart, Dashboard)
│   └── assets/             # Graphical Assets and Fonts
└── backend/                # Server-Side API Layer (Node.js / Express - For Future Work)
    ├── server.js           # API Entry Point
    ├── package.json        # Backend Dependencies
    └── .env.example        # Environment Variables Template
```

---

## 🛠️ System Architecture & Tech Stack (Frontend)

The frontend is built purely with Vanilla JavaScript, native CSS imports, and Vite, demonstrating high-performance, framework-free SPA construction.

### 1. Custom Hash-Based Router
*   **Location:** [router.js](file:///Users/morsistoredz/antigravity/Dzair-Craft/frontend/js/core/router.js)
*   **Pattern:** Front-Controller Router.
*   **Design Choice:** The [Router](file:///Users/morsistoredz/antigravity/Dzair-Craft/frontend/js/core/router.js#L1) class handles view transitions dynamically:
    *   Cleans up active page contexts to prevent memory leaks.
    *   Mounts loading skeletons during transitions to optimize Largest Contentful Paint (LCP).
    *   Asynchronously resolves, renders, and initializes new view controllers.

### 2. Pub/Sub State Store
*   **Location:** [store.js](file:///Users/morsistoredz/antigravity/Dzair-Craft/frontend/js/core/store.js)
*   **Pattern:** Publisher-Subscriber (Pub/Sub) Singleton.
*   **Design Choice:** The global [Store](file:///Users/morsistoredz/antigravity/Dzair-Craft/frontend/js/core/store.js#L3) handles reactively synchronized state (cart count, totals, wishlist, user auth).
    *   Components subscribe to data changes (e.g. `store.subscribe('cart', cb)`).
    *   State mutations trigger micro-updates to only the relevant sub-trees of the page DOM.
    *   Provides automatic local data persistence using browser `localStorage` serialization.

---

## 🚀 Setup & Local Execution

### Prerequisites: Node.js (v18+)

You can run commands directly from the root workspace folder; they will automatically be forwarded to the correct workspace directory using the `--prefix` flag.

1.  **Clone the project and install all dependencies:**
    ```bash
    npm install --prefix frontend
    ```
2.  **Launch the frontend client server:**
    ```bash
    npm run dev
    ```
    This launches the Vite dev server inside `/frontend`. Open `http://localhost:3000` to preview.

3.  **Build the frontend production package:**
    ```bash
    npm run build
    ```

4.  **Backend operations (for future extensions):**
    ```bash
    cd backend
    npm install
    npm run dev
    ```
