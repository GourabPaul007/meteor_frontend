import React, { useEffect, useState, Suspense } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { PatientsTable } from "../Tables/PatientsTable";
import { LogsTable } from "../Tables/LogsTable";

const Dashboard = () => {
  const navigate = useNavigate();
  const [allColumns, setAllColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [data, setData] = useState([]);

  const [activeButton, setActiveButton] = useState("patients");
  const [logs, setLogs] = useState([]);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    if (checked) {
      setSelectedColumns((prevColumns) => [...prevColumns, name]);
    } else {
      setSelectedColumns((prevColumns) =>
        prevColumns.filter((col) => col !== name)
      );
    }
  };

  useEffect(() => {
    // IF ITS USER

    (async () => {
      if (sessionStorage.getItem("role") != "admin") {
        const urlencoded = new URLSearchParams();
        urlencoded.append("name", sessionStorage.getItem("name"));
        urlencoded.append("email", sessionStorage.getItem("email"));
        urlencoded.append("password", sessionStorage.getItem("password"));
        urlencoded.append("role", sessionStorage.getItem("role"));

        try {
          await fetch("http://localhost:5000/api/patients", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: urlencoded.toString(),
          }).then((response) => {
            response.json().then((data) => {
              console.log(data);
              if (data && data.msg && data.msg == "unauthorized") {
                navigate("/login");
              }
              setAllColumns(data.cols);
              setSelectedColumns(data.cols);
              setData(data.data);
            });
          });
        } catch (error) {
          console.error("There was an error!", error);
        }
      }

      // IF ITS ADMIN
      else {
        console.log("admin");
        // GET PATIENTS
        const urlencoded1 = new URLSearchParams();
        urlencoded1.append("adminKey", sessionStorage.getItem("adminKey"));
        urlencoded1.append("role", sessionStorage.getItem("role"));
        try {
          await fetch("http://localhost:5000/api/admin/getpatients", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: urlencoded1.toString(),
          }).then((response) => {
            response.json().then((data) => {
              console.log(data);
              if (data && data.msg && data.msg == "unauthorized") {
                navigate("/login");
              }
              setAllColumns(data.cols);
              setSelectedColumns(data.cols);
              setData(data.data);
            });
          });
        } catch (error) {
          console.error("There was an error!", error);
        }
        // GET LOGS
        const urlencoded2 = new URLSearchParams();
        urlencoded2.append("adminKey", sessionStorage.getItem("adminKey"));
        urlencoded2.append("role", sessionStorage.getItem("role"));
        try {
          await fetch("http://localhost:5000/api/admin/getlogs", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: urlencoded2.toString(),
          }).then((response) => {
            response.json().then((data) => {
              console.log(data);
              if (data && data.msg && data.msg == "unauthorized") {
                navigate("/login");
              }
              setLogs(data);
            });
          });
          eraseLS(10);
        } catch (error) {
          console.error("There was an error!", error);
        }
      }
    })();
  }, []);

  const eraseLS = (mins) => {
    setTimeout(() => {
      sessionStorage.setItem("name", "");
      sessionStorage.setItem("email", "");
      sessionStorage.setItem("password", "");
      sessionStorage.setItem("role", "");
      sessionStorage.setItem("adminKey", "");
      navigate("/login");
    }, mins * 60 * 1000);
  };

  return (
    <div className="d-flex flex-column mt-4 mx-10">
      <h1 className="text-center">Dashboard</h1>
      {sessionStorage.getItem("role") == "admin" ? (
        <div className="btn-group p-4" role="group">
          <button
            type="button"
            className={`btn ${
              activeButton == "patients" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={(e) => {
              setActiveButton("patients");
            }}
          >
            Patients
          </button>
          <button
            type="button"
            className={`btn ${
              activeButton == "logs" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={(e) => {
              setActiveButton("logs");
            }}
          >
            See Logs
          </button>
          <button
            type="button"
            className={`btn ${
              activeButton == "deleteusers"
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
            onClick={(e) => {
              setActiveButton("deleteusers");
            }}
          >
            Delete Users
          </button>
        </div>
      ) : null}
      
      {sessionStorage.getItem("role") != "admin" ? (
        <PatientsTable
        allColumns={allColumns}
        selectedColumns={selectedColumns}
        data={data}
        handleCheckboxChange={handleCheckboxChange}
      />
      ) : null}
      {sessionStorage.getItem("role") == "admin" && activeButton == "logs" ? (
        <LogsTable logs={logs} />
      ) : null}

      {sessionStorage.getItem("role") == "admin" && activeButton == "patients" ? (
        <PatientsTable
        allColumns={allColumns}
        selectedColumns={selectedColumns}
        data={data}
        handleCheckboxChange={handleCheckboxChange}
      />
      ) : null}
      {sessionStorage.getItem("role") == "admin" && activeButton == "logs" ? (
        <LogsTable logs={logs} />
      ) : null}
    </div>
  );
};

export default Dashboard;
