export const COUPON_DETAIL_COLGROUP_INFO = [
  { width: '188' },
  { width: '393' },
  { width: '262' },
  { width: '116' },
  { width: '134' },
  { width: '136' },
  { width: '136' },
  { width: '136' },
  { width: '136' },
];

export const COUPON_DETAIL_THEAD_INFO = [
  [
    { children: '결제일시', rowSpan: 2 },
    { children: '쿠폰', rowSpan: 2 },
    { children: '사용메뉴', rowSpan: 2 },
    { children: '쿠폰 사용금액', rowSpan: 2 },
    { children: '거래기기', rowSpan: 2 },
    { children: '주문자', rowSpan: 2 },
    { children: '본사발행 쿠폰 결제내역', rowSpan: 1, colSpan: 3, className: 'price-area boder-th-b' },
  ],
  [
    { children: '공급가', className: 'price-area' },
    { children: '부가세', className: 'price-area' },
    { children: '합계', className: 'price-area' },
  ],
];

export const COUPON_DETAIL_FILTER_TYPE = {
  COUPON: 'coupon',
  DEVICE: 'device',
} as const;

export const COUPON_DETAIL_FILTER_OPTION = {
  [COUPON_DETAIL_FILTER_TYPE.COUPON]: [
    {
      label: '쿠폰 전체',
      value: 0,
    },
  ] as { label: string; value: number }[],
  [COUPON_DETAIL_FILTER_TYPE.DEVICE]: [
    {
      label: '거래기기 전체',
      value: '',
    },
    {
      label: '키오스크',
      value: '키오스크',
    },
    {
      label: '어플',
      value: '어플',
    },
  ],
} as const;
export type CouponDetailFilterOption = typeof COUPON_DETAIL_FILTER_OPTION;

export const COUPON_SUM_TYPE = {
  ALL: 89,
} as const;

export const COUPON_DETAIL_TOTAL_INFO = {
  [COUPON_SUM_TYPE.ALL]: { title: '본사 쿠폰 사용금액 합계(보전)', sum: 0 },
} as Record<string, { title: string; sum: number }>;
export type CouponDetailTotalInfo = typeof COUPON_DETAIL_TOTAL_INFO;
