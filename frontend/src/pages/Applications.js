import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import DeleteIcon from "@mui/icons-material/Delete";

function Applications() {
  const location = useLocation();
  const { post } = location.state || {};
  const [listOfApplications, setListOfApplications] = useState([]);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get("http://localhost:3001/applications", {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        setListOfApplications(response.data);
      });
  }, []);

  return (
    <div className="postAndApplicationsPage">
      <div className="postDetailsWithApplications">
        <div className="post">
          <div className="title">
            {post.course}
            {authState.username === post.username && (
              <DeleteIcon className="delete" />
            )}
          </div>

          <div className="body">
            <p>
              <strong>Rate:</strong> {post.rate}
              <br />
              <strong>Schedule:</strong> {post.schedule}
              <br />
              <strong>Availability:</strong> {post.availability}
              <br />
              <strong>Description:</strong> {post.description}
            </p>
          </div>

          <div className="footer">
            <div className="username">
              <Link to={`/profile/${post.UserId}`}>{post.username}</Link>
            </div>

            <div className="buttons">
              <ThumbUpAltIcon
                className={
                  post.Likes.some((like) => like.UserId === authState.id)
                    ? "likedBttn"
                    : "unlikeBttn"
                }
              />
            </div>

            <div className="number">
              <label>{post.Likes.length}</label>
            </div>
          </div>
        </div>
      </div>

      <div className="applicationsContainer">
        {listOfApplications.map((application, key) => {
          return (
            <div className="applicationandaccept" key={key}>
              <div className="application">
                <div className="title">{application.course}</div>
                <div className="body">
                  <p>
                    <strong>Rate:</strong> {application.rate}
                    <br />
                    <strong>Schedule:</strong> {application.schedule}
                    <br />
                    <strong>Availability:</strong> {application.availability}
                    <br />
                    <strong>Experience:</strong> {application.experience}
                  </p>
                </div>
                <div className="footer">{application.username}</div>
              </div>

              <div className="acceptApplicationContainer">
                <div className="acceptApplicationButton">
                  <button>Accept</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Applications;
