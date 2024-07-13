import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RequestTutor() {
  let navigate = useNavigate();

  const initialValues = {
    course: "",
    rate: "",
    schedule: "",
    availability: "",
    description: "",
  };

  const onSubmit = (data) => {
    const username = localStorage.getItem("username");
    const postData = { ...data, username };

    axios
      .post("/posts", postData, {
        baseURL: process.env.REACT_APP_BACKEND_URL,
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
    course: Yup.string().required("Course code and name is required"),
    rate: Yup.string().required("Rate is required"),
    schedule: Yup.string().required("Schedule is required"),
    availability: Yup.string().required("Availability is required"),
    description: Yup.string().required("Description is required"),
  });

  return (
    <div className="requestTutorPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="requestTutorFormContainer">
          <label>Course: </label>
          <ErrorMessage name="course" component="span" />
          <Field
            autoComplete="off"
            id="inputRequestTutor"
            name="course"
            placeholder="Eg. CS1101S Programming Methodology"
          />
          <label>Rate: </label>
          <ErrorMessage name="rate" component="span" />
          <Field
            autoComplete="off"
            id="inputRequestTutor"
            name="rate"
            placeholder="Eg. $80/h"
          />
          <label>Schedule: </label>
          <ErrorMessage name="schedule" component="span" />
          <Field
            autoComplete="off"
            id="inputRequestTutor"
            name="schedule"
            placeholder="Eg. Once a week, 1.5hr"
          />
          <label>Availability: </label>
          <ErrorMessage name="availability" component="span" />
          <Field
            autoComplete="off"
            id="inputRequestTutor"
            name="availability"
            placeholder="Eg. Mon/Wed/Fri 4-7pm"
          />
          <label>Description: </label>
          <ErrorMessage name="description" component="span" />
          <Field
            autoComplete="off"
            id="inputRequestTutor"
            name="description"
            placeholder="Type of help needed, Preference of tutor, etc."
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
