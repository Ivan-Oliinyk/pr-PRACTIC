import styled from "styled-components";
import { baseTheme } from "../../../../styles/theme";

export const List = styled.li`
  position: relative;
  padding: 2.4rem 5rem 2.4rem 1.6rem;
  display: flex;
  cursor: pointer;
  border-left: 3px solid transparent;
  transition: background-color 250ms linear, border-left 250ms linear;

  &:hover,
  &:focus {
    background-color: #f0f9fd;
    border-left: 3px solid ${baseTheme.colors.blueV1};
  }
`;

export const Avatar = styled.img`
  border-radius: 50%;
`;

export const UserInfo = styled.div`
  margin-left: 1.4rem;
`;

export const MessageWrapper = styled.div`
  margin-top: 0.2em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 20rem;
`;

export const MessageCount = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  line-height: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2.2rem;
  min-width: 2.2rem;
  background-color: ${baseTheme.colors.blueV1};
  border-radius: 1.5rem;
  padding: 0 0.9rem;
  color: ${baseTheme.colors.white};
`;
