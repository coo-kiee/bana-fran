const CALCULATE_TYPE = {
    LIST: 'list',
    POINT: 'point',
    COUPON: 'coupon',
    CLAIM: 'claim',
    ETC: 'etc',
} as const;
type CalculateType = typeof CALCULATE_TYPE[keyof typeof CALCULATE_TYPE];

// 정산내역 확인 데이터
type CalculateDetail = {
    calculate_id: number,
    calculate_d_id: number,
    from_date: string,
    to_date: string,
    calculate_type: string,
    item_type: string,
    item_detail: string,
    item_cnt: number,
    item_price: number,
    supply_amt: number,
    vat_amt: number,
    total_amt: number,
    etc: string,
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
    log_date: string,
    log_type: string,
    comment: string,
    insert_staff_no: number,
    insert_staff_name: string,
    pre_data: string,
    change_data: string,
};

export {
    CALCULATE_TYPE, CALCULATE_STATUS
};

export type {
    CalculateType, CalculateDetail, CalculateDetailOut, CalculateStatusType, CalculateFixDetail
};