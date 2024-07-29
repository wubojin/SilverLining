import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import ProfileNav from "../helpers/ProfileNav";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";

function Messages() {
  const location = useLocation();
  const navigate = useNavigate();
  const fromProfile = location.state?.fromProfile || false;
  const { group } = location.state || {};
  const { authState } = useContext(AuthContext);
  const [listOfStudyGroups, setListOfStudyGroups] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

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

  useEffect(() => {
    if (group && group.id) {
      axios
        .get(`/messages/${group.id}`, {
          baseURL: process.env.REACT_APP_BACKEND_URL,
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setMessages(response.data);
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });
    }
  }, [group]);

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

  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    const messageData = {
      StudyGroupId: group.id,
      messageBody: newMessage,
      username: authState.username,
    };

    axios
      .post("/messages", messageData, {
        baseURL: process.env.REACT_APP_BACKEND_URL,
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        setMessages([...messages, response.data]);
        setNewMessage("");
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  return (
    <div className="groupAndMessagesPage">
      {fromProfile && (
        <div className="profilePage">
          <div className="basicInfo">
            {authState.username !== group.username && (
              <h3>User: {group.username}</h3>
            )}

            {authState.username === group.username && (
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

      <div className="groupDetailsWithMessages">
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
          <div className="body">{group.objective}</div>
          <div className="footer">
            <div className="username">
              <Link to={`/profile/${group.UserId}/formed-study-groups`}>
                {group.username}
              </Link>
            </div>
          </div>
        </div>
        {authState.username !== group.username && (
          <div className="leaveGroupContainer">
            <div className="leaveGroupButton">
              <button>Leave group</button>
            </div>
          </div>
        )}
      </div>

      <div className="messagesContainer">
        <div className="messagesList">
          {messages.map((message, key) => (
            <div className="message" key={key}>
              <span className="messageUsername">{message.username}</span>
              <span className="messageText">{message.messageBody}</span>
            </div>
          ))}
        </div>
        <div className="messageInputContainer">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            autoComplete="off"
          />
          <SendIcon onClick={sendMessage} className="send" />
        </div>
      </div>
    </div>
  );
}

export default Messages;
