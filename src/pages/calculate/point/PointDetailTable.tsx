import React, { RefObject } from 'react';

// Type
import { SearchDate } from 'constants/calculate/common';
import {
  PointDetailFilterOption,
  POINT_DETAIL_COLGROUP_INFO,
  POINT_DETAIL_THEAD_INFO,
  POINT_DETAIL_TOTAL_INFO,
} from 'constants/calculate/point';

// API
import { useCalculatePointDetailList } from 'service/calculateService';

// Hook
import useUserInfo from 'hooks/user/useUser';
import useHandlePageDataCnt from 'hooks/pagination/useHandlePageDataCnt';
import usePointFilterCondition from 'hooks/calculate/point/usePointFilterCondition';
import usePageInfo from 'hooks/pagination/usePageInfo';

// Util
import Utils from 'utils/Utils';
import { sumPointDetailTotalInfo } from 'utils/calculate/sumPointDetailTotalInfo';

// Component
import TableTotalInfo from '../../common/table/TableTotalInfo';
import Table from 'pages/common/table';

interface IPointDetailTable {
  tableRef: RefObject<HTMLTableElement>;
  searchDate: SearchDate;
  filterCondition: Record<keyof PointDetailFilterOption, string>;
}
const PointDetailTable = ({ tableRef, searchDate, filterCondition }: IPointDetailTable) => {
  const { user } = useUserInfo();
  const { filterData } = usePointFilterCondition();

  const { checkCurrentPageData } = usePageInfo();

  const params = {
    f_code: user.fCode,
    from_date: searchDate.fromDate,
    to_date: searchDate.toDate,
  };

  // Query
  const pointDetailListRes = useCalculatePointDetailList(params);
  useHandlePageDataCnt(pointDetailListRes, filterCondition, filterData);

  return (
    <>
      <TableTotalInfo
        fromDate={searchDate.fromDate}
        toDate={searchDate.toDate}
        queryRes={pointDetailListRes}
        initialDetailTotalInfo={POINT_DETAIL_TOTAL_INFO}
        sumFn={sumPointDetailTotalInfo}
      />
      <Table className="board-wrap board-top" cellPadding="0" cellSpacing="0" tableRef={tableRef}>
        <Table.ColGroup colGroupAttributes={POINT_DETAIL_COLGROUP_INFO} />
        <Table.TableHead style={{ whiteSpace: 'pre-line' }} thData={POINT_DETAIL_THEAD_INFO} />
        <Table.TableList
          queryRes={pointDetailListRes}
          render={(datas) =>
            datas
              ?.filter((pointDetail) => filterData(filterCondition, pointDetail))
              .map((pointDetail, index) => {
                const rowSpan = pointDetail.bonus_point_type ? 2 : 1;
                const display = checkCurrentPageData(index) ? '' : 'none';

                return (
                  <React.Fragment key={index}>
                    <tr style={{ display }}>
                      <td className="align-center" rowSpan={rowSpan}>
                        {pointDetail.rcp_date.split(' ')[0]}
                      </td>
                      <td className="align-left" rowSpan={rowSpan}>
                        {pointDetail.item_name}
                      </td>
                      <td className="align-center" rowSpan={rowSpan}>
                        {pointDetail.phone}
                      </td>
                      <td className="align-right" rowSpan={rowSpan}>
                        {Utils.numberComma(pointDetail.nChargeTotal)}
                      </td>
                      <td className="align-right" rowSpan={rowSpan}>
                        {Utils.numberComma(pointDetail.total_amt)}
                      </td>
                      <td className="align-center">{pointDetail.use_point_type}</td>
                      <td className="align-center" rowSpan={rowSpan}>
                        {pointDetail.rcp_type}
                      </td>
                      <td className="align-right">{Utils.numberComma(pointDetail.supply_amt)}</td>
                      <td className="align-right">{Utils.numberComma(pointDetail.vat_amt)}</td>
                      <td className="align-right">{Utils.numberComma(pointDetail.total_paid_amt)}</td>
                      <td className="align-right">{Utils.numberComma(pointDetail.fee_supply_amt)}</td>
                      <td className="align-right">{Utils.numberComma(pointDetail.fee_vat_amt)}</td>
                      <td className="align-right">
                        {Utils.numberComma(pointDetail.fee_supply_amt + pointDetail.fee_vat_amt)}
                      </td>
                    </tr>
                    {pointDetail.bonus_point_type && (
                      <tr style={{ display }}>
                        <td className="align-center">{pointDetail.bonus_point_type}</td>
                        <td className="align-right">{Utils.numberComma(pointDetail.bonus_supply_amt)}</td>
                        <td className="align-right">{Utils.numberComma(pointDetail.bonus_vat_amt)}</td>
                        <td className="align-right">{Utils.numberComma(pointDetail.total_bonus_amt)}</td>
                        <td className="align-right">{Utils.numberComma(pointDetail.fee_bonus_supply_amt)}</td>
                        <td className="align-right">{Utils.numberComma(pointDetail.fee_bonus_vat_amt)}</td>
                        <td className="align-right">
                          {Utils.numberComma(pointDetail.fee_bonus_supply_amt + pointDetail.fee_bonus_vat_amt)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
          }
        />
      </Table>
    </>
  );
};

export default PointDetailTable;
