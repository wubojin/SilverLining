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
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/posts", {
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
      .delete(`http://localhost:3001/posts/${id}`, {
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
        "http://localhost:3001/likes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
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

  const handleApply = (post) => {
    navigate("/applytuition", { state: { post } });
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
                  {post.title}{" "}
                  {authState.username === post.username && (
                    <DeleteIcon
                      onClick={() => {
                        deletePost(post.id);
                      }}
                      className="delete"
                    />
                  )}
                </div>

                <div className="body">{post.postText}</div>

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
                    <button onClick={() => handleApply(post)}>Apply</button>
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