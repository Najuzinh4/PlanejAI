// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import CreateSubject from "./pages/CreateSubject";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/subjects" element={<CreateSubject />} />
      </Routes>
    </BrowserRouter>
  );
}
