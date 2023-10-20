import { useContext, useState } from 'react';

// Hook
import useOnChange from 'hooks/useOnChange';

// Context
import { PageInfoContext, SetPageInfoContext } from './PageInfoProvider';

const SelectListRow = () => {
  const [rows] = useState([20, 30, 50, 100]);

  const { row } = useContext(PageInfoContext);
  const setPageInfo = useContext(SetPageInfoContext);
  const handlePageInfo = useOnChange(setPageInfo);

  return (
    <select className="filter-number" name="row" id="" onChange={handlePageInfo} value={row}>
      {rows.map((item) => (
        <option key={item} value={item}>
          {item}개
        </option>
      ))}
    </select>
  );
};

export default SelectListRow;
