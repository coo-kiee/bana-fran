// 정산내역 확인 데이터
type CalculateLastMonthTotalDetail = {
  calculate_id: number; // 정산내역 리스트 id
  calculate_d_id: number; // 정산내역 데이터 1개 id
  from_date: string; // 정산기간
  to_date: string; // 정산기간
  calculate_type: string; // 구분
  item_type: string; // 품목
  item_detail: string; // 상세내역
  item_cnt: number; // 수량

  item_price: number; // 단가
  supply_amt: number; // 공급가액
  vat_amt: number; // 부가세
  total_amt: number; // 합계
  etc: string; // 비고
};

// 정산내역 확인 Output
type CalculateLastMonthOutput = { calculate_id: number; calculate_status: number; error_msg: string };

// 정산내역 확인 쿼리 결과
type CalculateLastMonthTotalQueryResult = {
  list: CalculateLastMonthTotalDetail[];
  out: CalculateLastMonthOutput;
  return: 0 | 1;
};

// 정산내역 확인 수정요청/변경이력 데이터
type CalculateFixListQueryResult = {
  log_date: string; // 일시
  log_type: string; // 구분
  insert_staff_no: number;
  insert_staff_name: string; // 등록자
  comment: string; // 수정요청/답변내용
  pre_data: string; // 변경 전
  change_data: string; // 변경 후
};

// 포인트, 쿠폰 ,클레임, 기타 전월 결제내역
type CalculateLastMonthEachQueryResult = {
  from_date: string; // 정산기간
  to_date: string; // 정산기간
  calculate_type: string; // 기타 - 구분
  item_name: string; // 품목
  publisher: string; // 발행사
  supply_amt: number; // 공급가액
  vat_amt: number; // 부가세
  total_amt: number; // 합계
};

// 유상포인트 결제내역 상세
type CalculatePointDetailListQueryResult = {
  rcp_date: string; // 결제일시
  item_name: string; // 주문 메뉴
  phone: string; // 주문자
  rcp_type: string; // 거래기기
  nChargeTotal: number; // 총 주문금액
  use_point_type: string; // 유상포인트 구분
  supply_amt: number; // 유상포인트 공급가
  vat_amt: number; // 유상포인트 부가세
  bonus_supply_amt: number; // 보너스 포인트 공급가
  bonus_vat_amt: number; // 보너스 포인트 부가세
  bonus_point_type: string; // 보너스 충전포인트 필터값
  fee_supply_amt: string; // 유상포인트 수수료 공급가
  fee_vat_amt: number; // 유상포인트 수수료 부가세
  fee_bonus_supply_amt: string; // 보너스 충전포인트 수수료 공급가
  fee_bonus_vat_amt: number; // 보너스 충전포인트 수수료 부가세
  total_paid_amt: number; // 유상 포인트 사용 금액 합계
  total_bonus_amt: number; // 보너스 포인트 사용 금액 합계
  total_amt: number; // 유상 + 보너스 포인트 사용 금액 합계
};

type CalculateCouponListQueryResult = { code: number; code_name: string };

// 본사 쿠폰 결제내역 상세
type CalculateCouponDetailListQueryResult = {
  rcp_date: string; // 결제일시
  item_type: string; // 쿠폰
  item_type_code: number;
  sItem: string; // 사용메뉴
  phone: string; // 주문자
  total_amt: number; // 쿠폰 사용금액 / 본사발행 쿠폰 결제내역 합계
  rcp_type: string; // 거래기기
  supply_amt: number; // 본사발행 쿠폰 결제내역 공급가
  vat_amt: number; // 본사발행 쿠폰 결제내역 부가세
};

// 고객 클레임 보상 내역 상세
type CalculateClaimDetailListQueryResult = {
  send_date: string; // 쿠폰 발행일시
  use_date: string; // 쿠폰 사용일시
  use_flag: string; // 사용여부
  coupon_title: string; // 쿠폰명
  coupon_amt: number; // 쿠폰 발행 (최대)금액
  expiration_date: string; // 유효기간
  send_phone: string; // 발급 고객
  claim_text: string; // 클레임 내용
  send_f_name: string; //발급매장
  use_f_name: string; // 사용매장
  use_phone: string; // 사용자
  coupon_charge: number; // 사용 금액
  supply_amt: number; // 공급가
  vat_amt: number; // 부가세
};

// 제휴사 쿠폰/포인트 상세
type CalculateAffiliateDetailListQueryResult = {
  use_date: string; // 결제일시
  coupon_title: string; // 쿠폰명
  publisher: number; // 공급사
  menu_name: string; // 메뉴명
  phone: string; // 사용자
  apply_charge: number; // 사용 금액
  supply_amt: number; // 공급가
  vat_amt: number; // 부가세
  total_amt: number; // 합계
};

// 기타 정산 내역 상세
type CalculateEtcDetailListQueryResult = {
  std_month: string; // 정산월
  calculate_type: string; // 구분
  item_detail: string; // 내용
  supply_amt: number; // 기타 정산 금액 공급가
  vat_amt: number; // 기타 정산 금액 부가세
  total_amt: number; // 기타 정산 금액 합계
};

// 바나포인트 정산 내역 상세
type CalculateBanaPointDetailListQueryResult = {
  use_date: string; // --일시
  calc_type: string; // --구분
  use_point: number; // --사용금액
  use_fcode: number; // --사용매장코드
  use_fcode_name: string; // --사용매장명
  supply_amt: number; // --공급가액
  vat_amt: number; // --부가세
  total_amt: number; // --합계
};

// // 스탬프쿠폰 정산 내역 상세
type CalculateStampCouponDetailListQueryResult = {
  use_date: string; // --일시
  calc_type: string; // --구분
  sTitle: string; // --사용된쿠폰명
  coupon_use_charge: number; // --실사용금액
  use_fcode: number; // --사용매장코드
  use_fcode_name: string; // --사용매장명
  stamp_count: number; // -- 청구 스탬프 수
  one_charge: number; // -- 스탬프 단가
  stamp_charge: number; // -- 스탬프청구액
  hd_charge: number; // -- 본사부담(50%)
  supply_amt: number; // --공급가액
  vat_amt: number; // --부가세
  total_amt: number; // --실 청구액 / 합계
};

export type {
  CalculateLastMonthTotalQueryResult,
  CalculateLastMonthTotalDetail,
  CalculateLastMonthOutput,
  CalculateFixListQueryResult,
  CalculateLastMonthEachQueryResult,
  CalculatePointDetailListQueryResult,
  CalculateCouponDetailListQueryResult,
  CalculateClaimDetailListQueryResult,
  CalculateEtcDetailListQueryResult,
  CalculateAffiliateDetailListQueryResult,
  CalculateCouponListQueryResult,
  CalculateBanaPointDetailListQueryResult,
  CalculateStampCouponDetailListQueryResult,
};
