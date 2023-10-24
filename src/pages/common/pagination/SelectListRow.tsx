import { useState } from 'react';

// Hook
import useOnChange from 'hooks/useOnChange';
import usePageInfo from 'hooks/pagination/usePageInfo';

const SelectListRow = () => {
  const [rows] = useState([20, 30, 50, 100]);

  const { pageInfo, setPageInfo } = usePageInfo();
  const handlePageInfo = useOnChange(setPageInfo);

  return (
    <select className="filter-number" name="row" id="" onChange={handlePageInfo} value={pageInfo.row}>
      {rows.map((item) => (
        <option key={item} value={item}>
          {item}개
        </option>
      ))}
    </select>
  );
};

export default SelectListRow;
