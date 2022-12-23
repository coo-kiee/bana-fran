import { FC, useState, useRef, useMemo, ReactNode, Suspense } from "react";
import { useRecoilValue } from "recoil";
import { useQueryClient, useQueryErrorResetBoundary } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';
import Utils from "utils/Utils";
import { format, lastDayOfMonth, subMonths } from "date-fns";

// state
import { franState, loginState } from "state";

// type
import { PageInfoType, DeliveryChargeDetailProps, ETC_DELIVERY_SEARCH_OPTION_TYPE, DeliveryDetailListType, SearchInfoSelectType, ETC_DELIVERY_SEARCH_OPTION_LIST } from "types/etc/etcType";

// API
import ETC_SERVICE from 'service/etcService';

// component   
import EtcDetailTable, { EtcDetailTableHead, EtcDetailTableFallback } from "pages/etc/component/EtcDetailTable";  
import EtcDetailTableBottom from "../component/EtcDetailTableBottom"; 
import EtcDetailSummary from "../component/EtcDetailSummary"; 
import Sticky from "pages/common/sticky";  
import CalanderSearch from "pages/common/calanderSearch"; 

const DeliveryChargeDetail: FC<Omit<DeliveryChargeDetailProps, 'searchInfo' | 'setSearchInfo' | 'etcDeliveryListKey'>> = (props) => {
    const { reset } = useQueryErrorResetBoundary();
    const queryClient = useQueryClient();
    const franCode = useRecoilValue(franState);

    // state
    const [searchInfo, setSearchInfo] = useState<SearchInfoSelectType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM-01'),
        to: format(lastDayOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
        searchOption: [{ value: 'TOTAL', title: '구분 전체' }],
        searchTrigger: false,
    }); 

    // key
    // eslint-disable-next-line
    const etcDeliveryListKey = useMemo(() => ['etc_delivery_list', JSON.stringify({ franCode, from: searchInfo.from, to: searchInfo.to }) ], [franCode, searchInfo.searchTrigger]);
    
    // 검색
    const handleRefetch = () => {
        queryClient.removeQueries({ queryKey:etcDeliveryListKey, exact: true }); // 쿼리 제거 
        setSearchInfo((prev) => ({...prev, searchTrigger: !prev.searchTrigger })); // =refetch
    };

    // fallback props 정리
    const defaultFallbackProps = { 
        searchDate: `${searchInfo.from} ~ ${searchInfo.to}`,
        summaryResult: [
            ['바나 딜리버리 주문금액 합계', '0' ], // 바나 딜리버리 주문금액 합계
            ['바나 딜리버리 수수료 공급가(주문금액*2%) 합계', '0'], // 바나 딜리버리 수수료 공급가(주문금액*2%) 합계
            ['바나 딜리버리 수수료(수수료 공급가+부가세) 합계', '0'], // 바나 딜리버리 수수료(수수료 공급가+부가세) 합계
        ], 
        ...props
    }
    const loadingFallbackProps = { ...defaultFallbackProps, fallbackType: 'LOADING' }
    const errorFallbackProps = { ...defaultFallbackProps, fallbackType: 'ERROR' }

    return (
        <>
            <CalanderSearch
                title={`상세내역`}
                dateType={'yyyy-MM-dd'}
                searchInfo={searchInfo}
                setSearchInfo={setSearchInfo}
                selectOption={searchOptionList}
                optionList={ETC_DELIVERY_SEARCH_OPTION_LIST}
                handleSearch={handleRefetch}
            />

            <Suspense fallback={<EtcDetailTableFallback {...loadingFallbackProps} />}>
                <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <EtcDetailTableFallback {...errorFallbackProps} resetErrorBoundary={resetErrorBoundary} />} >
                    <DeliveryChargeDetailData searchInfo={searchInfo} etcDeliveryListKey={etcDeliveryListKey} {...props} /> 
                </ErrorBoundary>
            </Suspense>
        </>
    )
}

export default DeliveryChargeDetail; 

