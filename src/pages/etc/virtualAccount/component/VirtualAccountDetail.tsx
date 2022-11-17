import React, { FC, useState, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from 'react-query';
import { useRecoilValue } from 'recoil';
import Utils from 'utils/Utils';

// state
import { franState } from 'state';

// component
import { EtcDetailTable, EtcDetailTableFallback, EtcDetailTableErrorFallback } from "pages/etc/component/EtcDetailTable";
import EtcDetailFooter from 'pages/etc/component/EtcDetailFooter';

// api
import ETC_SERVICE from 'service/etcService';

// type
import { PageInfoType, EtcListParams, VirtualAccountDetailProps } from 'types/etc/etcType';

const VirtualAccountDetail: FC<VirtualAccountDetailProps> = (props) => {
    const { detailTableColGroup, detailTableHead } = props;

    // 게시판 + 엑셀다운, 페이징, 정렬
    const { reset } = useQueryErrorResetBoundary();

    return (
        <>
            <React.Suspense fallback={<EtcDetailTableFallback colSpan={detailTableColGroup.length} colGroup={detailTableColGroup} theadData={detailTableHead} />}>
                <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <EtcDetailTableErrorFallback colSpan={detailTableColGroup.length} colGroup={detailTableColGroup} theadData={detailTableHead} resetErrorBoundary={resetErrorBoundary} />} >
                    {/* 로열티 내역 */}
                    <VirtualAccountDetailData {...props} />
                </ErrorBoundary>
            </React.Suspense>
        </>
    )
}

const VirtualAccountDetailData: FC<VirtualAccountDetailProps> = ({ detailTableColGroup, detailTableHead, searchInfo }) => {
    const franCode = useRecoilValue(franState);

    // 상태
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 3, // 한 페이지에 나오는 리스트 개수 
    }) // etcDetailFooter 관련 내용

    // 프로시저 
    let detailTableBody: any = [];
    const etcVirtualAccBalanceListParam: EtcListParams = { fran_store: franCode, from_date: searchInfo.from, to_date: searchInfo.to };
    const { data: listData, isSuccess: etcVirtualAccBalanceListSuccess } = ETC_SERVICE.useEtcList<EtcListParams>('CS4QOSEGOQGJ8QCALM7L', etcVirtualAccBalanceListParam, 'etc_virtual_acc_balance_total_list');

    if (etcVirtualAccBalanceListSuccess) {
        // console.log('etcVirtualAccBalanceListSuccess: ', listData)
        detailTableBody = listData
    }

    // 엑셀 다운로드 관련 
    const tableRef = useRef<null | HTMLTableElement>(null);
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
                Utils.excelDownload(tableRef.current, options, '음악 서비스 이용료');
            }
            catch (error) {
                console.log(error);
            }
        };
    };

    return (
        <>
            <EtcDetailTable colGroup={detailTableColGroup} theadData={detailTableHead} tbodyData={detailTableBody} pageInfo={pageInfo} ref={tableRef} />
            <EtcDetailFooter excelFn={handleExcelPrint} dataCnt={detailTableBody.length || 0} pageInfo={pageInfo} pageFn={setPageInfo} />
        </>
    )
}

export default VirtualAccountDetail;