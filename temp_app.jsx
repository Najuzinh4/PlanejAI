// App.jsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import CreatePlan from "./pages/CreatePlan";
import PlanDetail from "./pages/PlanDetail";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Planos from "./pages/Planos";
import Home from "./pages/Home";

function AppShell() {
  const location = useLocation();
  const showHeader = location.pathname !== "/"; // hide global header on Home
  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}> 
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/planos" element={<Planos />} />
          <Route path="/plans/new" element={<CreatePlan />} />
          <Route path="/plans/:id" element={<PlanDetail />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;

