import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StudyGroupForm() {
  let navigate = useNavigate();

  const initialValues = {
    groupname: "",
    objective: "",
  };

  const onSubmit = (data) => {
    axios
      .post("http://localhost:3001/studygroups", data, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          console.log("Study group created successfully");
          navigate("/studygroups");
        }
      })
      .catch((error) => {
        console.error("Error creating study group:", error);
      });
  };

  const validationSchema = Yup.object().shape({
    groupname: Yup.string().required("Group name is required"),
    objective: Yup.string().required("Objective is required"),
  });

  return (
    <div className="createStudyGroupPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="studygroupFormContainer">
          <label>Group name: </label>
          <ErrorMessage name="groupname" component="span" />
          <Field
            autoComplete="off"
            id="inputCreateStudyGroup"
            name="groupname"
            placeholder="Eg. AcademicWeapons"
          />
          <label>Objective: </label>
          <ErrorMessage name="objective" component="span" />
          <Field
            autoComplete="off"
            id="inputCreateStudyGroup"
            name="objective"
            placeholder="Eg. Prep for finals"
          />
          <div className="createStudyGroupButtonContainer">
            <button type="submit">Create study group</button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default StudyGroupForm;
