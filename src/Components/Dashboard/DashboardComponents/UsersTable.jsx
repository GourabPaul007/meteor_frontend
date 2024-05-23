import React, { useState } from "react";
import { Card, Button, Form, Alert, Table, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

export const UsersTable = (props) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="m-4">
        <Table bordered responsive className="table table-striped">
          <thead>
            <tr>
              {props.usersColumns.map((col) => {
                return (
                  <th key={col} scope="col">
                    {col}
                  </th>
                );
              })}
              <th key={"action"} scope="col">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {props.usersData &&
              props.usersData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {props.usersColumns.map((col) => (
                    <td key={col}>{row[col]}</td>
                  ))}
                  <td key={"aaaaaaaaa"}>
                    <button
                      type="button"
                      className="btn btn btn-danger btn-sm"
                      data-bs-toggle="modal"
                      data-bs-target="#deleteUserModal"
                      onClick={() => {
                        // console.log(row["email"]);
                        sessionStorage.setItem(
                          "to_be_deleted_email",
                          row["email"]
                        );
                        // props.handleDeleteUser(row["email"]);
                        handleShow();
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>

      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Delete User?</Modal.Title>
          </Modal.Header>
          <Modal.Body>Deleting a user will remove them from Database.</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                const to_be_deleted_email = sessionStorage.getItem(
                  "to_be_deleted_email"
                );
                props.handleDeleteUser(to_be_deleted_email);
                sessionStorage.setItem("to_be_deleted_email", "");
                handleClose();
              }}
            >
              Confirm Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </>
  );
};
