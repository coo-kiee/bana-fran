import React, { FC } from 'react';
import { format, subMonths, lastDayOfMonth } from 'date-fns';
import { useQueryErrorResetBoundary } from 'react-query';

// type
import { EtcTotalParams, ETC_TAB_TYPE, ChkGiftCardStockParams } from 'types/etc/etcType';
import { ErrorBoundary } from 'react-error-boundary';
import Loading from 'pages/common/loading';
import { useRecoilValue } from 'recoil';
import Utils from 'utils/Utils';

// component
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';

// state
import { franState } from 'state';

// service
import ETC_SERVICE from 'service/etcService';

const EtcTotalTable: FC<{ currTab: number, }> = ({ currTab }) => {
    const { reset } = useQueryErrorResetBoundary();

    const handleTotalTableData = (currTab: number) => {
        if(currTab === ETC_TAB_TYPE.ORDER) return <EtcOrderTotalTableData />
        else if(currTab === ETC_TAB_TYPE.MUSIC) return <EtcMusicTotalTableData />
        else if (currTab === ETC_TAB_TYPE.GIFTCARD) return <EtcGiftCardTotalTableData />
        else return <EtcTotalTableData currTab={currTab} />
    }
    return (
        <>
            <p className="title bullet">{tabList[currTab].title}</p>
            <table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
                <colgroup>
                    {tabList[currTab].colgroup.map((col, idx) => <col key={`etc_table_colgroup_${idx}`} width={col} />)}
                </colgroup>
                <thead>
                    <tr>
                        {tabList[currTab].thead.map((head, idx) => <th key={`etc_table_thead_${idx}`}>{head}</th>)}
                    </tr>
                </thead>
                <tbody>
                    <React.Suspense fallback={<Loading width={50} height={50} isTable={true} />}>
                        <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} isTable={true} />}>
                            {handleTotalTableData(currTab)} 
                        </ErrorBoundary>
                    </React.Suspense>
                </tbody>
            </table>
        </>
    )
}

export default EtcTotalTable;

const EtcTotalTableData: FC<{ currTab: number }> = ({ currTab }) => {
    const franCode = useRecoilValue(franState);

    // 성공 후 데이터 가공 관련
    const handleClassNameDefault = (idx: number) => {
        if (idx === 0) return 'align-center';
        else if (idx === 1) return 'align-left';
        else return 'align-right';
    };
    const handleAccount = (accNum: string) => {
        if (accNum.length === 14) {
            return [accNum.slice(0, 6), accNum.slice(6, 8), accNum.slice(8)].join('-');
        } else if (accNum.length === 13) {
            return [accNum.slice(0, 4), accNum.slice(4, 7), accNum.slice(7)].join('-');
        } else if (accNum.length === 12) {
            return [accNum.slice(0, 3), accNum.slice(4, 7), accNum.slice(7)].join('-');
        } else if (accNum.length === 11) {
            return [accNum.slice(0, 3), accNum.slice(3, 5), accNum.slice(5)].join('-');
        } else {
            return accNum
        }
    };

    // TODO: 프로시저 
    let tableBody: any = []; // 프로시저 성공 후 업데이트
    const totalParam: EtcTotalParams = { fran_store: franCode };
    const { data: totalData, isSuccess: totalSuccess } = ETC_SERVICE.useEtcTotal<EtcTotalParams, any>(tabList[currTab].query, totalParam, tabList[currTab].queryKey);
    if (totalSuccess) {
        if (currTab === ETC_TAB_TYPE.DELIVERY) { // TODO: 바나 딜리버리 수수료
            tableBody = [
                [
                    { data: `${totalData.std_date}` },
                    { data: `${totalData.item}` },
                    { data: `${Utils.numberComma(totalData.supply_amt)}` },
                    { data: `${Utils.numberComma(totalData.vat_amt)}` },
                    { data: `${Utils.numberComma(totalData.total_amt)}` },
                ]
            ];
        } else if (currTab === ETC_TAB_TYPE.ROYALTY) { // TODO: 로열티 페이지
            tableBody = [
                [
                    { data: `${format(subMonths(new Date(), 1), 'yyyy/MM/01')}~${format(lastDayOfMonth(subMonths(new Date(), 1)), 'yyyy/MM/dd')}` },
                    { data: '로열티' },
                    { data: '150,000' },
                    { data: '150,000' },
                    { data: '150,000', strong: true },
                ]
            ];
        } else if (currTab === ETC_TAB_TYPE.ACCOUNT) { // TODO: 가상계좌 충전/차감 페이지
            tableBody = [
                [
                    { data: `${totalData.fran_name}`, },
                    { data: `${totalData.bank_code}` },
                    { data: `${handleAccount(String(totalData.account))}`, className: 'align-center' },
                    { data: `${Utils.numberComma(totalData.total_charge)}원` },
                    { data: `${Utils.numberComma(totalData.used_amount)}원` },
                    { data: `${Utils.numberComma(totalData.balance)}원`, strong: true },
                ]
            ];
        }
    }

    return (
        <>
            {tableBody.map((tr: any, idx: number) => {
                return (
                    <tr key={`etc_table_tr_${idx}`}>
                        {tr.map((td: any, idx: number) => <td key={`etc_table_td_${idx}`} className={td.className || handleClassNameDefault(idx)}>{td.strong ? <strong>{td.data}</strong> : td.data}</td>)}
                    </tr>
                )
            })}
        </>
    )
}

