export const STAMP_COUPON_DETAIL_COLGROUP_INFO = [
  { width: '130' },
  { width: '68' },
  { width: '*' },
  { width: '200' },
  { width: '100' },
  { width: '90' },
  { width: '100' },
  { width: '100' },
  { width: '100' },
  { width: '100' },
  { width: '100' },
  { width: '100' },
  { width: '100' },
];

export const STAMP_COUPON_DETAIL_THEAD_INFO = [
  [
    { children: '사용일시' },
    { children: '구분' },
    { children: '사용된 쿠폰' },
    { children: '사용매장' },
    { children: '실 사용금액' },
    { children: '청구 스탬프 수' },
    { children: '스탬프 단가' },
    { children: '스탬프 청구액' },
    { children: '본사부담(50%)' },
    { children: '실 청구액' },
    { children: '공급가액', className: 'price-area' },
    { children: '부가세', className: 'price-area' },
    { children: '합계', className: 'price-area' },
  ],
];

export const STAMP_COUPON_DETAIL_FILTER_TYPE = {
  CHARGE: 'charge',
} as const;

export const STAMP_COUPON_DETAIL_FILTER_OPTION = {
  [STAMP_COUPON_DETAIL_FILTER_TYPE.CHARGE]: [
    {
      label: '구분 전체',
      value: '',
    },
    {
      label: '청구',
      value: '청구',
    },
    {
      label: '보전',
      value: '보전',
    },
  ],
} as const;
export type StampCouponDetailFilterOption = typeof STAMP_COUPON_DETAIL_FILTER_OPTION;

export const STAMP_COUPON_SUM_TYPE = {
  BILLING: '청구',
  CONSERVATION: '보전',
} as const;

// 정산 관리 금액 곱셈값
export const STAMP_COUPON_CHARGE_MULTIPLY = {
  [STAMP_COUPON_SUM_TYPE.CONSERVATION]: 1, // 보전
  [STAMP_COUPON_SUM_TYPE.BILLING]: -1, // 청구
} as { [key: string]: 1 | -1 };

export const STAMP_COUPON_DETAIL_TOTAL_INFO = {
  [STAMP_COUPON_SUM_TYPE.BILLING]: { title: '청구 금액 합계', sum: 0 },
  [STAMP_COUPON_SUM_TYPE.CONSERVATION]: { title: '보전 금액 합계', sum: 0 },
};
export type StampCouponDetailTotalInfo = typeof STAMP_COUPON_DETAIL_TOTAL_INFO;
