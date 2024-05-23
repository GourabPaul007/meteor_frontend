import React, { useEffect, useState, Suspense } from "react";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const PatientsTable = (props) => {
    return (
        <>
        <div className="filters mb-3">
        <div className="form-check form-check-inline d-flex justify-content-center flex-wrap mt-4">
          {props.allColumns.map((col) => {
            return (
              <div
                key={col}
                className="form-check form-check-inline pt-2 pb-2 pe-2 ps-6"
                // style={{padding:"10px", margin:"5px"}}
              >
                <input
                  className="form-check-input"
                  type="checkbox"
                  name={col}
                  id={`${col}Checkbox`}
                  checked={props.selectedColumns.includes(col)}
                  onChange={props.handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor={col + "Checkbox"}>
                  {col}
                </label>
              </div>
            );
          })}
        </div>
      </div>
      <div className="m-4">
        <Table bordered responsive className="table table-striped">
          <thead>
            <tr>
              {props.selectedColumns.map((col) => {
                return (
                  <th key={col} scope="col">
                    {col}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {props.data &&
              props.data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {props.selectedColumns.map((col) => (
                    <td key={col}>{row[col]}</td>
                  ))}
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
      </>
    );
}