const enum CALCULATE_TYPE {
    LIST,
    POINT,
    COUPON,
    CLAIM,
    ETC,
    AFFILIATE,
};

type CalculateType = typeof CALCULATE_TYPE[keyof typeof CALCULATE_TYPE];

// 정산내역 확인 쿼리 결과
type CalculateLastMonthTotalQueryResult = { list: CalculateLastMonthTotalDetail[], out: CalculateLastMonthOutput, sumAll: number };

// 정산내역 확인 데이터
type CalculateLastMonthTotalDetail = {
    calculate_id: number, // 정산내역 리스트 id
    calculate_d_id: number, // 정산내역 데이터 1개 id
    from_date: string, // 정산기간
    to_date: string, // 정산기간
    calculate_type: string, // 구분
    item_type: string, // 품목
    item_detail: string, // 상세내역
    item_cnt: number, // 수량
    item_price: number, // 단가
    supply_amt: number, // 공급가액
    vat_amt: number, // 부가세
    total_amt: number, // 합계
    etc: string, // 비고
};

// 정산내역 확인 Output
type CalculateLastMonthOutput = { calculate_id: number, calculate_status: CalculateStatusType, error_msg: string };

// 정산내역 확인 정산상태
const CALCULATE_STATUS = {
    ERROR: -1,
    DISTRIBUTE:5, // 미배포
    NOT_CONFIRM: 10, // 미확인
    FIX_REQUEST: 20, // 수정요청
    CONFIRM: 30 // 확인완료
} as const;
type CalculateStatusType = typeof CALCULATE_STATUS[keyof typeof CALCULATE_STATUS];

// 정산내역 확인 수정요청/변경이력 데이터
type CalculateFixListQueryResult = {
    log_date: string, // 일시
    log_type: string, // 구분
    insert_staff_no: number, 
    insert_staff_name: string, // 등록자
    comment: string, // 수정요청/답변내용
    pre_data: string, // 변경 전
    change_data: string, // 변경 후
};

// 포인트, 쿠폰 ,클레임, 기타 전월 결제내역
type CalculateLastMonthEachQueryResult = {
    from_date: string, // 정산기간
    to_date:string, // 정산기간
    calculate_type?:string, // 기타 - 구분
    item_name: string, // 품목
    publisher: string, // 발행사
    supply_amt: number, // 공급가액
    vat_amt: number, // 부가세
    total_amt: number, // 합계
};

// 유상포인트 결제내역 상세
type CalculatePointDetailListQueryResult = {
    rcp_date: string, // 결제일시
    item_name: string, // 주문 메뉴
    phone: string, // 주문자
    rcp_type: string, // 거래기기
    nChargeTotal: number, // 총 주문금액
    use_point_type: string, // 유상포인트 구분
    supply_amt: number, // 유상포인트 공급가
    vat_amt: number, // 유상포인트 부가세
    bonus_supply_amt: number,  // 보너스 포인트 공급가
    bonus_vat_amt:number, // 보너스 포인트 부가세
    bonus_point_type: string, // 보너스 충전포인트 필터값
    fee_supply_amt: string, // 유상포인트 수수료 공급가
    fee_vat_amt: number, // 유상포인트 수수료 부가세
    fee_bonus_supply_amt: string, // 보너스 충전포인트 수수료 공급가
    fee_bonus_vat_amt: number, // 보너스 충전포인트 수수료 부가세
    total_paid_amt: number, // 유상 포인트 사용 금액 합계
    total_bonus_amt: number, // 보너스 포인트 사용 금액 합계
    total_amt: number, // 유상 + 보너스 포인트 사용 금액 합계
};

