// type
interface SearchInfoType {
    from: string,
    to: string,
    searchOption?: string[],
}
interface PageInfoType {
    currentPage: number,
    row: number,
}
interface PopupOrderDetailType {
    show: boolean,
    data: any[],
}
// param

// props 
interface OrderDetailProps {
    setPopupOrderDetail: React.Dispatch<React.SetStateAction<PopupOrderDetailType>>
}

interface EtcOrderDetailProps {
    popupOrderDetail: PopupOrderDetailType,
    setPopupOrderDetail: React.Dispatch<React.SetStateAction<PopupOrderDetailType>>
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

export type { SearchInfoType, PageInfoType, PopupOrderDetailType, OrderDetailProps, EtcOrderDetailProps };
export { ETC_TAB_TYPE, ETC_TAB_LIST };