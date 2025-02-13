"use client";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { Alert, Icon, IconButton, Slide } from "@mui/material";
import { addAdminRole, listUsers, removeAdminRole } from "../firebase";
import ClearIcon from "@mui/icons-material/Clear";
import PlusIcon from "@mui/icons-material/Add";
import CheckMarkIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminAuthWrapper from "../components/AdminAuthWrapper";

interface User {
  email: string;
  emailVerified: boolean;
  admin: boolean;
}

export default function Admin() {
  const [adminInput, setAdminInput] = useState("");
  const [alert, setAlert] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({ open: false, message: "", severity: "success" });
    const [users, setUsers] = useState<User[] | null>(null);

  //call listUsers and update the users state
  useEffect(() => {
    listUsers()
      .then((res) => {
        setUsers(res.data as User[]);
      })
      .catch((error) => {
        setAlert({
          open: true,
          message: error.message,
          severity: "error",
        });
      });
  }, []);

  const handleAddAdmin = async (email: string) => {
    await addAdminRole({ email })
      .then((res) => {
        setAlert({
          open: true,
          message: "Admin added successfully",
          severity: "success",
        });
        if (users) {
          setUsers([
            ...users.filter((user) => user.email !== email),
            {
              email: email,
              emailVerified:
                users.find((user) => user.email === email)?.emailVerified ||
                false,
              admin: true,
            },
          ]);
        }
        console.log(res);
      })
      .catch((error: { message: any; details: any }) => {
        setAlert({
          open: true,
          message: error.message,
          severity: "error",
        });
        console.log(error);
      });
  };

  const handleRemoveAdmin = async (email: string) => {
    await removeAdminRole({ email })
      .then((res) => {
        setAlert({
          open: true,
          message: "Admin removed successfully",
          severity: "success",
        });
        if (users) {
          setUsers([
            ...users.filter((user) => user.email !== email),
            {
              email: email,
              emailVerified:
                users.find((user) => user.email === email)?.emailVerified ||
                false,
              admin: false,
            },
          ]);
        }
      })
      .catch((error: { message: any; details: any }) => {
        setAlert({
          open: true,
          message: error.message,
          severity: "error",
        });
        console.log(error);
      });
  };

  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <AdminAuthWrapper>
      <Header />
      <main className="flex min-h-screen flex-col items-center p-6 bg-gray-900 text-white">
        <Slide in={alert.open} direction="up">
          <Alert
            severity={alert.severity}
            className="absolute right-3 bottom-3"
          >
            <span className="mr-3">{alert.message}</span>
            <IconButton className="w-5 h-5" onClick={handleAlertClose}>
              <ClearIcon fontSize="small" />
            </IconButton>
          </Alert>
        </Slide>
        <h1 className="text-3xl mb-6">Manage Admins</h1>
        <div className="flex w-full max-w-3xl space-x-2">
          <input
            type="email"
            placeholder="Search..."
            value={adminInput}
            onChange={(e) => setAdminInput(e.target.value)}
            className="flex-1 p-4 mb-6 border border-gray-300 rounded-lg text-black"
          />
        </div>
        {users ? (
          <div className="flex flex-col w-full max-w-3xl space-y-2">
            {users
              .filter((user) =>
                user.email.toLowerCase().includes(adminInput.toLowerCase())
              )
              .sort((a, b) => (a.admin === b.admin ? 0 : a.admin ? -1 : 1))
              .map((user) => (
                <div
                  key={user.email}
                  className="flex items-center space-x-2 w-full p-4 bg-gray-800 rounded-lg"
                >
                  <div className="flex-1">
                    <p>{user.email}</p>
                  </div>
                  <div>
                    <span
                      className={`px-2 py-1 rounded-lg ${
                        user.emailVerified ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      <CheckMarkIcon fontSize="small" className="mr-1" />
                      {user.emailVerified
                        ? "Email Verified"
                        : "Email Not Verified"}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`px-2 py-1 rounded-lg ${
                        user.admin ? "bg-red-500" : "bg-green-500"
                      }`}
                    >
                      {user.admin ? "Admin" : "User"}
                    </span>
                  </div>
                  {user.admin ? (
                    <IconButton
                      onClick={() => handleRemoveAdmin(user.email)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  ) : (
                    <IconButton
                      onClick={() => handleAddAdmin(user.email)}
                      color="inherit"
                    >
                      <PlusIcon />
                    </IconButton>
                  )}
                </div>
              ))}
          </div>
        ) : (
          <h1>Loading...</h1>
        )}
      </main>
    </AdminAuthWrapper>
  );
}
