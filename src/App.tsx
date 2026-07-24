import { Routes, Route } from "react-router-dom";
import DashboardPage from "@/features/dashboard/components/DashboardPage";
import DashboardLayout from "./components/layout/DashboardLayout";

function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
    </Routes>
  );
}

export default App;
