// type
interface SearchInfoType {
    from: string,
    to: string,
}; // 검색 날짜만 필요한 경우
interface SearchInfoSelectType extends SearchInfoType {
    searchOption: { value: string | number, title: string }[], // Select
} // 검색 날짜 + 추가 옵션으로 Select 사용하는 경우
interface SearchInfoRadioType extends SearchInfoType {
    searchType: string,
} // 검색 날짜 + 추가 옵션으로 radio 사용하는 경우

interface SearchOptionType {
    type: number,
    title: string,
}
interface PageInfoType {
    currentPage: number,
    row: number,
}
interface PopupOrderDetailType {
    show: boolean,
    data: any[],
}
interface TableHeadItemType {
    itemName: string, // th 이름 ... '기간'
    rowSpan?: number, // rowSpan 
    colSpan?: number, // colSpan
    className?: string, // className 필요한 경우 사용
}

// 쿼리 결과값 관련 type
interface TotalResultType {
    [key: string]: number;
}

// param
interface EtcTotalParams {
    fran_store: number,
}
interface EtcListParams {
    fran_store: number,
    from_date: string,
    to_date: string
}

// props 
interface OrderDetailProps {
    setPopupOrderDetail: React.Dispatch<React.SetStateAction<PopupOrderDetailType>>
}

interface EtcOrderDetailProps {
    popupOrderDetail: PopupOrderDetailType,
    setPopupOrderDetail: React.Dispatch<React.SetStateAction<PopupOrderDetailType>>
}

// Overall props
interface OverallFallbackProps {
    tableHead: string[],
    tableColGroup: string[],
}
interface DeliveryChargeOverallProps extends OverallFallbackProps {
}
interface MusicChargeOverallProps extends OverallFallbackProps {
}

// Detail props
interface DetailFallbackProps {
    detailPriceInfo: string[][],
    detailTableColGroup: string[],
    detailTableHead: TableHeadItemType[][],
}

interface DeliveryChargeDetailProps extends DetailFallbackProps {
    searchInfo: SearchInfoSelectType,
    detailPriceInfo: string[][],
    handleSearchInfo: (currentTempSearchInfo: SearchInfoType) => void,
}
interface MusicChargeDetailProps extends DetailFallbackProps {
    searchInfo: SearchInfoType,
    detailPriceInfo: string[][],
    handleSearchInfo: (currentTempSearchInfo: SearchInfoType) => void,
}

/* Type Check */
const isSelect = (target: any): target is SearchInfoSelectType => {
    return 'searchOption' in target ? true : false;
}

const isRadio = (target: any): target is SearchInfoRadioType => {
    return 'searchType' in target ? true : false;
}

// etc페이지 탭 관련 
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
    TOTAL: 0, // '구분 전체'
    CARD: 1, // '현장 카드'
    CASH: 2, // '현장 현금'
    APP: 3, // '어플선결제'
}

const ETC_DELIVERY_SEARCH_OPTION_LIST = [
    [
        ETC_DELIVERY_SEARCH_OPTION_TYPE.TOTAL,
        ETC_DELIVERY_SEARCH_OPTION_TYPE.CARD,
        ETC_DELIVERY_SEARCH_OPTION_TYPE.CASH,
        ETC_DELIVERY_SEARCH_OPTION_TYPE.APP,
    ]
];

export type {
    SearchInfoType, SearchOptionType, PageInfoType, PopupOrderDetailType, TableHeadItemType, SearchInfoSelectType, SearchInfoRadioType,
    TotalResultType,
    EtcTotalParams, EtcListParams,
    OverallFallbackProps, OrderDetailProps, EtcOrderDetailProps, DeliveryChargeOverallProps, DetailFallbackProps, DeliveryChargeDetailProps,
    MusicChargeOverallProps, MusicChargeDetailProps
};
export {
    ETC_TAB_TYPE, ETC_TAB_LIST, ETC_DELIVERY_SEARCH_OPTION_TYPE, ETC_DELIVERY_SEARCH_OPTION_LIST,
    isSelect, isRadio,
};