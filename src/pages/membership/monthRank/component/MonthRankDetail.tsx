import React, { FC, useState, useRef } from "react";
import { useQueryErrorResetBoundary } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { format, subMonths } from "date-fns";
import Utils from "utils/Utils";
import { useRecoilValue } from "recoil";

// type
import { EtcListParams, SearchInfoType, TableHeadItemType, PageInfoType } from "types/etc/etcType";
import { MonthRankDetailProps } from "types/membership/monthRankType";

// component
import CalanderSearch from "pages/common/calanderSearch";
import { EtcDetailTableFallback, EtcDetailTableErrorFallback } from "pages/etc/component/EtcDetailTable";
import EtcDetailFooter from "pages/etc/component/EtcDetailFooter";

// service
import MEMBERSHIP_SERVICE from "service/membershipService";

// state
import { franState } from "state";

const MonthRankDetail: FC<MonthRankDetailProps> = ({ searchInfo, handleSearchInfo, detailTableColGroup, detailTableHead }) => {
    const { reset } = useQueryErrorResetBoundary();

    return (
        <>
            <MonthRankDetailSearch handleSearchInfo={handleSearchInfo} />

            <React.Suspense fallback={<EtcDetailTableFallback colSpan={detailTableHead.length} colGroup={detailTableColGroup} theadData={detailTableHead} />}>
                <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <EtcDetailTableErrorFallback colSpan={detailTableHead.length} colGroup={detailTableColGroup} theadData={detailTableHead} resetErrorBoundary={resetErrorBoundary} />} >
                    <MonthRankDetailData searchInfo={searchInfo} detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
                </ErrorBoundary>
            </React.Suspense>
        </>
    )
}

export default MonthRankDetail;

interface MonthRankDetailDataProps {
    searchInfo: SearchInfoType,
    detailTableColGroup: string[],
    detailTableHead: TableHeadItemType[][],
}
const MonthRankDetailData: FC<MonthRankDetailDataProps> = ({ searchInfo, detailTableColGroup, detailTableHead }) => {
    const franCode = useRecoilValue(franState);

    // TODO: state
    const tableRef = useRef<null | HTMLTableElement>(null);
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 3, // 한 페이지에 나오는 리스트 개수 
    }) // etcDetailFooter 관련 내용

    // TODO: 프로시저
    const rankListParams: EtcListParams = { fran_store: franCode, from_date: searchInfo.from, to_date: searchInfo.to };
    const { data, isSuccess } = MEMBERSHIP_SERVICE.useRankList(rankListParams);
    if (isSuccess) {
        // console.log(data);
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
            <table className="board-wrap board-top" cellPadding="0" cellSpacing="0" ref={tableRef}>
                <colgroup>
                    {detailTableColGroup.map((el, idx) => <col key={`month_rank_col_item_${idx}`} width={el} />)}
                </colgroup>
                <thead>
                    {detailTableHead.map((trData, idx1) => {
                        return (
                            <tr key={`extra_overall_table_row_${idx1}`}>
                                {trData.map((tdData, idx2) => {
                                    return (
                                        <th key={`extra_overall_table_row_item_${idx2}`} rowSpan={tdData.rowSpan || undefined} colSpan={tdData.colSpan || undefined} className={tdData.className || ''}>
                                            {tdData.itemName}
                                        </th>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </thead>
                <tbody>
                    <tr>
                        <td>2022-04</td>
                        <td>충무로점</td>
                        <td>1</td>
                        <td>0101234**** <span>(닉네임)</span></td>
                        <td>바나포인트<p>(20,000점)</p></td>
                    </tr>
                    <tr>
                        <td>2022-04</td>
                        <td>충무로점</td>
                        <td>1</td>
                        <td>0101234**** <span>(닉네임)</span></td>
                        <td>바나포인트<p>(20,000점)</p></td>
                    </tr>
                    <tr>
                        <td>2022-04</td>
                        <td>충무로점</td>
                        <td>1</td>
                        <td>0101234**** <span>(닉네임)</span></td>
                        <td>바나포인트<p>(20,000점)</p></td>
                    </tr>
                    <tr>
                        <td>2022-04</td>
                        <td>충무로점</td>
                        <td>1</td>
                        <td>0101234**** <span>(닉네임)</span></td>
                        <td>바나포인트<p>(20,000점)</p></td>
                    </tr>
                </tbody>
            </table>
            <EtcDetailFooter excelFn={handleExcelPrint} dataCnt={5} pageInfo={pageInfo} pageFn={setPageInfo} />
        </>
    )
}

const MonthRankDetailSearch: FC<{ handleSearchInfo: (currentTempSearchInfo: SearchInfoType) => void }> = ({ handleSearchInfo }) => {
    // state
    const [tempSearchInfo, setTempSearchInfo] = useState<SearchInfoType>({
        from: format(new Date(), 'yyyy-MM-01'),
        to: format(subMonths(new Date(), 1), 'yyyy-MM-dd'),
    }); // 실제 쿼리에서 사용될 날짜, 옵션값

    return (
        <CalanderSearch
            title={`보상 지급 내역`}
            dateType={'yyyy-MM-dd'}
            searchInfo={tempSearchInfo}
            setSearchInfo={setTempSearchInfo}
            handleSearch={() => handleSearchInfo(tempSearchInfo)} // 조회 버튼에 필요한 fn
        />
    )
}