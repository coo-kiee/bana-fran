import React, { FC, useState, useRef } from "react";
import { useQueryErrorResetBoundary } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { format, subMonths } from "date-fns";
import Utils from "utils/Utils";
import { useRecoilValue } from "recoil";

// type
import { EtcListParams, SearchInfoType, PageInfoType } from "types/etc/etcType";
import { MonthRankDetailProps, MonthRankDetailDataProps } from "types/membership/monthRankType";

// component
import CalanderSearch from "pages/common/calanderSearch";
import Sticky from "pages/common/sticky";
import { EtcDetailTableHead, EtcDetailTableFallback, EtcDetailTableErrorFallback } from "pages/etc/component/EtcDetailTable";
import EtcDetailFooter from "pages/etc/component/EtcDetailFooter";

// service
import MEMBERSHIP_SERVICE from "service/membershipService";

// state
import { franState } from "state";

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

            <React.Suspense fallback={<EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} />}>
                <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <EtcDetailTableErrorFallback colSpan={detailTableHead.length} colGroup={detailTableColGroup} theadData={detailTableHead} resetErrorBoundary={resetErrorBoundary} />} >
                    <MonthRankDetailData searchInfo={searchInfo} detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
                </ErrorBoundary>
            </React.Suspense>
        </>
    )
}

export default MonthRankDetail;

const MonthRankDetailData: FC<MonthRankDetailDataProps> = ({ searchInfo, detailTableColGroup, detailTableHead }) => {
    const franCode = useRecoilValue(franState);

    // TODO: state
    const tableRef = useRef<null | HTMLTableElement>(null);
    const thRef = useRef<HTMLTableRowElement>(null);

    // const [showSticky, setShowSticky] = useState<boolean>(false); // sticky header display
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 3, // 한 페이지에 나오는 리스트 개수 
    }) // etcDetailFooter 관련 내용

    // TODO: 프로시저
    let rankListData: any = [];
    const rankListParams: EtcListParams = { fran_store: franCode, from_date: searchInfo.from + '-01', to_date: searchInfo.to + '-01' };
    const { data, isSuccess } = MEMBERSHIP_SERVICE.useRankList(rankListParams);
    if (isSuccess) {
        rankListData = data;
        // TODO: data에 빈배열 들어오는 경우 처리 
        // TODO: 업데이트 처리 해주기
    }

    // TODO: 엑셀 다운로드
    const handleExcelPrint = () => {
        if (tableRef.current) {
            const options = {
                type: 'table',
                sheetOption: { origin: "B3" }, // 해당 셀부터 데이터 표시, default - A1, 필수 X
                colspan: detailTableColGroup.map(wpx => (wpx !== '*' ? { wpx } : { wpx: 400 })), // 셀 너비 설정, 필수 X
                // rowspan: [], // 픽셀단위:hpx, 셀 높이 설정, 필수 X 
                sheetName: `${searchInfo.from}~${searchInfo.to}`, // 시트이름, 필수 X
                addRowColor: { row: [1, 2], color: ['d3d3d3', 'd3d3d3'] }, //  { row: [1, 2], color: ['3a3a4d', '3a3a4d'] }
            };

            try {
                Utils.excelDownload(tableRef.current, options, '바나 딜리버리 수수료');
            }
            catch (error) {
                console.log(error);
            }
        };
    };

    return (
        <>
            <Sticky reference={thRef.current}>
                <EtcDetailTableHead detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
            </Sticky>

            <table className="board-wrap board-top" cellPadding="0" cellSpacing="0" ref={tableRef}>
                <EtcDetailTableHead detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} ref={thRef} />
                <tbody>
                    {
                        rankListData.map((data: any, idx: number) => {
                            if (
                                (idx < (pageInfo.currentPage - 1) * pageInfo.row) || // 현재 페이지 이전에 있는 데이터
                                (idx >= (pageInfo.currentPage * pageInfo.row)) // 현재 페이지 이후에 있는 데이터
                            ) {
                                return null;
                            } else {
                                const [rewardType, rewardAmount] = data.gift.split(' ');
                                return (
                                    <tr key={`month_rank_row_item_${idx}`}>
                                        <td>{data.sDate}</td>
                                        <td>{data.sName}</td>
                                        <td>{data.nRank}</td>
                                        <td>{data.sPhone || '번호 정보 없음'} <span>({data.nickname || '-'})</span></td>
                                        <td>{rewardType}<p>{rewardAmount}</p></td>
                                    </tr>
                                )
                            }
                        })
                    }
                </tbody>
            </table>
            <EtcDetailFooter excelFn={handleExcelPrint} dataCnt={rankListData.length || 0} pageInfo={pageInfo} pageFn={setPageInfo} />
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
            dateType={'yyyy-MM-dd'}
            searchInfo={tempSearchInfo}
            setSearchInfo={setTempSearchInfo}
            handleSearch={() => handleSearchInfo(tempSearchInfo)} // 조회 버튼에 필요한 fn
            showMonthYearPicker={true}
        />
    )
}