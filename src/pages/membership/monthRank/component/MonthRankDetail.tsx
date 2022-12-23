import { FC, useState, useRef, useMemo, ReactNode, Suspense } from "react";
import { useQueryClient, useQueryErrorResetBoundary } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { format, subMonths } from "date-fns"; 
import { useRecoilValue } from "recoil";
import Utils from "utils/Utils";

// type
import { SearchInfoType, PageInfoType } from "types/etc/etcType";
import { MonthRankDetailProps } from "types/membership/monthRankType";

// component
import CalanderSearch from "pages/common/calanderSearch";
import Sticky from "pages/common/sticky";
import EtcDetailTable, { EtcDetailTableFallback, EtcDetailTableHead } from "pages/etc/component/EtcDetailTable"; 
import EtcDetailTableBottom from "pages/etc/component/EtcDetailTableBottom"; 

// service
import MEMBERSHIP_SERVICE from "service/membershipService";

// state
import { franState, loginState } from "state";

const MonthRankDetail: FC<Omit<MonthRankDetailProps, 'searchInfo' | 'rankListKey'>> = ( props ) => {
    const { reset } = useQueryErrorResetBoundary();
    const queryClient = useQueryClient();
    const franCode = useRecoilValue(franState);

    // state
    const [searchInfo, setSearchInfo] = useState<SearchInfoType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM'), // 2022-10 
        to: format(new Date(), 'yyyy-MM'), // 2022-11
        searchTrigger: false,
    });

    // key
    // eslint-disable-next-line
    const rankListKey = useMemo(() => ['membership_rank_list', JSON.stringify({ franCode, from: searchInfo.from, to: searchInfo.to }) ], [franCode, searchInfo.searchTrigger]);

    // 검색
    const handleRefetch = () => {
        queryClient.removeQueries({ queryKey:rankListKey, exact: true }); // 쿼리 제거 
        setSearchInfo((prev) => ({...prev, searchTrigger: !prev.searchTrigger })); // =refetch
    };

    // fallback props 정리 
    const loadingFallbackProps = { ...props, fallbackType: 'LOADING' }
    const errorFallbackProps = { ...props, fallbackType: 'ERROR' }

    return (
        <>
            <CalanderSearch
                title={`보상 지급 내역`}
                dateType={'yyyy-MM'}
                searchInfo={searchInfo}
                setSearchInfo={setSearchInfo}
                handleSearch={handleRefetch}
                showMonthYearPicker={true}
            />

            <Suspense fallback={<EtcDetailTableFallback {...loadingFallbackProps} />}>
                <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <EtcDetailTableFallback {...errorFallbackProps} resetErrorBoundary={resetErrorBoundary} />}>
                    <MonthRankDetailData searchInfo={searchInfo} rankListKey={rankListKey} {...props} />
                </ErrorBoundary>
            </Suspense>
        </>
    )
}

export default MonthRankDetail;

const MonthRankDetailData: FC<MonthRankDetailProps> = ({ searchInfo: { from, to }, rankListKey, detailTableColGroup, detailTableHead }) => {
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
    const { data } = MEMBERSHIP_SERVICE.useRankList(rankListKey, [ franCode, from, to ]);

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
                {/* {monthRankDetailTablebody} */}
                <EtcDetailTable tbodyData={renderTableList} pageInfo={pageInfo} />
            </table>
            
            {!!renderTableList && renderTableList!.length > 0 && <EtcDetailTableBottom handleExcelDownload={handleExcelDownload} dataCnt={!!renderTableList ? renderTableList?.length : 0} pageInfo={pageInfo} setPageInfo={setPageInfo} />}
        </>
    )
}