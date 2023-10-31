import React, { RefObject } from 'react';

// Type
import { SearchDate } from 'constants/calculate/common';
import {
  CouponDetailFilterOption,
  COUPON_DETAIL_COLGROUP_INFO,
  COUPON_DETAIL_THEAD_INFO,
} from 'constants/calculate/coupon';

// API
import { useCalculateCouponDetailList } from 'service/calculateService';

// Hook
import useUserInfo from 'hooks/user/useUser';
import useHandlePageDataCnt from 'hooks/pagination/useHandlePageDataCnt';
import useCouponFilterCondition from 'hooks/calculate/coupon/useCouponFilterCondition';
import usePageInfo from 'hooks/pagination/usePageInfo';
import useCouponDetailInitialTotalInfo from 'hooks/calculate/coupon/useCouponDetailInitialTotalInfo';

// Util
import Utils from 'utils/Utils';
import { sumCouponDetailTotalInfo } from 'utils/calculate/sumCouponDetailTotalInfo';

// Component
import TableList from 'pages/common/table/TableList';
import Table from 'pages/common/table';
import CalculateDetailTotalInfo from '../component/CalculateDetailTotalInfo';

interface ICouponDetailTable {
  tableRef: RefObject<HTMLTableElement>;
  searchDate: SearchDate;
  filterCondition: Record<keyof CouponDetailFilterOption, string>;
}
const CouponDetailTable = ({ tableRef, searchDate, filterCondition }: ICouponDetailTable) => {
  const { user } = useUserInfo();
  const { filterData } = useCouponFilterCondition();

  const { checkCurrentPageData } = usePageInfo();

  const params = {
    f_code: user.fCode,
    from_date: searchDate.fromDate,
    to_date: searchDate.toDate,
  };

  // Query
  const couponDetailListRes = useCalculateCouponDetailList(params);
  useHandlePageDataCnt(couponDetailListRes, filterCondition, filterData);

  const initialDetailTotalInfo = useCouponDetailInitialTotalInfo();

  return (
    <>
      <CalculateDetailTotalInfo
        searchDate={searchDate}
        queryRes={couponDetailListRes}
        initialDetailTotalInfo={initialDetailTotalInfo}
        sumFn={sumCouponDetailTotalInfo}
      />
      <Table className="board-wrap board-top" cellPadding="0" cellSpacing="0" tableRef={tableRef}>
        <Table.ColGroup colGroupAttributes={COUPON_DETAIL_COLGROUP_INFO} />
        <Table.TableHead style={{ whiteSpace: 'pre-line' }} thData={COUPON_DETAIL_THEAD_INFO} />
        <TableList
          queryRes={couponDetailListRes}
          render={(datas) =>
            datas
              ?.filter((couponDetail) => filterData(filterCondition, couponDetail))
              .map((couponDetail, index) => {
                const display = checkCurrentPageData(index) ? '' : 'none';

                return (
                  <React.Fragment key={index}>
                    <tr style={{ display }}>
                      <td className="align-center">{couponDetail.rcp_date.split(' ')[0]}</td>
                      <td className="align-left">{couponDetail.item_type}</td>
                      <td className="align-center">{couponDetail.sItem}</td>
                      <td className="align-right">{Utils.numberComma(couponDetail.total_amt)}</td>
                      <td className="align-center">{couponDetail.rcp_type}</td>
                      <td className="align-center">{couponDetail.phone}</td>
                      <td className="align-right">{Utils.numberComma(couponDetail.supply_amt)}</td>
                      <td className="align-right">{Utils.numberComma(couponDetail.vat_amt)}</td>
                      <td className="align-right">{Utils.numberComma(couponDetail.total_amt)}</td>
                    </tr>
                  </React.Fragment>
                );
              })
          }
        />
      </Table>
    </>
  );
};

export default CouponDetailTable;
