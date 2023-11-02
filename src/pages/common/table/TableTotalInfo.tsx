// Type
import { SearchDate } from 'constants/calculate/common';
import { UseQueryResult } from 'react-query';

// Util
import Utils from 'utils/Utils';

interface ITableTotalInfo<T, Q> extends Partial<SearchDate> {
  queryRes: UseQueryResult<Q, unknown>;
  initialDetailTotalInfo: T;
  sumFn: (initial: T, datas: Q) => T;
}

const TableTotalInfo = <T extends Record<string | number, { title: string; sum: number }>, Q>({
  queryRes,
  initialDetailTotalInfo,
  sumFn,
  fromDate,
  toDate,
}: ITableTotalInfo<T, Q>) => {
  const detailTotalInfo = !queryRes?.data ? initialDetailTotalInfo : sumFn(initialDetailTotalInfo, queryRes.data);

  return (
    <>
      <div className="search-result-wrap">
        <div className="search-date">
          <p>조회기간: {fromDate + `${toDate ? ' ~ ' + toDate : ''}`}</p>
        </div>
        <ul className="search-result">
          {Object.values(detailTotalInfo).map((totalInfo, index) => (
            <li key={index}>
              {totalInfo.title} : <span className="value">{Utils.numberComma(totalInfo.sum)}원</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TableTotalInfo;
