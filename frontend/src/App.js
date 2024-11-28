import HomePage from './components/homePage'
import ProtectedRoute from "./components/protectedRoute"
import Login from "./components/login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // Toast notifications
import "react-toastify/dist/ReactToastify.css"; // Toastify CSS

// App Component
function App() {
  return (
    <Router>
      <Routes>
        {/* public route */}
        <Route path="/login" element={<Login />} />

        {/* protected route */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
