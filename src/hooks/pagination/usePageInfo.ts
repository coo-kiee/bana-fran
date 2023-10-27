import { useContext, useEffect, useState } from 'react';

// Context
import { PageInfoContext, SetPageInfoContext } from 'pages/common/pagination/PageInfoProvider';

const usePageInfo = () => {
  const pageInfo = useContext(PageInfoContext);
  const setPageInfo = useContext(SetPageInfoContext);

  const [handleCurrentPage] = useState(() => (page: number) => {
    setPageInfo((prev) => ({ ...prev, currentPage: page }));
  });

  const [handleDataCnt] = useState(() => (dataCnt: number) => {
    setPageInfo((prev) => ({ ...prev, dataCnt }));
  });

  const [handleRow] = useState(() => (row: number) => {
    setPageInfo((prev) => ({ ...prev, row }));
  });

  const checkCurrentPageData = (index: number) => {
    return index >= (pageInfo.currentPage - 1) * pageInfo.row && index < pageInfo.currentPage * pageInfo.row;
  };

  useEffect(() => {
    setPageInfo((prev) => ({ ...prev, currentPage: 1 }));
  }, [pageInfo.dataCnt, pageInfo.row, setPageInfo]);

  return { pageInfo, setPageInfo, handleCurrentPage, handleDataCnt, handleRow, checkCurrentPageData };
};

export default usePageInfo;
