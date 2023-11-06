// type
interface MembershipTotalType {
  convert_coupon_stamp_cnt: number; // 쿠폰 전환, 갯수 관련
  notyet_coupon_stamp_cnt: number; // 미전환, 스탬프 갯수

  expired_coupon_amount: number; // 유효기간 소멸, 쿠폰 금액 관련
  expired_coupon_cnt: number; // 유효기간 소멸, 쿠폰 갯수 관련
  expired_point: number; // 유효기간 소멸, 포인트 관련
  expired_stamp_cnt: number; // 유효기간 소멸, 스탬프 갯수 관련

  not_used_coupon_amount: string; // 미전환, 쿠폰 금액
  not_used_coupon_cnt: number; // 미전환, 쿠폰 갯수
  not_used_point: number; // 미전환, 포인트

  total_coupon_amount: string; // 총 쿠폰 금액
  total_coupon_cnt: number; // 총 쿠폰 갯수
  total_point: number; // 총 포인트
  total_stamp_cnt: number; // 총 스탬프 갯수

  used_coupon_amount: string; // 사용 수 금액
  used_coupon_cnt: number; // 사용 쿠폰 갯수
  used_point: number; // 총 사용수 포인트
} // useMembershipTotal 결과 값 타입

interface MembershipListType {
  convert_coupon_stamp_cnt: number | string; // ? 쿠폰 전환, 갯수 관련
  expired_coupon_amount: string; // 쿠폰 - 유효기간 소멸 수 금액
  expired_coupon_cnt: number | string; // 쿠폰 - 유효기간 소멸 수
  expired_point: number | string; // 포인트 - 유효기간 소멸
  expired_stamp_cnt: number | string; // 스탬프 - 유효기간 소멸 수
  std_date: string; // 일시
  total_coupon_amount: string; // 쿠폰 - 발급 수 금액
  total_coupon_cnt: number | string; // 쿠폰 - 발급 수
  total_point: number | string; // ? 포인트 - 총 액수?
  total_stamp_cnt: number | string; // 스탬프 - 지급 수
  used_coupon_amount: string; // 쿠폰 - 사용 수 금액
  used_coupon_cnt: number | string; // 쿠폰 - 사용 수
  used_point: number | string; // 포인트 - 사용
} // useMembershipList 결과 값 타입

export type { MembershipTotalType, MembershipListType };
