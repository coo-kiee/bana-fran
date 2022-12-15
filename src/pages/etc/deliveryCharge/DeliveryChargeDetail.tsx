import { FC, useState, useRef, useMemo, ReactNode, Suspense, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useQueryErrorResetBoundary } from 'react-query';
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
import EtcDetailTable, { EtcDetailTableHead } from "pages/etc/component/EtcDetailTable";  
import Pagination from "pages/common/pagination"; 
import Sticky from "pages/common/sticky";  
import CalanderSearch from "pages/common/calanderSearch";
import Loading from "pages/common/loading";
import SuspenseErrorPage from "pages/common/suspenseErrorPage";

const DeliveryChargeDetail: FC<Omit<DeliveryChargeDetailProps, 'searchInfo' | 'setSearchInfo'>> = ({ detailTableColGroup, detailTableHead }) => {
    const { reset } = useQueryErrorResetBoundary();
    const [searchInfo, setSearchInfo] = useState<SearchInfoSelectType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM-01'),
        to: format(lastDayOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
        searchOption: [{ value: 'TOTAL', title: '구분 전체' }],
        searchTrigger: false,
    }); // 실제 쿼리에서 사용될 날짜, 옵션값

    return (
        <>
            <DeliveryChargeDetailSearch searchInfo={searchInfo} setSearchInfo={setSearchInfo}/> 

            <Suspense fallback={<Loading marginTop={120} />}>
                <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} />} >
                    <DeliveryChargeDetailData 
                        searchInfo={searchInfo} 
                        detailTableColGroup={detailTableColGroup}
                        detailTableHead={detailTableHead}
                    />
                </ErrorBoundary>
            </Suspense>
        </>
    )
}

export default DeliveryChargeDetail; 

