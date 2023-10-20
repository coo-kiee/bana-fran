import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useLayoutEffect, useState } from 'react';

const initialPageInfo = { currentPage: 1, dataCnt: 0, row: 20 };
export type IPageInfo = typeof initialPageInfo;

export const PageInfoContext = createContext<IPageInfo>(initialPageInfo);
export const SetPageInfoContext = createContext<Dispatch<SetStateAction<IPageInfo>>>(() => {});

const PageInfoProvider: FC<PropsWithChildren> = ({ children }) => {
  const [pageInfo, setPageInfo] = useState(initialPageInfo);

  useLayoutEffect(() => {
    setPageInfo((prev) => ({ ...prev, currentPage: 1 }));
  }, [pageInfo.dataCnt, pageInfo.row]);

  return (
    <PageInfoContext.Provider value={pageInfo}>
      <SetPageInfoContext.Provider value={setPageInfo}>{children}</SetPageInfoContext.Provider>
    </PageInfoContext.Provider>
  );
};

export default PageInfoProvider;
