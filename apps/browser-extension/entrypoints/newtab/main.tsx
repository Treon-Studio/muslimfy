import React from "react";
import ReactDOM from "react-dom/client";
import { IslamicCompanion } from "@/components/islamic-companion.tsx";
import "~/assets/global.css";

// Nothing special here
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <IslamicCompanion />
  </React.StrictMode>,
);
