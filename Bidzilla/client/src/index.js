import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";  // ✅ Make sure this import is correct

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* ✅ Wrap your app here */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
