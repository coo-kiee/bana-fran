import { useRef } from 'react';

// Const
import { CALCULATE_TITLE, CALCULATE_TYPE, SearchDate } from 'constants/calculate/common';
import {
  BANA_POINT_DETAIL_TOTAL_INFO,
  BANA_POINT_DETAIL_COLGROUP_INFO,
  BANA_POINT_DETAIL_THEAD_INFO,
  BANA_POINT_CHARGE_MULTIPLY,
  BanaPointDetailFilterOption,
} from 'constants/calculate/banaPoint';

// Hook
import useBanaPointFilterCondition from 'hooks/calculate/bana-point/useBanaPointFilterCondition';
import useHandlePageDataCnt from 'hooks/pagination/useHandlePageDataCnt';
import usePageInfo from 'hooks/pagination/usePageInfo';
import useUserInfo from 'hooks/user/useUser';

// API
import { useCalculateBanaPointDetailList } from 'service/calculateService';

// Util
import Utils from 'utils/Utils';
import { sumBanaPointDetailTotalInfo } from 'utils/calculate/sumBanaPointDetailTotalInfo';

// Component
import Table from 'pages/common/table';
import TableTotalInfo from '../../common/table/TableTotalInfo';
import ExcelButton from 'pages/common/excel/ExcelButton';
import Pages from 'pages/common/pagination/Pages';

interface IBanaPointDetailTable {
  searchDate: SearchDate;
  filterCondition: Record<keyof BanaPointDetailFilterOption, string>;
}
const BanaPointDetailTable = ({ searchDate, filterCondition }: IBanaPointDetailTable) => {
  const tableRef = useRef<HTMLTableElement>(null);

  const { user } = useUserInfo();
  const { filterData } = useBanaPointFilterCondition();

  const { checkCurrentPageData } = usePageInfo();

  const params = {
    f_code: user.fCode,
    from_date: searchDate.fromDate,
    to_date: searchDate.toDate,
  };

  // Query
  const banaPointDetailListRes = useCalculateBanaPointDetailList(params);
  useHandlePageDataCnt(banaPointDetailListRes, filterCondition, filterData);

  return (
    <>
      <TableTotalInfo
        fromDate={searchDate.fromDate}
        toDate={searchDate.toDate}
        queryRes={banaPointDetailListRes}
        initialDetailTotalInfo={BANA_POINT_DETAIL_TOTAL_INFO}
        sumFn={sumBanaPointDetailTotalInfo}
      />
      <Table className="board-wrap board-top" cellPadding="0" cellSpacing="0" tableRef={tableRef}>
        <Table.ColGroup colGroupAttributes={BANA_POINT_DETAIL_COLGROUP_INFO} />
        <Table.TableHead style={{ whiteSpace: 'pre-line' }} thData={BANA_POINT_DETAIL_THEAD_INFO} />
        <Table.TableList
          queryRes={banaPointDetailListRes}
          render={(datas) =>
            datas
              ?.filter((banaPointDetail) => filterData(filterCondition, banaPointDetail))
              .map((banaPointDetail, index) => {
                const display = checkCurrentPageData(index) ? '' : 'none';

                return (
                  <tr key={index} style={{ display }}>
                    <td className="align-center">{banaPointDetail.use_date}</td>
                    <td className="align-center">{banaPointDetail.calc_type}</td>
                    <td className="align-right">{Utils.numberComma(banaPointDetail.use_point)}</td>
                    <td className="align-center">{banaPointDetail.use_fcode_name}</td>
                    <td className="align-right">
                      {Utils.numberComma(
                        banaPointDetail.supply_amt * BANA_POINT_CHARGE_MULTIPLY[banaPointDetail.calc_type],
                      )}
                    </td>
                    <td className="align-right">
                      {Utils.numberComma(
                        banaPointDetail.vat_amt * BANA_POINT_CHARGE_MULTIPLY[banaPointDetail.calc_type],
                      )}
                    </td>
                    <td className="align-right">
                      <strong>
                        {Utils.numberComma(
                          banaPointDetail.total_amt * BANA_POINT_CHARGE_MULTIPLY[banaPointDetail.calc_type],
                        )}
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
          fileName={`${user.fCodeName}_${CALCULATE_TITLE[CALCULATE_TYPE.BANA_POINT]}(${searchDate.fromDate}~${
            searchDate.toDate
          })`}
          sheetOption={{ origin: 'B3' }}
          colWidths={Object.values(BANA_POINT_DETAIL_COLGROUP_INFO).flatMap((item) =>
            item.width !== '*' ? { wpx: Number(item.width) * 1.2 } : { wpx: 400 },
          )}
          addRowColor={{ rowNums: [1], colors: ['d3d3d3'] }}
        />
        <Pages />
      </div>
    </>
  );
};

export default BanaPointDetailTable;
