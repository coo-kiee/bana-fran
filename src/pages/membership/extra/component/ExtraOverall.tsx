import Utils from 'utils/Utils';

// component
import TableList from 'pages/common/table/TableList';
import Table from 'pages/common/table';

// Service
import MEMBERSHIP_SERVICE from 'service/membershipService';

// hook
import useUserInfo from 'hooks/user/useUser';

const ExtraOverall = () => {
  const {
    user: { fCode },
  } = useUserInfo();
  const listData = MEMBERSHIP_SERVICE.useMembershipTotal({ fran_store: fCode });

  return (
    <Table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
      <Table.TableHead thData={EXTRA_OVERALL_TH_LIST} />
      <TableList
        queryRes={listData}
        render={({
          convert_coupon_stamp_cnt,
          expired_coupon_amount,
          expired_coupon_cnt,
          expired_point,
          expired_stamp_cnt,
          not_used_coupon_amount,
          not_used_coupon_cnt,
          not_used_point,
          notyet_coupon_stamp_cnt,
          total_coupon_amount,
          total_coupon_cnt,
          total_point,
          total_stamp_cnt,
          used_coupon_amount,
          used_coupon_cnt,
          used_point,
        }) => (
          <tr>
            <td>{Utils.numberComma(total_stamp_cnt)}</td>
            <td>{Utils.numberComma(convert_coupon_stamp_cnt)}개</td>
            <td>{Utils.numberComma(expired_stamp_cnt)}개</td>
            <td className="point">{Utils.numberComma(notyet_coupon_stamp_cnt)}개</td>
            <td>
              {Utils.numberComma(total_coupon_cnt)}개<p>({Utils.numberComma(total_coupon_amount)}원)</p>
            </td>
            <td>
              {Utils.numberComma(used_coupon_cnt)}개<p>({Utils.numberComma(used_coupon_amount)}원)</p>
            </td>
            <td>
              {Utils.numberComma(expired_coupon_cnt)}개<p>({Utils.numberComma(expired_coupon_amount)}원)</p>
            </td>
            <td className="point">
              {Utils.numberComma(not_used_coupon_cnt)}개<p>({Utils.numberComma(not_used_coupon_amount)}원)</p>
            </td>
            <td>{Utils.numberComma(total_point)}P</td>
            <td>{Utils.numberComma(used_point)}P</td>
            <td>{Utils.numberComma(expired_point)}P</td>
            <td className="point">{Utils.numberComma(not_used_point)}P</td>
          </tr>
        )}
      />
    </Table>
  );
};

export default ExtraOverall;

const EXTRA_OVERALL_TH_LIST = [
  [
    { children: '스탬프', className: 'boder-th-a', colSpan: 4 },
    { children: '무료음료쿠폰 (스탬프적립&월간랭킹보상)', className: 'price-area boder-th-b', colSpan: 4 },
    { children: '바나포인트 (적립&월간랭킹보상)', className: 'boder-th-b', colSpan: 4 },
  ],
  [
    { children: '총 지급 수', className: 'height-63' },
    { children: '총 쿠폰전환 수', className: 'height-63' },
    { children: '총 유효기간 소멸 수', className: 'height-63' },
    { children: '쿠폰 미전환 수', className: 'height-63' },
    {
      children: (
        <>
          총 발급 수<p>(금액)</p>
        </>
      ),
      className: 'price-area height-63',
    },
    {
      children: (
        <>
          총 사용 수<p>(금액)</p>
        </>
      ),
      className: 'price-area height-63',
    },
    {
      children: (
        <>
          총 유효기간 소멸 수<p>(금액)</p>
        </>
      ),
      className: 'price-area height-63',
    },
    {
      children: (
        <>
          미사용 쿠폰 수<p>(금액)</p>
        </>
      ),
      className: 'price-area height-63',
    },
    { children: '총 적립', className: 'height-63' },
    { children: '총 사용', className: 'height-63' },
    { children: '총 유효기간 소멸', className: 'height-63' },
    { children: '미사용 잔액', className: 'height-63' },
  ],
];
