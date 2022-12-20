import React, { FC, useState, useRef, useMemo, ReactNode, Suspense, useEffect } from "react";
import { useQueryErrorResetBoundary } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { format, subMonths } from "date-fns"; 
import { useRecoilValue } from "recoil";
import Utils from "utils/Utils";

// type
import { SearchInfoType, PageInfoType } from "types/etc/etcType";
import { MonthRankDetailProps, MonthRankDetailDataProps } from "types/membership/monthRankType";

// component
import CalanderSearch from "pages/common/calanderSearch";
import Sticky from "pages/common/sticky";
import EtcDetailTable, { EtcDetailTableHead } from "pages/etc/component/EtcDetailTable"; 
import EtcDetailTableBottom from "pages/etc/component/EtcDetailTableBottom";
import Loading from "pages/common/loading";
import SuspenseErrorPage from "pages/common/suspenseErrorPage";

// service
import MEMBERSHIP_SERVICE from "service/membershipService";

// state
import { franState, loginState } from "state";

const MonthRankDetail: FC<MonthRankDetailProps> = ({ detailTableColGroup, detailTableHead }) => {
    const { reset } = useQueryErrorResetBoundary();
    const [searchInfo, setSearchInfo] = useState<SearchInfoType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM'), // 2022-10 
        to: format(new Date(), 'yyyy-MM'), // 2022-11
        searchTrigger: false,
    });

    return (
        <>
            <MonthRankDetailSearch searchInfo={searchInfo} setSearchInfo={setSearchInfo} />

            <Suspense fallback={<Loading marginTop={120} />}>
                <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} />} >
                    <MonthRankDetailData searchInfo={searchInfo} detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
                </ErrorBoundary>
            </Suspense>
        </>
    )
}

export default MonthRankDetail;

const MonthRankDetailData: FC<MonthRankDetailDataProps> = ({ searchInfo: { from, to, searchTrigger }, detailTableColGroup, detailTableHead }) => {
    const franCode = useRecoilValue(franState);
    const { userInfo: { f_list } } = useRecoilValue(loginState);

    // TODO: 상태
    const tableRef = useRef<null | HTMLTableElement>(null);
    const thRef = useRef<HTMLTableRowElement>(null);
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 20, // 한 페이지에 나오는 리스트 개수 
    });

    // TODO: 데이터 
    // eslint-disable-next-line
    const rankListKey = useMemo(() => ['membership_rank_list', JSON.stringify({ franCode, from, to }) ], [franCode, searchTrigger]);
    const { data, isSuccess, isLoading, isRefetching, isError, refetch } = MEMBERSHIP_SERVICE.useRankList(rankListKey, [ franCode, from, to ]);
    useEffect(() => {
        refetch();
    }, [franCode, searchTrigger, refetch])

    const renderTableList = useMemo(() => {
        return data?.reduce((arr: ReactNode[], tbodyRow) => {
            const { sDate, sName, nRank, sPhone, nickname } = tbodyRow;
            const [rewardType, rewardAmount] = tbodyRow.gift.split(' ');

            arr.push(
                <>
                    <td>{sDate}</td>
                    <td>{sName}</td>
                    <td>{nRank}</td>
                    <td>{sPhone || '번호 정보 없음'} <span>({nickname || '-'})</span></td>
                    <td>{rewardType}<p>{rewardAmount}</p></td>
                </>
            )
            return arr;
        }, [] as ReactNode[]);
    }, [data]);

    const monthRankDetailTablebody = useMemo(() => { 
        const isTableSuccess = isSuccess && !isLoading && !isRefetching; // 모두 성공 + refetch나 loading 안하고 있을때 
        const isTableLoading = isLoading || isRefetching ; // 처음으로 요청 || refetch 하는 경우 

        if( isTableSuccess ) {
            return <EtcDetailTable tbodyData={renderTableList} pageInfo={pageInfo} />
        } else if( isError ) {
            return <tbody><SuspenseErrorPage isTable={true} /></tbody>
        } else if( isTableLoading ){
            return <tbody><Loading isTable={true} /></tbody>
        } 
    }, [isSuccess, isLoading, isRefetching, isError, pageInfo, renderTableList]);

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
                addRowColor: { row: [1], color: ['d3d3d3'] }, //  { row: [1, 2], color: ['3a3a4d', '3a3a4d'] }
            };
            const fileName = `${from}~${to}_${branchName}_월간랭킹현황`;
            Utils.excelDownload(tableRef.current, options, fileName);
        };
    }; 

    return (
        <>
            <Sticky reference={thRef.current} contentsRef={tableRef.current}>
                <EtcDetailTableHead detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
            </Sticky>

            <table className="board-wrap board-top" cellPadding="0" cellSpacing="0" ref={tableRef}>
                <EtcDetailTableHead detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} ref={thRef} />
                {monthRankDetailTablebody}
            </table>
            
            {!!renderTableList && renderTableList!.length > 0 && <EtcDetailTableBottom handleExcelDownload={handleExcelDownload} dataCnt={!!renderTableList ? renderTableList?.length : 0} pageInfo={pageInfo} setPageInfo={setPageInfo} />}
        </>
    )
}

const MonthRankDetailSearch: FC<{ searchInfo:SearchInfoType, setSearchInfo: React.Dispatch<React.SetStateAction<SearchInfoType>> }> = ({ searchInfo, setSearchInfo }) => {
    const handleRefetch = () => {
        setSearchInfo((prev) => ({...prev, searchTrigger: !prev.searchTrigger }));
    };
    
    return (
        <CalanderSearch
            title={`보상 지급 내역`}
            dateType={'yyyy-MM'}
            searchInfo={searchInfo}
            setSearchInfo={setSearchInfo}
            handleSearch={handleRefetch}
            showMonthYearPicker={true}
        />
    )
}