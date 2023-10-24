import React, { Dispatch, SetStateAction } from 'react';

// Type
import { SearchDate } from 'constants/calculate/common';
import { PointDetailFilterOption, PointDetailTotalInfo } from 'constants/calculate/point';

// API
import { useCalculatePointDetailList } from 'service/calculateService';

// Hook
import useUserInfo from 'hooks/user/useUser';
import useHandlePageDataCnt from 'hooks/pagination/useHandlePageDataCnt';
import useSumPointDetailTotalInfo from 'hooks/calculate/point/useSumPointDetailTotalInfo';
import useHandleDetailTotalInfo from 'hooks/calculate/common/useHandleDetailTotalInfo';
import usePointFilterCondition from 'hooks/calculate/point/usePointFilterCondition';
import usePageInfo from 'hooks/pagination/usePageInfo';

// Util
import Utils from 'utils/Utils';

// Component
import TableList from 'pages/common/table/TableList';

interface IPointDetailList {
  searchDate: SearchDate;
  filterCondition: Record<keyof PointDetailFilterOption, string>;
  setDetailTotalInfo: Dispatch<SetStateAction<PointDetailTotalInfo>>;
}
const PointDetailList = ({ searchDate, filterCondition, setDetailTotalInfo }: IPointDetailList) => {
  const { user } = useUserInfo();
  const { filterData } = usePointFilterCondition();

  const { checkCurrentPageData } = usePageInfo();

  const params = {
    f_code: user.fCode,
    from_date: searchDate.fromDate,
    to_date: searchDate.toDate,
  };

  // Query
  const pointDetailListRes = useCalculatePointDetailList({ staffNo: user.staffNo, params });
  useHandlePageDataCnt(pointDetailListRes, filterCondition, filterData);

  const pointDetailTotalInfo = useSumPointDetailTotalInfo(pointDetailListRes);
  useHandleDetailTotalInfo(pointDetailTotalInfo, setDetailTotalInfo);

  return (
    <TableList
      queryRes={pointDetailListRes}
      render={(datas) =>
        datas?.map((pointDetail, index) => {
          const rowSpan = pointDetail.bonus_point_type ? 2 : 1;
          const display = checkCurrentPageData(index) && filterData(filterCondition, pointDetail) ? '' : 'none';

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
  );
};

export default PointDetailList;
