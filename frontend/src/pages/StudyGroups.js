import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../helpers/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function StudyGroups() {
  const [listOfStudyGroups, setListOfStudyGroups] = useState([]);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/studygroups", {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        setListOfStudyGroups(response.data.listOfStudyGroups);
      })
      .catch((error) => {
        console.error("Error fetching study groups:", error);
      });
  }, []);

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
                  <div className="title">{group.groupname}</div>
                  <div className="body">{group.objective}</div>
                  <div className="footer">
                    {" "}
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
            );
          })}
      </div>
    </div>
  );
}

export default StudyGroups;
