// type
interface SearchDateType {
    from: string,
    to: string,
}
interface PageInfoType {
    currentPage: number,
    row: number,
}

// param

// props
interface TabComponentsProps {
    pageInfo: PageInfoType,
    searchDate: SearchDateType,
    setPageInfo: React.Dispatch<React.SetStateAction<PageInfoType>>,
    setSearchDate: React.Dispatch<React.SetStateAction<SearchDateType>>,
    handleExcelPrint: () => void;
}

// interface TabItemProps extends Omit<TabComponentsProps, 'setPageInfo'> {
//     handlePageInfo: (target: { [key in keyof PageInfoType]?: PageInfoType[key] }) => void;
// }

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

export type { SearchDateType, PageInfoType, TabComponentsProps };
export { ETC_TAB_TYPE, ETC_TAB_LIST };