import { ReactNode } from 'react';
import { UseQueryResult } from 'react-query';

// Hook
import usePageInfo from 'hooks/pagination/usePageInfo';

// Component
import Loading from '../loading';
import NoData from '../noData';

interface ITableList<T> {
  queryRes: UseQueryResult<T, unknown>;
  render: (datas: T) => ReactNode;
  isPagination?: boolean;
}
const TableList = <T,>({ queryRes, render, isPagination = true }: ITableList<T>) => {
  const { pageInfo } = usePageInfo();

  if (queryRes.isFetching || !queryRes.data)
    return (
      <tbody>
        <Loading height={80} width={80} marginTop={0} isTable />
      </tbody>
    );

  if ((Array.isArray(queryRes.data) && !queryRes.data.length) || (isPagination && pageInfo.dataCnt === 0))
    return (
      <tbody>
        <NoData isTable />
      </tbody>
    );

  return <tbody>{render(queryRes.data)}</tbody>;
};

export default TableList;
