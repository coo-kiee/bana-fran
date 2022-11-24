import React, { FC, useState, useRef, useMemo, ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useQueryErrorResetBoundary } from 'react-query';
import { format, isAfter, lastDayOfMonth, subMonths } from 'date-fns'
import Utils from "utils/Utils";
import { useRecoilValue } from "recoil";

// component
import CalanderSearch from "pages/common/calanderSearch";
import { EtcDetailTableHead, EtcDetailTableFallback } from 'pages/etc/component/EtcDetailTableHeader'
import EtcDetailFooter from "pages/etc/component/EtcDetailFooter";
import Sticky from "pages/common/sticky";
import NoData from "pages/common/noData";

// type 
import { SearchInfoType, PageInfoType, EtcListParams } from 'types/etc/etcType';
import { ExtraDetailProps, ExtraDetailDataProps, MembershipListType, MembershipTotalType } from "types/membership/extraType";

// service
import MEMBERSHIP_SERVICE from "service/membershipService";

// state
import { franState, loginState } from "state";
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
    let membershipListData: MembershipListType[] = [];
    const membershipListParams: EtcListParams = {
        fran_store: franCode,
        from_date: searchInfo.from + '-01',
        to_date: isAfter(lastDayOfMonth(new Date(searchInfo.to)), new Date()) ? format(new Date(), 'yyyy-MM-dd') : format(lastDayOfMonth(new Date(searchInfo.to)), 'yyyy-MM-dd')
    }
    const { data, isSuccess, isLoading, isError } = MEMBERSHIP_SERVICE.useMembershipList(membershipListParams);
    if (isSuccess) {
        membershipListData = [...membershipListData, ...data];
    }

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
                    {renderTableList?.map((item: any, index: number) => {
                        const isCurrentPage = (index >= (pageInfo.currentPage - 1) * pageInfo.row && index < pageInfo.currentPage * pageInfo.row);
                        return (<tr key={index} style={{ display: isCurrentPage ? '' : 'none' }}>{item}</tr>);
                    })}
                    {renderTableList?.length === 0 && <NoData isTable={true} />}
                </tbody>
            </table>

            <EtcDetailFooter
                dataCnt={membershipListData.length || 0}
                pageInfo={pageInfo}
                pageFn={setPageInfo}
                tableRef={tableRef}
                detailTableColGroup={detailTableColGroup}
                fCodeName={f_list[0].f_code_name}
                searchDate={`${searchInfo.from}~${searchInfo.to}`}
                excelFileName={`멤버십누적내역`}
            />
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