import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.ts";

import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";

// Crea una instancia de QueryClient
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <App />
          <ToastContainer theme="dark" limit={2} />
        </QueryClientProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
