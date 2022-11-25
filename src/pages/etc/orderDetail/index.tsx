import React, { FC, Fragment, ReactNode, useEffect, useMemo, useState } from 'react';
import { format, subDays, subMonths } from 'date-fns';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from 'react-query';

// type
import { EtcListParams, ETC_TAB_TYPE, SearchInfoType } from "types/etc/etcType";

// component 
import OrderDetailDetail from './OrderDetailDetail';
import CalanderSearch from 'pages/common/calanderSearch';
import { EtcDetailTableFallback } from '../component/EtcDetailTableHeader';
import EtcTotalTable from '../component/EtcTotalTable';

const OrderDetail = () => {
    console.log(`OrderDetail`)
    const { reset } = useQueryErrorResetBoundary();

    // TODO: 상태 관련
    const [searchInfo, setSearchInfo] = useState<SearchInfoType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM-dd'),
        to: format(new Date(), 'yyyy-MM-dd')
    }); // etcSearch 내부 검색 날짜 

    // 상태 관련 함수
    const handleSearchInfo = (currentTempSearchInfo: SearchInfoType) => {
        setSearchInfo((prevSearchInfo) => ({ ...prevSearchInfo, ...currentTempSearchInfo }));
    }; // tempSearchInfo -> searchInfo로 업데이트 (-> 자동으로 refetch역할)

    // TODO: EtcDetailTable 관련 데이터  
    const detailTableColGroup = ['170', '170', '170', '84', '104', '84', '98', '98', '*', '150'];
    const detailTableHead = [
        [{ itemName: '일시' }, { itemName: '최종수정일', }, { itemName: '취소일' }, { itemName: '접수자' }, { itemName: '최종수정자' }, { itemName: '취소자' }, { itemName: '상태' }, { itemName: '발주 건 수' }, { itemName: '품목 상세' }, { itemName: '발주 금액' }]
    ];

    console.log("INDEX RENDER!") // 1번 찍힘
    return (
        <div className="board-date-wrap">
            <EtcTotalTable currTab={ETC_TAB_TYPE.ORDER} />
            <OrderDetailDetailSearch handleSearchInfo={handleSearchInfo} />

            <React.Suspense fallback={<EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} type={`LOADING`} />}>
                <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} type={`ERROR`} resetErrorBoundary={resetErrorBoundary} />} >
                    <OrderDetailDetail searchInfo={searchInfo} handleSearchInfo={handleSearchInfo} detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
                    {/* <Test searchInfo={searchInfo} /> */}
                </ErrorBoundary>
            </React.Suspense>
        </div>
    )
}

export default OrderDetail;

const OrderDetailDetailSearch: FC<{ handleSearchInfo: (currentTempSearchInfo: SearchInfoType) => void }> = ({ handleSearchInfo }) => {
    const [tempSearchInfo, setTempSearchInfo] = useState<SearchInfoType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM-dd'), // 2022-10-18
        to: format(new Date(), 'yyyy-MM-dd') // 2022-11-18
    }); // etcSearch 내부 검색 날짜 관련 보여질 state 

    return (
        <CalanderSearch
            title={`상세내역`}
            dateType={'yyyy-MM-dd'}
            searchInfo={tempSearchInfo}
            setSearchInfo={setTempSearchInfo}
            handleSearch={() => handleSearchInfo(tempSearchInfo)} // 조회 버튼에 필요한 fn
        />
    )
}