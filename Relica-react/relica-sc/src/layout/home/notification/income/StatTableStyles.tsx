import styled from "styled-components";
import { baseTheme } from "../../../../styles/theme";

export const Table = styled.table`
  margin-top: 2rem;
  border-collapse: collapse;
  width: 100%;

  thead {
    th {
      padding: 1rem 1.5rem;
      background-color: ${baseTheme.colors.greyLight};
      border-color: ${baseTheme.colors.greyLight};
      font-size: 1.6rem;
      color: #939393;
      text-align: start;

      &:first-of-type {
        border-radius: 1rem 0 0 1rem;
      }

      &:last-of-type {
        border-radius: 0 1rem 1rem 0;
      }

      img {
        display: inline-block;
        margin-right: 0.7rem;
      }
    }
  }

  tbody {
    td {
      padding: 3rem 1.5rem;
    }

    img {
      border-radius: 1rem;
    }
  }
`;
