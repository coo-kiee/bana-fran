import { useContext, useLayoutEffect } from 'react';
import { UseQueryResult } from 'react-query';

// Type
import { SetPageInfoContext } from 'pages/common/pagination/PageInfoProvider';

// Hook
import useHandlePageInfo from './useHandlePageInfo';

const useHandlePageDataCnt = <T extends unknown[], F>(
  queryRes: UseQueryResult<T, unknown>,
  filterCondition?: F,
  filterFn?: (filterCondition: F, data: T[number]) => boolean,
) => {
  const setPageInfo = useContext(SetPageInfoContext);
  const { handleDataCnt } = useHandlePageInfo(setPageInfo);

  useLayoutEffect(() => {
    if (!queryRes.data) return;

    const dataCnt =
      filterCondition && filterFn
        ? queryRes.data.filter((item) => filterFn(filterCondition, item)).length
        : queryRes.data.length;

    handleDataCnt(dataCnt);
  }, [filterCondition, filterFn, handleDataCnt, queryRes.data]);
};

export default useHandlePageDataCnt;
