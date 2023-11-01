import { useRef } from 'react';

// Const
import { CALCULATE_EXCEL_FILENAME } from 'constants/calculate/common';
import { ETC_DETAIL_COLGROUP_INFO, ETC_DETAIL_FILTER_OPTION, ETC_DETAIL_FILTER_TYPE } from 'constants/calculate/etc';
import { CALCULATE_TYPE } from 'types/calculate/calculateType';

// Hook
import useSearchDate from 'hooks/common/useSearchDate';
import useUserInfo from 'hooks/user/useUser';
import useEtcFilterCondition from 'hooks/calculate/etc/useEtcFilterCondition';

// Component
import ExcelButton from 'pages/common/excel/ExcelButton';
import PageInfoProvider from 'pages/common/pagination/PageInfoProvider';
import Pages from 'pages/common/pagination/Pages';
import CalculateDetailSearch from '../component/CalculateDetailSearch';
import CalculateDetailFilter from '../component/CalculateDetailFilter';
import EtcDetailTable from './EtcDetailTable';

const EtcDetail = () => {
  const tableRef = useRef<HTMLTableElement>(null); // 엑셀 다운에 사용

  const { user } = useUserInfo();

  const { filterCondition, handleFilterCondition } = useEtcFilterCondition();
  const { searchDate, handleSearchDate } = useSearchDate({ dateFormat: 'yyyy-MM' });

  return (
    <>
      <p className="title bullet">상세내역</p>
      <div className="search-wrap">
        <CalculateDetailSearch
          searchDate={searchDate}
          handleSearchDate={handleSearchDate}
          dateFormat="yyyy-MM"
          showMonthYearPicker
        >
          <div className="select-wrap">
            <CalculateDetailFilter
              name={ETC_DETAIL_FILTER_TYPE.CHARGE}
              value={filterCondition[ETC_DETAIL_FILTER_TYPE.CHARGE]}
              options={ETC_DETAIL_FILTER_OPTION[ETC_DETAIL_FILTER_TYPE.CHARGE]}
              handleOnChange={handleFilterCondition}
            />
          </div>
        </CalculateDetailSearch>
      </div>
      <PageInfoProvider>
        <EtcDetailTable tableRef={tableRef} searchDate={searchDate} filterCondition={filterCondition} />
        <div className="result-function-wrap">
          <ExcelButton
            type={'table'}
            target={tableRef}
            tableRef={tableRef}
            fileName={`${user.fCodeName}_${CALCULATE_EXCEL_FILENAME[CALCULATE_TYPE.ETC]}(${searchDate.fromDate}~${
              searchDate.toDate
            })`}
            sheetOption={{ origin: 'B3' }}
            colWidths={Object.values(ETC_DETAIL_COLGROUP_INFO).flatMap((item) =>
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

export default EtcDetail;