const DeliveryChargeDetailData: FC<DeliveryChargeDetailProps> = ({ detailTableColGroup, detailTableHead, searchInfo: { from, to, searchOption, searchTrigger} }) => {
    const franCode = useRecoilValue(franState);
    const { userInfo: { f_list } } = useRecoilValue(loginState);

    // TODO: 상태
    const tableRef = useRef<HTMLTableElement>(null);
    const thRef = useRef<HTMLTableRowElement>(null); 
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지tempSearchInfo
        row: 20, // 한 페이지에 나오는 리스트 개수 
    }) // etcDetailFooter 관련 내용 

    // TODO: 데이터 
    // eslint-disable-next-line
    const etcDeliveryListKey = useMemo(() => ['etc_delivery_list', JSON.stringify({ franCode, from, to }) ], [franCode, searchTrigger]);
    const { data: listData, refetch } = ETC_SERVICE.useEtcList<DeliveryDetailListType[]>('YOCYKBCBC6MTUH9AXBM7', etcDeliveryListKey, [franCode, from, to] );
    useEffect(() => {
        refetch();
    }, [searchTrigger, refetch])
    const [renderTableList, totalCharge, supplyTotal, taxTotal]: [ReactNode[] | undefined, number, number, number] = useMemo(() => {
        const tableList = listData?.reduce((arr: ReactNode[], tbodyRow, index: number) => {
            const { delivery_pay_type, dtRcp, nDeliveryCharge, payment_type, sItem, sPhone, suply_fee, suply_fee_tax, total_charge, total_fee} = tbodyRow;

            // option filter
            const paymentType = searchOption[0].value === ETC_DELIVERY_SEARCH_OPTION_TYPE.TOTAL ? true : searchOption[0].title === delivery_pay_type;

            if(paymentType){
                arr.push(
                    <>
                        <td className="align-center">{format(new Date(dtRcp), `yyyy-MM-dd hh:mm`)}</td>
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

        const totalCharge = listData?.reduce((acc: any, cur: any) => acc += cur.total_charge, 0) || 0; // 바나 딜리버리 주문금액 합계
        const supplyTotal = listData?.reduce((acc: any, cur: any) => acc += cur.suply_fee, 0) || 0; // 바나 딜리버스 수수료 공급가(주문금액*2%) 합계
        const taxTotal = listData?.reduce((acc: any, cur: any) => acc += (cur.suply_fee + cur.suply_fee_tax), 0) || 0; // 바나 딜리버리 수수료(수수료 공급가+부가세) 합계
        
        setPageInfo((tempPageInfo) => ({...tempPageInfo, currentPage: 1})) // 검색 or 필터링 한 경우 1페이지로 이동

        return [tableList, totalCharge, supplyTotal, taxTotal];
    }, [listData, searchOption]) 

    // TODO: 엑셀, 페이지네이션 관련
    const handleExcelDownload = () => {
        if (tableRef.current) {
            const options = {
                type: 'table',
                sheetOption: { origin: "B3" }, // 해당 셀부터 데이터 표시, default - A1, 필수 X
                colspan: detailTableColGroup.map(wpx => (wpx !== '*' ? { wpx } : { wpx: 400 })), // 셀 너비 설정, 필수 X
                // rowspan: [], // 픽셀단위:hpx, 셀 높이 설정, 필수 X 
                sheetName: '', // 시트이름, 필수 X
                addRowColor: { row: [1, 2], color: ['d3d3d3', 'd3d3d3'] }, //  { row: [1, 2], color: ['3a3a4d', '3a3a4d'] }
            };
            const fileName = `${from}~${to}_${f_list[0].f_code_name}_딜리버리수수료내역`;
            Utils.excelDownload(tableRef.current, options, fileName);
        };
    };
    const handlePageChange = (changePage: number) => {
        setPageInfo((prevPageInfo) => ({ ...prevPageInfo, currentPage: changePage }))
    }
    const handlePageRow = (row: number) => {
        setPageInfo((prevPageInfo) => ({ ...prevPageInfo, row: row }))
    }

    return (
        <> 
            <div className="search-result-wrap">
                <div className="search-date">
                    <p>조회기간: {from} ~ {to}</p>
                </div>
                <ul className="search-result"> 
                    <li className="hyphen">바나 딜리버리 주문금액 합계<span className="colon"></span><span className="value">{Utils.numberComma(totalCharge)}원</span></li>
                    <li className="hyphen">바나 딜리버스 수수료 공급가(주문금액*2%) 합계<span className="colon"></span><span className="value">{Utils.numberComma(supplyTotal)}원</span></li>
                    <li className="hyphen">바나 딜리버리 수수료(수수료 공급가+부가세) 합계<span className="colon"></span><span className="value">{Utils.numberComma(taxTotal)}원</span></li>
                </ul>
                <div className="price-info">
                    <p className="hyphen"><span>주문금액</span><span className="colon"></span>배달비를 제외한 카드/현금/포인트/쿠폰 결제금액의 합계.</p>
                    <p className="hyphen"><span>수수료 공급가</span><span className="colon"></span>주문금액의 2% (부가세 별도.)</p>
                </div>
            </div>

            <Sticky reference={thRef.current} contentsRef={tableRef.current}> 
                <EtcDetailTableHead detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
            </Sticky>
            <table className="board-wrap" cellPadding="0" cellSpacing="0" ref={tableRef}> 
                <EtcDetailTableHead detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} ref={thRef} />
                <EtcDetailTable tbodyData={renderTableList} pageInfo={pageInfo} /> 
            </table>

            <div className="result-function-wrap">
                <div className="function">
                    <button className="goast-btn" onClick={handleExcelDownload}>엑셀다운</button>
                </div>
                <Pagination dataCnt={!!renderTableList ? renderTableList.length : 0} pageInfo={pageInfo} handlePageChange={handlePageChange} handlePageRow={handlePageRow} />
            </div>
        </>
    )
};

const DeliveryChargeDetailSearch: FC<{searchInfo:SearchInfoSelectType, setSearchInfo: React.Dispatch<React.SetStateAction<SearchInfoSelectType>> }> = ({ searchInfo, setSearchInfo }) => { 
    const searchOptionList = [
        {
            [ETC_DELIVERY_SEARCH_OPTION_TYPE.TOTAL]: { title: '구분 전체', value: 'TOTAL' },
            [ETC_DELIVERY_SEARCH_OPTION_TYPE.CARD]: { title: '현장카드', value: 'CARD' },
            [ETC_DELIVERY_SEARCH_OPTION_TYPE.CASH]: { title: '현장현금', value: 'CASH' },
            [ETC_DELIVERY_SEARCH_OPTION_TYPE.APP]: { title: '어플선결제', value: 'APP' },
        }
    ];
    const handleRefetch = () => {
        setSearchInfo((prev) => ({...prev, searchTrigger: !prev.searchTrigger }));
    };

    return (
        // 검색 -> 관련 X 
        <CalanderSearch
            title={`상세내역`}
            dateType={'yyyy-MM-dd'}
            searchInfo={searchInfo}
            setSearchInfo={setSearchInfo}
            selectOption={searchOptionList}
            optionList={ETC_DELIVERY_SEARCH_OPTION_LIST}
            handleSearch={handleRefetch} // 조회 버튼에 필요한 fn
        />
    )
}