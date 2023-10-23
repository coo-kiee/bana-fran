export const POINT_DETAIL_COLGROUP_INFO = [
  { width: '100' },
  { width: '250' },
  { width: '136' },
  { width: '100' },
  { width: '100' },
  { width: '134' },
  { width: '92' },
  { width: '100' },
  { width: '100' },
  { width: '100' },
  { width: '100' },
  { width: '100' },
  { width: '100' },
];

export const POINT_DETAIL_THEAD_INFO = [
  [
    { children: '결제일시', rowSpan: 2 },
    { children: '주문메뉴', rowSpan: 2 },
    { children: '주문자', rowSpan: 2 },
    { children: '총 주문금액', rowSpan: 2 },
    { children: '유상포인트 사용금액', rowSpan: 2 },
    { children: '유상포인트 구분', rowSpan: 2 },
    { children: '거래기기', rowSpan: 2 },
    { children: '유상포인트 결제금액', rowSpan: 1, colSpan: 3, className: 'price-area boder-th-b' },
    { children: '수수료 (2.2%)', rowSpan: 1, colSpan: 3, className: 'price-area boder-th-b' },
  ],
  [
    { children: '공급가', className: 'price-area' },
    { children: '부가세', className: 'price-area' },
    { children: '합계', className: 'price-area' },
    { children: '공급가 (2%)', className: 'price-area' },
    { children: '부가세 (0.2%)', className: 'price-area' },
    { children: '합계 (2.2%)', className: 'price-area' },
  ],
];

export const POINT_DETAIL_FILTER_TYPE = {
  POINT: 'point',
  DEVICE: 'device',
} as const;

export const POINT_DETAIL_FILTER_OPTION = {
  [POINT_DETAIL_FILTER_TYPE.POINT]: [
    {
      label: '포인트 구분 전체',
      value: '',
    },
    {
      label: '충전포인트',
      value: '충전포인트',
    },
    {
      label: '잔돈포인트',
      value: '잔돈포인트',
    },
    {
      label: '보너스 충전포인트',
      value: '보너스 충전포인트',
    },
  ],
  [POINT_DETAIL_FILTER_TYPE.DEVICE]: [
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
export type PointDetailFilterOption = typeof POINT_DETAIL_FILTER_OPTION;

export const POINT_SUM_TYPE = {
  CHARGE: '충전포인트',
  CHANGE: '잔돈포인트',
  BONUS_CHARGE: '보너스 충전포인트',
  ALL: '전체포인트',
} as const;

export const POINT_DETAIL_TOTAL_INFO = {
  [POINT_SUM_TYPE.CHARGE]: { title: '충전포인트 사용금액 합계', sum: 0 },
  [POINT_SUM_TYPE.CHANGE]: { title: '잔돈포인트 사용금액 합계', sum: 0 },
  [POINT_SUM_TYPE.BONUS_CHARGE]: { title: '충전포인트(보너스) 사용금액 합계', sum: 0 },
  [POINT_SUM_TYPE.ALL]: { title: '유상(충전+보너스+잔돈)포인트 사용금액 합계', sum: 0 },
};
export type PointDetailTotalInfo = typeof POINT_DETAIL_TOTAL_INFO;
