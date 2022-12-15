import React, { FC, useState, useRef, useMemo, ReactNode, Suspense, useEffect } from "react";
import { useQueryErrorResetBoundary } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { format, isAfter, lastDayOfMonth, subMonths } from "date-fns"; 
import { useRecoilValue } from "recoil";
import Utils from "utils/Utils";

// type
import { SearchInfoType, PageInfoType } from "types/etc/etcType";
import { MonthRankDetailProps, MonthRankDetailDataProps } from "types/membership/monthRankType";

// component
import CalanderSearch from "pages/common/calanderSearch";
import Sticky from "pages/common/sticky";
import EtcDetailTable, { EtcDetailTableHead} from "pages/etc/component/EtcDetailTable";
import Pagination from "pages/common/pagination";
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
    }); // 실제 쿼리에서 사용될 날짜, 옵션값 

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
    const { data, refetch } = MEMBERSHIP_SERVICE.useRankList(rankListKey, [ franCode, from, to ]);
    useEffect(() => {
        refetch();
    }, [searchTrigger])

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

    // TODO: 엑셀, 페이지네이션 관련
    const handleExcelDownload = () => {
        if (tableRef.current) {
            const options = {
                type: 'table',
                sheetOption: { origin: "B3" }, // 해당 셀부터 데이터 표시, default - A1, 필수 X
                colspan: detailTableColGroup.map(wpx => (wpx !== '*' ? { wpx } : { wpx: 400 })), // 셀 너비 설정, 필수 X
                // rowspan: [], // 픽셀단위:hpx, 셀 높이 설정, 필수 X 
                sheetName: '', // 시트이름, 필수 X
                addRowColor: { row: [1], color: ['d3d3d3'] }, //  { row: [1, 2], color: ['3a3a4d', '3a3a4d'] }
            };
            const fileName = `${from}~${to}_${f_list[0].f_code_name}_월간랭킹현황`;
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
            <Sticky reference={thRef.current} contentsRef={tableRef.current}>
                <EtcDetailTableHead detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
            </Sticky>

            <table className="board-wrap board-top" cellPadding="0" cellSpacing="0" ref={tableRef}>
                <EtcDetailTableHead detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} ref={thRef} />
                <EtcDetailTable tbodyData={renderTableList} pageInfo={pageInfo} />  
            </table>
            
            <div className="result-function-wrap">
                <div className="function">
                    <button className="goast-btn" onClick={handleExcelDownload}>엑셀다운</button>
                </div>
                <Pagination dataCnt={!!renderTableList ? renderTableList?.length : 0} pageInfo={pageInfo} handlePageChange={handlePageChange} handlePageRow={handlePageRow} />
            </div>
        </>
    )
}

const MonthRankDetailSearch: FC<{searchInfo:SearchInfoType, setSearchInfo: React.Dispatch<React.SetStateAction<SearchInfoType>> }> = ({ searchInfo, setSearchInfo }) => {
    const handleRefetch = () => {
        setSearchInfo((prev) => ({...prev, searchTrigger: !prev.searchTrigger }));
    };
    
    return (
        <CalanderSearch
            title={`보상 지급 내역`}
            dateType={'yyyy-MM'}
            searchInfo={searchInfo}
            setSearchInfo={setSearchInfo}
            handleSearch={handleRefetch} // 조회 버튼에 필요한 fn
            showMonthYearPicker={true}
        />
    )
}