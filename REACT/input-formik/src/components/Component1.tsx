import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { TItem } from "../store/reducers/mainReducer";
function payloadPrepare(list: TItem, values: { [key: string]: string }) {
  Object.keys(values).map((key: string) => (list[key]["value"] = values[key]));
  return list;
}
export default function Component1() {
  const list: TItem = useAppSelector((store) => store.mainReducer);
  const dispatch = useAppDispatch();
  const regexPassword =
    /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9!@#$%^&*]{6,12}$/;
  const regexEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return (
    <Formik
      initialValues={Object.keys(list).reduce(
        (initValues: { [key: string]: string }, key: string) => {
          initValues[key] = list[key].value;
          return initValues;
        },
        {}
      )}
      validate={(values) => {
        const errors: { [key: string]: string } = {};

        if (!values.password) {
          errors.password = "Enter password";
        } else if (!regexPassword.test(values.password)) {
          errors.password =
            "Пароль должен именть символы в верхнем и нижнем регистре, длина 6-12 символов";
        }

        if (!values.email) {
          errors.email = "Enter Email";
        } else if (!regexEmail.test(values.email)) {
          errors.email = "Не валидный пароль";
        }
        return errors;
      }}
      onSubmit={async (values) => {
        await new Promise((resolve) => setTimeout(resolve, 1));
        dispatch({ type: "CHANGE", payload: payloadPrepare(list, values) });
      }}
    >
      <Form>
        {Object.keys(list).map((key: string, i) => (
          <div key={i}>
            <Field name={key} type={list[key].type} />
            <ErrorMessage name={key} component="div" />
          </div>
        ))}
        <button type="submit" disabled={false}>
          SUBMIT
        </button>
      </Form>
    </Formik>
  );
}
