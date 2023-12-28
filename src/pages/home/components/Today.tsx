import { Suspense, useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useRecoilValue } from 'recoil';

// global state
import { franState } from 'state';
// API
import HOME_SERVICE from 'service/homeService';
// Utils
import Utils from 'utils/Utils';
// Components
import Board from 'pages/home/components/board/Board';
import Loading from 'pages/common/loading';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';

const Today = () => {
  const fCode = useRecoilValue(franState);
  const { data } = HOME_SERVICE.useSalesToday({ f_code: fCode });

  // 배달매출, 카드결제, 간편결제, 현금결제, 유상포인트결제, 본사쿠폰결제(보전), 쿠팡/배민, 가맹점쿠폰결제, 바나포인트결제, 본사쿠폰결제(미보전)
  const [
    freeService,
    paidSales,
    totalSales,
    {
      delivery_charge,
      card_charge,
      e_coupon_charge,
      e_pay_charge,
      cash_charge,
      paid_point,
      hd_coupon_charge,
      etc_delivery_charge,
      fran_coupon_charge,
      bana_point,
      hd_coupon_charge_2,
    },
  ] = useMemo(() => {
    // 매출 상세 내역
    let todayData = {
      delivery_charge: 0,
      card_charge: 0,
      e_pay_charge: 0,
      cash_charge: 0,
      paid_point: 0,
      hd_coupon_charge: 0,
      etc_delivery_charge: 0,
      e_coupon_charge: 0,
      fran_coupon_charge: 0,
      bana_point: 0,
      hd_coupon_charge_2: 0,
    };
    // 무/유상 매출 합계
    let freeService = 0,
      paidSales = 0,
      totalSales = 0;
    if (data) {
      todayData = data[0];
      freeService = data[0].fran_coupon_charge + data[0].bana_point + data[0].hd_coupon_charge_2;
      paidSales =
        data[0].card_charge +
        data[0].cash_charge +
        data[0].etc_delivery_charge +
        data[0].e_coupon_charge +
        data[0].e_pay_charge +
        data[0].hd_coupon_charge +
        data[0].paid_point;
      totalSales = freeService + paidSales;
    }
    return [freeService, paidSales, totalSales, todayData];
  }, [data]);

  return (
    <tr>
      <td className="point">{Utils.numberComma(totalSales)}원</td>
      <td>
        {Utils.numberComma(data ? data[0].delivery_charge : 0)}원
        <span className="percentage">({((100 * delivery_charge) / totalSales || 0).toFixed(1)}%)</span>
      </td>
      <td className="point">
        {Utils.numberComma(paidSales)}원
        <span className="percentage">({((100 * paidSales) / totalSales || 0).toFixed(1)}%)</span>
      </td>
      <td>
        {Utils.numberComma(card_charge || 0)}원
        <span className="percentage">({((100 * card_charge) / totalSales || 0).toFixed(1)}%)</span>
      </td>
      <td>
        {Utils.numberComma(e_pay_charge || 0)}원
        <span className="percentage">({((100 * e_pay_charge) / totalSales || 0).toFixed(1)}%)</span>
      </td>
      <td>
        {Utils.numberComma(cash_charge || 0)}원
        <span className="percentage">({((100 * cash_charge) / totalSales || 0).toFixed(1)}%)</span>
      </td>
      <td>
        {Utils.numberComma(paid_point || 0)}원
        <span className="percentage">({((100 * (paid_point + e_coupon_charge)) / totalSales || 0).toFixed(1)}%)</span>
      </td>
      <td>
        {Utils.numberComma(hd_coupon_charge || 0)}원
        <span className="percentage">({((100 * hd_coupon_charge) / totalSales || 0).toFixed(1)}%)</span>
      </td>
      <td>
        {Utils.numberComma(e_coupon_charge || 0)}원
        <span className="percentage">({((100 * e_coupon_charge) / totalSales || 0).toFixed(1)}%)</span>
      </td>
      <td>
        {Utils.numberComma(etc_delivery_charge)}원
        <span className="percentage">({((100 * etc_delivery_charge) / totalSales || 0).toFixed(1)}%)</span>
      </td>
      <td className="point">
        {Utils.numberComma(freeService)}원
        <span className="percentage">({((100 * freeService) / totalSales || 0).toFixed(1)}%)</span>
      </td>
      <td>
        {Utils.numberComma(fran_coupon_charge || 0)}원
        <span className="percentage">({((100 * fran_coupon_charge) / totalSales || 0).toFixed(1)}%)</span>
      </td>
      <td>
        {Utils.numberComma(bana_point || 0)}원
        <span className="percentage">({((100 * bana_point) / totalSales || 0).toFixed(1)}%)</span>
      </td>
      <td>
        {Utils.numberComma(hd_coupon_charge_2 || 0)}원
        <span className="percentage">({((100 * hd_coupon_charge_2) / totalSales || 0).toFixed(1)}%)</span>
      </td>
    </tr>
  );
};

const TodayContainer = () => {
  return (
    <Board boardClass="today" title="Today" url="/sales/statistic" suffix="총 매출">
      <table className="contents-list" cellPadding="0" cellSpacing="0">
        <colgroup>
          <col width="163" />
          <col width="163" />
          <col width="163" />
          <col width="163" />
          <col width="163" />
          <col width="163" />
          <col width="163" />
          <col width="163" />
          <col width="163" />
          <col width="163" />
          <col width="163" />
          <col width="163" />
          <col width="163" />
          <col width="163" />
        </colgroup>
        <thead>
          <tr>
            <th rowSpan={2}>
              총매출 <br /> (부가세 포함)
            </th>
            <th rowSpan={2}>
              배달매출 <br /> (부가세 포함){' '}
            </th>
            <th colSpan={8}>유상매출 (부가세 포함)</th>
            <th colSpan={4}>무상 서비스 비용</th>
          </tr>
          <tr>
            <td className="sales">합계</td>
            <td className="sales">카드결제</td>
            <td className="sales">간편결제</td>
            <td className="sales">현금결제</td>
            <td className="sales">유상포인트결제</td>
            <td className="sales">본사쿠폰결제(보전)</td>
            <td className="sales">제휴사쿠폰/포인트결제</td>
            <td className="sales">쿠팡/배민</td>
            <td className="service">합계</td>
            <td className="service">가맹점쿠폰결제</td>
            <td className="service">바나포인트결제</td>
            <td className="service">본사쿠폰결제(미보전)</td>
          </tr>
        </thead>
        <tbody>
          <ErrorBoundary
            fallbackRender={({ resetErrorBoundary }) => (
              <SuspenseErrorPage isTable paddingTop="0px" resetErrorBoundary={resetErrorBoundary} />
            )}
            onError={(e) => console.log('error on Today: ', e)}
          >
            <Suspense fallback={<Loading width={50} height={50} marginTop={15} isTable />}>
              <Today />
            </Suspense>
          </ErrorBoundary>
        </tbody>
      </table>
      <div className="description">
        <p className="hyphen">총 매출: 유상매출+무상서비스</p>
        <p className="hyphen">유상매출과 무상서비스 금액에 자체 앱주문 배달비 포함.</p>
        <p className="hyphen">배달매출: 앱배달/쿠팡/배민 합계. (배달비 포함)</p>
      </div>
    </Board>
  );
};
export default TodayContainer;
