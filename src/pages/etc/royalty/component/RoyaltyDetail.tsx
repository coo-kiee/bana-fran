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
import { PageInfoType, EtcListParams, RoyaltyDetailProps } from 'types/etc/etcType';

const RoyaltyDetail: FC<Omit<RoyaltyDetailProps, 'title'>> = (props) => {
    const { detailTableColGroup, detailTableHead } = props;
    // 게시판 + 엑셀다운, 페이징, 정렬
    const { reset } = useQueryErrorResetBoundary();
    const title = `월별 발주금액 통계`;

    return (
        <>
            <React.Suspense fallback={<EtcDetailTableFallback colGroup={detailTableColGroup} theadData={detailTableHead} />}>
                <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <EtcDetailTableErrorFallback colSpan={detailTableColGroup.length} colGroup={detailTableColGroup} theadData={detailTableHead} resetErrorBoundary={resetErrorBoundary} />} >
                    {/* 로열티 내역 */}
                    <RoyaltyDetailData title={title} {...props} />
                </ErrorBoundary>
            </React.Suspense>
        </>
    )
}


const RoyaltyDetailData: FC<RoyaltyDetailProps> = ({ detailTableColGroup, detailTableHead, searchInfo }) => {
    const franCode = useRecoilValue(franState);

    // 상태
    const [pageInfo, setPageInfo] = useState<PageInfoType>({
        currentPage: 1, // 현재 페이지
        row: 3, // 한 페이지에 나오는 리스트 개수 
    }) // etcDetailFooter 관련 내용

    let detailTableBody: any = [];
    // 프로시저 
    const etcRoyaltyListParam: EtcListParams = { fran_store: franCode, from_date: searchInfo.from + '-01', to_date: searchInfo.to + '-01' };
    const { data: listData, isSuccess: etcRoyaltyListSuccess } = ETC_SERVICE.useEtcList<EtcListParams>('YGQA4CREHNZCZIXPF2AH', etcRoyaltyListParam, 'etc_royalty_list');

    if (etcRoyaltyListSuccess) {
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
                Utils.excelDownload(tableRef.current, options, '로열티 내역');
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

export default RoyaltyDetail;