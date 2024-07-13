import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  Link,
  useLocation,
  useParams,
  useNavigate,
  Outlet,
} from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import ProfileNav from "../helpers/ProfileNav";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import DeleteIcon from "@mui/icons-material/Delete";

function Applications() {
  let { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const fromProfile = location.state?.fromProfile || false;
  const { post } = location.state || {};
  const [listOfApplications, setListOfApplications] = useState([]);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(`/applications/${id}`, {
        baseURL: process.env.REACT_APP_BACKEND_URL,
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        setListOfApplications(response.data);
      });
  }, [id]);

  return (
    <div className="postAndApplicationsPage">
      {fromProfile && (
        <div className="profilePage">
          <div className="basicInfo">
            {authState.username !== post.username && (
              <h3>User: {post.username}</h3>
            )}

            {authState.username === post.username && (
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
      )}

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
        {listOfApplications.length === 0 ? (
          <h3 className="noApplications">No applications yet</h3>
        ) : (
          listOfApplications.map((application, key) => {
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

                {authState.username === post.username && (
                  <div className="acceptApplicationContainer">
                    <div className="acceptApplicationButton">
                      <button>Accept</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Applications;
