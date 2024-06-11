import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import axios from "axios";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import DeleteIcon from "@mui/icons-material/Delete";

function Profile() {
  let { id } = useParams();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfoResponse = await axios.get(
          `http://localhost:3001/auth/basicinfo/${id}`
        );
        setUsername(userInfoResponse.data.username);

        const postsResponse = await axios.get(
          `http://localhost:3001/posts/byUserId/${id}`
        );
        setListOfPosts(postsResponse.data || []);

        const likesResponse = await axios.get(
          `http://localhost:3001/likes/byUserId/${id}`
        );
        setLikedPosts(new Set(likesResponse.data.map((like) => like.PostId)));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const deletePost = (postId) => {
    axios
      .delete(`http://localhost:3001/posts/${postId}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setListOfPosts(listOfPosts.filter((val) => val.id !== postId));
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  };

  const likePost = async (postId) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/likes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      );

      setListOfPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            const updatedLikes = response.data.liked
              ? [...post.Likes, 0]
              : post.Likes.slice(0, -1);

            return { ...post, Likes: updatedLikes };
          } else {
            return post;
          }
        })
      );

      setLikedPosts((prevLikedPosts) => {
        const updatedLikedPosts = new Set(prevLikedPosts);
        if (updatedLikedPosts.has(postId)) {
          updatedLikedPosts.delete(postId);
        } else {
          updatedLikedPosts.add(postId);
        }
        return updatedLikedPosts;
      });
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  let navigate = useNavigate();

  return (
    <div className="profilePage">
      <div className="basicInfo">
        <h1>Username: {username}</h1>
        {authState.username === username && (
          <div className="changePasswordButtonContainer">
            <button onClick={() => navigate("/changepassword")}>
              {" "}
              Change password
            </button>
          </div>
        )}
      </div>
      <div className="listOfPosts">
        {listOfPosts
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
                      likedPosts.has(post.id) ? "likedBttn" : "unlikeBttn"
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
