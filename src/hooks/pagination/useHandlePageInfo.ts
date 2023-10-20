import { Dispatch, SetStateAction, useState } from 'react';

// Type
import { IPageInfo } from 'pages/common/pagination/PageInfoProvider';

const useHandlePageInfo = (setPageInfo: Dispatch<SetStateAction<IPageInfo>>) => {
  const [handleCurrentPage] = useState(() => (page: number) => {
    setPageInfo((prev) => ({ ...prev, currentPage: page }));
  });

  const [handleDataCnt] = useState(() => (dataCnt: number) => {
    setPageInfo((prev) => ({ ...prev, dataCnt }));
  });

  const [handleRow] = useState(() => (row: number) => {
    setPageInfo((prev) => ({ ...prev, row }));
  });

  return { handleCurrentPage, handleDataCnt, handleRow };
};

export default useHandlePageInfo;
