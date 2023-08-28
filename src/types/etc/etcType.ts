// type
/**
 * 옵션 유형을 나타내는 열거형입니다.
 * @enum {string}
 */
enum OPTION_TYPE { 
    /**
     * 셀렉트 옵션 유형입니다.
     */
    SELECT = 'SELECT', 
    /**
     * 라디오 버튼 옵션 유형입니다.
     */
    RADIO = 'RADIO'
  }
/**
 * Suspense, ErrorBoundary 내 Fallback 유형을 나타내는 열거형입니다.
 * @enum {string}
 */
enum FALLBACK_TYPE {
  /**
   * 로딩 유형으로 <Suspense />의 Fallback으로 사용됨을 의미합니다.
   */
  LOADING = 'LOADING',
  /**
   * 오류 유형으로 <ErrorBoundary />의 Fallback으로 사용됨을 의미합니다.
   */
  ERROR = 'ERROR'
}
/**
 * 기타내역 내 상세내역 조회 시 필요한 시작, 끝 날짜와 조회 트리거를 포함하는 타입입니다.
 * @interface
 */
interface SearchInfoType {
    /**
     * 조회 시작 날짜입니다.
     * @type {string}
     */
    from: string,
    /**
     * 조회 종료 날짜입니다.
     * @type {string}
     */
    to: string,
    /**
     * 조회 트리거 여부를 나타냅니다. true 상태가 되면 조회를 요청합니다.
     * @type {boolean | undefined}
     */
    searchTrigger? : boolean,
};
/**
 * 기타내역 내 상세내역 조회 시 select 옵션을 사용하는 타입입니다.
 * 
 * 상세 타입은 {@link SearchInfoType}를 확인하세요.
 */
interface SearchInfoSelectType extends SearchInfoType {
    /**
     * 내역 조회 시 상세 옵션을 나타냅니다.
     * @type { value: string | number, title: string }[]
     */
    searchOption: { value: string | number, title: string }[], // Select
}
/**
 * 기타내역 내 상세내역 조회 시 radio 옵션을 사용하는 타입입니다.
 * 
 * 상세 타입은 {@link SearchInfoType}를 확인하세요.
 */
interface SearchInfoRadioType extends SearchInfoType {
    /**
     * 내역 조회 시 상세 옵션을 나타냅니다.
     * @type {string}
     */
    searchType: string,
}

/**
 * 페이지 정보를 나타내는 인터페이스입니다.
 * @interface
 */
interface PageInfoType {
    /**
     * 현재 페이지 번호입니다.
     * @type {number}
     */
    currentPage: number,
    /**
     * 한 페이지당 표시될 행(row) 수입니다.
     * @type {number}
     */
    row: number,
}

interface TableHeadItemType {
    itemName: string, // th 이름 ... '기간'
    rowSpan?: number, // rowSpan 
    colSpan?: number, // colSpan
    className?: string, // className 필요한 경우 사용
}

// 쿼리 결과값 관련 type 
interface DeliveryDetailListType{
    delivery_pay_type: string,
    dtRcp: string,
    nDeliveryCharge: number,
    payment_type: string,
    sItem: string,
    sPhone: string,
    suply_fee: number,
    suply_fee_tax: number,
    total_charge: number,
    total_fee: number
} // web_fran_s_etc_delivery_list 결과 타입
interface MusicChargeDetailType {
    state: string,
    std_date: string,
    suply_amount: number,
    tax_amount: number,
    total_amount: number
} // web_fran_s_etc_music_fee_list 결과 타입 (음악 서비스 이용료, 로열티에서 사용)
interface GiftCardDetailType {
    account_amt: number,
    gubun: string,
    item_amt: number,
    item_cnt: number,
    item_name: string,
    menu_Item: number,
    rcp_type: string,
    std_date: string
} // web_fran_s_etc_gift_cert_detail_list 결과 타입
interface OrderDetailListType {
    amount: number,
    cancel_staff: string,
    cancel_date: string,
    first_item: string,
    insert_date: string,
    last_modify_date: string,
    last_modify_staff: string,
    nOrderID: number,
    order_count: number,
    staff_name: string,
    state: number,
    state_name: string,
    supply_amt: number,
    vat_amt: number,
} // web_fran_s_etc_order_list 결과 타입
interface OrderDetailListExcelTotalType {
    [key: string]: OrderDetailListExcelType[]; // ex) 123456: [ { cancel_date: "", nOrderId: 123456, ... }, {...}, ... ]
}
interface OrderDetailListExcelType {
    cancel_date: string,
    cancel_staff: string,
    delivery_volume: string,
    delivery_unit: string,
    fran_price: number, 
    insert_date: string,
    last_modify_date: string,
    last_modify_staff: string,
    nEAPerPack: number,
    nOrderID: number,
    order_count: number,
    order_detail_cnt: number,
    sGroup: string,
    sItemShort: string,
    staff_name: string,
    state: number,
    state_name: string,
    supply_amt: number,
    total_amt: number,
    vat_amt: number,
} // web_fran_s_etc_order_list_excel
interface RoyaltyDetailListType {
    std_date: string,
    state: string,
    suply_amount: number,
    tax_amount: number,
    total_amount: number,
} // web_fran_s_etc_royalty_list 결과 타입 
interface VirtualAccListType {
    balance: number,
    deposit: number,
    division: string,
    log_date: string,
    etc: string
    state: string
} // web_fran_s_etc_balance_list 결과 타입
interface OrderDetailModalItemType {
    fOrderCount: number,
    fran_price: number,
    nEAPerPack: number,
    nItem: number,
    sDeliveryUnit: string,
    sEtc: number,
    sGroup: string,
    sItemShort: string,
    suply_amount: number,
    tax_amount: number,
    total_amount: number,
    volume: string
}// web_fran_s_etc_order_detail 결과 타입

