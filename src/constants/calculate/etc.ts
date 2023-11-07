export const ETC_DETAIL_COLGROUP_INFO = [
  { width: '128' },
  { width: '68' },
  { width: '*' },
  { width: '130' },
  { width: '130' },
  { width: '130' },
];

export const ETC_DETAIL_THEAD_INFO = [
  [
    { children: '정산월', rowSpan: 2 },
    { children: '구분', rowSpan: 2 },
    { children: '내용', rowSpan: 2 },
    { children: '기타 정산 금액', colSpan: 3, className: 'price-area boder-th-b' },
  ],
  [
    { children: '공급가', className: 'price-area' },
    { children: '부가세', className: 'price-area' },
    { children: '합계', className: 'price-area' },
  ],
];

export const ETC_DETAIL_FILTER_TYPE = {
  CHARGE: 'charge',
} as const;

export const ETC_DETAIL_FILTER_OPTION = {
  [ETC_DETAIL_FILTER_TYPE.CHARGE]: [
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
export type EtcDetailFilterOption = typeof ETC_DETAIL_FILTER_OPTION;

export const ETC_SUM_TYPE = {
  BILLING: '청구',
  CONSERVATION: '보전',
} as const;

// 정산 관리 금액 곱셈값
export const ETC_CHARGE_MULTIPLY = {
  [ETC_SUM_TYPE.CONSERVATION]: 1, // 보전
  [ETC_SUM_TYPE.BILLING]: -1, // 청구
} as { [key: string]: 1 | -1 };

export const ETC_DETAIL_TOTAL_INFO = {
  [ETC_SUM_TYPE.BILLING]: { title: '청구 금액 합계', sum: 0 },
  [ETC_SUM_TYPE.CONSERVATION]: { title: '보전 금액 합계', sum: 0 },
};
export type EtcDetailTotalInfo = typeof ETC_DETAIL_TOTAL_INFO;
