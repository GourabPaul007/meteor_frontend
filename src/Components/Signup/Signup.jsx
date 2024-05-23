import React, { useEffect, useState } from "react";
import { Card, Button, Form, Alert, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);

  const [name, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [wardnumber, setWardNumber] = useState("");
  const [role, setRole] = useState("doctor");

  const [msg, setMsg] = useState("");

  const handleSignup = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    const urlencoded = new URLSearchParams();
    urlencoded.append("name", name);
    urlencoded.append("password", password);
    urlencoded.append("email", email);
    urlencoded.append("role", role);
    urlencoded.append("wardnumber", wardnumber);

    try {
      const response = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlencoded.toString(),
      });
      const data = await response.json();
      console.log(data);
      if (data.code == "uatd") {
        setUsername("");
        setEmail("");
        setPassword("");
        setRole("");
        setWardNumber("");
        setMsg(data.msg.toUpperCase());
      }
      navigate("/login");
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  useEffect(() => {
    // setRole('admin')
  }, []);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <Card>
            <Card.Body>
              <Card.Title>Signup</Card.Title>
              <Form noValidate validated={validated} onSubmit={handleSignup}>
                <br />
                <Form.Group controlId="formBasicUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Group>

                <br />
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    required
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <br />
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    required
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                {role == "wardincharge" ? (
                  <>
                    <br />
                    <Form.Group controlId="formBasicPassword">
                      <Form.Label>Ward Number</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="Ward Number"
                        value={wardnumber}
                        onChange={(e) => setWardNumber(e.target.value)}
                      />
                    </Form.Group>
                  </>
                ) : null}

                <br />
                <Form.Group controlId="formBasicSelect">
                  <Form.Label>Role</Form.Label>
                  <Form.Select onChange={(e) => setRole(e.target.value)}>
                    {/* <option value="admin">Admin</option> */}
                    <option value="backoffice">Back Office</option>
                    <option value="doctor">Doctor</option>
                    <option value="nurse">Nurse</option>
                    <option value="wardincharge">Ward In Charge</option>
                    <option value="clerk">Clerk</option>
                    <option value="accounts">Accounts</option>
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
                    //  onClick={handleSignup}
                  >
                    Signup
                  </Button>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <Link
                    className="mt-1"
                    variant="primary"
                    type="submit"
                    to={"/login"}
                  >
                    Login
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

export default Signup;
