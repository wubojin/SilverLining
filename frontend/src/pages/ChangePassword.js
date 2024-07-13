import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

function ChangePassword({ onLogout }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const initialValues = {
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const onSubmit = (values) => {
    axios
      .put(
        "/auth/changepassword",
        {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        },
        {
          baseURL: process.env.REACT_APP_BACKEND_URL,
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          setError(response.data.error);
        } else {
          onLogout();
          navigate("/login");
        }
      });
  };

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Old password is required"),
    newPassword: Yup.string()
      .min(4, "New password must be at least 4 characters")
      .max(20, "New password must be at most 20 characters")
      .required("New password is required"),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "New password must match")
      .required("Confirm new password is required"),
  });

  return (
    <div className="changePasswordPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ setFieldValue }) => (
          <Form className="changePasswordFormContainer">
            <div>
              <label htmlFor="oldPassword">Old password:</label>
              {error && <div className="errorMessage">{error}</div>}
              <ErrorMessage
                name="oldPassword"
                component="div"
                className="errorMessage"
              />
              <Field
                type="password"
                name="oldPassword"
                id="inputChangePassword"
                onChange={(event) => {
                  setError("");
                  setFieldValue("oldPassword", event.target.value);
                }}
              />
            </div>

            <div>
              <label htmlFor="newPassword">New password:</label>
              <ErrorMessage
                name="newPassword"
                component="div"
                className="errorMessage"
              />
              <Field
                type="password"
                name="newPassword"
                id="inputChangePassword"
                onChange={(event) => {
                  setError("");
                  setFieldValue("newPassword", event.target.value);
                }}
              />
            </div>

            <div>
              <label htmlFor="confirmNewPassword">Confirm new password:</label>
              <ErrorMessage
                name="confirmNewPassword"
                component="div"
                className="errorMessage"
              />
              <Field
                type="password"
                name="confirmNewPassword"
                id="inputChangePassword"
                onChange={(event) => {
                  setError("");
                  setFieldValue("confirmNewPassword", event.target.value);
                }}
              />
            </div>

            <div className="saveChangesButtonContainer">
              <button type="submit">Save changes</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ChangePassword;