// param
interface GiftCardListParams {
    f_code: number,
    from_date: string,
    to_date: string,
}

// Detail props
interface DetailFallbackProps { 
    detailTableColGroup: string[],
    detailTableHead: TableHeadItemType[][],
}  
interface DeliveryChargeDetailProps extends DetailFallbackProps {
    searchInfo: SearchInfoSelectType, 
    etcDeliveryListKey: string[],
    summaryInfo: string[][]
}
interface MusicChargeDetailProps extends DetailFallbackProps {
    searchInfo: SearchInfoType, 
    etcMusicListKey: string[],
    summaryInfo: string[][]
}
interface GiftcardDetailProps extends DetailFallbackProps {
    searchInfo: SearchInfoSelectType, 
    etcGiftcardListKey: string[],
    summaryInfo: string[][]
}
interface OrderDetailDetailProps extends DetailFallbackProps {
    searchInfo: SearchInfoSelectType, 
    etcOrderDetailListKey: string[],
    etcOrderDetailExcelListKey: string[],
    openOrderDetailModal: (nOrderID: number) => void,
}
interface RoyaltyDetailProps extends DetailFallbackProps { 
    searchInfo: SearchInfoType,
    etcRoyaltyListKey: string[],
    summaryInfo: string[][]
}
interface VirtualAccountDetailProps extends DetailFallbackProps {
    searchInfo: SearchInfoType,
    etcVirtualAccBalanceListKey: string[]
}

/* Type Check */ 
/**
 * 주어진 객체가 SearchInfoSelectType 유형인지 여부를 확인합니다.
 * 
 * 파라미터 타입은 {@link SearchInfoSelectType}을 참고하세요.
 * @param {any} target - 확인하려는 객체.
 * @returns {boolean} 주어진 객체가 SearchInfoSelectType 유형이면 true, 그렇지 않으면 false를 반환합니다.
 */
const isSelect = (target: any): target is SearchInfoSelectType => 'searchOption' in target ? true : false
/**
 * 주어진 객체가 SearchInfoRadioType 유형인지 여부를 확인합니다.
 * 
 * 파라미터 타입은 {@link SearchInfoRadioType}을 참고하세요.
 * @param {any} target - 확인하려는 객체.
 * @returns {boolean} 주어진 객체가 SearchInfoRadioType 유형이면 true, 그렇지 않으면 false를 반환합니다.
 */
const isRadio = (target: any): target is SearchInfoRadioType => 'searchType' in target ? true : false

/**
 * 기타내역 페이지에서 사용되는 탭, 페이지 유형을 정의하는 열거형입니다.
 * @enum {string}
 */
enum ETC_TAB_TYPE {
    /**
     * 바나 딜리버리 수수료
     */
    DELIVERY,
    /**
     * 음악 서비스 이용료
     */
    MUSIC,
    /**
     * 실물상품권 발주/판매
     */
    GIFTCARD,
    /**
     * 발주내역
     */
    ORDER,
    /**
     * 로열티
     */
    ROYALTY,
    /**
     * 가상계좌 충전/차감
     */
    ACCOUNT
}

/**
 * 기타내역 > 바나 딜리버리 수수료 페이지 상세내역 검색 시 사용하는 결제 방식 옵션입니다.
 */
