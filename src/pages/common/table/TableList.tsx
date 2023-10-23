import { Children, ReactNode } from 'react';

// Type
import { IPageInfo } from '../pagination/PageInfoProvider';
import { UseQueryResult } from 'react-query';

// Component
import Loading from '../loading';
import NoData from '../noData';

interface ITableList<T> {
  queryRes: UseQueryResult<T, unknown>;
  render: (datas: T | undefined) => ReactNode;
  pageInfo?: IPageInfo;
}
const TableList = <T extends unknown[]>({ queryRes, render, pageInfo }: ITableList<T>) => {
  if (queryRes.isFetching) return <Loading height={80} width={80} marginTop={0} isTable={true} />;

  if (!queryRes.data?.length || pageInfo?.dataCnt === 0) return <NoData isTable={true} />;

  const isRender = (index: number) => {
    if (!pageInfo) return true;

    return index >= (pageInfo.currentPage - 1) * pageInfo.row && index < pageInfo.currentPage * pageInfo.row;
  };

  return (
    <>
      {Children.map(render(queryRes.data), (item, index) => {
        return isRender(index) ? item : null;
      })}
    </>
  );
};

export default TableList;
