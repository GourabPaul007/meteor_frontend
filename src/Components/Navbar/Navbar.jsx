import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = (props) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Implement login functionality here
    console.log("Login clicked");
    // props.isUserLoggedIn(true);
    navigate("/login");
  };

  const handleLogout = () => {
    // Implement Logout functionality here
    console.log("Logout clicked");
    sessionStorage.setItem("name", "");
    sessionStorage.setItem("email", "");
    sessionStorage.setItem("password", "");
    sessionStorage.setItem("role", "");
    sessionStorage.setItem("adminKey", "");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand m-0 p-0" to="/" style={{fontSize:32}}>
          METEOR
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Add more navbar links as needed */}
          </ul>
          {props.isUserLoggedIn()==true ? (
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button className="btn btn-outline-warning" onClick={handleLogin}>
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
