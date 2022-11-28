import React, { FC, useState, useRef, useMemo, ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useQueryErrorResetBoundary } from 'react-query';
import { format, isAfter, lastDayOfMonth, subMonths } from 'date-fns' 
import { useRecoilValue } from "recoil";
import Utils from "utils/Utils";

// component
import CalanderSearch from "pages/common/calanderSearch"; 
import { EtcDetailTableHead, EtcDetailTableFallback, EtcDetailTable} from "pages/etc/component/EtcDetailTable"; 
import Sticky from "pages/common/sticky";
import NoData from "pages/common/noData";
import Pagination from "pages/common/pagination";

// type 
import { SearchInfoType, PageInfoType, EtcListParams } from 'types/etc/etcType';
import { ExtraDetailProps, ExtraDetailDataProps } from "types/membership/extraType";

// service
import MEMBERSHIP_SERVICE from "service/membershipService";

// state
import { franState, loginState } from "state"; 
import Loading from "pages/common/loading";
import SuspenseErrorPage from "pages/common/suspenseErrorPage";

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

            <React.Suspense fallback={<EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} type={`LOADING`} />}>
                <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} type={`ERROR`} resetErrorBoundary={resetErrorBoundary} />} >
                    <ExtraDetailData searchInfo={searchInfo} detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
                </ErrorBoundary>
            </React.Suspense>
        </>
    )
}

export default ExtraDetail;

const ExtraDetailData: FC<ExtraDetailDataProps> = ({ searchInfo, detailTableColGroup, detailTableHead }) => {
    const franCode = useRecoilValue(franState);
    const { userInfo: { f_list } } = useRecoilValue(loginState);

    // TODO: 상태
    const tableRef = useRef<null | HTMLTableElement>(null);
    const thRef = useRef<HTMLTableRowElement>(null);

    // const [showSticky, setShowSticky] = useState<boolean>(false); // sticky header display
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 3, // 한 페이지에 나오는 리스트 개수 
    }) // etcDetailFooter 관련 내용

    // TODO: 프로시저  
    const membershipListParams: EtcListParams = {
        fran_store: franCode,
        from_date: searchInfo.from + '-01',
        to_date: isAfter(lastDayOfMonth(new Date(searchInfo.to)), new Date()) ? format(new Date(), 'yyyy-MM-dd') : format(lastDayOfMonth(new Date(searchInfo.to)), 'yyyy-MM-dd')
    }
    const { data, isError, isLoading, isSuccess } = MEMBERSHIP_SERVICE.useMembershipList(membershipListParams);

    const renderTableList = useMemo(() => {
        return data?.reduce((arr: any, tbodyRow: any, index: number) => {
            const {
                std_date, total_stamp_cnt, convert_coupon_stamp_cnt, expired_stamp_cnt, total_coupon_cnt, total_coupon_amount,
                used_coupon_cnt, used_coupon_amount, expired_coupon_cnt, expired_coupon_amount, total_point, used_point, expired_point
            } = tbodyRow;

            arr.push(
                <>
                    <td className={index === 0 ? 'total' : ''}>{std_date}</td>
                    <td className={index === 0 ? 'total' : ''}>{total_stamp_cnt}개</td>
                    <td className={index === 0 ? 'total' : ''}>{convert_coupon_stamp_cnt}개</td>
                    <td className={index === 0 ? 'total' : ''}>{expired_stamp_cnt}개</td>
                    <td className={index === 0 ? 'total' : ''}>{total_coupon_cnt}개<p>({total_coupon_amount}원)</p></td>
                    <td className={index === 0 ? 'total' : ''}>{used_coupon_cnt}개<p>({used_coupon_amount}원)</p></td>
                    <td className={index === 0 ? 'total' : ''}>{expired_coupon_cnt}개<p>({expired_coupon_amount}원)</p></td>
                    <td className={index === 0 ? 'total' : ''}>{total_point}P</td>
                    <td className={index === 0 ? 'total' : ''}>{used_point}P</td>
                    <td className={index === 0 ? 'total' : ''}>{expired_point}P</td>
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
                addRowColor: { row: [1, 2], color: ['d3d3d3', 'd3d3d3'] }, //  { row: [1, 2], color: ['3a3a4d', '3a3a4d'] }
            };
            const fileName = `${searchInfo.from}~${searchInfo.to}_${f_list[0].f_code_name}_멤버십누적내역`;
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

            <table className="board-wrap" cellPadding="0" cellSpacing="0" ref={tableRef}>
                <EtcDetailTableHead detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} ref={thRef} /> 
                {isSuccess && <EtcDetailTable tbodyData={renderTableList} pageInfo={pageInfo} /> }
                {isLoading && <Loading isTable={true} />}
                {isError && <SuspenseErrorPage isTable={true} />}
            </table>

            <div className="result-function-wrap">
                <div className="function">
                    <button className="goast-btn" onClick={handleExcelDownload}>엑셀다운</button>
                </div>
                <Pagination dataCnt={!!renderTableList ? renderTableList.length : 0} pageInfo={pageInfo} handlePageChange={handlePageChange} handlePageRow={handlePageRow} />
            </div>
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
            dateType={'yyyy-MM'}
            searchInfo={tempSearchInfo}
            setSearchInfo={setTempSearchInfo}
            handleSearch={() => handleSearchInfo(tempSearchInfo)} // 조회 버튼에 필요한 fn
            showMonthYearPicker={true}
        />
    )
}