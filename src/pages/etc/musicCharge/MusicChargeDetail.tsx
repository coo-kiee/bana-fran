import React, { FC, useState, useRef, useMemo, ReactNode } from "react";
import { useRecoilValue } from "recoil";
import Utils from "utils/Utils";
import { useQueryErrorResetBoundary } from "react-query";
import { format, isAfter, lastDayOfMonth } from 'date-fns';
import { ErrorBoundary } from 'react-error-boundary';

// state
import { franState, loginState } from "state";

// type
import { EtcListParams, PageInfoType, SearchInfoType, MusicChargeDetailProps, MusicChargeDetailType } from "types/etc/etcType";

// API
import ETC_SERVICE from 'service/etcService';

// component 
import { EtcDetailTable, EtcDetailTableFallback, EtcDetailTableHead} from "pages/etc/component/EtcDetailTable";  
import Pagination from "pages/common/pagination"; 
import Sticky from "pages/common/sticky"; 
import Loading from "pages/common/loading";
import SuspenseErrorPage from "pages/common/suspenseErrorPage";

const MusicChargeDetail: FC<MusicChargeDetailProps> = ({ detailTableColGroup, detailTableHead, searchInfo  }) => {
    const { reset } = useQueryErrorResetBoundary();

    return (
        <React.Suspense fallback={<EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} type={`LOADING`} />}>
            <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} type={`ERROR`} resetErrorBoundary={resetErrorBoundary} />} >
                <MusicChargeDetailData
                    searchInfo={searchInfo}  
                    detailTableColGroup={detailTableColGroup}
                    detailTableHead={detailTableHead} />
            </ErrorBoundary>
        </React.Suspense>
    )
}

export default MusicChargeDetail;

const MusicChargeDetailData: FC<MusicChargeDetailProps> = ({ detailTableColGroup, detailTableHead, searchInfo }) => {
    const franCode = useRecoilValue(franState);
    const { userInfo: { f_list } } = useRecoilValue(loginState);

    // 상태
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 3, // 한 페이지에 나오는 리스트 개수 
    }) // etcDetailFooter 관련 내용 
    const tableRef = useRef<HTMLTableElement>(null); // 엑셀 다운로드 관련
    const thRef = useRef<HTMLTableRowElement>(null);

    // 프로시저 
    const etcMusicListParam: EtcListParams = {
        fran_store: franCode,
        from_date: searchInfo.from + '-01',
        to_date: isAfter(lastDayOfMonth(new Date(searchInfo.to)), new Date()) ? format(new Date(), 'yyyy-MM-dd') : format(lastDayOfMonth(new Date(searchInfo.to)), 'yyyy-MM-dd')
    };
    const { data: listData, isSuccess, isError, isLoading } = ETC_SERVICE.useEtcList<EtcListParams, MusicChargeDetailType[]>('VK4WML6GW9077BKEWP3O', etcMusicListParam, 'etc_music_list');
    const [renderTableList, musicTotal, feeTotal]: [ReactNode[], number, number] = useMemo(() => { 
        const tableList = listData?.reduce((arr: any, tbodyRow: any) => {
            const { std_date, state, suply_amount, tax_amount, total_amount } = tbodyRow; 
            arr.push(
                <>
                    <td className='align-center'>{std_date}</td>
                    <td className='align-left'>{state}</td>
                    <td className='align-right'>{Utils.numberComma(suply_amount)}</td>
                    <td className='align-right'>{Utils.numberComma(tax_amount)}</td>
                    <td className='align-right'>{Utils.numberComma(total_amount)}</td>
                </>
            )
            return arr;
        }, [] as ReactNode[]); 

        const musicTotal = listData?.filter((el: any) => el.state.includes('음악')).reduce((acc: any, cur: any) => acc+= cur.total_amount,0);
        const feeTotal = listData?.filter((el: any) => el.state.includes('공연')).reduce((acc: any, cur: any) => acc+= cur.total_amount,0);

        return [tableList, musicTotal, feeTotal];
    }, [listData])

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
            const fileName = `${searchInfo.from}~${searchInfo.to}_${f_list[0].f_code_name}_음악서비스내역`;
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
                    <li className="hyphen">음악 사용료 합계<span className="colon"></span><span className="value">{Utils.numberComma(musicTotal)}원</span></li>
                    <li className="hyphen">공연권료 합계<span className="colon"></span><span className="value">{Utils.numberComma(feeTotal)}원</span></li>
                </ul>
                <div className='price-info'>
                    <p className="hyphen">음악사용료/공연권료는 일할 계산되지 않습니다. (월 단위 요금 청구)</p>
                </div>
            </div>
 
            <Sticky reference={thRef.current}>
                <EtcDetailTableHead detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
            </Sticky>
            <table className="board-wrap" cellPadding="0" cellSpacing="0" ref={tableRef}>
                <EtcDetailTableHead detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} ref={thRef}/>
                {/* <EtcDetailTable tbodyData={renderTableList} pageInfo={pageInfo} />   */}
                {isSuccess && <EtcDetailTable tbodyData={renderTableList} pageInfo={pageInfo} /> }
                {isLoading && <Loading isTable={true} />}
                {isError && <SuspenseErrorPage isTable={true} />}
            </table>
            
            <div className="result-function-wrap">
                <div className="function">
                    <button className="goast-btn" onClick={handleExcelDownload}>엑셀다운</button>
                </div>
                <Pagination dataCnt={!!renderTableList? renderTableList.length : 0} pageInfo={pageInfo} handlePageChange={handlePageChange} handlePageRow={handlePageRow} />
            </div>
        </>
    )
} 