const DeliveryChargeDetailData: FC<DeliveryChargeDetailProps> = ({ detailTableColGroup, detailTableHead, summaryInfo, etcDeliveryListKey, searchInfo: { from, to, searchOption } }) => {
    const franCode = useRecoilValue(franState);
    const { userInfo: { f_list } } = useRecoilValue(loginState); 

    // TODO: 상태
    const tableRef = useRef<HTMLTableElement>(null);
    const thRef = useRef<HTMLTableRowElement>(null); 
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지 tempSearchInfo
        row: 20, // 한 페이지에 나오는 리스트 개수 
    }) // etcDetailFooter 관련 내용 

    // TODO: 데이터  
    const { data: listData } = ETC_SERVICE.useEtcList<DeliveryDetailListType[]>('YOCYKBCBC6MTUH9AXBM7', etcDeliveryListKey, [franCode, from, to] );
    const [renderTableList, summaryResult ]: [ReactNode[] | undefined, string[][]] = useMemo(() => {
        const tableList = listData?.reduce((arr: ReactNode[], tbodyRow, index: number) => {
            const { delivery_pay_type, dtRcp, nDeliveryCharge, payment_type, sItem, sPhone, suply_fee, suply_fee_tax, total_charge, total_fee} = tbodyRow;
            const paymentType = searchOption[0].value === ETC_DELIVERY_SEARCH_OPTION_TYPE.TOTAL ? true : searchOption[0].title === delivery_pay_type;

            if(paymentType){
                arr.push(
                    <>
                        <td className="align-center">{dtRcp}</td>
                        <td className="align-left">{sItem}</td>
                        <td className="align-right">{Utils.numberComma(total_charge)}</td>
                        <td className="align-right">{Utils.numberComma(nDeliveryCharge)}</td>
                        <td className="align-center">{payment_type}</td>
                        <td className="align-center">{delivery_pay_type}</td>
                        <td className="align-center">{Utils.phoneNumberEncryption(sPhone)}</td>
                        <td className="align-right">{Utils.numberComma(suply_fee)}</td>
                        <td className="align-right">{Utils.numberComma(suply_fee_tax)}</td>
                        <td className="align-right"><strong>{Utils.numberComma(total_fee)}</strong></td>
                    </>
                )
            }
            return arr;
        }, [] as ReactNode[]);

        const summaryResult = [
            ['바나 딜리버리 주문금액 합계', Utils.numberComma(listData?.reduce((acc: any, cur: any) => acc += cur.total_charge, 0) || 0) ], // 바나 딜리버리 주문금액 합계
            ['바나 딜리버리 수수료 공급가(주문금액*2%) 합계', Utils.numberComma(listData?.reduce((acc: any, cur: any) => acc += cur.suply_fee, 0) || 0)], // 바나 딜리버리 수수료 공급가(주문금액*2%) 합계
            ['바나 딜리버리 수수료(수수료 공급가+부가세) 합계', Utils.numberComma(listData?.reduce((acc: any, cur: any) => acc += (cur.suply_fee + cur.suply_fee_tax), 0) || 0)], // 바나 딜리버리 수수료(수수료 공급가+부가세) 합계
        ]
        setPageInfo((tempPageInfo) => ({...tempPageInfo, currentPage: 1})) // 검색 or 필터링 한 경우 1페이지로 이동

        return [tableList, summaryResult];
    }, [listData, searchOption]) 

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
                addRowColor: { row: [1, 2], color: ['d3d3d3', 'd3d3d3'] }, //  { row: [1, 2], color: ['3a3a4d', '3a3a4d'] }
            };
            const fileName = `${from}~${to}_${branchName}_딜리버리수수료내역`;
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
            {!!renderTableList && renderTableList!.length > 0 && <EtcDetailTableBottom handleExcelDownload={handleExcelDownload} dataCnt={!!renderTableList ? renderTableList?.length : 0} pageInfo={pageInfo} setPageInfo={setPageInfo} />}
        </>
    )
};

const searchOptionList = [
    {
        [ETC_DELIVERY_SEARCH_OPTION_TYPE.TOTAL]: { title: '구분 전체', value: 'TOTAL' },
        [ETC_DELIVERY_SEARCH_OPTION_TYPE.CARD]: { title: '현장카드', value: 'CARD' },
        [ETC_DELIVERY_SEARCH_OPTION_TYPE.CASH]: { title: '현장현금', value: 'CASH' },
        [ETC_DELIVERY_SEARCH_OPTION_TYPE.APP]: { title: '어플선결제', value: 'APP' },
    }
];