# 🌌 Digital Swarm | Hive Mind E-commerce

Experience the future of development with **Digital Swarm**. This premium e-commerce platform showcases high-performance digital assets and hive agents, delivered with a state-of-the-art cyberpunk aesthetic.

Built with **Next.js 14**, **Tailwind CSS 4**, and **Framer Motion**, this project demonstrates the "Environment as a Living Organism" philosophy.

---

## 🚀 Key Features

* **Hive UX**: Futuristic interfaces designed for speed and clarity.
* **Signature Effects**:
  * **The Void**: Deep space backgrounds and neon traces.
  * **Data Core**: Rotating logo with pulse effects.
  * **Quantum Glitch**: SVG turbulence filters for product visualization.
  * **Neon Type**: High-contrast, glowing text effects.
* **Robust Commerce**:
  * Multi-step validated checkout flow.
  * Zustand-powered persistent cart management.
    * **Cashfree-integrated** secure processing.
* **Production Ready**:
  * Optimized image delivery via `Next/Image`.
  * Semantic SEO metadata and OpenGraph support.
  * Clean, modular TypeScript architecture.

## 🛠 Tech Stack

## 🚀 High-Performance Digital Supply

All products, user licenses, and affiliate records are managed in real-time via **Supabase**. The platform is secured with **Clerk Auth** and optimized with a custom GSAP + CSS Cyberpunk design system.

---

* **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
* **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
* **Animations**: [Framer Motion](https://www.framer.com/motion/)
* **Auth**: [Clerk](https://clerk.com/)
* **Database**: [Supabase](https://supabase.com/)
* **State**: [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)

---

## 🏗 Getting Started

### Prerequisites

* Node.js 18.x or higher
* A Supabase project and Clerk account

### Installation

1. **Clone the Repository**:

    ```bash
    git clone [repository-url]
    cd digital-swarm-ecommerce
    ```

2. **Install Dependencies**:

    ```bash
    npm install
    ```

3. **Environment Setup**:
    Create a `.env` file in the root directory and add the following keys:

    ```env
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
    CLERK_SECRET_KEY=your_key
    NEXT_PUBLIC_SUPABASE_URL=your_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
    ```

4. **Run Development Server**:

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to see the result.

5. **Build for Production**:

    ```bash
    npm run build
    ```

## 📂 Project Structure

* `src/app`: Page components and API routes.
* `src/components`:
  * `layout`: Global structure (Header, Footer).
  * `ui`: Reusable design system components.
  * `products`: Catalog logic and product visualization.
  * `cart`: State-driven drawer and checkout logic.
* `src/lib`: Data schemas, types, and the Zustand global store.
* `src/db`: Database migration scripts and schema definitions.

---

**✅ PRODUCTION READY**: All "Mock" fallbacks have been removed. System is live-connected to Supabase.
**Current Version**: 2.1 (Cyberpunk Update)
