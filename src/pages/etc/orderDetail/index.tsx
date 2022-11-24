import React, { FC, Fragment, ReactNode, useEffect, useMemo, useState } from 'react';
import { format, subMonths } from 'date-fns';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from 'react-query';

// type
import { EtcListParams, OrderDetailListType, PageInfoType, SearchInfoType } from "types/etc/etcType";

// component
import OrderDetailOverall from './component/OrderDetailOverall';
import OrderDetailDetail from './component/OrderDetailDetail';
import Loading from 'pages/common/loading';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';
import CalanderSearch from 'pages/common/calanderSearch';
import { EtcDetailTableFallback } from '../component/EtcDetailTableHeader';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { franState, loginState, orderDetailModalState } from 'state';
import ETC_SERVICE from 'service/etcService';
import Utils from 'utils/Utils';
import NoData from 'pages/common/noData';

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

    // TODO: EtcTable 관련 데이터 (프로시저 데이터 확인 후 수정하기)
    const colGroup = ['147', '147', '147', '147', '147', '147', '147', '147', '147', '147'];
    const thead = Array.from({ length: 10 }, (_, idx1) => idx1).map((el) => format(subMonths(new Date(), el), 'yyyy-MM')).reverse();

    // TODO: EtcDetailTable 관련 데이터  
    const detailTableColGroup = ['170', '170', '170', '84', '104', '84', '98', '98', '*', '150'];
    const detailTableHead = [
        [{ itemName: '일시' }, { itemName: '최종수정일', }, { itemName: '취소일' }, { itemName: '접수자' }, { itemName: '최종수정자' }, { itemName: '취소자' }, { itemName: '상태' }, { itemName: '발주 건 수' }, { itemName: '품목 상세' }, { itemName: '발주 금액' }]
    ];

    console.log("INDEX RENDER!")
    return (
        <div id="tab4" className="tab-content active">
            <div className="info-wrap">
                <p>※ 상세 발주 내역을 조회할 수 있습니다.<strong>(가상계좌 자동 차감되므로 정산내역에는 반영되지 않습니다.)</strong></p>
            </div>
            <div className="board-date-wrap">
                <p className="title bullet">월별 발주금액 통계</p>
                <table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
                    <colgroup>
                        {colGroup.map((col, idx) => <col key={`etc_table_colgroup_${idx}`} width={col} />)}
                    </colgroup>
                    <thead>
                        <tr>
                            {thead.map((head, idx) => <th key={`etc_table_thead_${idx}`}>{head}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        <React.Suspense fallback={<Loading width={50} height={50} isTable={true} />}>
                            <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} isTable={true} />}>
                                <OrderDetailOverall tableColGroup={colGroup} tableHead={thead} />
                            </ErrorBoundary>
                        </React.Suspense>
                    </tbody>
                </table>

                <OrderDetailDetailSearch handleSearchInfo={handleSearchInfo} />

                <React.Suspense fallback={<EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} type={`LOADING`} />}>
                    <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} type={`ERROR`} resetErrorBoundary={resetErrorBoundary} />} >
                        <OrderDetailDetail searchInfo={searchInfo} handleSearchInfo={handleSearchInfo} detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
                        {/* <Test searchInfo={searchInfo} /> */}
                    </ErrorBoundary>
                </React.Suspense>
            </div>
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