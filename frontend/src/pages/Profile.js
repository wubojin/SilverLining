import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import ProfileNav from "../helpers/ProfileNav";
import axios from "axios";

function Profile() {
  let { id } = useParams();
  const [username, setUsername] = useState("");
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/auth/basicinfo/${id}`, {
        baseURL: process.env.REACT_APP_BACKEND_URL,
      })
      .then((response) => {
        setUsername(response.data.username);
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
      });
  }, [id]);

  return (
    <div className="profilePage">
      <div className="basicInfo">
        {authState.username !== username && <h3>User: {username}</h3>}

        {authState.username === username && (
          <div className="changePasswordButtonContainer">
            <button onClick={() => navigate("/changepassword")}>
              Change password
            </button>
          </div>
        )}
      </div>

      <ProfileNav />
      <Outlet />
    </div>
  );
}

export default Profile;
