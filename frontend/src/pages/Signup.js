import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [error, setError] = useState("");

  const initialValues = {
    username: "",
    password: "",
    confirmPassword: "",
  };

  let navigate = useNavigate();

  const onSubmit = (data) => {
    axios
      .post("/auth/signup", data, {
        baseURL: process.env.REACT_APP_BACKEND_URL,
      })
      .then((response) => {
        if (response.data.error) {
          setError(response.data.error);
        } else {
          console.log(data);
          navigate("/login");
        }
      });
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .max(15, "Username must be at most 15 characters")
      .required("Username is required"),
    password: Yup.string()
      .min(4, "Password must be at least 4 characters")
      .max(20, "Password must be at most 20 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  return (
    <div className="signupPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ setFieldValue }) => (
          <Form className="signupFormContainer">
            <div>
              <label htmlFor="username">Username:</label>
              {error && <div className="errorMessage">{error}</div>}
              <ErrorMessage
                name="username"
                component="div"
                className="errorMessage"
              />
              <Field
                autoComplete="off"
                id="inputSignup"
                name="username"
                placeholder="Eg. mandyliu"
                onChange={(event) => {
                  setError("");
                  setFieldValue("username", event.target.value);
                }}
              />
            </div>

            <div>
              <label htmlFor="password">Password:</label>
              <ErrorMessage
                name="password"
                component="div"
                className="errorMessage"
              />
              <Field
                autoComplete="off"
                type="password"
                id="inputSignup"
                name="password"
                placeholder="Your password..."
                onChange={(event) => {
                  setError("");
                  setFieldValue("password", event.target.value);
                }}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword">Confirm password:</label>
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="errorMessage"
              />
              <Field
                autoComplete="off"
                type="password"
                id="inputSignup"
                name="confirmPassword"
                placeholder="Confirm your password..."
                onChange={(event) => {
                  setError("");
                  setFieldValue("confirmPassword", event.target.value);
                }}
              />
            </div>

            <div className="signupButtonContainer">
              <button type="submit">Sign up</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Signup;
