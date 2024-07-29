import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../helpers/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";

function StudyGroups() {
  const [listOfStudyGroups, setListOfStudyGroups] = useState([]);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/studygroups", {
        baseURL: process.env.REACT_APP_BACKEND_URL,
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        setListOfStudyGroups(response.data.listOfStudyGroups);
      })
      .catch((error) => {
        console.error("Error fetching study groups:", error);
      });
  }, []);

  const deleteGroup = (id) => {
    axios
      .delete(`/studygroups/${id}`, {
        baseURL: process.env.REACT_APP_BACKEND_URL,
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setListOfStudyGroups(
          listOfStudyGroups.filter((val) => {
            return val.id !== id;
          })
        );
      });
  };

  return (
    <div className="studygroupsPage">
      <div className="subHeader">
        <h3>Can't find a suitable study group? Form your own study group!</h3>
        <div className="formStudyGroupButtonContainer">
          <button onClick={() => navigate("/studygroupform")}>
            Form study group
          </button>
        </div>
      </div>

      <div className="studygroupsContainer">
        {listOfStudyGroups
          .slice()
          .reverse()
          .map((group, key) => {
            return (
              <div className="groupandjoin" key={key}>
                <div className="group">
                  <div className="title">
                    {group.groupname}
                    {authState.username === group.username && (
                      <DeleteIcon
                        onClick={() => {
                          deleteGroup(group.id);
                        }}
                        className="delete"
                      />
                    )}
                  </div>

                  <div
                    className={
                      authState.username === group.username
                        ? "clickableBody"
                        : "body"
                    }
                    onClick={() => {
                      authState.username === group.username &&
                        navigate(`/messages/${group.id}`, {
                          state: { group },
                        });
                    }}
                  >
                    <p>
                      <strong>Objective:</strong> {group.objective}
                    </p>
                  </div>

                  <div className="footer">
                    {" "}
                    <div className="username">
                      <Link to={`/profile/${group.UserId}/formed-study-groups`}>
                        {group.username}
                      </Link>
                    </div>
                  </div>
                </div>

                {authState.username !== group.username && (
                  <div className="joinGroupContainer">
                    <div className="joinGroupButton">
                      <button
                        onClick={() => {
                          navigate(`/messages/${group.id}`, {
                            state: { group },
                          });
                        }}
                      >
                        Join group
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default StudyGroups;
