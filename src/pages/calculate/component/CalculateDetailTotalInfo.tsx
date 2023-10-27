import { Dispatch, SetStateAction, useState } from 'react';
import { useIsFetching } from 'react-query';

// Util
import Utils from 'utils/Utils';

interface ICalculateDetailTotalInfo<T> {
  searchDate: {
    fromDate: string;
    toDate: string;
  };
  initialDetailTotalInfo: T;
  render: (setDetailTotalInfo: Dispatch<SetStateAction<T>>) => JSX.Element;
}
const CalculateDetailTotalInfo = <T extends Record<string | number, { title: string; sum: number }>>({
  searchDate,
  initialDetailTotalInfo,
  render,
}: ICalculateDetailTotalInfo<T>) => {
  const fetchingCnt = useIsFetching();

  const [detailTotalInfo, setDetailTotalInfo] = useState(initialDetailTotalInfo);

  return (
    <>
      <div className="search-result-wrap">
        <div className="search-date">
          <p>
            조회기간: {searchDate.fromDate} ~ {searchDate.toDate}
          </p>
        </div>
        <ul className="search-result">
          {!fetchingCnt &&
            Object.values(detailTotalInfo).map((totalInfo, index) => (
              <li key={index}>
                {totalInfo.title} : <span className="value">{Utils.numberComma(totalInfo.sum)}원</span>
              </li>
            ))}
        </ul>
      </div>
      {render(setDetailTotalInfo)}
    </>
  );
};

export default CalculateDetailTotalInfo;
