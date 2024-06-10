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
  };

  let navigate = useNavigate();

  const onSubmit = (data) => {
    axios.post("http://localhost:3001/auth/signup", data).then((response) => {
      if (response.data.error) {
        setError(response.data.error);
      } else {
        console.log(data);
        navigate("/login");
      }
    });
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(15).required(),
    password: Yup.string().min(4).max(20).required(),
  });

  return (
    <div className="signupContainer">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {(
          { setFieldValue } // Destructure setFieldValue from Formik props
        ) => (
          <Form className="signupFormContainer">
            <label>Username: </label>
            {error && <span className="errorMessage">{error}</span>}
            <ErrorMessage name="username" component="span" />
            <Field
              autoComplete="off"
              id="inputSignup"
              name="username"
              placeholder="(Eg. user123)"
              onChange={(event) => {
                setError(""); // Clear error message when username input changes
                setFieldValue("username", event.target.value);
              }}
            />
            <label>Password: </label>
            <ErrorMessage name="password" component="span" />
            <Field
              autoComplete="off"
              type="password"
              id="inputSignup"
              name="password"
              placeholder="Your password..."
            />
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
