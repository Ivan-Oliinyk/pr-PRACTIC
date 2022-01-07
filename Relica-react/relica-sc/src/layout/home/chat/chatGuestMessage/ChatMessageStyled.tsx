import styled from "styled-components";

export const GuestMessageWrapper = styled.div`
  margin-left: 1.5rem;
  margin-top: 4.5rem;
  display: flex;

  &:not(:first-of-type) {
    margin-top: 4.6rem;
  }

  img {
    border-radius: 50%;
  }
`;

export const GuestMessage = styled.div`
  position: relative;
  margin-left: 1rem;
  padding: 0.7em 1.3em;
  display: flex;
  background-color: #f5f5f5;
  font-size: 1.6rem;
  max-width: 22rem;
  border-radius: 3rem 3rem 3rem 0;
  box-shadow: 0 0 3px #dbdbdb;

  &:before {
    content: "7:12 am";
    display: block;
    position: absolute;
    right: -4em;
    bottom: -1em;
    font-size: 1.1rem;
    color: grey;
  }
`;
