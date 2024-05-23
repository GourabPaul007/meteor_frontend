import React, { useEffect, useState, Suspense } from "react";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const LogsTable = (props) => {
  return (
    <>
      <div className="m-4">
        <Table bordered responsive className="table table-striped px-4">
          <thead>
            <tr>
                <th scope="col">
                {"Logs"}
                </th>
            </tr>
          </thead>
          <tbody>
            {props.logs &&
              props.logs.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td>{row.logData}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};
