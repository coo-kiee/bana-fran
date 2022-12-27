import { FC, Suspense, useState, useRef, ReactNode, useMemo } from "react";
import { useRecoilValue } from "recoil";
import Utils from "utils/Utils";
import { useQueryClient, useQueryErrorResetBoundary } from "react-query";
import { format, subMonths } from 'date-fns';
import { ErrorBoundary } from 'react-error-boundary';

// state
import { franState, loginState } from "state";

// type
import { 
    PageInfoType, GiftcardDetailProps, SearchInfoSelectType, 
    ETC_GIFTCARD_SEARCH_CATEGORY_TYPE, ETC_GIFTCARD_SEARCH_CARD_TYPE, ETC_GIFTCARD_SEARCH_DEVICE_TYPE,
    ETC_GIFTCARD_SEARCH_CATEGORY_LIST, ETC_GIFTCARD_SEARCH_CARD_LIST, ETC_GIFTCARD_SEARCH_DEVICE_LIST 
} from "types/etc/etcType";

// API
import ETC_SERVICE from "service/etcService";

// component 
import EtcDetailTable, { EtcDetailTableFallback, EtcDetailTableHead } from "pages/etc/component/EtcDetailTable";  
import EtcDetailTableBottom from "../component/EtcDetailTableBottom"; 
import Sticky from "pages/common/sticky";
import CalanderSearch from "pages/common/calanderSearch"; 
import EtcDetailSummary from "../component/EtcDetailSummary";

const GiftCardDetail: FC<Omit<GiftcardDetailProps, 'searchInfo' | 'etcGiftcardListKey'>> = ( props ) => {
    const { reset } = useQueryErrorResetBoundary();
    const queryClient = useQueryClient();
    const franCode = useRecoilValue(franState);

    // state
    const [searchInfo, setSearchInfo] = useState<SearchInfoSelectType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM'), // 2022-10 
        to: format(new Date(), 'yyyy-MM'), // 2022-10 
        searchTrigger: false,
        searchOption: [
            { value: 'CATEGORY_ALL', title: '포인트 구분 전체' },
            { value: 'CARD_ALL', title: '상품권종 전체' },
            { value: 'DEVICE_ALL', title: '처리기기 전체' },
        ],
    }); 

    // eslint-disable-next-line
    const etcGiftcardListKey = useMemo(() => ['etc_gift_card_list', JSON.stringify({ franCode, from: searchInfo.from, to: searchInfo.to }) ], [franCode, searchInfo.searchTrigger]);

    // 검색 기능
    const handleRefetch = () => {
        queryClient.removeQueries({ queryKey:etcGiftcardListKey, exact: true }); // 쿼리 제거 
        setSearchInfo((prev) => ({...prev, searchTrigger: !prev.searchTrigger })); // =refetch
    };

    // fallback props 정리
    const defaultFallbackProps = { 
        searchDate: `${searchInfo.from} ~ ${searchInfo.to}`,
        summaryResult: [
            ['키오스크/POS 판매금액 합계', '0'],
            ['어플 판매금액 합계', '0'],
            ['판매취소(폐기)금액 합계', '0']
        ], 
        ...props
    }
    const loadingFallbackProps = { ...defaultFallbackProps, fallbackType: 'LOADING' }
    const errorFallbackProps = { ...defaultFallbackProps, fallbackType: 'ERROR' }

    return (
        <>
            <CalanderSearch
                title={`상세내역`}
                dateType={'yyyy-MM'}
                searchInfo={searchInfo}
                setSearchInfo={setSearchInfo}
                selectOption={searchOptionList}
                optionList={[ETC_GIFTCARD_SEARCH_CATEGORY_LIST, ETC_GIFTCARD_SEARCH_CARD_LIST, ETC_GIFTCARD_SEARCH_DEVICE_LIST]}
                handleSearch={handleRefetch}
                showMonthYearPicker={true}
            />

            <Suspense fallback={<EtcDetailTableFallback {...loadingFallbackProps} />}>
                <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <EtcDetailTableFallback {...errorFallbackProps} resetErrorBoundary={resetErrorBoundary} />} >
                    <GiftCardDetailData {...props} searchInfo={searchInfo} etcGiftcardListKey={etcGiftcardListKey} />
                </ErrorBoundary>
            </Suspense>
        </>
    )
}

