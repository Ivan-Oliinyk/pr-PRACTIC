//action creater
// export const myAction = (value) => ({
//   type: "MY_ACTION1",
//   payload: value,
// });

//literals
// export const myAction2 = {
//   type: "MY_ACTION2",
//   payload: "super payload2",
// };

//////////////////////////////////////

export const increment = (value) => ({
  type: "counter/Increment",
  payload: value,
});

export const decrement = (value) => ({
  type: "counter/Decrement",
  payload: value,
});
