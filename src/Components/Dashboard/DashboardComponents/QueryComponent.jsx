import React, { useState } from "react";
import { Form, Button, Card, Row, Col, Alert } from "react-bootstrap";

const QueryComponent = (props) => {
  const [query, setQuery] = useState("");
  const [msg, setMsg] = useState("");
  const [msgColor, setMsgColor] = useState("primary");

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleRunQuery = async () => {
    const urlencoded = new URLSearchParams();
    urlencoded.append("query", query);
    urlencoded.append("adminKey", sessionStorage.getItem("adminKey"));
    urlencoded.append("role", sessionStorage.getItem("role"));

    try {
      // INSERT INTO users (name, email, password, role) VALUES ('a', 'a@a', 'a', 'a');
      const response = await fetch("http://localhost:5000/api/admin/runquery", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlencoded.toString(),
      });
      const data = await response.json();
      console.log(data);
      setMsg(data.msg.toUpperCase());
      if (data.code == "es") {
        setMsgColor("primary");
      }else{
        setMsgColor("danger");
      }
      props.getPatientsAdmin();
      props.getLogs();
      props.getUsers();
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  return (
    <>
      <Card className="mx-auto mt-2" style={{ width: "50%" }}>
        <Card.Header>Run Custom Query</Card.Header>
        <Card.Body className="d-flex justify-content-center">
          <Form style={{ width: "80%" }}>
            <Form.Group controlId="queryInput">
              <Form.Control
                required
                type="text"
                placeholder="Enter Query"
                value={query}
                onChange={handleQueryChange}
              />
            </Form.Group>
          </Form>
          &nbsp; &nbsp;
          <Button variant="primary" onClick={handleRunQuery}>
            Run Query
          </Button>
        </Card.Body>
        <br />
        {msg.length > 0 && (
          <Alert key={"primary"} variant={msgColor} className="mx-4">
            {msg}
          </Alert>
        )}
      </Card>
    </>
  );
};

export default QueryComponent;
