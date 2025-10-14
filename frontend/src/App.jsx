// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import CreateSubject from "./pages/CreateSubject";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Planos from "./pages/Planos";
import Cronograma from "./pages/Cronograma";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}> 
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/planos" element={<Planos />} />
          <Route path="/cronograma" element={<Cronograma />} />
          <Route path="/subjects" element={<CreateSubject />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;