import { SearchDate } from 'constants/calculate/common';
import { MEMBERSHIP_PAGE_TYPE } from 'types/membership/membershipType';

interface EventCouponListParams {
  f_code: number;
  from_date: string;
  to_date: string;
}

interface EventCouponStatusListItemType {
  insert_date: string;
  title: string;
  expiration_day: number;
  insert_count: number;
  not_print_cnt: number;
  print_cnt: number;
  coupon_use_count: number;
  coupon_not_use_cnt: number;
  end_coupon_not_use_cnt: number;
  discount_charge: number;
  use_coupon_charge: number;
}

interface EventCouponUsageListItemType {
  use_date: string;
  coupon_name: string;
  use_amt: number;
  print_date: string;
  coupon_code: string;
  expiration_date: string;
  phone: string;
}

interface DetailTableProps {
  searchDate: SearchDate;
  pageType: MEMBERSHIP_PAGE_TYPE;
}

export type { EventCouponListParams, EventCouponStatusListItemType, EventCouponUsageListItemType, DetailTableProps };
