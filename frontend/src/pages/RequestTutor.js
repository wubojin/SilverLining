import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RequestTutor() {
  let navigate = useNavigate();

  const initialValues = {
    title: "",
    postText: "",
  };

  const onSubmit = (data) => {
    const username = localStorage.getItem("username");
    const postData = { ...data, username };

    axios
      .post("http://localhost:3001/posts", postData, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          console.log("It worked");
          navigate("/browsetutees");
        }
      });
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    postText: Yup.string().required("Post text is required"),
  });

  return (
    <div className="requestTutorPage">
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
            <button type="submit">Request Tutor</button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default RequestTutor;
