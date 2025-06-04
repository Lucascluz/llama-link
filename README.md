# Llama-Link: Tauri + React + Typescript

This project is a desktop application built with Tauri, React, and Typescript, designed to interact with local large language models via Ollama.

## ⚠️ Important: Ollama Installation Required

**This application WILL NOT WORK without a running Ollama instance.** Ollama allows you to run powerful open-source large language models locally.

**Please ensure you have Ollama installed and running with your desired model(s) before proceeding.**

- **Download and Install Ollama:** [https://ollama.com/download](https://ollama.com/download)
- **Pull a model:** After installing Ollama, you need to pull a model. For example, to pull the Llama 3 model, run the following command in your terminal:
  ```bash
  ollama pull llama3
  ```
  You can find other available models on the [Ollama Library](https://ollama.com/library).

## Prerequisites

Before you begin, ensure you have the following installed:

- **Ollama:** As mentioned above, this is crucial.
- **Node.js and npm (or yarn):** For managing frontend dependencies and running the development server.
  - [Download Node.js](https://nodejs.org/) (npm is included)
- **Rust and Cargo:** For building the Tauri backend.
  - [Install Rust](https://www.rust-lang.org/tools/install)
- **System Dependencies for Tauri:** Tauri has some system-specific dependencies. Please check the [Tauri prerequisites guide](https://tauri.app/v1/guides/getting-started/prerequisites) for your operating system.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/)
- [Tauri Extension for VS Code](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer Extension for VS Code](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Getting Started

Follow these steps to get the project up and running on your local machine.

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd llama-link
```

### 2. Install Frontend Dependencies

Navigate to the project's root directory and install the necessary npm packages:

```bash
npm install
# or if you prefer yarn
# yarn install
```

### 3. Install Rust Dependencies

Tauri uses Cargo to manage Rust dependencies. These will typically be fetched when you first build or run the application.

## Development

To start the application in development mode (with hot-reloading for the frontend):

```bash
npm run tauri dev
```

This command will:

1. Build the Rust backend.
2. Start the Vite development server for the React frontend.
3. Open the Tauri application window.

## Building the Application

To build the application for production:

```bash
npm run tauri build
```

This will generate an executable file (or installer, depending on your `tauri.conf.json` configuration and OS) in the `src-tauri/target/release/` directory (or `src-tauri/target/release/bundle/`).

## Modifying the Project

### Frontend (React + TypeScript)

- All frontend code is located in the `src` directory.
- Components are typically found in `src/components`.
- Main application logic is in `src/App.tsx` and related files.
- You can modify the UI and frontend logic here. Changes will be hot-reloaded in development mode.

### Backend (Rust + Tauri)

- All backend code is located in the `src-tauri` directory.
- The main Rust application entry point is `src-tauri/src/main.rs`.
- You can define custom Rust functions and invoke them from the frontend using Tauri's command system.
- Modify `tauri.conf.json` to configure application settings, permissions, window properties, etc.
- After making backend changes, you'll need to restart the `npm run tauri dev` process to see them reflected.

## Project Structure

```
.
├── public/             # Static assets for the frontend
├── src/                # Frontend source code (React, TypeScript, CSS)
│   ├── assets/         # Frontend assets (images, fonts, etc.)
│   ├── components/     # React components
│   ├── App.tsx         # Main React application component
│   └── main.tsx        # Frontend entry point
├── src-tauri/          # Backend source code (Rust, Tauri)
│   ├── icons/          # Application icons
│   ├── src/            # Rust source files
│   │   └── main.rs     # Main Rust application entry point
│   ├── build.rs        # Rust build script (optional)
│   ├── Cargo.toml      # Rust dependencies and project metadata
│   └── tauri.conf.json # Tauri application configuration
├── .gitignore
├── index.html          # HTML entry point for Vite
├── package.json        # npm package metadata and scripts
├── README.md           # This file
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## Troubleshooting

- **Ollama Connection Issues:**
  - Ensure Ollama is running.
  - Verify the model you are trying to use has been pulled (`ollama list`).
  - Check network configurations if Ollama is running on a different host/port (you might need to configure the endpoint in the application's code).
- **Build Failures:**
  - Ensure all prerequisites (Rust, Node, system dependencies for Tauri) are correctly installed.
  - Check the error messages in the terminal for specific clues.
  - Sometimes, cleaning the target directory can help: `cargo clean` (in `src-tauri`) and then try building again.

---

This template was initially based on a standard Tauri + React + Typescript setup.
