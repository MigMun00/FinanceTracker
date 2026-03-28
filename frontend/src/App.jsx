import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Transactions from "./pages/Transactions";
import Categories from "./pages/Categories";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/*" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
