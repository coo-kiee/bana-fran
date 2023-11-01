import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useState } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import SuspenseErrorPage from '../suspenseErrorPage';

const initialPageInfo = { currentPage: 1, dataCnt: 0, row: 20 };
export type IPageInfo = typeof initialPageInfo;

export const PageInfoContext = createContext<IPageInfo>(initialPageInfo);
export const SetPageInfoContext = createContext<Dispatch<SetStateAction<IPageInfo>>>(() => {});

interface IPageInfoProvider extends PropsWithChildren {
  fallbackComponent?: React.ComponentType<FallbackProps>;
}
const PageInfoProvider: FC<IPageInfoProvider> = ({ children, fallbackComponent = () => <SuspenseErrorPage /> }) => {
  const [pageInfo, setPageInfo] = useState(initialPageInfo);

  return (
    <ErrorBoundary FallbackComponent={fallbackComponent}>
      <PageInfoContext.Provider value={pageInfo}>
        <SetPageInfoContext.Provider value={setPageInfo}>{children}</SetPageInfoContext.Provider>
      </PageInfoContext.Provider>
    </ErrorBoundary>
  );
};

export default PageInfoProvider;
