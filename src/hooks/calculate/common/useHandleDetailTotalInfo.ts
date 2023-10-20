import { Dispatch, SetStateAction, useLayoutEffect } from 'react';

const useHandleDetailTotalInfo = <T>(detailTotalInfo: T, setDetailTotalInfo: Dispatch<SetStateAction<T>>) => {
  useLayoutEffect(() => {
    if (!detailTotalInfo) return;

    setDetailTotalInfo(detailTotalInfo);
  }, [detailTotalInfo, setDetailTotalInfo]);
};

export default useHandleDetailTotalInfo;
