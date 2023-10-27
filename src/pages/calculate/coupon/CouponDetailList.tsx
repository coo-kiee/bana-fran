import React, { Dispatch, SetStateAction } from 'react';

// Type
import { SearchDate } from 'constants/calculate/common';
import { CouponDetailFilterOption, CouponDetailTotalInfo } from 'constants/calculate/coupon';

// API
import { useCalculateCouponDetailList } from 'service/calculateService';

// Hook
import useUserInfo from 'hooks/user/useUser';
import useHandlePageDataCnt from 'hooks/pagination/useHandlePageDataCnt';
import useHandleDetailTotalInfo from 'hooks/calculate/common/useHandleDetailTotalInfo';
import useCouponFilterCondition from 'hooks/calculate/coupon/useCouponFilterCondition';
import usePageInfo from 'hooks/pagination/usePageInfo';

// Util
import Utils from 'utils/Utils';

// Component
import TableList from 'pages/common/table/TableList';
import useSumCouponDetailTotalInfo from 'hooks/calculate/coupon/useSumCouponDetailTotalInfo';

interface ICouponDetailList {
  searchDate: SearchDate;
  filterCondition: Record<keyof CouponDetailFilterOption, string>;
  setDetailTotalInfo: Dispatch<SetStateAction<CouponDetailTotalInfo>>;
}
const CouponDetailList = ({ searchDate, filterCondition, setDetailTotalInfo }: ICouponDetailList) => {
  const { user } = useUserInfo();
  const { filterData } = useCouponFilterCondition();

  const { checkCurrentPageData } = usePageInfo();

  const params = {
    f_code: user.fCode,
    from_date: searchDate.fromDate,
    to_date: searchDate.toDate,
  };

  // Query
  const couponDetailListRes = useCalculateCouponDetailList({ staffNo: user.staffNo, params });
  useHandlePageDataCnt(couponDetailListRes, filterCondition, filterData);

  const couponDetailTotalInfo = useSumCouponDetailTotalInfo(params);
  useHandleDetailTotalInfo(couponDetailTotalInfo, setDetailTotalInfo);

  return (
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
  );
};

export default CouponDetailList;
