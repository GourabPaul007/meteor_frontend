import React, { useState } from "react";
import { Card, Button, Form, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Login = (props) => {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [adminKey, setAdminKey] = useState("");

  const [msg, setMsg] = useState("");

  const handleLoginUser = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    console.log("name:", name);
    console.log("Password:", password);
    console.log("Email:", email);
    console.log("role:", role);

    const form = event.currentTarget;
    if (form.checkValidity() === false) return;
    setValidated(true);

    const urlencoded = new URLSearchParams();
    urlencoded.append("name", name);
    urlencoded.append("password", password);
    urlencoded.append("email", email);
    urlencoded.append("role", role);

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlencoded.toString(),
      });
      const data = await response.json();
      console.log(data);
      if (data.code == "uli" || data.code == "uali") {
        console.log("what");
        setMsg(data.msg.toUpperCase());
        sessionStorage.setItem("name", name);
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("password", password);
        sessionStorage.setItem("role", role);
        setName("");
        setEmail("");
        setPassword("");
        setRole("");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("There was an error!", error);
    }
  }

  const handleLoginAdmin = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    console.log("AdminKey:", adminKey);
    console.log("role:", role);

    const form = event.currentTarget;
    if (form.checkValidity() === false) return;
    setValidated(true);

    const urlencoded = new URLSearchParams();
    urlencoded.append("adminKey", adminKey);
    urlencoded.append("role", role);

    try {
      const response = await fetch("http://localhost:5000/api/admin/isadmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlencoded.toString(),
      });
      const data = await response.json();
      console.log(data);
      if (data.code == "isadmin") {
        console.log("what");
        setMsg(data.msg.toUpperCase());
        sessionStorage.setItem("adminKey", adminKey);
        sessionStorage.setItem("role", role);
        setAdminKey("");
        setRole("");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("There was an error!", error);
    }
  }

  const handleLogin = async (event) => {
    if(role == "admin") {
      await handleLoginAdmin(event);
    }else{
      await handleLoginUser(event);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <Card>
            <Card.Body>
              <Card.Title>Login</Card.Title>
              <Form validated={validated} onSubmit={handleLogin}>
                {role && role == "admin" ? null : (
                  <>
                    <br />
                    <Form.Group controlId="formname">
                      <Form.Label>name</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="Enter Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </Form.Group>
                  </>
                )}

                {role && role == "admin" ? null : (
                  <>
                    <br />
                    <Form.Group controlId="formEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        required
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Form.Group>
                  </>
                )}

                {role && role == "admin" ? null : (
                  <>
                    <br />
                    <Form.Group controlId="formPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        required
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Form.Group>
                  </>
                )}

                {role && role == "admin" ? (
                  <>
                    <br />
                    <Form.Group controlId="formAdminKey">
                      <Form.Label>Admin Key</Form.Label>
                      <Form.Control
                        required
                        type="password"
                        placeholder="AdminKey"
                        value={adminKey}
                        onChange={(e) => setAdminKey(e.target.value)}
                      />
                    </Form.Group>
                  </>
                ) : null}

                <br />
                <Form.Group controlId="formSelect">
                  <Form.Label>Role</Form.Label>
                  <Form.Select onChange={(e) => setRole(e.target.value)}>
                    {/* <option value="admin">Admin</option> */}
                    <option value="admin">Admin</option>
                    <option value="doctor">Doctor</option>
                    <option value="nurse">Nurse</option>
                    {/* <option value="3">Three</option> */}
                  </Form.Select>
                </Form.Group>

                <br />
                {msg.length > 0 && (
                  <Alert key={"primary"} variant={"primary"}>
                    {msg}
                  </Alert>
                )}

                <br />
                <div className="d-flex p-2 bd-highlight">
                  <Button
                    variant="primary"
                    type="submit"
                    //  onClick={handleLogin}
                  >
                    Login
                  </Button>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <Link
                    className="mt-1"
                    variant="primary"
                    type="submit"
                    to={"/signup"}
                  >
                    Signup
                  </Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
