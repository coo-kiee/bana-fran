import React, { FC, useState, useRef, useMemo, ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from 'react-query';
import { useRecoilValue } from 'recoil';
import Utils from 'utils/Utils';
import { format, isAfter, lastDayOfMonth } from 'date-fns';

// state
import { franState, loginState } from 'state';

// component
import EtcDetailTable from "pages/etc/component/EtcDetailTable";
import { EtcDetailTableFallback } from 'pages/etc/component/EtcDetailTableHeader'
import EtcDetailFooter from 'pages/etc/component/EtcDetailFooter';

// api
import ETC_SERVICE from 'service/etcService';

// type
import { PageInfoType, EtcListParams, VirtualAccountDetailProps, VirtualAccListType } from 'types/etc/etcType';

const VirtualAccountDetail: FC<VirtualAccountDetailProps> = (props) => {
    const { detailTableColGroup, detailTableHead } = props;

    // 게시판 + 엑셀다운, 페이징, 정렬
    const { reset } = useQueryErrorResetBoundary();

    return (
        <React.Suspense fallback={<EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} type={`LOADING`} />}>
            <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} type={`ERROR`} resetErrorBoundary={resetErrorBoundary} />} >
                <VirtualAccountDetailData {...props} />
            </ErrorBoundary>
        </React.Suspense>
    )
}

const VirtualAccountDetailData: FC<VirtualAccountDetailProps> = ({ detailTableColGroup, detailTableHead, searchInfo }) => {
    const franCode = useRecoilValue(franState);
    const { userInfo: { f_list } } = useRecoilValue(loginState);

    // 상태
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 3, // 한 페이지에 나오는 리스트 개수 
    }) // etcDetailFooter 관련 내용
    const tableRef = useRef<HTMLTableElement>(null); // 엑셀 다운로드 관련

    // 프로시저 
    let detailTableBody: any = [];
    const etcVirtualAccBalanceListParam: EtcListParams = {
        fran_store: franCode,
        from_date: searchInfo.from + '-01',
        to_date: isAfter(lastDayOfMonth(new Date(searchInfo.to)), new Date()) ? format(new Date(), 'yyyy-MM-dd') : format(lastDayOfMonth(new Date(searchInfo.to)), 'yyyy-MM-dd')
    };
    const { data: listData, isSuccess: etcVirtualAccBalanceListSuccess } = ETC_SERVICE.useEtcList<EtcListParams>('CS4QOSEGOQGJ8QCALM7L', etcVirtualAccBalanceListParam, 'etc_virtual_acc_balance_total_list');

    if (etcVirtualAccBalanceListSuccess) {
        // console.log('etcVirtualAccBalanceListSuccess: ', listData)
        detailTableBody = listData
    }

    const renderTableList = useMemo(() => {
        return listData?.reduce((arr: any, tbodyRow: any) => {
            const { balance, deposit, division, log_date, state } = tbodyRow;

            arr.push(
                <>
                    <td className='balance'>{Utils.numberComma(balance)}</td>
                    <td className={`align-center ${deposit === '차감' ? `negative-value` : ''}`}>{Utils.numberComma(deposit)}</td>
                    <td className={`align-center ${division === '차감' ? `negative-value` : ''}`}>{division}</td>
                    <td className='align-center'>{format(new Date(log_date), 'yyyy/MM/dd hh:mm')}</td>
                    <td className='align-center'>{state}</td>
                </>
            )
            return arr;
        }, [] as ReactNode[]);
    }, [listData])

    return (
        <>
            <EtcDetailTable colGroup={detailTableColGroup} theadData={detailTableHead} tbodyData={renderTableList} pageInfo={pageInfo} ref={tableRef} />
            <EtcDetailFooter
                dataCnt={detailTableBody.length || 0}
                pageInfo={pageInfo}
                pageFn={setPageInfo}
                tableRef={tableRef}
                detailTableColGroup={detailTableColGroup}
                fCodeName={f_list[0].f_code_name}
                searchDate={`${searchInfo.from}~${searchInfo.to}`}
                excelFileName={`가상계좌내역`}
            />
        </>
    )
}

export default VirtualAccountDetail;