import { Dispatch } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { TAction, TItem } from "../store/reducers/mainReducer";
import styled, { createGlobalStyle } from "styled-components";

const List = styled.li`
  padding: 10px;
  border-bottom: 2px solid black;
  margin-top: 9px;
  list-style: none;
  min-height: 36px;
  min-width: 200px;
`;

export default function Component2() {
  const list: TItem[] = useAppSelector((store) => store.mainReducer);

  const dispatch = useAppDispatch();

  function handlerChange(key: string, value: string) {
    dispatch({
      type: "CHANGE",
      payload: list.map((item: TItem) =>
        item.key === key ? { key, value } : item
      ),
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      COMPONENT 2
      <ol>
        {list.map((item: TItem, i) => (
          <List key={i}>
            <p>{item.value}</p>
          </List>
        ))}
      </ol>
    </div>
  );
}
