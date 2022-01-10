import React from "react";
import { StaticList } from "./income/StaticList";
import dataList from "./income/dataList.json";
import { StatTable } from "./income/StatTable";
import styled from "styled-components";
import Typography, {
  FontSize,
} from "../../../components/typography/Typography";

const Container = styled.div`
  max-width: 97rem;
  margin-left: auto;
  margin-right: auto;
  padding-top: 6rem;
`;

export const Income: React.FC = () => {
  return (
    <Container>
      <Typography weight={700} fontSize={FontSize.ml} margin="0 0 1.6rem 0">
        Total earned
      </Typography>
      <StaticList data={dataList} />
      <StatTable />
    </Container>
  );
};