const EtcOrderTotalTableData = () => {
    const franCode = useRecoilValue(franState);

    let tableBody: any = []; // 프로시저 성공 후 업데이트
    const totalParam: EtcTotalParams = { fran_store: franCode };
    const { data: totalData, isSuccess: totalSuccess } = ETC_SERVICE.useOrderDetailStatistic(totalParam);
    if (totalSuccess) {
        tableBody = [totalData.map((el: any) => ({ data: Utils.numberComma(el.amount), className: 'align-right' }))];
    }

    return (
        <>
            {tableBody.map((tr: any, idx: number) => {
                return (
                    <tr key={`etc_table_tr_${idx}`}>
                        {tr.map((td: any, idx: number) => <td key={`etc_table_td_${idx}`} className={td.className}>{td.strong ? <strong>{td.data}</strong> : td.data}</td>)}
                    </tr>
                )
            })}
        </>
    )
}

const EtcMusicTotalTableData = () => {
    const franCode = useRecoilValue(franState);

    let tableBody: any = []; // 프로시저 성공 후 업데이트
    const totalParam: EtcTotalParams = { fran_store: franCode };
    const { data: totalData, isSuccess: totalSuccess } = ETC_SERVICE.useMusicTotal(totalParam);
    if (totalSuccess) { 
        tableBody = totalData;
    }

    return (
        <>
            {tableBody.map((tr: any, idx: number) => {
                const {item, std_date, supply_amt, total_amt, vat_amt} = tr;
                return (
                    <tr key={`etc_table_td_${idx}`}>
                        <td>{std_date}</td>   
                        <td>{item}</td>   
                        <td>{Utils.numberComma(supply_amt)}</td>   
                        <td>{Utils.numberComma(vat_amt)}</td>   
                        <td>{Utils.numberComma(total_amt)}</td>   
                    </tr>
                )
            })}
        </>
    )
}

