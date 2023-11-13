import { useState } from 'react';

// Hook
import usePageInfo from 'hooks/pagination/usePageInfo';

const SelectListRow = () => {
  const [rows] = useState([20, 30, 50, 100]);

  const { pageInfo, handleRow } = usePageInfo();

  return (
    <select
      className="filter-number"
      name="row"
      id=""
      onChange={(e) => handleRow(Number(e.currentTarget.value))}
      value={pageInfo.row}
    >
      {rows.map((item) => (
        <option key={item} value={item}>
          {item}개
        </option>
      ))}
    </select>
  );
};

export default SelectListRow;
