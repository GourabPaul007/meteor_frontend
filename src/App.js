import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar'; // Assuming you have a Navbar component
import Signup from './Components/Signup/Signup';
import Login from './Components/Login/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './Components/Dashboard/Dashboard';
import { useNavigate } from "react-router-dom";

const App = () => {

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const [user, setUser] = React.useState({
    name: sessionStorage.getItem("name") || "",
    email: sessionStorage.getItem("email") || "",
    password: sessionStorage.getItem("password") || "",
    role: sessionStorage.getItem("role") || "",
  });

  const isUserLoggedIn = () => {
    if(sessionStorage.getItem("role") && sessionStorage.getItem("role").length>0){
      return true;
    }
  }

  return (
    <Router>
      <div>
        <Navbar isUserLoggedIn={isUserLoggedIn} /> {/* Include the Navbar component outside Routes */}
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
