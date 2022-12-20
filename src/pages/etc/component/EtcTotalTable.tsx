import React, { FC } from 'react';
import { format, subMonths } from 'date-fns';
import { useQueryErrorResetBoundary } from 'react-query';

// type
import { ETC_TAB_TYPE, ChkGiftCardStockParams } from 'types/etc/etcType';
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

const EtcTotalTable: FC<{ currTab: number }> = ({ currTab }) => {
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
        if(accNum.length <= 11) return [accNum.slice(0, 3), accNum.slice(3, 5), accNum.slice(5)].join('-'); // XXX-YY-ZZZZZC
        else if(accNum.length === 12) return [accNum.slice(0, 3), accNum.slice(3, 5), accNum.slice(5)].join('-'); // XXX-YY-ZZZZZZC
        else if(accNum.length === 13) return [accNum.slice(0, 4), accNum.slice(4, 7), accNum.slice(7)].join('-'); // SYYY-CZZ-ZZZZZZ
        else if(accNum.length >= 14) return [accNum.slice(0, 3), accNum.slice(3, 9), accNum.slice(9, 11), accNum.slice(11)].join('-'); // XXX-BBBBBB-YY-ZZC
        else return accNum; 
    };

    // TODO: 프로시저 
    let tableBody: any = []; // 프로시저 성공 후 업데이트
    const totalParam: { fran_store: number } = { fran_store: franCode };
    const { data: totalData, isSuccess: totalSuccess } = ETC_SERVICE.useEtcTotal<{ fran_store: number }, any>(tabList[currTab].query, totalParam, tabList[currTab].queryKey);
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
        } else if ( currTab === ETC_TAB_TYPE.ROYALTY) { // TODO: 로열티 페이지 상단 테이블
            tableBody = [
                [
                    { data: totalData.std_date },
                    { data: totalData.item },
                    { data: Utils.numberComma(totalData.supply_amt) },
                    { data: Utils.numberComma(totalData.vat_amt) },
                    { data: Utils.numberComma(totalData.total_amt), strong: true },
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

    let tableBodyTotal: any; // 프로시저 성공 후 업데이트
    let tableBodySupply: any; // 프로시저 성공 후 업데이트
    let tableBodyVat: any; // 프로시저 성공 후 업데이트

    const totalParam: { fran_store: number } = { fran_store: franCode };
    const { data, isSuccess: totalSuccess } = ETC_SERVICE.useOrderDetailStatistic(totalParam);
    if (totalSuccess) {
        tableBodyTotal = [[{data: '발주금액(합계)', className: 'align-center'}, ...data.map((el: any) => ({ data: el.amount, className: 'align-right' }))]];
        tableBodySupply = [[{data: '공급가', className: 'align-center'}, ...data.map((el: any) => ({ data: el.supply_amt, className: 'align-right' }))]];
        tableBodyVat = [[{data: '부가세', className: 'align-center'}, ...data.map((el: any) => ({ data: el.vat_amt, className: 'align-right' }))]];
    }

    return (
        <>
            {tableBodyTotal.map((tr: any, idx: number) => {
                return (
                    <tr key={`etc_table_tr_total_${idx}`}>
                        {tr.map((td: any, idx: number) => <td key={`etc_table_td_${idx}`} className={td.className}>{td.strong ? <strong>{td.data}</strong> : td.data}</td>)}
                    </tr>
                )
            })}
            {tableBodySupply.map((tr: any, idx: number) => {
                return (
                    <tr key={`etc_table_tr_supply_${idx}`}>
                        {tr.map((td: any, idx: number) => <td key={`etc_table_td_${idx}`} className={td.className}>{td.strong ? <strong>{td.data}</strong> : td.data}</td>)}
                    </tr>
                )
            })}
            {tableBodyVat.map((tr: any, idx: number) => {
                return (
                    <tr key={`etc_table_tr_vat_${idx}`}>
                        {tr.map((td: any, idx: number) => <td key={`etc_table_td_${idx}`} className={td.className}>{td.strong ? <strong>{td.data}</strong> : td.data}</td>)}
                    </tr>
                )
            })} 
        </>
    )
}

// TODO: 음악 수수료, 로열티 페이지 상단 테이블
const EtcMusicTotalTableData = () => {
    const franCode = useRecoilValue(franState);

    let tableBody: any = []; // 프로시저 성공 후 업데이트
    const totalParam: { fran_store: number } = { fran_store: franCode };
    const { data: totalData, isSuccess: totalSuccess } = ETC_SERVICE.useMusicTotal(totalParam);
    if (totalSuccess) { 
        tableBody = totalData.map((item: any) => {
            return [
                {data: item.std_date, className:'align-center'},
                {data: item.item, className:'align-left' },
                {data: Utils.numberComma(item.supply_amt), className:'align-center'},
                {data: Utils.numberComma(item.vat_amt), className:'align-center'},
                {data: Utils.numberComma(item.total_amt), className:'align-center'},
            ]
        });
    }

    return (
        <>
            {tableBody.map((tr: any, idx: number) => {
                return (
                    <tr key={`etc_table_tr_${idx}`}>
                        {tr.map((td: any, idx: number) => <td className={td.className} key={`etc_table_td_${idx}`}>{td.data}</td>)}
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
        tableBody = totalData;
    }  

    return (
        <>
            <tr>
                <td>매장 보유 재고</td>
                <td className={`align-center ${tableBody.cnt1_class}`}>{tableBody.fran_stock_cnt1}장 ({tableBody.fran_stock_amt1})</td>
                <td className={`align-center ${tableBody.cnt3_class}`}>{tableBody.fran_stock_cnt3}장 ({tableBody.fran_stock_amt3})</td>
                <td className={`align-center ${tableBody.cnt5_class}`}>{tableBody.fran_stock_cnt5}장 ({tableBody.fran_stock_amt5})</td> 
                <td className={`align-center ${tableBody.total_class}`}>{tableBody.fran_stock_cnt_total}장 ({tableBody.fran_stock_amt_total})</td>
            </tr>
            <tr>
                <td>본사DB 재고</td>
                <td className={`align-center ${tableBody.cnt1_class}`}>{tableBody.hq_stock_cnt1}장 ({tableBody.hq_stock_amt1})</td>
                <td className={`align-center ${tableBody.cnt3_class}`}>{tableBody.hq_stock_cnt3}장 ({tableBody.hq_stock_amt3})</td>
                <td className={`align-center ${tableBody.cnt5_class}`}>{tableBody.hq_stock_cnt5}장 ({tableBody.hq_stock_amt5})</td> 
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
        query: '', // 개별 프로시저
        queryKey: 'etc_music_fee',
    },
    [ETC_TAB_TYPE.GIFTCARD]: {
        title: `실물 상품권 재고 현황`,
        colgroup: ['20%', '20%', '20%', '20%', '20%'],
        thead: ['재고 구분', '1만원권', '3만원권', '5만원권', '합계'],
        query: '', // 개별 프로시저
        queryKey: 'etc_giftcard_statistic',
    },
    [ETC_TAB_TYPE.ORDER]: {
        title: `월별 발주금액 통계`,
        colgroup: ['147', '147', '147', '147', '147', '147', '147', '147', '147', '147', '147'],
        thead: Array.from({ length: 11 }, (_, idx1) => idx1).map((el, idx, thisArg) => idx + 1 !== thisArg.length ? format(subMonths(new Date(), el), 'yyyy-MM') : '구분').reverse(),
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
