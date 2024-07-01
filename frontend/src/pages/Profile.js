import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import axios from "axios";
import ProfileNav from "../helpers/ProfileNav";

function Profile() {
  let { id } = useParams();
  const [username, setUsername] = useState("");
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3001/auth/basicinfo/${id}`)
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
        <h3>Username: {username}</h3>
        {authState.username === username && (
          <div className="changePasswordButtonContainer">
            <button onClick={() => navigate("/changepassword")}>
              Change password
            </button>
          </div>
        )}
      </div>

      <ProfileNav />
    </div>
  );
}

export default Profile;
