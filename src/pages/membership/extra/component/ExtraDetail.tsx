import React, { FC, useState, useRef, useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useQueryErrorResetBoundary } from 'react-query';
import { format, subMonths } from 'date-fns'
import Utils from "utils/Utils";
import { useRecoilValue } from "recoil";

// component
import CalanderSearch from "pages/common/calanderSearch";
import { EtcDetailTableHead, EtcDetailTableFallback, EtcDetailTableErrorFallback } from "pages/etc/component/EtcDetailTable";
import EtcDetailFooter from "pages/etc/component/EtcDetailFooter";
import Sticky from "pages/common/sticky";

// type 
import { SearchInfoType, PageInfoType, EtcListParams } from 'types/etc/etcType';
import { ExtraDetailProps, ExtraDetailDataProps } from "types/membership/extraType";

// service
import MEMBERSHIP_SERVICE from "service/membershipService";

// state
import { franState } from "state";
import Loading from "pages/common/loading";

const ExtraDetail: FC<ExtraDetailProps> = (props) => {
    const { detailTableColGroup, detailTableHead } = props;
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
            <ExtraDetailSearch handleSearchInfo={handleSearchInfo} />
            <div className="search-result-wrap">
                <div className="search-date">
                    <p>조회기간: {searchInfo.from} ~ {searchInfo.to}</p>
                </div>
            </div>

            <React.Suspense fallback={<EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} />}>
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
    const thRef = useRef<HTMLTableRowElement>(null);

    // const [showSticky, setShowSticky] = useState<boolean>(false); // sticky header display
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 3, // 한 페이지에 나오는 리스트 개수 
    }) // etcDetailFooter 관련 내용

    // TODO: 프로시저 
    let membershipListData: any = [];
    const membershipListParams: EtcListParams = { fran_store: franCode, from_date: searchInfo.from + '-01', to_date: searchInfo.to + '-01' }
    const { data, isSuccess, isLoading, isError } = MEMBERSHIP_SERVICE.useMembershipList(membershipListParams);
    if (isSuccess) {
        membershipListData = [...membershipListData, ...data]
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
                Utils.excelDownload(tableRef.current, options, '바나 스탬프/쿠폰/바나포인트 상세내역');
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

            <table className="board-wrap" cellPadding="0" cellSpacing="0" ref={tableRef}>
                <EtcDetailTableHead detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} ref={thRef} />
                <tbody>
                    {isLoading && <Loading width={100} height={100} isTable={true} />}
                    {isError && <tr><td colSpan={10}>에러가 발생했습니다.</td></tr>}
                    {isSuccess && membershipListData.map((el: any, idx: number) => {
                        if (
                            (idx < (pageInfo.currentPage - 1) * pageInfo.row) || // 현재 페이지 이전에 있는 데이터
                            (idx >= (pageInfo.currentPage * pageInfo.row)) // 현재 페이지 이후에 있는 데이터
                        ) {
                            return null;
                        } else {
                            const {
                                std_date, total_stamp_cnt, convert_coupon_stamp_cnt, expired_stamp_cnt, total_coupon_cnt, total_coupon_amount,
                                used_coupon_cnt, used_coupon_amount, expired_coupon_cnt, expired_coupon_amount, total_point, used_point, expired_point
                            } = el;
                            return (
                                <tr key={`extra_detail_data_item_${idx}`}>
                                    <td className={idx === 0 ? 'total' : ''}>{std_date}</td>
                                    <td className={idx === 0 ? 'total' : ''}>{total_stamp_cnt}개</td>
                                    <td className={idx === 0 ? 'total' : ''}>{convert_coupon_stamp_cnt}개</td>
                                    <td className={idx === 0 ? 'total' : ''}>{expired_stamp_cnt}개</td>
                                    <td className={idx === 0 ? 'total' : ''}>{total_coupon_cnt}개<p>({total_coupon_amount}원)</p></td>
                                    <td className={idx === 0 ? 'total' : ''}>{used_coupon_cnt}개<p>({used_coupon_amount}원)</p></td>
                                    <td className={idx === 0 ? 'total' : ''}>{expired_coupon_cnt}개<p>({expired_coupon_amount}원)</p></td>
                                    <td className={idx === 0 ? 'total' : ''}>{total_point}P</td>
                                    <td className={idx === 0 ? 'total' : ''}>{used_point}P</td>
                                    <td className={idx === 0 ? 'total' : ''}>{expired_point}P</td>
                                </tr>
                            )
                        }
                    })}
                </tbody>
            </table>

            {/* 엑셀 다운로드, etc -> 안 말고 밖으로 보내기*/}
            <EtcDetailFooter excelFn={handleExcelPrint} dataCnt={membershipListData.length || 0} pageInfo={pageInfo} pageFn={setPageInfo} />
        </>
    )
};

const ExtraDetailSearch: FC<{ handleSearchInfo: (currentTempSearchInfo: SearchInfoType) => void }> = ({ handleSearchInfo }) => {
    // state
    const [tempSearchInfo, setTempSearchInfo] = useState<SearchInfoType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM'), // 2022-10 
        to: format(new Date(), 'yyyy-MM'), // 2022-11   
    }); // 실제 쿼리에서 사용될 날짜, 옵션값

    return (
        <CalanderSearch
            title={`상세내역`}
            dateType={'yyyy-MM-dd'}
            searchInfo={tempSearchInfo}
            setSearchInfo={setTempSearchInfo}
            handleSearch={() => handleSearchInfo(tempSearchInfo)} // 조회 버튼에 필요한 fn
            showMonthYearPicker={true}
        />
    )
}