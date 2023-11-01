import { useRef } from 'react';

// Const
import { CALCULATE_EXCEL_FILENAME, CALCULATE_TYPE } from 'constants/calculate/common';
import {
  POINT_DETAIL_COLGROUP_INFO,
  POINT_DETAIL_FILTER_OPTION,
  POINT_DETAIL_FILTER_TYPE,
} from 'constants/calculate/point';

// Hook
import usePointFilterCondition from 'hooks/calculate/point/usePointFilterCondition';
import useUserInfo from 'hooks/user/useUser';
import useSearchDate from 'hooks/common/useSearchDate';

// Component
import ExcelButton from 'pages/common/excel/ExcelButton';
import Pages from 'pages/common/pagination/Pages';
import PageInfoProvider from 'pages/common/pagination/PageInfoProvider';
import PointDetailTable from './PointDetailTable';
import CalculateDetailSearch from '../component/CalculateDetailSearch';
import CalculateDetailFilter from '../component/CalculateDetailFilter';

const PointDetail = () => {
  const tableRef = useRef<HTMLTableElement>(null); // 엑셀 다운에 사용

  const { user } = useUserInfo();
  const { filterCondition, handleFilterCondition } = usePointFilterCondition();
  const { searchDate, handleSearchDate } = useSearchDate();

  return (
    <>
      <p className="title bullet">상세내역</p>
      <div className="search-wrap">
        <CalculateDetailSearch searchDate={searchDate} handleSearchDate={handleSearchDate}>
          <div className="select-wrap">
            <CalculateDetailFilter
              name={POINT_DETAIL_FILTER_TYPE.POINT}
              value={filterCondition[POINT_DETAIL_FILTER_TYPE.POINT]}
              options={POINT_DETAIL_FILTER_OPTION[POINT_DETAIL_FILTER_TYPE.POINT]}
              handleOnChange={handleFilterCondition}
            />
            &nbsp;
            <CalculateDetailFilter
              name={POINT_DETAIL_FILTER_TYPE.DEVICE}
              value={filterCondition[POINT_DETAIL_FILTER_TYPE.DEVICE]}
              options={POINT_DETAIL_FILTER_OPTION[POINT_DETAIL_FILTER_TYPE.DEVICE]}
              handleOnChange={handleFilterCondition}
            />
          </div>
        </CalculateDetailSearch>
      </div>
      <PageInfoProvider>
        <PointDetailTable tableRef={tableRef} searchDate={searchDate} filterCondition={filterCondition} />
        <div className="result-function-wrap">
          <ExcelButton
            type={'table'}
            target={tableRef}
            tableRef={tableRef}
            fileName={`${user.fCodeName}_${CALCULATE_EXCEL_FILENAME[CALCULATE_TYPE.POINT]}(${searchDate.fromDate}~${
              searchDate.toDate
            })`}
            sheetOption={{ origin: 'B3' }}
            colWidths={Object.values(POINT_DETAIL_COLGROUP_INFO).flatMap((item) =>
              item.width !== '*' ? { wpx: Number(item.width) * 1.2 } : { wpx: 400 },
            )}
            addRowColor={{ rowNums: [1, 2], colors: ['d3d3d3', 'd3d3d3'] }}
          />
          <Pages />
        </div>
      </PageInfoProvider>
    </>
  );
};

export default PointDetail;
