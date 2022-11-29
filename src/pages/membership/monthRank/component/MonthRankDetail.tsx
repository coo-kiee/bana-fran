import React, { FC, useState, useRef, useMemo, ReactNode } from "react";
import { useQueryErrorResetBoundary } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { format, isAfter, lastDayOfMonth, subMonths } from "date-fns"; 
import { useRecoilValue } from "recoil";

// type
import { EtcListParams, SearchInfoType, PageInfoType } from "types/etc/etcType";
import { MonthRankDetailProps, MonthRankDetailDataProps } from "types/membership/monthRankType";

// component
import CalanderSearch from "pages/common/calanderSearch";
import Sticky from "pages/common/sticky";
import { EtcDetailTableHead, EtcDetailTableFallback, EtcDetailTable} from "pages/etc/component/EtcDetailTable";  

// service
import MEMBERSHIP_SERVICE from "service/membershipService";

// state
import { franState, loginState } from "state";
import Utils from "utils/Utils";
import Pagination from "pages/common/pagination";

const MonthRankDetail: FC<MonthRankDetailProps> = ({ detailTableColGroup, detailTableHead }) => {
    const { reset } = useQueryErrorResetBoundary();
    const [searchInfo, setSearchInfo] = useState<SearchInfoType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM'), // 2022-10 
        to: format(new Date(), 'yyyy-MM'), // 2022-11
    }); // 실제 쿼리에서 사용될 날짜, 옵션값

    // 상태 관련 함수
    const handleSearchInfo = (currentTempSearchInfo: SearchInfoType) => {
        setSearchInfo((prevSearchInfo) => ({ ...prevSearchInfo, ...currentTempSearchInfo }));
    }; // tempSearchInfo -> searchInfo로 업데이트 (-> 자동으로 refetch역할)

    return (
        <>
            <MonthRankDetailSearch handleSearchInfo={handleSearchInfo} />

            <React.Suspense fallback={<EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} type={`LOADING`} />}>
                <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} type={`ERROR`} resetErrorBoundary={resetErrorBoundary} />} >
                    <MonthRankDetailData searchInfo={searchInfo} detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
                </ErrorBoundary>
            </React.Suspense>
        </>
    )
}

export default MonthRankDetail;

const MonthRankDetailData: FC<MonthRankDetailDataProps> = ({ searchInfo, detailTableColGroup, detailTableHead }) => {
    const franCode = useRecoilValue(franState);
    const { userInfo: { f_list } } = useRecoilValue(loginState);

    // TODO: state
    const tableRef = useRef<null | HTMLTableElement>(null);
    const thRef = useRef<HTMLTableRowElement>(null);

    // const [showSticky, setShowSticky] = useState<boolean>(false); // sticky header display
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 3, // 한 페이지에 나오는 리스트 개수 
    }) // etcDetailFooter 관련 내용

    // TODO: 프로시저 
    const rankListParams: EtcListParams = {
        fran_store: franCode,
        from_date: searchInfo.from + '-01',
        to_date: isAfter(lastDayOfMonth(new Date(searchInfo.to)), new Date()) ? format(new Date(), 'yyyy-MM-dd') : format(lastDayOfMonth(new Date(searchInfo.to)), 'yyyy-MM-dd')
    };
    const { data } = MEMBERSHIP_SERVICE.useRankList(rankListParams);
    const renderTableList = useMemo(() => {
        return data?.reduce((arr: any, tbodyRow: any, index: number) => {
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
            const fileName = `${searchInfo.from}~${searchInfo.to}_${f_list[0].f_code_name}_월간랭킹현황`;
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
            <Sticky reference={thRef.current}>
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
                <Pagination dataCnt={renderTableList?.length || 0} pageInfo={pageInfo} handlePageChange={handlePageChange} handlePageRow={handlePageRow} />
            </div>
        </>
    )
}

const MonthRankDetailSearch: FC<{ handleSearchInfo: (currentTempSearchInfo: SearchInfoType) => void }> = ({ handleSearchInfo }) => {
    // state
    const [tempSearchInfo, setTempSearchInfo] = useState<SearchInfoType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM'), // 2022-10 
        to: format(new Date(), 'yyyy-MM'), // 2022-11  
    }); // 실제 쿼리에서 사용될 날짜, 옵션값

    return (
        <CalanderSearch
            title={`보상 지급 내역`}
            dateType={'yyyy-MM'}
            searchInfo={tempSearchInfo}
            setSearchInfo={setTempSearchInfo}
            handleSearch={() => handleSearchInfo(tempSearchInfo)} // 조회 버튼에 필요한 fn
            showMonthYearPicker={true}
        />
    )
}