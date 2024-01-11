export const BANA_POINT_DETAIL_COLGROUP_INFO = [
  { width: '*' },
  { width: '*' },
  { width: '*' },
  { width: '*' },
  { width: '130' },
  { width: '130' },
  { width: '130' },
];

export const BANA_POINT_DETAIL_THEAD_INFO = [
  [
    { children: '일시' },
    { children: '구분' },
    { children: '바나포인트 사용금액' },
    { children: '사용매장' },
    { children: '공급가액', className: 'price-area' },
    { children: '부가세', className: 'price-area' },
    { children: '합계', className: 'price-area' },
  ],
];

export const BANA_POINT_DETAIL_FILTER_TYPE = {
  CHARGE: 'charge',
} as const;

export const BANA_POINT_DETAIL_FILTER_OPTION = {
  [BANA_POINT_DETAIL_FILTER_TYPE.CHARGE]: [
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
export type BanaPointDetailFilterOption = typeof BANA_POINT_DETAIL_FILTER_OPTION;

export const BANA_POINT_SUM_TYPE = {
  BILLING: '청구',
  CONSERVATION: '보전',
} as const;

// 정산 관리 금액 곱셈값
export const BANA_POINT_CHARGE_MULTIPLY = {
  [BANA_POINT_SUM_TYPE.CONSERVATION]: 1, // 보전
  [BANA_POINT_SUM_TYPE.BILLING]: -1, // 청구
} as { [key: string]: 1 | -1 };

export const BANA_POINT_DETAIL_TOTAL_INFO = {
  [BANA_POINT_SUM_TYPE.BILLING]: { title: '청구 금액 합계', sum: 0 },
  [BANA_POINT_SUM_TYPE.CONSERVATION]: { title: '보전 금액 합계', sum: 0 },
};
export type BanaPointDetailTotalInfo = typeof BANA_POINT_DETAIL_TOTAL_INFO;
