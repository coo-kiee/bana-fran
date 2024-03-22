import { Suspense } from 'react';
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

const Membership = () => {
  const fCode = useRecoilValue(franState);
  const { data } = HOME_SERVICE.useMembershipInfo({ f_code: fCode });

  return (
    <>
      <tr>
        <td className="sortation">미사용 바나포인트(P)</td>
        <td className="align-right">-</td>
        <td className="align-right">{data && Utils.numberComma(data[0].bana_point)}P</td>
      </tr>
      <tr>
        <td className="sortation">미사용 무료쿠폰(스탬프적립)</td>
        <td className="align-right">{data && Utils.numberComma(data[0].stamp_coupon_cnt)}</td>
        <td className="align-right">{data && Utils.numberComma(data[0].stamp_coupon_amt)}원</td>
      </tr>
      <tr>
        <td className="sortation">미사용 무료쿠폰(월간랭킹)</td>
        <td className="align-right">{data && Utils.numberComma(data[0].month_coupon_cnt)}</td>
        <td className="align-right">-</td>
      </tr>
      {/* 라벨 QR 이벤트 부분 */}
      <tr>
        <td className="sortation">미사용 무료쿠폰(라벨QR이벤트)</td>
        <td className="align-right">{data && Utils.numberComma(data[0].qr_coupon_cnt)}</td>
        <td className="align-right">-</td>
      </tr>
    </>
  );
};

const MembershipContainer = () => {
  return (
    <Board boardClass="membership" title="멤버십 적립 현황" url="/membership/extra" suffix="누적">
      <table className="contents-list" cellPadding="0" cellSpacing="0">
        <colgroup>
          <col width="258" />
          <col width="125" />
          <col width="*" />
        </colgroup>
        <thead>
          <tr>
            <th>구분</th>
            <th>건수</th>
            <th>금액</th>
          </tr>
        </thead>
        <tbody>
          <ErrorBoundary
            fallbackRender={({ resetErrorBoundary }) => (
              <SuspenseErrorPage isTable paddingTop="0px" resetErrorBoundary={resetErrorBoundary} />
            )}
            onError={(e) => console.log('error on Membership(멤버십 적립 현황): ', e)}
          >
            <Suspense fallback={<Loading width={50} height={50} marginTop={16} isTable />}>
              <Membership />
            </Suspense>
          </ErrorBoundary>
        </tbody>
      </table>
    </Board>
  );
};

export default MembershipContainer;
