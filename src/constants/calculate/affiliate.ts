// 제휴사 쿠폰/포인트 탭
export const AFFILIATE_TAB_TYPE = {
  COUPON: 5,
  POINT: 6,
};
export type AffiliateTabType = (typeof AFFILIATE_TAB_TYPE)[keyof typeof AFFILIATE_TAB_TYPE];

export const AFFILIATE_TAB_TITLE = {
  [AFFILIATE_TAB_TYPE.COUPON]: '제휴사 쿠폰 결제',
  // [AFFILIATE_TAB_TYPE.POINT]: '제휴사 포인트 결제',
} as const;

export const AFFILIATE_COUPON_DETAIL_COLGROUP_INFO = [
  { width: '130' },
  { width: '*' },
  { width: '*' },
  { width: '*' },
  { width: '130' },
  { width: '150' },
  { width: '130' },
  { width: '130' },
  { width: '130' },
];

export const AFFILIATE_POINT_DETAIL_COLGROUP_INFO = [
  { width: '130' },
  { width: '*' },
  { width: '*' },
  { width: '*' },
  { width: '130' },
  { width: '150' },
  { width: '130' },
  { width: '130' },
  { width: '130' },
];

export const AFFILIATE_DETAIL_TABLE_COLGROUP_INFO = {
  [AFFILIATE_TAB_TYPE.COUPON]: AFFILIATE_COUPON_DETAIL_COLGROUP_INFO,
  [AFFILIATE_TAB_TYPE.POINT]: AFFILIATE_POINT_DETAIL_COLGROUP_INFO,
} as const;

export const AFFILIATE_COUPON_DETAIL_THEAD_INFO = [
  [
    { children: '결제일시', rowSpan: 2 },
    { children: '쿠폰', rowSpan: 2 },
    { children: '발행사', rowSpan: 2 },
    { children: '주문메뉴', rowSpan: 2 },
    { children: '주문자', rowSpan: 2 },
    { children: '제휴사 쿠폰 사용금액\n(권면금액)', rowSpan: 2 },
    {
      children: '제휴사 쿠폰 결제내역 (수수료 차감전 기준)',
      colSpan: 3,
      className: 'price-area boder-th-b',
    },
  ],
  [
    { children: '공급가', className: 'price-area' },
    { children: '부가세', className: 'price-area' },
    { children: '합계', className: 'price-area' },
  ],
];

export const AFFILIATE_POINT_DETAIL_THEAD_INFO = [
  [
    { children: '결제일시', rowSpan: 2 },
    { children: '쿠폰', rowSpan: 2 },
    { children: '발행사', rowSpan: 2 },
    { children: '주문메뉴', rowSpan: 2 },
    { children: '주문자', rowSpan: 2 },
    { children: '제휴사 쿠폰 사용금액\n(권면금액)', rowSpan: 2 },
    {
      children: '제휴사 쿠폰 결제내역 (수수료 차감전 기준)',
      colSpan: 3,
      className: 'price-area boder-th-b',
    },
  ],
  [
    { children: '공급가', className: 'price-area' },
    { children: '부가세', className: 'price-area' },
    { children: '합계', className: 'price-area' },
  ],
];

export const AFFILIATE_DETAIL_TABLE_THEAD_INFO = {
  [AFFILIATE_TAB_TYPE.COUPON]: AFFILIATE_COUPON_DETAIL_THEAD_INFO,
  [AFFILIATE_TAB_TYPE.POINT]: AFFILIATE_POINT_DETAIL_THEAD_INFO,
} as const;

export const AFFILIATE_SUM_TYPE = {
  USE: '사용',
  POINT_USE: '포인트',
} as const;

export const AFFILIATE_COUPON_DETAIL_TOTAL_INFO = {
  [AFFILIATE_SUM_TYPE.USE]: { title: '제휴사 쿠폰 결제금액(권면금액 기준)', sum: 0 },
};

export const AFFILIATEL_POINT_DETAIL_TOTAL_INFO = {
  [AFFILIATE_SUM_TYPE.POINT_USE]: { title: '제휴사 포인트 결제금액(권면금액 기준)', sum: 0 },
};

export const AFFILIATE_DETAIL_TOTAL_INFO = {
  [AFFILIATE_TAB_TYPE.COUPON]: AFFILIATE_COUPON_DETAIL_TOTAL_INFO,
  [AFFILIATE_TAB_TYPE.POINT]: AFFILIATEL_POINT_DETAIL_TOTAL_INFO,
} as const;
export type AffiliateDetailTotalInfo = (typeof AFFILIATE_DETAIL_TOTAL_INFO)[keyof typeof AFFILIATE_DETAIL_TOTAL_INFO];
