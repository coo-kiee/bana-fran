import { useContext, useLayoutEffect } from 'react';
import { UseQueryResult } from 'react-query';

// Type
import { SetPageInfoContext } from 'pages/common/pagination/PageInfoProvider';

// Hook
import useHandlePageInfo from './useHandlePageInfo';

const useHandlePageDataCnt = <T extends unknown[]>(queryRes: UseQueryResult<T, unknown>) => {
  const setPageInfo = useContext(SetPageInfoContext);
  const { handleDataCnt } = useHandlePageInfo(setPageInfo);

  useLayoutEffect(() => {
    if (!queryRes.data) return;

    const dataCnt = queryRes.data.length;
    handleDataCnt(dataCnt);
  }, [handleDataCnt, queryRes.data]);
};

export default useHandlePageDataCnt;
