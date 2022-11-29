import React, { FC, useState, useRef, ReactNode, useMemo } from "react";
import { useRecoilValue } from "recoil";
import Utils from "utils/Utils";
import { useQueryErrorResetBoundary } from "react-query";
import { format, isAfter, lastDayOfMonth } from 'date-fns';
import { ErrorBoundary } from 'react-error-boundary';

// state
import { franState, loginState } from "state";

// type
import { PageInfoType, GiftcardDetailProps, ETC_GIFTCARD_SEARCH_CATEGORY_TYPE, ETC_GIFTCARD_SEARCH_CARD_TYPE, ETC_GIFTCARD_SEARCH_DEVICE_TYPE, GiftCardListParams } from "types/etc/etcType";

// API
import ETC_SERVICE from "service/etcService";

// component 
import { EtcDetailTable, EtcDetailTableFallback, EtcDetailTableHead} from "pages/etc/component/EtcDetailTable";  
import Pagination from "pages/common/pagination";
import Sticky from "pages/common/sticky";

const GiftCardDetail: FC<GiftcardDetailProps> = ({ detailTableHead, detailTableColGroup, searchInfo, handleSearchInfo }) => {
    const { reset } = useQueryErrorResetBoundary();

    return (
        <>
            <React.Suspense fallback={<EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} type={`LOADING`} />}>
                <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} type={`ERROR`} resetErrorBoundary={resetErrorBoundary} />} >
                    <GiftCardDetailData
                        searchInfo={searchInfo}
                        detailTableColGroup={detailTableColGroup}
                        detailTableHead={detailTableHead} />
                </ErrorBoundary>
            </React.Suspense>
        </>
    )
}

export default GiftCardDetail

const GiftCardDetailData: FC<Omit<GiftcardDetailProps, 'handleSearchInfo'>> = ({ detailTableHead, detailTableColGroup, searchInfo }) => {
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
    const etcGiftcardListParam: GiftCardListParams = {
        f_code: franCode,
        from_date: searchInfo.from + '-01',
        to_date: isAfter(lastDayOfMonth(new Date(searchInfo.to)), new Date()) ? format(new Date(), 'yyyy-MM-dd') : format(lastDayOfMonth(new Date(searchInfo.to)), 'yyyy-MM-dd')
    };
    const { data: listData } = ETC_SERVICE.useGiftCardList(etcGiftcardListParam);

    const [renderTableList, kioskAndPosTotal, appTotal, cancelTotal]: [ReactNode[], number, number, number] = useMemo(() => { 
        const tableList = listData?.reduce((arr: any, tbodyRow: any) => {
            const { account_amt, gubun, item_amt, item_cnt, item_name, menu_Item, rcp_type, std_date} = tbodyRow; 

            const pointType = searchInfo.searchOption[0].value === ETC_GIFTCARD_SEARCH_CATEGORY_TYPE.CATEGORY_ALL ?  
                true : searchInfo.searchOption[0].value === gubun; // 포인트 구분 필터
            const cardType = searchInfo.searchOption[1].value === ETC_GIFTCARD_SEARCH_CARD_TYPE.CARD_ALL ?
                true : Number(searchInfo.searchOption[1].value) === menu_Item; // 상품권종 관련 필터
            const deviceType = searchInfo.searchOption[2].value === ETC_GIFTCARD_SEARCH_DEVICE_TYPE.DEVICE_ALL ? 
                true : searchInfo.searchOption[2].value === rcp_type; // 처리기기 관련 필터

            if( pointType && cardType && deviceType ){
                arr.push(
                    <>
                        <td className="align-center">{format(new Date(std_date), 'yyyy-MM-dd hh:mm')}</td>
                        <td className="align-center">{rcp_type}</td>
                        <td className="align-center">{item_name}</td>
                        <td className="align-center">{Utils.numberComma(item_cnt)}장 ({Utils.numberComma(item_amt)})</td>
                        <td className="align-center">{rcp_type}</td>
                        <td className="align-center">{gubun}</td>
                        <td className={`align-center ${(menu_Item === 510 && account_amt < 0) ? 'negative-value' : ''}`}>{menu_Item === 510 ? `${Utils.numberComma(account_amt)}` : ''}</td>
                        <td className={`align-center ${(menu_Item === 511 && account_amt < 0) ? 'negative-value' : ''}`}>{menu_Item === 511 ? `${Utils.numberComma(account_amt)}` : ''}</td>
                        <td className={`align-center ${(menu_Item === 512 && account_amt < 0) ? 'negative-value' : ''}`}>{menu_Item === 512 ? `${Utils.numberComma(account_amt)}` : ''}</td>
                    </>
                )
            }
            return arr;
        }, [] as ReactNode[]);
 
        const kioskAndPosTotal = listData?.filter((el:any) => el.rcp_type === '키오스크' || el.rcp_type === 'POS').reduce((acc: any, cur:any) => acc += cur.account_amt,0) || 0; // 키오스크/POS 판매금액 합계
        const appTotal = listData?.filter((el:any) => el.rcp_type === '어플').reduce((acc: any, cur:any) => acc += cur.account_amt, 0) || 0; // 어플 판매금액 합계
        const cancelTotal = listData?.filter((el:any) => el.gubun === '판매취소(폐기)').reduce((acc: any, cur:any) => acc += cur.account_amt ,0) || 0;  // 판매취소(폐기)금액 합계

        setPageInfo((tempPageInfo) => ({...tempPageInfo, currentPage: 1})) // 검색 or 필터링 한 경우 1페이지로 이동
        return [tableList, kioskAndPosTotal, appTotal, cancelTotal];
    }, [listData, searchInfo.searchOption ])

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
            const fileName = `${searchInfo.from}~${searchInfo.to}_${f_list[0].f_code_name}_상품권내역`;
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
                    <li className="hyphen">키오스크/POS 판매금액 합계<span className="colon"></span><span className="value">{Utils.numberComma(kioskAndPosTotal)}원</span></li>
                    <li className="hyphen">어플 판매금액 합계<span className="colon"></span><span className="value">{Utils.numberComma(appTotal)}원</span></li>
                    <li className="hyphen">판매취소(폐기)금액 합계<span className="colon"></span><span className="value">{Utils.numberComma(cancelTotal)}원</span></li>
                </ul>
                <div className='price-info'>
                    <p className="hyphen">키오스크/POS 판매금액은 가상계좌에서 자동 차감됩니다.</p>
                    <p className="hyphen">어플 판매금액은 가상계좌에서 차감되지 않습니다.</p>
                    <p className="hyphen">판매취소된 상품권은 폐기되므로 재고에 반영되지 않습니다.</p>
                </div>
            </div>

            <Sticky reference={thRef.current}> 
                <EtcDetailTableHead detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
            </Sticky>

            <table className="board-wrap" cellPadding="0" cellSpacing="0" ref={tableRef}>
                <EtcDetailTableHead detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} ref={thRef} />
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
