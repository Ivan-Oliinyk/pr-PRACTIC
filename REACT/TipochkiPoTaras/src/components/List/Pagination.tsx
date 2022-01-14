import React from "react";

export type TPaginationData = {
  page: number;
  limit: number;
  count: number;
};

export type TPaginationProps = {
  pagination: TPaginationData;
  onChange: (page: number) => void;
};

export default ({ pagination, onChange }: TPaginationProps) => {
  return (
    <div className="pagination__wrapper">
      {new Array(Math.ceil(pagination.count / pagination.limit))
        .fill("")
        .map((_, idx) => (
          <button key={idx} onClick={() => onChange(idx + 1)}>
            {idx + 1}
          </button>
        ))}
    </div>
  );
};