// 본사 쿠폰 결제내역 상세
type CalculateCouponDetailListQueryResult = {
    rcp_date: string, // 결제일시
    item_type: string, // 쿠폰
    item_type_code: number,
    sItem: string, // 사용메뉴
    phone: string, // 주문자
    total_amt: number, // 쿠폰 사용금액 / 본사발행 쿠폰 결제내역 합계
    rcp_type: string, // 거래기기
    supply_amt: number, // 본사발행 쿠폰 결제내역 공급가
    vat_amt: number, // 본사발행 쿠폰 결제내역 부가세
};

// 고객 클레임 보상 내역 상세
type CalculateClaimDetailListQueryResult = {
    send_date: string, // 쿠폰 발행일시
    use_date: string, // 쿠폰 사용일시
    use_flag: string, // 사용여부
    coupon_title: string, // 쿠폰명
    coupon_amt: number, // 쿠폰 발행 (최대)금액
    expiration_date: string, // 유효기간
    send_phone: string, // 발급 고객
    claim_text: string, // 클레임 내용
    use_f_name: string, // 사용매장
    use_phone: string, // 사용자
    coupon_charge: number, // 사용 금액
    supply_amt: number, // 공급가
    vat_amt: number, // 부가세
};

// 제휴사 쿠폰/포인트 상세
type CalculateAffiliateDetailListQueryResult = {
    use_date: string, // 결제일시
    coupon_title: string, // 쿠폰명
    publisher: number, // 공급사
    menu_name: string, // 메뉴명
    phone: string, // 사용자
    apply_charge: number, // 사용 금액
    supply_amt: number, // 공급가
    vat_amt: number, // 부가세
    total_amt: number, // 합계
};

// 고객 클레임 보상내역 탭
const CLAIM_TAB_TYPE = {
    CLAIM: 'claim',
    CALCULATE: 'calculate',
} as const;
type TabType = typeof CLAIM_TAB_TYPE[keyof typeof CLAIM_TAB_TYPE];

// 정산 관리 금액 타입
const CALCULATE_CHARGE_TYPE = {
    BILLING: '청구',
    CONSERVATION: '보전',
} as const;
type CalculateChargeType = typeof CALCULATE_CHARGE_TYPE[keyof typeof CALCULATE_CHARGE_TYPE];

// 정산 관리 금액 곱셈값
const CALCULATE_CHARGE_MULTIPLY = {
    [CALCULATE_CHARGE_TYPE.CONSERVATION]: 1, // 보전
    [CALCULATE_CHARGE_TYPE.BILLING]: -1, // 청구
} as const;
type CalculateChargeMultiplyKey = keyof typeof CALCULATE_CHARGE_MULTIPLY;


// 기타 정산 내역 상세
type CalculateEtcDetailListQueryResult = {
    std_month: string, // 정산월
    calculate_type: string, // 구분
    item_detail: string, // 내용
    supply_amt: number, // 기타 정산 금액 공급가
    vat_amt: number, // 기타 정산 금액 부가세
    total_amt: number, // 기타 정산 금액 합계
};

// 제휴사 쿠폰/포인트 탭
const AFFILIATE_TAB_TYPE = {
    COUPON: 5,
    POINT: 6,
} as const;
type AffilateTabType = typeof AFFILIATE_TAB_TYPE[keyof typeof AFFILIATE_TAB_TYPE];

export {
    CALCULATE_TYPE, CALCULATE_STATUS, CLAIM_TAB_TYPE, CALCULATE_CHARGE_TYPE, CALCULATE_CHARGE_MULTIPLY, AFFILIATE_TAB_TYPE
};

export type {
    CalculateType, CalculateLastMonthTotalQueryResult, CalculateLastMonthTotalDetail, CalculateLastMonthOutput, CalculateStatusType, CalculateFixListQueryResult,
    CalculateLastMonthEachQueryResult, CalculatePointDetailListQueryResult, CalculateCouponDetailListQueryResult, CalculateClaimDetailListQueryResult, TabType, 
    CalculateChargeType, CalculateChargeMultiplyKey, CalculateEtcDetailListQueryResult, AffilateTabType, CalculateAffiliateDetailListQueryResult
};