import { AuthContext } from "../helpers/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import DeleteIcon from "@mui/icons-material/Delete";

function BrowseTutees() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const { authState } = useContext(AuthContext);
  let navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/posts", {
        baseURL: process.env.REACT_APP_BACKEND_URL,
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        setListOfPosts(response.data.listOfPosts);
        setLikedPosts(
          response.data.likedPosts.map((like) => {
            return like.PostId;
          })
        );
      });
  }, []);

  const deletePost = (id) => {
    axios
      .delete(`/posts/${id}`, {
        baseURL: process.env.REACT_APP_BACKEND_URL,
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setListOfPosts(
          listOfPosts.filter((val) => {
            return val.id !== id;
          })
        );
      });
  };

  const likePost = (postId) => {
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

  return (
    <div className="browseTuteesPage">
      {listOfPosts
        .slice()
        .reverse()
        .map((post, key) => {
          return (
            <div className="postandapply" key={key}>
              <div className="post">
                <div className="title">
                  {post.course}{" "}
                  {authState.username === post.username && (
                    <DeleteIcon
                      onClick={() => {
                        deletePost(post.id);
                      }}
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
                        state: { post, fromProfile: false },
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
                      onClick={() => {
                        likePost(post.id);
                      }}
                      className={
                        likedPosts.includes(post.id)
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
                    <button
                      onClick={() => {
                        navigate("/applytuition", { state: { post } });
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}

export default BrowseTutees;
