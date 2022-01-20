import { Formik, FormikProps } from "formik";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface IFormModel {
  name: string;
  username: string;
  email: string;
  dob: Date | undefined;
  password: string;
}

const App: React.FC = () => {
  return (
    <div>
      <h1>Formic-TS</h1>
      <Formik<IFormModel>
        initialValues={{
          name: "",
          username: "",
          email: "",
          dob: undefined,
          password: "",
        }}
        onSubmit={(values) => {
          // alert(JSON.stringify(values));
          console.log(JSON.stringify(values));
        }}
        component={RegistrationForm}
      ></Formik>
    </div>
  );
};

const RegistrationForm: (props: FormikProps<IFormModel>) => JSX.Element = ({
  handleSubmit,
  values,
  handleChange,
  setFieldValue,
}) => {
  const dateOnChange = (date: Date | null) => {
    setFieldValue("dob", date);
  };
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="formName">Name</label>
      <input
        id="formName"
        type="text"
        name="name"
        placeholder="type your name here"
        value={values.name}
        onChange={handleChange}
      />

      <label htmlFor="username">User Name</label>
      <input
        id="username"
        type="text"
        name="username"
        placeholder="type your user name here"
        value={values.username}
        onChange={handleChange}
      />

      <label htmlFor="email">Eamil</label>
      <input
        id="email"
        type="email"
        name="email"
        placeholder="type your email here"
        value={values.email}
        onChange={handleChange}
      />

      <label htmlFor="dateOfbirth">Date of birth</label>
      <DatePicker
        id="dateOfbirth"
        name="dob"
        placeholderText="Your date of birth"
        value={values.dob?.toLocaleString()}
        selected={values.dob}
        onChange={dateOnChange}
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        name="password"
        placeholder="enter your password"
        value={values.password}
        onChange={handleChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default App;