export default GiftCardDetail

const GiftCardDetailData: FC<Omit<GiftcardDetailProps, 'handleSearchInfo'>> = ({ detailTableHead, detailTableColGroup, etcGiftcardListKey, summaryInfo, searchInfo: {from, to, searchOption} }) => {
    const franCode = useRecoilValue(franState);
    const { userInfo: { f_list } } = useRecoilValue(loginState);

    // 상태 
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 20, // 한 페이지에 나오는 리스트 개수 
    });
    const tableRef = useRef<HTMLTableElement>(null); 
    const thRef = useRef<HTMLTableRowElement>(null);

    // TODO: 데이터 
    const { data: listData } = ETC_SERVICE.useGiftCardList(etcGiftcardListKey, [ franCode, from, to ]);
    // etc_gift_card_list
    const [renderTableList, summaryResult]: [ReactNode[] | undefined, string[][]] = useMemo(() => { 
        const tableList = listData?.reduce((arr: ReactNode[], tbodyRow) => {
            const { account_amt, gubun, item_amt, item_cnt, item_name, menu_Item, rcp_type, std_date} = tbodyRow; 

            const pointType = searchOption[0].value === ETC_GIFTCARD_SEARCH_CATEGORY_TYPE.CATEGORY_ALL ?  
                true : searchOption[0].value === gubun; // 포인트 구분 필터
            const cardType = searchOption[1].value === ETC_GIFTCARD_SEARCH_CARD_TYPE.CARD_ALL ?
                true : Number(searchOption[1].value) === menu_Item; // 상품권종 관련 필터
            const deviceType = searchOption[2].value === ETC_GIFTCARD_SEARCH_DEVICE_TYPE.DEVICE_ALL ? 
                true : searchOption[2].value === rcp_type; // 처리기기 관련 필터

            if( pointType && cardType && deviceType ){
                arr.push(
                    <>
                        <td className="align-center">{std_date}</td>
                        <td className={`align-center ${gubun.includes('임의') ? 'negative-value' : ''}`}>{gubun}</td>
                        <td className="align-center">{item_name}</td>
                        <td className="align-center">{Utils.numberComma(item_cnt)}장 ({Utils.numberComma(item_amt)})</td>
                        <td className="align-center">{rcp_type}</td>
                        <td className={`align-center ${account_amt < 0 ? 'negative-value' : ''}`}>{Utils.numberComma(account_amt)}</td>
                    </>
                )
            }
            return arr;
        }, [] as ReactNode[]);

        const summaryResult = [
            ['키오스크/POS 판매금액 합계', Utils.numberComma(listData?.filter((el:any) => (el.rcp_type === '키오스크' || el.rcp_type === 'POS') && (el.gubun === '판매')).reduce((acc: any, cur:any) => acc += cur.item_amt,0) || 0)], // 키오스크/POS 판매금액 합계
            ['어플 판매금액 합계', Utils.numberComma(listData?.filter((el:any) => el.rcp_type === '어플' && el.gubun === '판매').reduce((acc: any, cur:any) => acc += cur.item_amt, 0) || 0)], // 어플 판매금액 합계
            ['판매취소(폐기)금액 합계', Utils.numberComma(listData?.filter((el:any) => el.gubun === '판매취소(폐기)').reduce((acc: any, cur:any) => acc += cur.item_amt ,0) || 0)] // 판매취소(폐기)금액 합계
        ]

        setPageInfo((tempPageInfo) => ({...tempPageInfo, currentPage: 1})) // 검색 or 필터링 한 경우 1페이지로 이동
        return [tableList, summaryResult];
    }, [listData, searchOption ])

    // TODO: 엑셀, 페이지네이션 관련
    const handleExcelDownload = () => {
        const branchName = f_list.filter((el) => el.f_code === franCode)[0].f_code_name;
        if (tableRef.current) {
            const options = {
                type: 'table',
                sheetOption: { origin: "B3" }, // 해당 셀부터 데이터 표시, default - A1, 필수 X
                colspan: detailTableColGroup.map(wpx => (wpx !== '*' ? { wpx } : { wpx: 400 })), // 셀 너비 설정, 필수 X
                // rowspan: [], // 픽셀단위:hpx, 셀 높이 설정, 필수 X 
                sheetName: '', // 시트이름, 필수 X
                addRowColor: { row: [1], color: ['d3d3d3'] },
            };
            const fileName = `${from}~${to}_${branchName}_상품권내역`;
            Utils.excelDownload(tableRef.current, options, fileName);
        };
    }; 

    return (
        <> 
            <EtcDetailSummary searchDate={`${from} ~ ${to}`} summaryResult={summaryResult} summaryInfo={summaryInfo} />

            <Sticky reference={thRef.current} contentsRef={tableRef.current}> 
                <EtcDetailTableHead detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
            </Sticky>
            <table className="board-wrap" cellPadding="0" cellSpacing="0" ref={tableRef}>
                <EtcDetailTableHead detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} ref={thRef} />
                <EtcDetailTable tbodyData={renderTableList} pageInfo={pageInfo} />
            </table>
            {!!renderTableList && renderTableList!.length > 0 && <EtcDetailTableBottom handleExcelDownload={handleExcelDownload} dataCnt={renderTableList.length} pageInfo={pageInfo} setPageInfo={setPageInfo} />}
        </>
    )
}

