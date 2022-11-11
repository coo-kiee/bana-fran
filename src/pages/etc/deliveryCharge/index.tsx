import React, { useState } from "react";
import { format, subMonths, lastDayOfMonth } from 'date-fns';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from 'react-query';

// component 
import SuspenseErrorPage from "pages/common/suspenseErrorPage";
import DeliveryChargeOverall from "./components/DeliveryChargeOverall";
import DeliveryChargeDetail from "./components/DeliveryChargeDetail";
import { OverallFallback, TableFallback } from "../component/EtcTableFallback";

// type
import { SearchInfoType, SearchInfoSelectType, TableHeadItemType } from "types/etc/etcType";

const DeliveryCharge = () => {
    const { reset } = useQueryErrorResetBoundary();

    // 상태 관련
    const [searchInfo, setSearchInfo] = useState<SearchInfoSelectType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM-01'),
        to: format(lastDayOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
        searchOption: [{ value: 'SEARCH_0', title: '구분 전체' }]
    }); // 실제 쿼리에서 사용될 날짜, 옵션값   

    // 상태 관련 함수
    const handleSearchInfo = (currentTempSearchInfo: SearchInfoType) => {
        setSearchInfo((prevSearchInfo) => ({ ...prevSearchInfo, ...currentTempSearchInfo }));
    }; // tempSearchInfo -> searchInfo로 업데이트 (-> 자동으로 refetch역할)

    // column 관련 데이터
    const tableColGroup = ['188', '*', '150', '150', '150'];
    const tableHead = ['기간', '품목', '수수료 공급가 (2%)', '부가세 (0.2%)', '수수료 합계 (2.2%)'];
    const detailPriceInfo = [
        ['주문금액', '배달비를 제외한 카드/현금/포인트/쿠폰 결제금액의 합계.'],
        ['수수료 공급가', '주문금액의 2% (부가세 별도.)']
    ];
    const detailTableColGroup = ['188', '*', '120', '120', '150', '190', '136', '150', '150', '150'];
    const detailTableHead: TableHeadItemType[][] = [
        [{ itemName: '결제일시', rowSpan: 2 }, { itemName: '메뉴', rowSpan: 2 }, { itemName: '주문금액', rowSpan: 2 }, { itemName: '배달비', rowSpan: 2 }, { itemName: '결제방식', rowSpan: 2 }, { itemName: '결제수단', rowSpan: 2 }, { itemName: '주문자', rowSpan: 2 }, { itemName: '바나 딜리버리 수수료', colSpan: 3, className: 'price-area' }],
        [{ itemName: '수수료 공급가 (2%)', className: "price-area" }, { itemName: '부가세 (0.2%)', className: "price-area" }, { itemName: '수수료 합계 (2.2%)', className: "price-area" },]
    ];

    return (
        <div id="tab1" className="tab-content active">
            <div className="info-wrap">
                <p>※ 바나 딜리버리 수수료 내역을 조회할 수 있습니다. <strong>(가상계좌 자동 차감되므로 정산내역에는 반영되지 않습니다.)</strong></p>
            </div>

            <div className="board-date-wrap">
                <React.Suspense fallback={<OverallFallback tableColGroup={tableColGroup} tableHead={tableHead} />}>
                    <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} />} >
                        {/* *_total 프로시저 사용 컴포넌트 */}
                        <DeliveryChargeOverall tableColGroup={tableColGroup} tableHead={tableHead} />
                    </ErrorBoundary>
                </React.Suspense>

                <React.Suspense fallback={<TableFallback detailTableColGroup={detailTableColGroup} detailPriceInfo={detailPriceInfo} detailTableHead={detailTableHead} />}>
                    <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} />} >
                        {/* *_list 프로시저 사용하는 컴포넌트 */}
                        <DeliveryChargeDetail searchInfo={searchInfo} detailPriceInfo={detailPriceInfo} handleSearchInfo={handleSearchInfo} detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
                    </ErrorBoundary>
                </React.Suspense>
            </div>
        </div>
    )
}

export default DeliveryCharge;
