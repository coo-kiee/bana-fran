import { ReactNode } from 'react';
import { UseQueryResult } from 'react-query';

// Hook
import usePageInfo from 'hooks/pagination/usePageInfo';

// Component
import Loading from '../loading';
import NoData from '../noData';

interface ITableList<T> {
  queryRes: UseQueryResult<T, unknown>;
  render: (datas: T | undefined) => ReactNode;
}
const TableList = <T extends unknown[]>({ queryRes, render }: ITableList<T>) => {
  const { pageInfo } = usePageInfo();

  if (queryRes.isFetching)
    return (
      <tbody>
        <Loading height={80} width={80} marginTop={0} isTable={true} />
      </tbody>
    );

  if (!queryRes.data?.length || pageInfo?.dataCnt === 0)
    return (
      <tbody>
        <NoData isTable={true} />
      </tbody>
    );

  return <tbody>{render(queryRes.data)}</tbody>;
};

export default TableList;
