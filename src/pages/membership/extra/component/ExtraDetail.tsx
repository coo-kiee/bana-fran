import { FC, useState, useRef, useMemo, ReactNode, Suspense, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useQueryErrorResetBoundary } from 'react-query';
import { format, isBefore, isSameDay, subMonths } from 'date-fns';
import { useRecoilValue } from "recoil";
import Utils from "utils/Utils";

// component
import CalanderSearch from "pages/common/calanderSearch"; 
import EtcDetailTable, { EtcDetailTableFallback, EtcDetailTableHead } from "pages/etc/component/EtcDetailTable";  
import EtcDetailTableBottom from "pages/etc/component/EtcDetailTableBottom";
import Sticky from "pages/common/sticky";  
import Loading from "pages/common/loading";
import SuspenseErrorPage from "pages/common/suspenseErrorPage";

// type 
import { SearchInfoType, PageInfoType } from 'types/etc/etcType';
import { ExtraDetailProps, ExtraDetailDataProps } from "types/membership/extraType";

// service
import MEMBERSHIP_SERVICE from "service/membershipService";

// state
import { franState, loginState } from "state"; 
import EtcSearchDetail from "pages/etc/component/EtcDetailSummary";

const isSameOrBeforeToday = (targetDate: string) => {
    return isBefore(new Date(targetDate), new Date()) || isSameDay(new Date(targetDate), new Date())
};

const ExtraDetail: FC<ExtraDetailProps> = (props) => {
    const { detailTableColGroup, detailTableHead } = props;
    const { reset } = useQueryErrorResetBoundary(); 

    const [searchInfo, setSearchInfo] = useState<SearchInfoType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM'), 
        to: format(new Date(), 'yyyy-MM'),
        searchTrigger: false,
    }); 
    // fallback props 정리
    const defaultFallbackProps = { 
        searchDate: `${searchInfo.from} ~ ${searchInfo.to}`,
        ...props
    }
    const loadingFallbackProps = { ...defaultFallbackProps, fallbackType: 'LOADING' }
    const errorFallbackProps = { ...defaultFallbackProps, fallbackType: 'ERROR' }

    return (
        <>
            <ExtraDetailSearch searchInfo={searchInfo} setSearchInfo={setSearchInfo} /> 

            <Suspense fallback={<EtcDetailTableFallback {...loadingFallbackProps} />}>
                <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <EtcDetailTableFallback {...errorFallbackProps} resetErrorBoundary={resetErrorBoundary} />} >
                    <ExtraDetailData searchInfo={searchInfo} detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} /> 
                </ErrorBoundary>
            </Suspense>
        </>
    )
}

export default ExtraDetail;

const ExtraDetailData: FC<ExtraDetailDataProps> = ({ searchInfo: { from, to, searchTrigger }, detailTableColGroup, detailTableHead }) => {
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
    const membershipListKey = useMemo(() => ['membership_extra_list', JSON.stringify({ franCode, from, to }) ], [franCode, searchTrigger]);
    const { data, isError, isLoading, isSuccess, isRefetching, refetch } = MEMBERSHIP_SERVICE.useMembershipList(membershipListKey, [franCode, from, to ]);
    useEffect(() => {
        refetch();
    }, [franCode, searchTrigger, refetch])

    const renderTableList: ReactNode[] = useMemo(() => {  
        const tableList = data?.filter((data, idx) => isSameOrBeforeToday(data.std_date) || idx === 0) // 가장 첫번째 데이터(=총 합 데이터) || 오늘 포함한 오늘 이전 데이터
        .reduce((arr: any, tbodyRow: any, index: number) => { 
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
            );

            return arr;
        }, [] as ReactNode[]) || [];   

        return tableList
    }, [data]);
    
    const extraDetailTablebody = useMemo(() => { 
        const isTableSuccess = isSuccess && !isLoading && !isRefetching; // 모두 성공 + refetch나 loading 안하고 있을때 
        const isTableLoading = isLoading || isRefetching ; // 처음으로 요청 || refetch 하는 경우 

        if( isTableSuccess ) {
            return <EtcDetailTable tbodyData={renderTableList} pageInfo={pageInfo} />
        } else if( isError ) { // 실패한 경우 
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
                addRowColor: { row: [1, 2], color: ['d3d3d3', 'd3d3d3'] }, //  { row: [1, 2], color: ['3a3a4d', '3a3a4d'] }
            };
            const fileName = `${from}~${to}_${branchName}_멤버십누적내역`;
            Utils.excelDownload(tableRef.current, options, fileName);
        };
    }; 
    
    return (
        <> 
            <div className="search-result-wrap">
                <div className="search-date">
                    <p>조회기간: {from} ~ {to}</p>
                </div>
            </div>

            <Sticky reference={thRef.current} contentsRef={tableRef.current}>
                <EtcDetailTableHead detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
            </Sticky>

            <table className="board-wrap" cellPadding="0" cellSpacing="0" ref={tableRef}>
                <EtcDetailTableHead detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} ref={thRef} /> 
                {extraDetailTablebody}
            </table>

            {!!renderTableList && renderTableList!.length > 0 && <EtcDetailTableBottom handleExcelDownload={handleExcelDownload} dataCnt={!!renderTableList ? renderTableList?.length : 0} pageInfo={pageInfo} setPageInfo={setPageInfo} />}
        </>
    )
};

const ExtraDetailSearch: FC<{searchInfo:SearchInfoType, setSearchInfo: React.Dispatch<React.SetStateAction<SearchInfoType>> }> = ({ searchInfo, setSearchInfo }) => {
    const handleRefetch = () => {
        setSearchInfo((prev) => ({...prev, searchTrigger: !prev.searchTrigger }));
    };

    return (
        <CalanderSearch
            title={`상세내역`}
            dateType={'yyyy-MM'}
            searchInfo={searchInfo}
            setSearchInfo={setSearchInfo}
            handleSearch={handleRefetch}
            showMonthYearPicker={true}
        />
    )
}