enum ETC_DELIVERY_SEARCH_OPTION_TYPE {
  /**
   * 구분 전체
   */
  TOTAL = 'TOTAL',
  /**
   * 현장 카드
   */
  CARD = 'CARD',
  /**
   * 현장 현금
   */
  CASH = 'CASH',
  /**
   * 어플선결제
   */
  APP = 'APP'
}

/**
 * 기타내역 > 바나 딜리버리 수수료 페이지 상세내역 검색 시 사용하는 결제 방식 옵션입니다.
 * 
 * 각 옵션에 대해서는 {@link ETC_DELIVERY_SEARCH_OPTION_TYPE}를 참고하세요.
 */
const ETC_DELIVERY_SEARCH_OPTION_LIST = [
    ETC_DELIVERY_SEARCH_OPTION_TYPE.TOTAL,
    ETC_DELIVERY_SEARCH_OPTION_TYPE.CARD,
    ETC_DELIVERY_SEARCH_OPTION_TYPE.CASH,
    ETC_DELIVERY_SEARCH_OPTION_TYPE.APP,
];

/**
 * 기타내역 > 실물상품권 발주/판매 페이지 상세내역 검색 시 사용하는 포인트 옵션 유형 타입입니다.
 */
enum ETC_GIFTCARD_SEARCH_CATEGORY_TYPE {
    /**
     * 포인트 구분 전체
     */
    CATEGORY_ALL = 'CATEGORY_ALL',
    /**
     * 판매
     */
    SELL = 'SELL', 
    /**
     * 판매 취소(폐기)
     */
    SELL_DELETE = 'SELL_DELETE',  
    /**
     * 임의 추가
     */
    ADD = 'ADD', 
    /**
     * 임의 폐기
     */
    DELETE = 'DELETE',
    /**
     * N/A
     */
    ELSE = 'ELSE' 
};
/**
 * 기타내역 > 실물상품권 발주/판매 페이지 상세내역 검색 시 사용하는 상품권종 옵션 유형 타입입니다.
 */
enum ETC_GIFTCARD_SEARCH_CARD_TYPE {
    /**
     * 상품권종 전체
     */
    CARD_ALL = 'CARD_ALL', 
    /**
     * 1만원권
     */
    TEN = 'TEN', 
    /**
     * 3만원권
     */
    THIRTY = 'THIRTY', 
    /**
     * 5만원권
     */
    FIFTY = 'FIFTY' 
};
/**
 * 기타내역 > 실물상품권 발주/판매 페이지 상세내역 검색 시 사용하는 처리기기 옵션 유형 타입입니다.
 */
enum ETC_GIFTCARD_SEARCH_DEVICE_TYPE {
    /**
     * 처리기기 전체
     */
    DEVICE_ALL = 'DEVICE_ALL', 
    /**
     * 매장 앱
     */
    BRANCH_APP = 'BRANCH_APP', 
    /**
     * 어플
     */
    APP = 'APP',   
    /**
     * 키오스크
     */
    KIOSK = 'KIOSK', 
    /**
     * POS
     */
    POS = 'POS',  
    /**
     * N/A
     */
    ELSE = 'ELSE' 
}; 
 
/**
 * 기타내역 > 발주내역 페이지 상세내역 검색 시 사용하는 처리기기 옵션 유형 타입입니다.
 */
enum ETC_ORDER_SEARCH_STATE_TYPE {
    /**
     * 상태 전체
     */
    STATE_ALL = 'STATE_ALL',
    /**
     * 대기
     */
    AWAIT = 0,
    /**
     * 발주확인
     */
    CONFIRM = 10,
    /**
     * 패킹완료
     */
    PACKING = 20, 
    /**
     * 배송출발
     */
    DELIVERY = 30,
    /**
     * 일부배달완료
     */
    PARTIAL_COMPLETE = 35,
    /**
     * 배송완료
     */
    COMPLETE = 40,
    /**
     * 취소
     */
    CANCEL = 50,
}

/**
 * 기타내역 > 실물상품권 발주/판매 페이지 상세내역 검색 시 사용하는 포인트 옵션입니다.
 * 
 * 각 옵션에 대해서는 {@link ETC_GIFTCARD_SEARCH_CATEGORY_TYPE}를 참고하세요.
 */