const searchOptionList = [
    {
        [ETC_GIFTCARD_SEARCH_CATEGORY_TYPE.CATEGORY_ALL]: { title: '포인트 구분 전체', value: 'CATEGORY_ALL' },
        [ETC_GIFTCARD_SEARCH_CATEGORY_TYPE.SELL]: { title: '판매', value: '판매' },
        [ETC_GIFTCARD_SEARCH_CATEGORY_TYPE.SELL_DELETE]: { title: '판매 취소(폐기)', value: '판매 취소(폐기)' },
        [ETC_GIFTCARD_SEARCH_CATEGORY_TYPE.ADD]: { title: '임의추가', value: '임의추가' },    
        [ETC_GIFTCARD_SEARCH_CATEGORY_TYPE.DELETE]: { title: '임의폐기', value: '임의폐기' },
        [ETC_GIFTCARD_SEARCH_CATEGORY_TYPE.ELSE]: { title: 'N/A', value: 'N/A' },
    },
    {
        [ETC_GIFTCARD_SEARCH_CARD_TYPE.CARD_ALL]: { title: '상품권종 전체', value: 'CARD_ALL' },
        [ETC_GIFTCARD_SEARCH_CARD_TYPE.TEN]: { title: '1만원권', value: 510 },
        [ETC_GIFTCARD_SEARCH_CARD_TYPE.THIRTY]: { title: '3만원권', value: 511 },
        [ETC_GIFTCARD_SEARCH_CARD_TYPE.FIFTY]: { title: '5만원권', value: 512 },
    },
    {
        [ETC_GIFTCARD_SEARCH_DEVICE_TYPE.DEVICE_ALL]: { title: '처리기기 전체', value: 'DEVICE_ALL' },
        [ETC_GIFTCARD_SEARCH_DEVICE_TYPE.BRANCH_APP]: { title: '매장앱', value: '매장앱' },
        [ETC_GIFTCARD_SEARCH_DEVICE_TYPE.APP]: { title: '어플', value: '어플' },
        [ETC_GIFTCARD_SEARCH_DEVICE_TYPE.KIOSK]: { title: '키오스크', value: '키오스크' },
        [ETC_GIFTCARD_SEARCH_DEVICE_TYPE.POS]: { title: 'POS', value: 'POS' },
        [ETC_GIFTCARD_SEARCH_DEVICE_TYPE.ELSE]: {title: 'N/A', value: 'N/A'}
    },
]; 