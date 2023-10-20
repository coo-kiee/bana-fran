export const enum CALCULATE_TYPE {
  LIST,
  POINT,
  COUPON,
  CLAIM,
  ETC,
  AFFILIATE,
}

export const CALCULATE_EXCEL_FILENAME = {
  [CALCULATE_TYPE.LIST]: '정산내역 확인',
  [CALCULATE_TYPE.POINT]: '유상포인트 결제내역',
  [CALCULATE_TYPE.COUPON]: '본사 쿠폰 결제내역',
  [CALCULATE_TYPE.CLAIM]: '고객 클레임 보상내역',
  [CALCULATE_TYPE.ETC]: '기타 정산 내역',
  [CALCULATE_TYPE.AFFILIATE]: '',
};

export type SearchDate = { fromDate: string; toDate: string };
