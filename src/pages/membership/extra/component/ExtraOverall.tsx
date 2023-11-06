import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from 'react-query';
import { useRecoilValue } from 'recoil';
import Utils from 'utils/Utils';

// component
import Loading from 'pages/common/loading';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';

// type
import { MembershipTotalType } from 'types/membership/extraType';

// state
import { franState } from 'state';

// Service
import MEMBERSHIP_SERVICE from 'service/membershipService';

const ExtraOverall = () => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
      <thead>
        {EXTRA_OVERALL_TH_LIST.map((tr, idx1) => (
          <tr key={idx1}>
            {tr.map(({ children, ...thAttributes }, idx2) => (
              <th key={`${children}_${idx2}`} {...thAttributes}>
                {children}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        <React.Suspense fallback={<Loading width={50} height={50} isTable={true} />}>
          <ErrorBoundary
            onReset={reset}
            fallbackRender={({ resetErrorBoundary }) => (
              <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} isTable={true} />
            )}
          >
            <ExtraOverallData />
          </ErrorBoundary>
        </React.Suspense>
      </tbody>
    </table>
  );
};

const ExtraOverallData = () => {
  const franCode = useRecoilValue(franState);

  let extraOverallTotal: MembershipTotalType = {
    convert_coupon_stamp_cnt: 0,
    expired_coupon_amount: 0,
    expired_coupon_cnt: 0,
    expired_point: 0,
    expired_stamp_cnt: 0,
    not_used_coupon_amount: '',
    not_used_coupon_cnt: 0,
    not_used_point: 0,
    notyet_coupon_stamp_cnt: 0,
    total_coupon_amount: '',
    total_coupon_cnt: 0,
    total_point: 0,
    total_stamp_cnt: 0,
    used_coupon_amount: '',
    used_coupon_cnt: 0,
    used_point: 0,
  };
  const membershipTotalParams: { fran_store: number } = { fran_store: franCode };
  const { data, isSuccess } = MEMBERSHIP_SERVICE.useMembershipTotal(membershipTotalParams);

  if (isSuccess) {
    extraOverallTotal = data;
  }

  return (
    <tr>
      <td>{Utils.numberComma(extraOverallTotal.total_stamp_cnt)}</td>
      <td>{Utils.numberComma(extraOverallTotal.convert_coupon_stamp_cnt)}개</td>
      <td>{Utils.numberComma(extraOverallTotal.expired_stamp_cnt)}개</td>
      <td className="point">{Utils.numberComma(extraOverallTotal.notyet_coupon_stamp_cnt)}개</td>
      <td>
        {Utils.numberComma(extraOverallTotal.total_coupon_cnt)}개
        <p>({Utils.numberComma(extraOverallTotal.total_coupon_amount)}원)</p>
      </td>
      <td>
        {Utils.numberComma(extraOverallTotal.used_coupon_cnt)}개
        <p>({Utils.numberComma(extraOverallTotal.used_coupon_amount)}원)</p>
      </td>
      <td>
        {Utils.numberComma(extraOverallTotal.expired_coupon_cnt)}개
        <p>({Utils.numberComma(extraOverallTotal.expired_coupon_amount)}원)</p>
      </td>
      <td className="point">
        {Utils.numberComma(extraOverallTotal.not_used_coupon_cnt)}개
        <p>({Utils.numberComma(extraOverallTotal.not_used_coupon_amount)}원)</p>
      </td>
      <td>{Utils.numberComma(extraOverallTotal.total_point)}P</td>
      <td>{Utils.numberComma(extraOverallTotal.used_point)}P</td>
      <td>{Utils.numberComma(extraOverallTotal.expired_point)}P</td>
      <td className="point">{Utils.numberComma(extraOverallTotal.not_used_point)}P</td>
    </tr>
  );
};

export default ExtraOverall;

const EXTRA_OVERALL_TH_LIST = [
  [
    { children: '스탬프', className: 'boder-th-a', colSpan: 4 },
    { children: '무료음료쿠폰 (스탬프적립&월간랭킹보상)', className: 'price-area boder-th-b', colSpan: 4 },
    { children: '바나포인트 (적립&월간랭킹보상)', colSpan: 4 },
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
