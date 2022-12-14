// type
interface SearchInfoType {
    from: string,
    to: string,
    searchTrigger? : boolean,
}; // 검색 날짜만 필요한 경우
interface SearchInfoSelectType extends SearchInfoType {
    searchOption: { value: string | number, title: string }[], // Select
} // 검색 날짜 + 추가 옵션으로 Select 사용하는 경우
interface SearchInfoRadioType extends SearchInfoType {
    searchType: string,
} // 검색 날짜 + 추가 옵션으로 radio 사용하는 경우

interface PageInfoType {
    currentPage: number,
    row: number,
} // pagenation으로 넘겨줄 state 타입

interface TableHeadItemType {
    itemName: string, // th 이름 ... '기간'
    rowSpan?: number, // rowSpan 
    colSpan?: number, // colSpan
    className?: string, // className 필요한 경우 사용
} // EtcDetailTable에 넘겨줄 데이터 타입

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
interface VirtualAccountTotalType {
    fran_name: string,
    balance: number,
    account: string,
    bank_code: string,
    total_charge: string,
    used_amount: string,
} // web_fran_s_etc_balance 결과 타입
interface VirtualAccListType {
    balance: number,
    deposit: number,
    division: string,
    log_date: string,
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
interface ChkGiftCardStockParams {
    f_code: number
}
interface GiftCardListParams {
    f_code: number,
    from_date: string,
    to_date: string,
} 
interface OrderDetailModalParams {
    order_code: number,
}

// Detail props
interface DetailFallbackProps { 
    detailTableColGroup: string[],
    detailTableHead: TableHeadItemType[][],
} 
interface DeliveryChargeDetailProps extends DetailFallbackProps {
    searchInfo: SearchInfoSelectType, 
}
interface MusicChargeDetailProps extends DetailFallbackProps {
    searchInfo: SearchInfoType, 
}
interface GiftcardDetailProps extends DetailFallbackProps {
    searchInfo: SearchInfoSelectType, 
}
interface OrderDetailDetailProps extends DetailFallbackProps {
    // searchInfo: SearchInfoType, 
    searchInfo: SearchInfoSelectType, 
}
interface RoyaltyDetailProps extends DetailFallbackProps { 
    searchInfo: SearchInfoType,
}
interface VirtualAccountDetailProps extends DetailFallbackProps {
    searchInfo: SearchInfoType,
}

/* Type Check */ 
const isSelect = (target: any): target is SearchInfoSelectType => {
    return 'searchOption' in target ? true : false;
}

const isRadio = (target: any): target is SearchInfoRadioType => {
    return 'searchType' in target ? true : false;
}

// etc 페이지 탭 관련 
const ETC_TAB_TYPE = {
    DELIVERY: 0, // 바나 딜리버리 수수료
    MUSIC: 1, // 음악 서비스 이용료
    GIFTCARD: 2, // 실물상품권 발주/판매
    ORDER: 3, // 발주내역
    ROYALTY: 4, // 로열티
    ACCOUNT: 5, // 가상계좌 충전/차감
}

const ETC_TAB_LIST = [
    ETC_TAB_TYPE.DELIVERY,
    ETC_TAB_TYPE.MUSIC,
    ETC_TAB_TYPE.GIFTCARD,
    ETC_TAB_TYPE.ORDER,
    ETC_TAB_TYPE.ROYALTY,
    ETC_TAB_TYPE.ACCOUNT,
] as const;

// etc 페이지 상세내역 검색 옵션 관련
const ETC_DELIVERY_SEARCH_OPTION_TYPE = {
    TOTAL: 'TOTAL', // '구분 전체'
    CARD: 'CARD', // '현장 카드'
    CASH: "CASH", // '현장 현금'
    APP: 'APP', // '어플선결제'
}

const ETC_DELIVERY_SEARCH_OPTION_LIST = [
    [
        ETC_DELIVERY_SEARCH_OPTION_TYPE.TOTAL,
        ETC_DELIVERY_SEARCH_OPTION_TYPE.CARD,
        ETC_DELIVERY_SEARCH_OPTION_TYPE.CASH,
        ETC_DELIVERY_SEARCH_OPTION_TYPE.APP,
    ]
];

// etc 페이지 실물상품권 판매 검색 옵션 관련
const ETC_GIFTCARD_SEARCH_CATEGORY_TYPE = {
    CATEGORY_ALL: 'CATEGORY_ALL', // 포인트 구분 전체
    SELL: 'SELL', // 판매
    SELL_DELETE: 'SELL_DELETE', // 판매 취소(폐기)
    ADD: 'ADD', // 임의 추가
    DELETE: 'DELETE', // 임의 폐기
    ELSE: 'ELSE' // N/A
}; // 구분 관련
const ETC_GIFTCARD_SEARCH_CARD_TYPE = {
    CARD_ALL: 'CARD_ALL', // 상품권종 전체
    TEN: 'TEN', // 1만원권
    THIRTY: 'THIRTY', // 3만원권
    FIFTY: 'FIFTY' // 5만원권
}; // 상품권종 관련
const ETC_GIFTCARD_SEARCH_DEVICE_TYPE = {
    DEVICE_ALL: 'DEVICE_ALL', // 처리기기 전체
    BRANCH_APP: 'BRANCH_APP', // 매장 앱
    APP: 'APP', // 어플
    KIOSK: 'KIOSK', // 키오스크
    POS: 'POS', // POS
    ELSE: 'ELSE' // N/A
}; // 처리기기 관련


// etc 페이지 발주내역 상태 검색 옵션 관련
const ETC_ORDER_SEARCH_STATE_TYPE = {
    STATE_ALL: 'STATE_ALL',
    AWAIT: 0,               // 대기
    CONFIRM: 10,            // 발주확인
    PACKING: 20,            // 패킹완료
    DELIVERY: 30,           // 배송출발
    PARTIAL_COMPLETE: 35,   // 일부배달완료
    COMPLETE: 40,           // 배송완료
    CANCEL: 50,             // 취소
}

const ETC_GIFTCARD_SEARCH_CATEGORY_LIST = [
    ETC_GIFTCARD_SEARCH_CATEGORY_TYPE.CATEGORY_ALL,
    ETC_GIFTCARD_SEARCH_CATEGORY_TYPE.SELL,
    ETC_GIFTCARD_SEARCH_CATEGORY_TYPE.SELL_DELETE,
    ETC_GIFTCARD_SEARCH_CATEGORY_TYPE.ADD,
    ETC_GIFTCARD_SEARCH_CATEGORY_TYPE.DELETE,
    ETC_GIFTCARD_SEARCH_CATEGORY_TYPE.ELSE,
]
const ETC_GIFTCARD_SEARCH_CARD_LIST = [
    ETC_GIFTCARD_SEARCH_CARD_TYPE.CARD_ALL,
    ETC_GIFTCARD_SEARCH_CARD_TYPE.TEN,
    ETC_GIFTCARD_SEARCH_CARD_TYPE.THIRTY,
    ETC_GIFTCARD_SEARCH_CARD_TYPE.FIFTY,
]
const ETC_GIFTCARD_SEARCH_DEVICE_LIST = [
    ETC_GIFTCARD_SEARCH_DEVICE_TYPE.DEVICE_ALL,
    ETC_GIFTCARD_SEARCH_DEVICE_TYPE.BRANCH_APP,
    ETC_GIFTCARD_SEARCH_DEVICE_TYPE.APP,
    ETC_GIFTCARD_SEARCH_DEVICE_TYPE.KIOSK,
    ETC_GIFTCARD_SEARCH_DEVICE_TYPE.POS,
    ETC_GIFTCARD_SEARCH_DEVICE_TYPE.ELSE,
]
const ETC_ORDER_SEARCH_STATE_LIST = [
    [
        ETC_ORDER_SEARCH_STATE_TYPE.STATE_ALL,
        ETC_ORDER_SEARCH_STATE_TYPE.AWAIT,
        ETC_ORDER_SEARCH_STATE_TYPE.CONFIRM,
        ETC_ORDER_SEARCH_STATE_TYPE.PACKING,
        ETC_ORDER_SEARCH_STATE_TYPE.DELIVERY,
        ETC_ORDER_SEARCH_STATE_TYPE.PARTIAL_COMPLETE,
        ETC_ORDER_SEARCH_STATE_TYPE.COMPLETE,
        ETC_ORDER_SEARCH_STATE_TYPE.CANCEL,
    ]
]
export type {
    SearchInfoType, PageInfoType, TableHeadItemType, SearchInfoSelectType, SearchInfoRadioType,
    DeliveryDetailListType, MusicChargeDetailType, GiftCardDetailType, OrderDetailListType, OrderDetailListExcelType, RoyaltyDetailListType, VirtualAccountTotalType, VirtualAccListType, OrderDetailModalItemType,
    ChkGiftCardStockParams, GiftCardListParams, OrderDetailModalParams,
    DetailFallbackProps, DeliveryChargeDetailProps, GiftcardDetailProps, MusicChargeDetailProps, OrderDetailDetailProps, RoyaltyDetailProps, VirtualAccountDetailProps,
};
export {
    ETC_TAB_TYPE, ETC_TAB_LIST, ETC_DELIVERY_SEARCH_OPTION_TYPE, ETC_DELIVERY_SEARCH_OPTION_LIST,
    ETC_GIFTCARD_SEARCH_CATEGORY_TYPE, ETC_GIFTCARD_SEARCH_CATEGORY_LIST, ETC_GIFTCARD_SEARCH_CARD_TYPE, ETC_GIFTCARD_SEARCH_CARD_LIST, ETC_GIFTCARD_SEARCH_DEVICE_TYPE, ETC_GIFTCARD_SEARCH_DEVICE_LIST, ETC_ORDER_SEARCH_STATE_TYPE, ETC_ORDER_SEARCH_STATE_LIST,
    isSelect, isRadio,
};