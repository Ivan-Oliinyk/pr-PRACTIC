import { addManyUsersAction } from "../customReducer";

// export const fetchCusomers = () => {
//   return function (dispatch) {
//     fetch("https://jsonplaceholder.typicode.com/users")
//       .then((response) => response.json())
//       .then((json) => dispatch(addManyUsersAction(json)));
//   };
// };

export const fetchCusomers = () => {
  return function (dispatch) {
    fetch("http://localhost:5000/api/user/")
      .then((response) => response.json())
      .then((json) => dispatch(addManyUsersAction(json)));
  };
};
