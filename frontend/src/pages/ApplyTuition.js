import React from "react";
import { useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import { AuthContext } from "../helpers/AuthContext";
import { useContext } from "react";

function ApplyTuition() {
  const location = useLocation();
  const { post } = location.state;
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  const initialValues = {
    title: post.title,
    postText: post.postText,
    username: authState.username,
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    postText: Yup.string().required("Post text is required"),
  });

  const onSubmit = (data) => {
    axios
      .post("http://localhost:3001/applications", data, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          console.log("Application submitted");
          navigate("/browsetutees");
        }
      });
  };

  return (
    <div className="applyTuitionPage">
      <div className="postDetails">
        <div className="post">
          <div className="title">
            {post.title}
            {authState.username === post.username && (
              <DeleteIcon className="delete" />
            )}
          </div>

          <div className="body">{post.postText}</div>

          <div className="footer">
            <div className="username">
              <Link to={`/profile/${post.UserId}`}>{post.username}</Link>
            </div>

            <div className="buttons">
              <ThumbUpAltIcon className="unlikeBttn" />
            </div>

            <div className="number">
              <label>{post.Likes.length}</label>
            </div>
          </div>
        </div>
      </div>

      <div className="applicationFormContainer">
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form className="requestTutorFormContainer">
            <label>Title: </label>
            <ErrorMessage name="title" component="span" />
            <Field
              autoComplete="off"
              id="inputRequestTutor"
              name="title"
              placeholder="(Eg. I need help in CS1010X)"
            />
            <label>Post: </label>
            <ErrorMessage name="postText" component="span" />
            <Field
              autoComplete="off"
              id="inputRequestTutor"
              name="postText"
              placeholder="(Eg. Budget: $X/h, Frequency: X times a week)"
            />
            <div className="requestTutorButtonContainer">
              <button type="submit">Submit</button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default ApplyTuition;
