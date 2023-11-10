import { useContext, useState } from 'react';

// Context
import { PageInfoContext, SetPageInfoContext } from 'pages/common/pagination/PageInfoProvider';

const usePageInfo = () => {
  const pageInfo = useContext(PageInfoContext);
  const setPageInfo = useContext(SetPageInfoContext);

  const [handleCurrentPage] = useState(() => (page: number) => {
    setPageInfo((prev) => ({ ...prev, currentPage: page }));
  });

  const [handleDataCnt] = useState(() => (dataCnt: number) => {
    setPageInfo((prev) => ({ ...prev, dataCnt, currentPage: 1 }));
  });

  const [handleRow] = useState(() => (row: number) => {
    setPageInfo((prev) => ({ ...prev, row, currentPage: 1 }));
  });

  const checkCurrentPageData = (index: number) => {
    return index >= (pageInfo.currentPage - 1) * pageInfo.row && index < pageInfo.currentPage * pageInfo.row;
  };

  return { pageInfo, setPageInfo, handleCurrentPage, handleDataCnt, handleRow, checkCurrentPageData };
};

export default usePageInfo;
