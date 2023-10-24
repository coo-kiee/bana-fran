import { useLayoutEffect } from 'react';
import { UseQueryResult } from 'react-query';

// Hook
import usePageInfo from './usePageInfo';

const useHandlePageDataCnt = <T extends unknown[], F>(
  queryRes: UseQueryResult<T, unknown>,
  filterCondition?: F,
  filterFn?: (filterCondition: F, data: T[number]) => boolean,
) => {
  const { handleDataCnt } = usePageInfo();

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
