import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

function Signup() {
  const initialValues = {
    username: "",
    password: "",
  };

  const onSubmit = (data) => {
    axios.post("http://localhost:3001/auth/signup", data).then(() => {
      console.log(data);
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
        <Form className="signupFormContainer">
          <label>Username: </label>
          <ErrorMessage name="username" component="span" />
          <Field
            autocomplete="off"
            id="inputSignup"
            name="username"
            placeholder="(Eg. user123)"
          />
          <label>Password: </label>
          <ErrorMessage name="password" component="span" />
          <Field
            autocomplete="off"
            type="password"
            id="inputSignup"
            name="password"
            placeholder="Your password..."
          />
          <div className="signupButtonContainer">
            <button type="submit">Sign up</button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default Signup;
