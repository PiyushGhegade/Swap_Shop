// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ToastProvider } from "@/components/ui/toast"; // ✅

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ToastProvider> {/* ✅ Use your wrapper here */}
      <App />
    </ToastProvider>
  </React.StrictMode>
);
