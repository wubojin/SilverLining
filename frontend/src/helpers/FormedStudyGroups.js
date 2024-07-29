import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../helpers/AuthContext";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";

function FormedStudyGroups() {
  let { id } = useParams();
  const [listOfStudyGroups, setListOfStudyGroups] = useState([]);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    if (authState.status) {
      axios
        .get(`/studygroups/byUserId/${id}`, {
          baseURL: process.env.REACT_APP_BACKEND_URL,
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setListOfStudyGroups(response.data.listOfStudyGroups);
        })
        .catch((error) => {
          console.error("Error fetching study groups:", error);
        });
    }
  }, [id, authState]);

  const deleteGroup = (id) => {
    axios
      .delete(`/studygroups/${id}`, {
        baseURL: process.env.REACT_APP_BACKEND_URL,
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setListOfStudyGroups(listOfStudyGroups.filter((val) => val.id !== id));
      });
  };

  return (
    <div className="listOfStudyGroups">
      {listOfStudyGroups.length === 0 ? (
        <h3>No study groups formed yet</h3>
      ) : (
        listOfStudyGroups
          .slice()
          .reverse()
          .map((group, key) => (
            <div className="groupandjoin" key={key}>
              <div className="group">
                <div className="title">
                  {group.groupname}
                  {authState.username === group.username && (
                    <DeleteIcon
                      onClick={() => deleteGroup(group.id)}
                      className="delete"
                    />
                  )}
                </div>
                <div className="body">{group.objective}</div>
                <div className="footer">
                  <div className="username">
                    <Link to={`/profile/${group.UserId}`}>
                      {group.username}
                    </Link>
                  </div>
                </div>
              </div>

              {authState.username !== group.username && (
                <div className="joinGroupContainer">
                  <div className="joinGroupButton">
                    <button>Join</button>
                  </div>
                </div>
              )}
            </div>
          ))
      )}
    </div>
  );
}

export default FormedStudyGroups;
