import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import axios from "axios";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import DeleteIcon from "@mui/icons-material/Delete";

function Profile() {
  let { id } = useParams();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    // Fetch user info
    axios
      .get(`http://localhost:3001/auth/basicinfo/${id}`)
      .then((response) => {
        setUsername(response.data.username);
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
      });

    // Fetch posts by user ID
    axios
      .get(`http://localhost:3001/posts/byUserId/${id}`)
      .then((response) => {
        setListOfPosts(response.data || []);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });

    // Fetch likes by user ID
    axios
      .get(`http://localhost:3001/likes/byUserId/${id}`)
      .then((response) => {
        setLikedPosts(response.data.map((like) => like.PostId) || []);
      })
      .catch((error) => {
        console.error("Error fetching likes:", error);
      });
  }, [id]);

  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setListOfPosts(listOfPosts.filter((val) => val.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
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
          setLikedPosts(likedPosts.filter((id) => id !== postId));
        } else {
          setLikedPosts([...likedPosts, postId]);
        }
      })
      .catch((error) => {
        console.error("Error liking post:", error);
      });
  };

  return (
    <div className="profilePageContainer">
      <div className="basicInfo">
        <h1>Username: {username}</h1>
      </div>
      <div className="listOfPosts">
        {listOfPosts.length > 0 &&
          listOfPosts
            .slice()
            .reverse()
            .map((post, key) => (
              <div className="post" key={key}>
                <div className="title">
                  {post.title}{" "}
                  {authState.username === post.username && (
                    <DeleteIcon
                      onClick={() => deletePost(post.id)}
                      className="delete"
                    />
                  )}
                </div>
                <div className="body">{post.postText}</div>
                <div className="footer">
                  <div className="username">{post.username}</div>
                  <div className="buttons">
                    <ThumbUpAltIcon
                      onClick={() => likePost(post.id)}
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
            ))}
      </div>
    </div>
  );
}

export default Profile;
