# ApexSEO: Client & SEO Management Dashboard

[cloudflarebutton]

ApexSEO is a comprehensive, visually stunning dashboard designed for SEO agencies and professionals. It integrates a client relationship manager (CRM) with powerful SEO performance tracking and a streamlined sales pipeline. The application features a modular design, allowing users to manage client information, monitor key SEO metrics like indexed keywords and organic traffic, and oversee strategic tasks. A key feature is the ability to upload various audit files (CSV, PDF, etc.) and associate them with specific clients. The sales pipeline offers multiple, intuitive views including a drag-and-drop Kanban board, a detailed table, and a simple list view, all with robust filtering capabilities to efficiently manage leads from inception to conversion.

## Key Features

-   **Integrated Client Management (CRM):** Manage company details, contact information, industry, and more.
-   **Advanced SEO Tracking:** Monitor key metrics like indexed keywords, organic clicks, website quality ratings, and strategic tasks.
-   **File Uploads:** Attach SEO audits and other relevant documents (CSV, PDF, XML, etc.) directly to client profiles.
-   **Dynamic Sales Pipeline:** Visualize and manage your sales process with multiple views:
    -   Drag-and-drop Kanban board
    -   Detailed and sortable Table view
    -   Simple List view
-   **Responsive & Modern UI:** A beautiful, intuitive, and fully responsive interface built for all devices.
-   **High-Performance Backend:** Powered by Cloudflare Workers for a fast, scalable, and serverless architecture.

## Technology Stack

-   **Frontend:**
    -   React & Vite
    -   TypeScript
    -   React Router for navigation
    -   Zustand for state management
    -   Tailwind CSS for styling
    -   shadcn/ui for the component library
    -   Framer Motion for animations
    -   Recharts for data visualization
    -   `@dnd-kit` for drag-and-drop functionality
-   **Backend:**
    -   Cloudflare Workers
    -   Hono web framework
-   **Storage:**
    -   Cloudflare Durable Objects for persistent, stateful storage.
-   **Tooling:**
    -   Bun for package management and scripting
    -   Vite for frontend bundling and development server
    -   Wrangler for Cloudflare Workers deployment

## Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later recommended)
-   [Bun](https://bun.sh/) installed as your package manager.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/apex_seo_dashboard.git
    cd apex_seo_dashboard
    ```

2.  **Install dependencies:**
    This project uses Bun for package management.
    ```bash
    bun install
    ```

3.  **Run the development server:**
    This command starts the Vite frontend development server and the Wrangler development server for the backend worker simultaneously.
    ```bash
    bun run dev
    ```
    The application will be available at `http://localhost:3000`.

## Development

The project is structured into three main directories:

-   `src/`: Contains the React frontend application code, including pages, components, hooks, and state management.
-   `worker/`: Contains the Hono backend application code that runs on Cloudflare Workers, including API routes and entity definitions.
-   `shared/`: Contains TypeScript types and mock data shared between the frontend and backend to ensure type safety.

API requests from the frontend are proxied to the local worker instance, allowing for seamless full-stack development.

## Deployment

This project is designed for easy deployment to the Cloudflare ecosystem.

1.  **Build the project:**
    This command bundles the React application and prepares the worker for deployment.
    ```bash
    bun run build
    ```

2.  **Deploy to Cloudflare:**
    Make sure you are logged into your Cloudflare account via the Wrangler CLI (`npx wrangler login`). Then, run the deploy command:
    ```bash
    bun run deploy
    ```
    This will publish your application and worker to your Cloudflare account. Wrangler will provide you with the URL of your deployed application.

Alternatively, you can deploy directly from your GitHub repository with a single click.

[cloudflarebutton]