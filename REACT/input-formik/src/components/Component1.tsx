import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { Formik, Field, Form } from "formik";
import { TItem } from "../store/reducers/mainReducer";

function payloadPrepare(list: TItem, values: { [key: string]: string }) {
  Object.keys(values).map((key: string) => {
    list[key]["value"] = values[key];

    console.log(list);
  });

  return list;
}

export default function Component1() {
  const list: TItem = useAppSelector((store) => store.mainReducer);
  const dispatch = useAppDispatch();

  return (
    <Formik
      initialValues={Object.keys(list).reduce(
        (initValues: { [key: string]: string }, key: string) => {
          initValues[key] = list[key].value;
          return initValues;
        },
        {}
      )}
      onSubmit={async (values) => {
        await new Promise((resolve) => setTimeout(resolve, 1));
        dispatch({ type: "CHANGE", payload: payloadPrepare(list, values) });
      }}
    >
      <Form>
        {Object.keys(list).map((key: string, i) => (
          <div key={i} className="field-wrapper">
            <Field name={key} type={list[key].type} />
          </div>
        ))}
        <button type="submit">SUBMIT</button>
      </Form>
    </Formik>
  );
}
