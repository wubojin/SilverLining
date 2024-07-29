import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import DeleteIcon from "@mui/icons-material/Delete";

function TutorRequests() {
  let { id } = useParams();
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/posts/byUserId/${id}`, {
        baseURL: process.env.REACT_APP_BACKEND_URL,
      })
      .then((response) => {
        setListOfPosts(response.data);
        setLikedPosts(
          response.data.likedPosts.map((like) => {
            return like.PostId;
          })
        );
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, [id]);

  const deletePost = (postId) => {
    axios
      .delete(`/posts/${postId}`, {
        baseURL: process.env.REACT_APP_BACKEND_URL,
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setListOfPosts(listOfPosts.filter((val) => val.id !== postId));
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  };

  const likePost = (post, postId) => {
    axios
      .post(
        "/likes",
        { PostId: postId },
        {
          baseURL: process.env.REACT_APP_BACKEND_URL,
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      )
      .then((response) => {
        if (
          !likedPosts.includes(post.id) &&
          post.Likes.some((like) => like.UserId === authState.id)
        ) {
          likePost(post, post.id);
        }

        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                return { ...post, Likes: [...post.Likes, 0] };
              } else {
                const likesArray = post.Likes;
                likesArray.pop();
                return { ...post, Likes: likesArray };
              }
            } else {
              return post;
            }
          })
        );

        if (likedPosts.includes(postId)) {
          setLikedPosts(
            likedPosts.filter((id) => {
              return id !== postId;
            })
          );
        } else {
          setLikedPosts([...likedPosts, postId]);
        }
      });
  };

  const handleApply = (post) => {
    navigate("/applytuition", { state: { post } });
  };

  return (
    <div className="listOfPosts">
      {listOfPosts.length === 0 ? (
        <h3>No tutor requests yet</h3>
      ) : (
        listOfPosts
          .slice()
          .reverse()
          .map((post, key) => (
            <div className="postandapply" key={key}>
              <div className="post">
                <div className="title">
                  {post.course}{" "}
                  {authState.username === post.username && (
                    <DeleteIcon
                      onClick={() => deletePost(post.id)}
                      className="delete"
                    />
                  )}
                </div>
                <div
                  className={
                    authState.username === post.username
                      ? "clickableBody"
                      : "body"
                  }
                  onClick={() => {
                    authState.username === post.username &&
                      navigate(`/applications/${post.id}`, {
                        state: { post, fromProfile: true },
                      });
                  }}
                >
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
                      onClick={() => likePost(post, post.id)}
                      className={
                        likedPosts.includes(post.id) ||
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
              {authState.username !== post.username && (
                <div className="applyTuitionContainer">
                  <div className="applyTuitionButton">
                    <button onClick={() => handleApply(post)}>Apply</button>
                  </div>
                </div>
              )}
            </div>
          ))
      )}
    </div>
  );
}

export default TutorRequests;
