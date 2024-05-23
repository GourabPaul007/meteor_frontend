import React, { useEffect, useState, Suspense } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { PatientsTable } from "./DashboardComponents/PatientsTable";
import { LogsTable } from "./DashboardComponents/LogsTable";
import { UsersTable } from "./DashboardComponents/UsersTable";
import QueryComponent from "./DashboardComponents/QueryComponent";

const Dashboard = () => {
  const navigate = useNavigate();
  const [allColumns, setAllColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [data, setData] = useState([]);

  const [activeButton, setActiveButton] = useState("patients");
  const [logs, setLogs] = useState([]);
  const [usersColumns, setUsersColumns] = useState([]);
  const [usersData, setUsersData] = useState([]);

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

  const handleDeleteUser = async (email) => {
    const urlencoded = new URLSearchParams();
    urlencoded.append("email", email);
    urlencoded.append("adminKey", sessionStorage.getItem("adminKey"));
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/deleteuser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: urlencoded.toString(),
        }
      );

      const data = await response.json();
      console.log(data);

      if (data && data.msg && data.msg === "unauthorized") {
        navigate("/login");
      } else if (data && data.code && data.code === "ud") {
        await getUsers();
        await getLogs();
      }
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  // GET USERS (FOR ADMIN ONLY)
  const getUsers = async () => {
    const urlencoded3 = new URLSearchParams();
    urlencoded3.append("adminKey", sessionStorage.getItem("adminKey"));
    urlencoded3.append("role", sessionStorage.getItem("role"));
    try {
      await fetch("http://localhost:5000/api/admin/getusers", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlencoded3.toString(),
      }).then((response) => {
        response.json().then((data) => {
          console.log(data);
          if (data && data.msg && data.msg == "unauthorized") {
            navigate("/login");
          }
          setUsersColumns(data.cols);
          setUsersData(data.rows);
        });
      });
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  // GET LOGS (FOR ADMIN ONLY)
  const getLogs = async () => {
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
          if (data && data.msg && data.msg == "unauthorized") {
            navigate("/login");
          }
          setLogs(data);
        });
      });
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const getPatientsUsers = async () => {
    const urlencoded = new URLSearchParams();
    urlencoded.append("name", sessionStorage.getItem("name"));
    urlencoded.append("email", sessionStorage.getItem("email"));
    urlencoded.append("password", sessionStorage.getItem("password"));
    urlencoded.append("role", sessionStorage.getItem("role"));
    urlencoded.append("wardnumber", sessionStorage.getItem("wardnumber"));

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
  };

  const getPatientsAdmin = async () => {
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
  };

  useEffect(() => {
    // IF ITS USER
    (async () => {
      if (sessionStorage.getItem("role") != "admin") {
        await getPatientsUsers(); // GET PATIENTS (FOR USERS ONLY)
      }
      // IF ITS ADMIN
      else {
        await getPatientsAdmin(); // GET PATIENTS (FOR ADMIN ONLY)
        await getLogs(); // GET LOGS
        await getUsers(); // GET USERS
      }
      eraseLS(10);
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
    <div className="d-flex flex-column mt-2 mx-10">
      <h1 className="text-center">Dashboard</h1>

      {/* ADMIN QUERY COMPONENT */}
      {sessionStorage.getItem("role") == "admin" ? (
        <QueryComponent getPatientsAdmin={getPatientsAdmin} getLogs={getLogs} getUsers={getUsers} />
      ) : null}

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
              activeButton == "users" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={(e) => {
              setActiveButton("users");
            }}
          >
            Users
          </button>
        </div>
      ) : null}

      {/* ADMIN PATIENTS TABLE */}
      {sessionStorage.getItem("role") != "admin" ? (
        <PatientsTable
          allColumns={allColumns}
          selectedColumns={selectedColumns}
          data={data}
          handleCheckboxChange={handleCheckboxChange}
        />
      ) : null}
      {/* ADMIN LOGS TABLE */}
      {sessionStorage.getItem("role") == "admin" && activeButton == "logs" ? (
        <LogsTable logs={logs} />
      ) : null}
      {/* ADMIN DELETE */}
      {sessionStorage.getItem("role") == "admin" && activeButton == "users" ? (
        <UsersTable
          usersData={usersData}
          usersColumns={usersColumns}
          handleDeleteUser={handleDeleteUser}
        />
      ) : null}

      {sessionStorage.getItem("role") == "admin" &&
      activeButton == "patients" ? (
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
