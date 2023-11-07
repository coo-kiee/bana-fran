import { useRef } from 'react';

// Const
import { CALCULATE_TITLE, CALCULATE_TYPE, SearchDate } from 'constants/calculate/common';
import {
  EtcDetailFilterOption,
  ETC_DETAIL_TOTAL_INFO,
  ETC_DETAIL_COLGROUP_INFO,
  ETC_DETAIL_THEAD_INFO,
  ETC_CHARGE_MULTIPLY,
} from 'constants/calculate/etc';

// Hook
import useEtcFilterCondition from 'hooks/calculate/etc/useEtcFilterCondition';
import useHandlePageDataCnt from 'hooks/pagination/useHandlePageDataCnt';
import usePageInfo from 'hooks/pagination/usePageInfo';
import useUserInfo from 'hooks/user/useUser';

// API
import { useCalculateEtcDetailList } from 'service/calculateService';

// Util
import Utils from 'utils/Utils';
import { sumEtcDetailTotalInfo } from 'utils/calculate/sumEtcDetailTotalInfo';

// Component
import Table from 'pages/common/table';
import TableTotalInfo from '../../common/table/TableTotalInfo';
import ExcelButton from 'pages/common/excel/ExcelButton';
import Pages from 'pages/common/pagination/Pages';

interface IEtcDetailTable {
  searchDate: SearchDate;
  filterCondition: Record<keyof EtcDetailFilterOption, string>;
}
const EtcDetailTable = ({ searchDate, filterCondition }: IEtcDetailTable) => {
  const tableRef = useRef<HTMLTableElement>(null);

  const { user } = useUserInfo();
  const { filterData } = useEtcFilterCondition();

  const { checkCurrentPageData } = usePageInfo();

  const params = {
    f_code: user.fCode,
    from_date: searchDate.fromDate,
    to_date: searchDate.toDate,
  };

  // Query
  const etcDetailListRes = useCalculateEtcDetailList(params);
  useHandlePageDataCnt(etcDetailListRes, filterCondition, filterData);

  return (
    <>
      <TableTotalInfo
        fromDate={searchDate.fromDate}
        toDate={searchDate.toDate}
        queryRes={etcDetailListRes}
        initialDetailTotalInfo={ETC_DETAIL_TOTAL_INFO}
        sumFn={sumEtcDetailTotalInfo}
      />
      <Table className="board-wrap board-top" cellPadding="0" cellSpacing="0" tableRef={tableRef}>
        <Table.ColGroup colGroupAttributes={ETC_DETAIL_COLGROUP_INFO} />
        <Table.TableHead style={{ whiteSpace: 'pre-line' }} thData={ETC_DETAIL_THEAD_INFO} />
        <Table.TableList
          queryRes={etcDetailListRes}
          render={(datas) =>
            datas
              ?.filter((etcDetail) => filterData(filterCondition, etcDetail))
              .map((etcDetail, index) => {
                const display = checkCurrentPageData(index) ? '' : 'none';

                return (
                  <tr key={index} style={{ display }}>
                    <td className="align-center">{etcDetail.std_month}</td>
                    <td className="align-center">{etcDetail.calculate_type}</td>
                    <td className="align-left">{etcDetail.item_detail}</td>
                    <td className="align-right">
                      {Utils.numberComma(etcDetail.supply_amt * ETC_CHARGE_MULTIPLY[etcDetail.calculate_type])}
                    </td>
                    <td className="align-right">
                      {Utils.numberComma(etcDetail.vat_amt * ETC_CHARGE_MULTIPLY[etcDetail.calculate_type])}
                    </td>
                    <td className="align-right">
                      <strong>
                        {Utils.numberComma(etcDetail.total_amt * ETC_CHARGE_MULTIPLY[etcDetail.calculate_type])}
                      </strong>
                    </td>
                  </tr>
                );
              })
          }
        />
      </Table>
      <div className="result-function-wrap">
        <ExcelButton
          type={'table'}
          target={tableRef}
          tableRef={tableRef}
          fileName={`${user.fCodeName}_${CALCULATE_TITLE[CALCULATE_TYPE.ETC]}(${searchDate.fromDate}~${
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
    </>
  );
};

export default EtcDetailTable;
