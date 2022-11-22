const enum CALCULATE_TYPE {
    LIST,
    POINT,
    COUPON,
    CLAIM,
    ETC,
};

type CalculateType = typeof CALCULATE_TYPE[keyof typeof CALCULATE_TYPE];

// 정산내역 확인 데이터
type CalculateDetail = {
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
type CalculateDetailOut = { calculate_id: number, calculate_status: CalculateStatusType, error_msg: string };

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
type CalculateFixDetail = {
    log_date: string, // 일시
    log_type: string, // 구분
    insert_staff_no: number, 
    insert_staff_name: string, // 등록자
    comment: string, // 수정요청/답변내용
    pre_data: string, // 변경 전
    change_data: string, // 변경 후
};

// 포인트, 쿠폰 ,클레임, 기타 전월 결제내역
type CalculateDetailSum = {
    from_date: string, // 정산기간
    to_date:string, // 정산기간
    calculate_type?:string, // 기타 - 구분
    item_name: string, // 품목
    supply_amt: number, // 공급가액
    vat_amt: number, // 부가세
    total_amt: number, // 합계
};

// 유상포인트 결제내역 상세
type CalculatePointDetail = {
    rcp_date: string, // 결제일시
    item_name: string, // 주문 메뉴
    phone: string, // 주문자
    nChargeTotal: number, // 총 주문금액
    total_amt: number, // 유상포인트 사용금액 / 유상포인트 결제금액 합계
    use_point_type: string, // 유상포인트 구분
    rcp_type: string, // 거래기기
    supply_amt: number, // 유상포인트 결제금액 공급가
    vat_amt: number, // 유상포인트 결제금액 부가세
};

// 본사 쿠폰 결제내역 상세
type CalculateCouponDetail = {
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

// 고객 클레임 보상내역 탭
const CLAIM_TAB_TYPE = {
    CLAIM: 'claim',
    CALCULATE: 'calculate',
} as const;
type TabType = typeof CLAIM_TAB_TYPE[keyof typeof CLAIM_TAB_TYPE];

export {
    CALCULATE_TYPE, CALCULATE_STATUS, CLAIM_TAB_TYPE
};

export type {
    CalculateType, CalculateDetail, CalculateDetailOut, CalculateStatusType, CalculateFixDetail,
    CalculateDetailSum, CalculatePointDetail, CalculateCouponDetail, TabType
};