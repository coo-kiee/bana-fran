export const EVENT_TAB_TYPE = {
  COUPON_STATUS: 'coupon_status',
  COUPON_USAGE: 'coupon_usage',
} as const;
export type EventTabType = (typeof EVENT_TAB_TYPE)[keyof typeof EVENT_TAB_TYPE];

export const EVENT_TAB_TITLE = {
  [EVENT_TAB_TYPE.COUPON_STATUS]: '쿠폰 현황',
  [EVENT_TAB_TYPE.COUPON_USAGE]: '사용 내역',
} as const;

export const EVENT_COUPON_USAGE_FILTER_TYPE = {
  COUPON_NAME: 'coupon_name',
  COUPON_CODE: 'coupon_code',
} as const;
export type eventCouponUsageType = (typeof EVENT_COUPON_USAGE_FILTER_TYPE)[keyof typeof EVENT_COUPON_USAGE_FILTER_TYPE];
