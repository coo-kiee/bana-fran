import { FC } from 'react';
import Utils from 'utils/Utils';

// type, constant
import { SearchDate } from 'constants/calculate/common';

// hook
import useHandlePageDataCnt from 'hooks/pagination/useHandlePageDataCnt';
import usePageInfo from 'hooks/pagination/usePageInfo';
import useUserInfo from 'hooks/user/useUser';

// component
import Table from 'pages/common/table';

// service
import MEMBERSHIP_SERVICE from 'service/membershipService';

const ExtraDetailTable: FC<{ searchDate: SearchDate }> = ({ searchDate: { fromDate, toDate } }) => {
  const {
    user: { fCode },
  } = useUserInfo();
  const { checkCurrentPageData } = usePageInfo();
  const listData = MEMBERSHIP_SERVICE.useMembershipList(
    ['membership_extra_list', JSON.stringify({ fCode, from: fromDate, to: toDate })],
    [fCode, fromDate, toDate],
  );

  useHandlePageDataCnt(listData);

  return (
    <Table.TableList
      queryRes={listData}
      render={(datas) =>
        datas?.map(
          (
            {
              std_date,
              total_stamp_cnt,
              convert_coupon_stamp_cnt,
              expired_stamp_cnt,
              total_coupon_cnt,
              total_coupon_amount,
              used_coupon_cnt,
              used_coupon_amount,
              expired_coupon_cnt,
              expired_coupon_amount,
              total_point,
              used_point,
              expired_point,
            },
            index,
          ) => {
            const display = checkCurrentPageData(index) ? '' : 'none';

            return (
              <tr key={index} style={{ display }}>
                <td className={index === 0 ? 'total' : ''}>{std_date}</td>
                <td className={index === 0 ? 'total' : ''}>{Utils.numberComma(total_stamp_cnt)}개</td>
                <td className={index === 0 ? 'total' : ''}>{Utils.numberComma(convert_coupon_stamp_cnt)}개</td>
                <td className={index === 0 ? 'total' : ''}>{Utils.numberComma(expired_stamp_cnt)}개</td>
                <td className={index === 0 ? 'total' : ''}>
                  {Utils.numberComma(total_coupon_cnt)}개<p>({Utils.numberComma(total_coupon_amount)}원)</p>
                </td>
                <td className={index === 0 ? 'total' : ''}>
                  {Utils.numberComma(used_coupon_cnt)}개<p>({Utils.numberComma(used_coupon_amount)}원)</p>
                </td>
                <td className={index === 0 ? 'total' : ''}>
                  {Utils.numberComma(expired_coupon_cnt)}개<p>({Utils.numberComma(expired_coupon_amount)}원)</p>
                </td>
                <td className={index === 0 ? 'total' : ''}>{Utils.numberComma(total_point)}P</td>
                <td className={index === 0 ? 'total' : ''}>{Utils.numberComma(used_point)}P</td>
                <td className={index === 0 ? 'total' : ''}>{Utils.numberComma(expired_point)}P</td>
              </tr>
            );
          },
        )
      }
    />
  );
};

export default ExtraDetailTable;
