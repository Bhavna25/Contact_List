import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Loading from "./Loading";
import UpdateIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import "./styles.css";

const data = localStorage.getItem("users");

function App() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({ username: "", email: "", phone: "" });
  const [searchInput, setSearchInput] = useState("");
  const [filteredUser, setFilteredUser] = useState([]);

  useEffect(() => {
    console.log(data);
    data && setUsers(JSON.parse(data));
  }, []);

  function handleChange(event) {
    event.persist();
    setUser((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const userId = users.findIndex((u) => u.id === user.id);
    const userExists = userId > -1;
    // if user exists, update it
    if (userExists) {
      console.log("USER UPDATED");
      const updatedUsers = users.map((u) => {
        return u.id === user.id ? user : u;
      });
      setUsers(updatedUsers);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      // if user doesn't exist, create it
    } else {
      const newUser = { ...user, id: Date.now() };
      console.log("USER CREATED");
      setUsers([...users, newUser]);
      localStorage.setItem("users", JSON.stringify([...users, newUser]));
    }
    setUser({ username: "", email: "", phone: "" });
  }

  function clearUser() {
    setUser({ username: "", email: "", phone: "" });
  }

  function deleteUser(user) {
    console.log("USER DELETED");
    const afterDeletion = users.filter((u) => u.id !== user.id);
    setUsers(afterDeletion);
    localStorage.setItem("users", JSON.stringify(afterDeletion));
  }

  function searchContact(value) {
    console.log(users);
    const filterUser = users.filter((user) => user.username.includes(value));
    setFilteredUser(filterUser);
  }
  useEffect(() => {
    let timer;
    timer = setTimeout(() => searchContact(searchInput), 400);
    return () => {
      clearTimeout(timer);
    };
  }, [searchInput, users]);

  return (
    <div className="container">
      <Typography align="center" component="h1" variant="h5">
        Contact List
      </Typography>
      <div className="searchBox">
        <input
          placeholder="Search Contact..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
      <form onSubmit={handleSubmit} className="form">
        <TextField
          autoComplete="off"
          name="username"
          onChange={handleChange}
          label="Name"
          fullWidth
          value={user.username}
        />
        <TextField
          autoComplete="off"
          name="email"
          onChange={handleChange}
          label="Email"
          fullWidth
          value={user.email}
        />
        <TextField
          autoComplete="off"
          name="phone"
          onChange={handleChange}
          label="Phone"
          fullWidth
          value={user.phone}
        />
        <div style={{ display: "flex" }}>
          <Button className="button-submit" type="submit">
            Submit
          </Button>
          <Button onClick={clearUser} className="button-clear" type="button">
            Clear
          </Button>
        </div>
      </form>
      {users ? (
        filteredUser &&
        filteredUser.map((user) => (
          <Card key={user.id} className="card">
            <CardContent>
              <Typography component="h5" variant="h5" className="username">
                {user.username}
              </Typography>
              <Typography variant="subtitle1" className="email">
                {user.email}
              </Typography>
              <Typography variant="subtitle1" className="phone">
                {user.phone}
              </Typography>
            </CardContent>
            <div style={{ margin: "1em" }}>
              <UpdateIcon
                style={{ color: "black" }}
                onClick={() => setUser(user)}
              />
              <DeleteIcon
                style={{ color: "black" }}
                onClick={() => deleteUser(user)}
              />
            </div>
          </Card>
        ))
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default App;
