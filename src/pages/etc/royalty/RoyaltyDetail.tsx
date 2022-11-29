import React, { FC, useState, useRef, useMemo, ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from 'react-query';
import { useRecoilValue } from 'recoil';
import Utils from 'utils/Utils';
import { format, isAfter, lastDayOfMonth } from 'date-fns';

// state
import { franState, loginState } from 'state';

// component  
import  { EtcDetailTable, EtcDetailTableFallback, EtcDetailTableHead } from "pages/etc/component/EtcDetailTable"; 

// api
import ETC_SERVICE from 'service/etcService';

// type
import { PageInfoType, EtcListParams, RoyaltyDetailProps, RoyaltyDetailListType } from 'types/etc/etcType'; 
import Pagination from 'pages/common/pagination'; 
import Sticky from 'pages/common/sticky';  

const RoyaltyDetail: FC<Omit<RoyaltyDetailProps, 'title'>> = (props) => {
    const { detailTableColGroup, detailTableHead } = props;
    // 게시판 + 엑셀다운, 페이징, 정렬
    const { reset } = useQueryErrorResetBoundary();
    const title = `월별 발주금액 통계`;

    return (
        <React.Suspense fallback={<EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} type={`LOADING`} />}>
            <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} type={`ERROR`} resetErrorBoundary={resetErrorBoundary} />} >
                {/* 로열티 내역 */}
                <RoyaltyDetailData title={title} {...props} />
            </ErrorBoundary>
        </React.Suspense>
    )
}

const RoyaltyDetailData: FC<RoyaltyDetailProps> = ({ detailTableColGroup, detailTableHead, searchInfo }) => {
    const franCode = useRecoilValue(franState);
    const { userInfo: { f_list } } = useRecoilValue(loginState);

    // 상태
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 3, // 한 페이지에 나오는 리스트 개수 
    }) // etcDetailFooter 관련 내용
    const tableRef = useRef<null | HTMLTableElement>(null); // 엑셀 다운로드 관련
    const thRef = useRef<HTMLTableRowElement>(null);

    // 프로시저   
    const etcRoyaltyListParam: EtcListParams = {
        fran_store: franCode,
        from_date: searchInfo.from + '-01',
        to_date: isAfter(lastDayOfMonth(new Date(searchInfo.to)), new Date()) ? format(new Date(), 'yyyy-MM-dd') : format(lastDayOfMonth(new Date(searchInfo.to)), 'yyyy-MM-dd')
    };
    const { data: listData, isSuccess, isLoading, isError } = ETC_SERVICE.useEtcList<EtcListParams, RoyaltyDetailListType[]>('YGQA4CREHNZCZIXPF2AH', etcRoyaltyListParam, 'etc_royalty_list');
    const [renderTableList, royaltyTotal, stageTotal ]: [ReactNode[], number, number] = useMemo(() => { 
        const tableList = listData?.reduce((arr: any, tbodyRow:any) => {
            const { std_date, state, suply_amount, tax_amount, total_amount } = tbodyRow; 
            arr.push(
                <>
                    <td className='align-center'>{std_date}</td>
                    <td className='align-left'>{state}</td>
                    <td className='align-center'>{Utils.numberComma(suply_amount)}</td>
                    <td className='align-center'>{Utils.numberComma(tax_amount)}</td>
                    <td className='align-center'><strong>{Utils.numberComma(total_amount)}</strong></td>
                </>
            ) 
 
            return arr;
        }, [] as ReactNode[]);
        const royaltyTotal = listData?.filter((el: any) => el.state.includes('로열티')).reduce((acc: any, cur: any) => acc+= cur.total_amount,0) || 0;
        const stageTotal = listData?.filter((el: any) => el.state.includes('공연')).reduce((acc: any, cur: any) => acc+= cur.total_amount,0) || 0;

        return [tableList, royaltyTotal, stageTotal];
    }, [listData]);
 
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
            const fileName = `${searchInfo.from}~${searchInfo.to}_${f_list[0].f_code_name}_발주내역`;
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
            <div className="search-result-wrap">
                <div className="search-date">
                    <p>조회기간: {searchInfo.from} ~ {searchInfo.to}</p>
                </div>
                <ul className="search-result">
                    <li className="hyphen">로열티 힙계<span className="colon"></span><span className="value">{Utils.numberComma(royaltyTotal)}원</span></li>
                    <li className="hyphen">공연권료 힙계<span className="colon"></span><span className="value">{Utils.numberComma(stageTotal)}원</span></li>
                </ul>
                <div className="price-info">
                    <p className="hyphen">로열티는 일할 계산되지 않습니다. (월 단위 요금 청구)</p>
                </div>
            </div>

            <Sticky reference={thRef.current}>
                <EtcDetailTableHead detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
            </Sticky>

            <table className="board-wrap" cellPadding="0" cellSpacing="0" ref={tableRef}>
                <EtcDetailTableHead detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} ref={thRef}/>
                <EtcDetailTable tbodyData={renderTableList} pageInfo={pageInfo} /> 
            </table>

            <div className="result-function-wrap">
                <div className="function">
                    <button className="goast-btn" onClick={handleExcelDownload}>엑셀다운</button>
                </div>
                <Pagination dataCnt={renderTableList.length || 0} pageInfo={pageInfo} handlePageChange={handlePageChange} handlePageRow={handlePageRow} />
            </div> 
        </>
    )
}

export default RoyaltyDetail;