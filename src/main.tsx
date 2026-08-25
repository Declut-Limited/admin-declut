import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./lib/theme/ThemeProvider";
import "leaflet/dist/leaflet.css";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider>
        <App />
        <Toaster
          position="top-right"
          closeButton
          toastOptions={{
            unstyled: true,
            classNames: {
              toast:
                "relative flex gap-3 w-80 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-100 dark:border-gray-800 p-4",
              title:
                "text-sm font-semibold text-brand-gray-dark dark:text-gray-100",
              description: "text-xs text-brand-gray-light mt-1",
              loading:
                "relative flex gap-3 w-80 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-100 dark:border-gray-800 p-4 pl-8",
              loader:
                "!absolute !left-4 !top-1/2 !-translate-y-1/2 !translate-x-0",
              closeButton:
                "!absolute !top-2 !right-2 !left-auto !translate-x-0 !translate-y-0 !w-5 !h-5 !rounded-full !text-white !bg-gray-900 dark:!bg-gray-700 !border-none !flex !items-center !justify-center hover:!bg-gray-800",
            },
          }}
        />
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>,
);
