import React, { FC, useState, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useQueryErrorResetBoundary } from 'react-query';
import { format, subMonths } from 'date-fns'
import Utils from "utils/Utils";
import { useRecoilValue } from "recoil";

// component
import CalanderSearch from "pages/common/calanderSearch";
import { EtcDetailTableFallback, EtcDetailTableErrorFallback } from "pages/etc/component/EtcDetailTable";
import EtcDetailFooter from "pages/etc/component/EtcDetailFooter";

// type
import { SearchInfoType } from 'types/etc/etcType';
import { PageInfoType, EtcListParams } from 'types/etc/etcType';
import { ExtraDetailProps, ExtraDetailDataProps } from "types/membership/extraType";

// service
import MEMBERSHIP_SERVICE from "service/membershipService";

// state
import { franState } from "state";

const ExtraDetail: FC<ExtraDetailProps> = (props) => {
    const { detailTableColGroup, detailTableHead } = props;
    const { reset } = useQueryErrorResetBoundary();

    const [searchInfo, setSearchInfo] = useState<SearchInfoType>({
        from: format(new Date(), 'yyyy-MM-01'),
        to: format(subMonths(new Date(), 1), 'yyyy-MM-dd'),
    }); // 실제 쿼리에서 사용될 날짜, 옵션값

    // 상태 관련 함수
    const handleSearchInfo = (currentTempSearchInfo: SearchInfoType) => {
        setSearchInfo((prevSearchInfo) => ({ ...prevSearchInfo, ...currentTempSearchInfo }));
    }; // tempSearchInfo -> searchInfo로 업데이트 (-> 자동으로 refetch역할)

    return (
        <>
            <ExtraDetailSearch handleSearchInfo={handleSearchInfo} />
            <div className="search-result-wrap">
                <div className="search-date">
                    <p>조회기간: {searchInfo.from} ~ {searchInfo.to}</p>
                </div>
            </div>

            <React.Suspense fallback={<EtcDetailTableFallback colSpan={detailTableHead.length} colGroup={detailTableColGroup} theadData={detailTableHead} />}>
                <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <EtcDetailTableErrorFallback colSpan={detailTableHead.length} colGroup={detailTableColGroup} theadData={detailTableHead} resetErrorBoundary={resetErrorBoundary} />} >
                    <ExtraDetailData searchInfo={searchInfo} detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
                </ErrorBoundary>
            </React.Suspense>
        </>
    )
}

export default ExtraDetail;

const ExtraDetailData: FC<ExtraDetailDataProps> = ({ searchInfo, detailTableColGroup, detailTableHead }) => {
    const franCode = useRecoilValue(franState);

    // TODO: 상태
    const tableRef = useRef<null | HTMLTableElement>(null);
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 3, // 한 페이지에 나오는 리스트 개수 
    }) // etcDetailFooter 관련 내용

    // TODO: 프로시저
    const membershipListParams: EtcListParams = { fran_store: franCode, from_date: searchInfo.from, to_date: searchInfo.to }
    const { data, isSuccess } = MEMBERSHIP_SERVICE.useMembershipList(membershipListParams);
    if (isSuccess) {
        // console.log(data); // []
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
            <table className="board-wrap" cellPadding="0" cellSpacing="0" ref={tableRef}>
                <colgroup>
                    {detailTableColGroup.map((el, idx) => <col key={`extra_overall_table_col_${idx}`} width={el} />)}
                </colgroup>

                <thead>
                    {detailTableHead.map((trData, idx1) => {
                        return (
                            <tr key={`extra_overall_table_row_${idx1}`}>
                                {trData.map((tdData, idx2) => {
                                    return (
                                        <th key={`extra_overall_table_row_item_${idx2}`} rowSpan={tdData.rowSpan || undefined} colSpan={tdData.colSpan || undefined} className={tdData.className || ''}>
                                            {tdData.itemName.length > 1 ? <>{tdData.itemName[0]}<p>{tdData.itemName[1]}</p></> : tdData.itemName[0]}
                                        </th>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </thead>
                {/* 세부 내역 테이블 */}
                <tbody>
                    {/* data에 빈배열 들어오는 경우 처리 data에 빈배열 들어오는 경우 처리 */}
                    <tr>
                        <td className="total">합계</td>
                        <td className="total">1,000개</td>
                        <td className="total">800개</td>
                        <td className="total">100개</td>
                        <td className="total">1,000개<p>(3,000,000원)</p></td>
                        <td className="total">500개<p>(3,000,000원)</p></td>
                        <td className="total">200개<p>(3,000,000원)</p></td>
                        <td className="total">1,000,000P</td>
                        <td className="total">1,000,000P</td>
                        <td className="total">1,000,000P</td>
                    </tr>
                    <tr>
                        <td>합계</td>
                        <td>1,000개</td>
                        <td>800개</td>
                        <td>100개</td>
                        <td>1,000개<p>(3,000,000원)</p></td>
                        <td>500개<p>(3,000,000원)</p></td>
                        <td>200개<p>(3,000,000원)</p></td>
                        <td>1,000,000P</td>
                        <td>1,000,000P</td>
                        <td>1,000,000P</td>
                    </tr>
                    <tr>
                        <td>합계</td>
                        <td>1,000개</td>
                        <td>800개</td>
                        <td>100개</td>
                        <td>1,000개<p>(3,000,000원)</p></td>
                        <td>500개<p>(3,000,000원)</p></td>
                        <td>200개<p>(3,000,000원)</p></td>
                        <td>1,000,000P</td>
                        <td>1,000,000P</td>
                        <td>1,000,000P</td>
                    </tr>
                </tbody>
            </table>

            {/* 엑셀 다운로드, etc -> 안 말고 밖으로 보내기*/}
            <EtcDetailFooter excelFn={handleExcelPrint} dataCnt={3} pageInfo={pageInfo} pageFn={setPageInfo} />
        </>
    )
};

const ExtraDetailSearch: FC<{ handleSearchInfo: (currentTempSearchInfo: SearchInfoType) => void }> = ({ handleSearchInfo }) => {
    // state
    const [tempSearchInfo, setTempSearchInfo] = useState<SearchInfoType>({
        from: format(new Date(), 'yyyy-MM-01'),
        to: format(subMonths(new Date(), 1), 'yyyy-MM-dd'),
    }); // 실제 쿼리에서 사용될 날짜, 옵션값

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