export const CLAIM_TAB_TYPE = {
  ALL: 'all',
  CALCULATE: 'calculate',
} as const;
export type ClaimTabType = (typeof CLAIM_TAB_TYPE)[keyof typeof CLAIM_TAB_TYPE];

export const CLAIM_TAB_TITLE = {
  [CLAIM_TAB_TYPE.ALL]: '클레임 내역전체',
  [CLAIM_TAB_TYPE.CALCULATE]: '정산 (보전)내역 조회',
} as const;

const CLAIM_ALL_DETAIL_COLGROUP_INFO = [
  { width: '130' },
  { width: '130' },
  { width: '88' },
  { width: '150' },
  { width: '109' },
  { width: '130' },
  { width: '136' },
  { width: '*' },
  { width: '130' },
  { width: '130' },
  { width: '*' },
  { width: '*' },
  { width: '130' },
  { width: '130' },
  { width: '130' },
];

const CLAIM_CALCULATE_DETAIL_COLGROUP_INFO = [
  { width: '130' },
  { width: '130' },
  { width: '88' },
  { width: '150' },
  { width: '109' },
  { width: '130' },
  { width: '136' },
  { width: '130' },
  { width: '130' },
  { width: '*' },
  { width: '*' },
  { width: '130' },
  { width: '130' },
  { width: '130' },
];

export const CLAIM_DETAIL_TABLE_COLGROUP_INFO = {
  [CLAIM_TAB_TYPE.ALL]: CLAIM_ALL_DETAIL_COLGROUP_INFO,
  [CLAIM_TAB_TYPE.CALCULATE]: CLAIM_CALCULATE_DETAIL_COLGROUP_INFO,
} as const;

const CLAIM_ALL_DETAIL_THEAD_INFO = [
  [
    { children: '쿠폰 발행일시', rowSpan: 2 },
    { children: '쿠폰 사용일시', rowSpan: 2 },
    { children: '사용여부', rowSpan: 2 },
    { children: '쿠폰명', rowSpan: 2 },
    { children: '쿠폰발행\n(최대)금액', rowSpan: 2 },
    { children: '유효기간', rowSpan: 2 },
    { children: '발급고객', rowSpan: 2 },
    { children: '클레임 내용', rowSpan: 2 },
    { children: '발급매장', rowSpan: 2 },
    { children: '사용매장', rowSpan: 2 },
    { children: '사용자', rowSpan: 2 },
    { children: '사용금액', rowSpan: 2 },
    { children: '클레임 쿠폰 사용 금액', colSpan: 3, className: 'price-area boder-th-b' },
  ],
  [
    { children: '공급가', className: 'price-area' },
    { children: '부가세', className: 'price-area' },
    { children: '합계', className: 'price-area' },
  ],
];

const CLAIM_CALCULATE_DETAIL_THEAD_INFO = [
  [
    { children: '쿠폰 발행일시', rowSpan: 2 },
    { children: '쿠폰 사용일시', rowSpan: 2 },
    { children: '사용여부', rowSpan: 2 },
    { children: '쿠폰명', rowSpan: 2 },
    { children: '쿠폰발행\n(최대)금액', rowSpan: 2 },
    { children: '유효기간', rowSpan: 2 },
    { children: '발급고객', rowSpan: 2 },
    { children: '발급매장', rowSpan: 2 },
    { children: '사용매장', rowSpan: 2 },
    { children: '사용자', rowSpan: 2 },
    { children: '사용금액', rowSpan: 2 },
    { children: '클레임 쿠폰 사용 금액', colSpan: 3, className: 'price-area boder-th-b' },
  ],
  [
    { children: '공급가', className: 'price-area' },
    { children: '부가세', className: 'price-area' },
    { children: '합계', className: 'price-area' },
  ],
];

export const CLAIM_DETAIL_TABLE_THEAD_INFO = {
  [CLAIM_TAB_TYPE.ALL]: CLAIM_ALL_DETAIL_THEAD_INFO,
  [CLAIM_TAB_TYPE.CALCULATE]: CLAIM_CALCULATE_DETAIL_THEAD_INFO,
} as const;

export const CLAIM_DETAIL_FILTER_TYPE = {
  SORT: 'sort',
};

const CLAIM_TOTAL_DETAIL_FILTER_OPTION = {
  [CLAIM_DETAIL_FILTER_TYPE.SORT]: [
    {
      label: '쿠폰 발행일시',
      value: '발행일자',
    },
    {
      label: '쿠폰 사용일시',
      value: '사용일자',
    },
  ],
};

export const CLAIM_DETAIL_FILTER_OPTION = {
  [CLAIM_TAB_TYPE.ALL]: CLAIM_TOTAL_DETAIL_FILTER_OPTION,
};
export type ClaimFilterOption = typeof CLAIM_DETAIL_FILTER_OPTION;

export const CLAIM_SUM_TYPE = {
  PUBLISH: '발행',
  EXPIRATION: '만료',
  USE: '사용',
} as const;

export const CLAIM_ALL_DETAIL_TOTAL_INFO = {
  [CLAIM_SUM_TYPE.PUBLISH]: { title: '클레임 보상 쿠폰 발행금액 합계', sum: 0 },
  [CLAIM_SUM_TYPE.EXPIRATION]: { title: '클레임 보상 쿠폰 만료금액 합계', sum: 0 },
  [CLAIM_SUM_TYPE.USE]: { title: '클레임 보상 쿠폰 사용금액 합계', sum: 0 },
};

export const CLAIM_CALCULATE_DETAIL_TOTAL_INFO = {
  [CLAIM_SUM_TYPE.USE]: { title: '클레임 보상 쿠폰 사용금액 합계', sum: 0 },
};

export const CLAIM_DETAIL_TOTAL_INFO = {
  [CLAIM_TAB_TYPE.ALL]: CLAIM_ALL_DETAIL_TOTAL_INFO,
  [CLAIM_TAB_TYPE.CALCULATE]: CLAIM_CALCULATE_DETAIL_TOTAL_INFO,
} as const;
export type ClaimDetailTotalInfo = (typeof CLAIM_DETAIL_TOTAL_INFO)[keyof typeof CLAIM_DETAIL_TOTAL_INFO];