const EtcGiftCardTotalTableData = () => {
    const franCode = useRecoilValue(franState);

    let tableBody: any = []; // 프로시저 성공 후 업데이트
    const totalParam: ChkGiftCardStockParams = { f_code: franCode };
    const { data: totalData, isSuccess: totalSuccess } = ETC_SERVICE.useChkGiftCardStock(totalParam);
    if (totalSuccess) { 
        console.log(totalData)
        tableBody = totalData;
    }  

    const handleClassName = (fran: number, hq:number) => {
        if(fran !== hq) return 'negative-value'
        else return ''
    }

    return (
        <>
            <tr>
                <td>매장 보유 재고</td>
                <td className={`align-center ${tableBody.cnt1_class}`}>{tableBody.fran_stock_cnt1}장 ({tableBody.fran_stock_amt1})</td>
                <td className={`align-center ${tableBody.cnt3_class}`}>{tableBody.fran_stock_cnt3}장 ({tableBody.fran_stock_amt3})</td>
                <td className={`align-center ${tableBody.cnt5_class}`}>{tableBody.fran_stock_cnt5}장 ({tableBody.fran_stock_amt5})</td>
                {/* check */}
                <td className={`align-center ${tableBody.total_class}`}>{tableBody.fran_stock_cnt_total}장 ({tableBody.fran_stock_amt_total})</td>
            </tr>
            <tr>
                <td>본사DB 재고</td>
                <td className={`align-center ${tableBody.cnt1_class}`}>{tableBody.hq_stock_cnt1}장 ({tableBody.hq_stock_amt1})</td>
                <td className={`align-center ${tableBody.cnt3_class}`}>{tableBody.hq_stock_cnt3}장 ({tableBody.hq_stock_amt3})</td>
                <td className={`align-center ${tableBody.cnt5_class}`}>{tableBody.hq_stock_cnt5}장 ({tableBody.hq_stock_amt5})</td>
                {/* check */}
                <td className={`align-center ${tableBody.total_class}`}>{tableBody.hq_stock_cnt_total}장 ({tableBody.hq_stock_amt_total})</td>
            </tr>
        </>
    )
}

const tabList = {
    [ETC_TAB_TYPE.DELIVERY]: {
        title: `${format(subMonths(new Date(), 1), `yyyy년 M월 바나 딜리버리 수수료 내역`)}`,
        colgroup: ['188', '*', '150', '150', '150'],
        thead: ['기간', '품목', '수수료 공급가 (2%)', '부가세 (0.2%)', '수수료 합계 (2.2%)'],
        query: 'YDKG75HJE31EPGS47MXQ',
        queryKey: 'etc_delivery_total',
    },
    [ETC_TAB_TYPE.MUSIC]: {
        title: `${format(subMonths(new Date(), 1), `yyyy년 M월 음악 서비스 이용료`)}`,
        colgroup: ['188', '*', '150', '150', '150'],
        thead: ['기간', '품목', '공급가', '부가세', '수수료 합계 (2.2%)'],
        query: '',
        queryKey: 'etc_music_fee',
    },
    [ETC_TAB_TYPE.GIFTCARD]: {
        title: `실물 상품권 재고 현황`,
        colgroup: ['20%', '20%', '20%', '20%', '20%'],
        thead: ['재고 구분', '1만원권', '3만원권', '5만원권', '합계'],
        query: '',
        queryKey: 'etc_giftcard_statistic',
    },
    [ETC_TAB_TYPE.ORDER]: {
        title: `월별 발주금액 통계`,
        colgroup: ['147', '147', '147', '147', '147', '147', '147', '147', '147', '147'],
        thead: Array.from({ length: 10 }, (_, idx1) => idx1).map((el) => format(subMonths(new Date(), el), 'yyyy-MM')).reverse(),
        query: '2Q65LKD2JBSZ3OWKWTWY',
        queryKey: 'etc_order_detail_statistic',
    },
    [ETC_TAB_TYPE.ROYALTY]: {
        title: `${format(subMonths(new Date(), 1), `yyyy년 M월 로열티 내역`)}`,
        colgroup: ['256', '*', '170', '170', '170'],
        thead: ['기간', '품목', '공급가', '부가세', '합계'],
        query: 'C0UUYOSQY3S4OUKJE7XG',
        queryKey: 'etc_royalty_total',
    },
    [ETC_TAB_TYPE.ACCOUNT]: {
        title: `가상 계좌 잔액`,
        colgroup: ['300', '270', '270', '*', '270', '270'],
        thead: ['매장', '은행', '계좌번호', '충 충전금액', '총 차감금액', '잔액'],
        query: 'FXFBHJ5WT2GYEO9EFZ46',
        queryKey: 'etc_virtual_acc_balance_total',
    },
};