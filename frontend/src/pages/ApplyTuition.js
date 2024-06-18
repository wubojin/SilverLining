import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import { AuthContext } from "../helpers/AuthContext";

function ApplyTuition() {
  const location = useLocation();
  const { post } = location.state || {};
  const { authState } = useContext(AuthContext);
  let navigate = useNavigate();

  const initialValues = {
    course: post.course,
    rate: "",
    schedule: "",
    availability: "",
    experience: "",
  };

  const onSubmit = (data) => {
    const username = localStorage.getItem("username");
    const applicationData = { ...data, username, PostId: post.id };

    axios
      .post("http://localhost:3001/applications", applicationData, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          console.log("Application submitted");
          navigate(`/applications/${post.id}`, { state: { post } });
        }
      });
  };

  const validationSchema = Yup.object().shape({
    course: Yup.string().required("Course code and name is required"),
    rate: Yup.string().required("Rate is required"),
    schedule: Yup.string().required("Schedule is required"),
    availability: Yup.string().required("Availability is required"),
    experience: Yup.string().required("Experience is required"),
  });

  return (
    <div className="applyTuitionPage">
      <div className="postDetails">
        <div className="post">
          <div className="title">
            {post.course}
            {authState.username === post.username && (
              <DeleteIcon className="delete" />
            )}
          </div>

          <div
            className="body"
            onClick={() => {
              authState.username === post.username &&
                navigate(`/applications/${post.id}`, { state: { post } });
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

      <div className="applicationFormContainer">
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form className="applyTuitionFormContainer">
            <label>Course: </label>
            <ErrorMessage name="course" component="span" />
            <Field
              autoComplete="off"
              id="inputApplyTuition"
              name="course"
              placeholder="Eg. CS1101S Programming Methodology"
            />
            <label>Rate: </label>
            <ErrorMessage name="rate" component="span" />
            <Field
              autoComplete="off"
              id="inputApplyTuition"
              name="rate"
              placeholder="Eg. $80/h"
            />
            <label>Schedule: </label>
            <ErrorMessage name="schedule" component="span" />
            <Field
              autoComplete="off"
              id="inputApplyTuition"
              name="schedule"
              placeholder="Eg. Once a week, 1.5hr"
            />
            <label>Availability: </label>
            <ErrorMessage name="availability" component="span" />
            <Field
              autoComplete="off"
              id="inputApplyTuition"
              name="availability"
              placeholder="Eg. Mon/Wed/Fri 4-7pm"
            />
            <label>Experience: </label>
            <ErrorMessage name="experience" component="span" />
            <Field
              autoComplete="off"
              id="inputApplyTuition"
              name="experience"
              placeholder="Course proficiency, Past tutoring jobs, etc."
            />
            <div className="applyTuitionButtonContainer">
              <button type="submit">Submit</button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default ApplyTuition;
