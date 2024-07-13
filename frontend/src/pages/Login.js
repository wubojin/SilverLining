import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setAuthState } = useContext(AuthContext);

  let navigate = useNavigate();

  const login = () => {
    const data = { username: username, password: password };
    axios
      .post("/auth/login", data, { baseURL: process.env.REACT_APP_BACKEND_URL })
      .then((response) => {
        if (response.data.error) {
          setError(response.data.error);
        } else {
          localStorage.setItem("accessToken", response.data.token);
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
          navigate("/");
        }
      });
  };

  return (
    <div className="loginPage">
      <div className="loginFormContainer">
        <label>Username:</label>
        <input
          autoComplete="off"
          type="text"
          id="inputLogin"
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
        <label>Password:</label>
        <input
          autoComplete="off"
          type="password"
          id="inputLogin"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        {error && <span className="errorMessage">{error}</span>}
        <div className="loginButtonContainer">
          <button onClick={login}>Log in</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