const ETC_GIFTCARD_SEARCH_CATEGORY_LIST = [
    ETC_GIFTCARD_SEARCH_CATEGORY_TYPE.CATEGORY_ALL,
    ETC_GIFTCARD_SEARCH_CATEGORY_TYPE.SELL,
    ETC_GIFTCARD_SEARCH_CATEGORY_TYPE.SELL_DELETE,
    ETC_GIFTCARD_SEARCH_CATEGORY_TYPE.ADD,
    ETC_GIFTCARD_SEARCH_CATEGORY_TYPE.DELETE,
    ETC_GIFTCARD_SEARCH_CATEGORY_TYPE.ELSE,
]
/**
 * 기타내역 > 실물상품권 발주/판매 페이지 상세내역 검색 시 사용하는 상품권종 옵션입니다. 
 * 
 * 각 옵션에 대해서는 {@link ETC_GIFTCARD_SEARCH_CARD_LIST}를 참고하세요.
 */
const ETC_GIFTCARD_SEARCH_CARD_LIST = [
    ETC_GIFTCARD_SEARCH_CARD_TYPE.CARD_ALL,
    ETC_GIFTCARD_SEARCH_CARD_TYPE.TEN,
    ETC_GIFTCARD_SEARCH_CARD_TYPE.THIRTY,
    ETC_GIFTCARD_SEARCH_CARD_TYPE.FIFTY,
]
/**
 * 기타내역 > 실물상품권 발주/판매 페이지 상세내역 검색 시 사용하는 처리기기 옵션입니다. 
 * 
 * 각 옵션에 대해서는 {@link ETC_GIFTCARD_SEARCH_DEVICE_TYPE}를 참고하세요.
 */
const ETC_GIFTCARD_SEARCH_DEVICE_LIST = [
    ETC_GIFTCARD_SEARCH_DEVICE_TYPE.DEVICE_ALL,
    ETC_GIFTCARD_SEARCH_DEVICE_TYPE.BRANCH_APP,
    ETC_GIFTCARD_SEARCH_DEVICE_TYPE.APP,
    ETC_GIFTCARD_SEARCH_DEVICE_TYPE.KIOSK,
    ETC_GIFTCARD_SEARCH_DEVICE_TYPE.POS,
    ETC_GIFTCARD_SEARCH_DEVICE_TYPE.ELSE,
]
/**
 * 기타내역 > 발주내역 페이지 상세내역 검색 시 사용하는 처리 상태 옵션입니다. 
 * 
 * 각 옵션에 대해서는 {@link ETC_ORDER_SEARCH_STATE_TYPE}를 참고하세요.
 */
const ETC_ORDER_SEARCH_STATE_LIST = [
    ETC_ORDER_SEARCH_STATE_TYPE.STATE_ALL,
    ETC_ORDER_SEARCH_STATE_TYPE.AWAIT,
    ETC_ORDER_SEARCH_STATE_TYPE.CONFIRM,
    ETC_ORDER_SEARCH_STATE_TYPE.PACKING,
    ETC_ORDER_SEARCH_STATE_TYPE.DELIVERY,
    ETC_ORDER_SEARCH_STATE_TYPE.PARTIAL_COMPLETE,
    ETC_ORDER_SEARCH_STATE_TYPE.COMPLETE,
    ETC_ORDER_SEARCH_STATE_TYPE.CANCEL,
]

export type {
    SearchInfoType, PageInfoType, TableHeadItemType, SearchInfoSelectType, SearchInfoRadioType, GiftCardListParams,
    DeliveryDetailListType, MusicChargeDetailType, GiftCardDetailType, OrderDetailListType, OrderDetailListExcelTotalType, OrderDetailListExcelType, RoyaltyDetailListType, VirtualAccListType, OrderDetailModalItemType,
    DetailFallbackProps, DeliveryChargeDetailProps, GiftcardDetailProps, MusicChargeDetailProps, OrderDetailDetailProps, RoyaltyDetailProps, VirtualAccountDetailProps,
};
export {
    OPTION_TYPE, FALLBACK_TYPE, ETC_TAB_TYPE, 
    ETC_DELIVERY_SEARCH_OPTION_TYPE, ETC_DELIVERY_SEARCH_OPTION_LIST,
    ETC_GIFTCARD_SEARCH_CATEGORY_TYPE, ETC_GIFTCARD_SEARCH_CATEGORY_LIST, 
    ETC_GIFTCARD_SEARCH_CARD_TYPE, ETC_GIFTCARD_SEARCH_CARD_LIST, 
    ETC_GIFTCARD_SEARCH_DEVICE_TYPE, ETC_GIFTCARD_SEARCH_DEVICE_LIST, 
    ETC_ORDER_SEARCH_STATE_TYPE, ETC_ORDER_SEARCH_STATE_LIST,
    isSelect, isRadio,
};