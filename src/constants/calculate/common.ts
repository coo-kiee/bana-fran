import { AFFILIATE_TAB_TYPE } from './affiliate';

export const CALCULATE_TYPE = {
  LIST: 0,
  POINT: 1,
  COUPON: 2,
  CLAIM: 3,
  ETC: 4,
  AFFILIATE: 5,
  BANA_POINT: 6,
  STAMP_COUPON: 7,
} as const;
export type CalculateType = (typeof CALCULATE_TYPE)[keyof typeof CALCULATE_TYPE];

export const CALCULATE_TITLE = {
  [CALCULATE_TYPE.LIST]: '정산내역 확인',
  [CALCULATE_TYPE.POINT]: '유상포인트 결제내역',
  [CALCULATE_TYPE.COUPON]: '본사 쿠폰 결제내역',
  [CALCULATE_TYPE.CLAIM]: '고객 클레임 보상내역',
  [CALCULATE_TYPE.ETC]: '기타 정산내역',
  [AFFILIATE_TAB_TYPE.COUPON]: '제휴사 쿠폰 결제내역',
  [AFFILIATE_TAB_TYPE.POINT]: '제휴사 포인트 결제내역',
  [CALCULATE_TYPE.BANA_POINT]: '바나포인트 정산내역',
  [CALCULATE_TYPE.STAMP_COUPON]: '스탬프 쿠폰 정산내역',
} as const;

export type SearchDate = { fromDate: string; toDate: string };

export const LAST_MONTH_TABLE_COLGROUP_INFO = {
  [CALCULATE_TYPE.POINT]: [{ width: '218' }, { width: '*' }, { width: '130' }, { width: '130' }, { width: '130' }],
  [CALCULATE_TYPE.COUPON]: [{ width: '218' }, { width: '*' }, { width: '130' }, { width: '130' }, { width: '130' }],
  [CALCULATE_TYPE.CLAIM]: [{ width: '218' }, { width: '*' }, { width: '130' }, { width: '130' }, { width: '130' }],
  [CALCULATE_TYPE.ETC]: [
    { width: '188' },
    { width: '70' },
    { width: '*' },
    { width: '130' },
    { width: '130' },
    { width: '130' },
  ],
  [AFFILIATE_TAB_TYPE.COUPON]: [
    { width: '188' },
    { width: '*' },
    { width: '*' },
    { width: '130' },
    { width: '130' },
    { width: '130' },
  ],
  [CALCULATE_TYPE.BANA_POINT]: [{ width: '218' }, { width: '*' }, { width: '130' }, { width: '130' }, { width: '130' }],
  [CALCULATE_TYPE.STAMP_COUPON]: [
    { width: '218' },
    { width: '*' },
    { width: '130' },
    { width: '130' },
    { width: '130' },
  ],
};

export const LAST_MONTH_TABLE_THEAD_INFO = {
  [CALCULATE_TYPE.POINT]: [
    [
      { children: '정산기간' },
      { children: '품목' },
      { children: '공금가액' },
      { children: '부가세' },
      { children: '합계' },
    ],
  ],
  [CALCULATE_TYPE.COUPON]: [
    [
      { children: '정산기간' },
      { children: '품목' },
      { children: '공금가액' },
      { children: '부가세' },
      { children: '합계' },
    ],
  ],
  [CALCULATE_TYPE.CLAIM]: [
    [
      { children: '정산기간' },
      { children: '품목' },
      { children: '공금가액' },
      { children: '부가세' },
      { children: '합계' },
    ],
  ],
  [CALCULATE_TYPE.ETC]: [
    [
      { children: '정산기간' },
      { children: '구분' },
      { children: '품목' },
      { children: '공금가액' },
      { children: '부가세' },
      { children: '합계' },
    ],
  ],
  [AFFILIATE_TAB_TYPE.COUPON]: [
    [
      { children: '정산기간' },
      { children: '품목' },
      { children: '발행사' },
      { children: '공금가액' },
      { children: '부가세' },
      { children: '합계' },
    ],
  ],
  [CALCULATE_TYPE.BANA_POINT]: [
    [
      { children: '정산기간' },
      { children: '품목' },
      { children: '공금가액' },
      { children: '부가세' },
      { children: '합계' },
    ],
  ],
  [CALCULATE_TYPE.STAMP_COUPON]: [
    [
      { children: '정산기간' },
      { children: '품목' },
      { children: '공금가액' },
      { children: '부가세' },
      { children: '합계' },
    ],
  ],
};
