import React, { FC } from 'react';
import { format, subMonths } from 'date-fns';
import { useQueryErrorResetBoundary } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { useRecoilValue } from 'recoil';
import Utils from 'utils/Utils';

// type
import { ETC_TAB_TYPE } from 'types/etc/etcType';

// component
import Loading from 'pages/common/loading';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';

// state
import { franState } from 'state';

// service
import ETC_SERVICE from 'service/etcService';

const EtcTotalTable: FC<{ currTab: ETC_TAB_TYPE }> = ({ currTab }) => {
    const franCode = useRecoilValue(franState);
    const { reset } = useQueryErrorResetBoundary(); 

    const handleTotalTableData = (currTab: ETC_TAB_TYPE) => {
        if(currTab === ETC_TAB_TYPE.ORDER) return <EtcOrderTotalTableData franCode={franCode} />
        else if(currTab === ETC_TAB_TYPE.MUSIC) return <EtcMusicTotalTableData franCode={franCode} />
        else if (currTab === ETC_TAB_TYPE.GIFTCARD) return <EtcGiftCardTotalTableData franCode={franCode} />
        else return <EtcTotalTableData currTab={currTab} franCode={franCode} />
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

/**
 * 기타내역 내 바나 딜리버리 수수료, 발주내역, 로열티, 가상계좌 충전/차감 페이지의 가장 최근 한달 내역 테이블 입니다.
 */
const EtcTotalTableData: FC<{ currTab: number, franCode: number }> = ({ currTab, franCode }) => {
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
 
    let tableBody: any = []; // 프로시저 성공 후 업데이트 
    const { data: totalData, isSuccess: totalSuccess } = ETC_SERVICE.useEtcTotal<{ fran_store: number }, any>(tabList[currTab].query, { fran_store: franCode }, tabList[currTab].queryKey);
    if (totalSuccess) {
        if (currTab === ETC_TAB_TYPE.DELIVERY) {
            tableBody = [
                [
                    { data: `${totalData.std_date}` },
                    { data: `${totalData.item}` },
                    { data: `${Utils.numberComma(totalData.supply_amt)}` },
                    { data: `${Utils.numberComma(totalData.vat_amt)}` },
                    { data: `${Utils.numberComma(totalData.total_amt)}` },
                ]
            ];
        } else if ( currTab === ETC_TAB_TYPE.ROYALTY) {
            tableBody = [
                [
                    { data: totalData.std_date },
                    { data: totalData.item },
                    { data: Utils.numberComma(totalData.supply_amt) },
                    { data: Utils.numberComma(totalData.vat_amt) },
                    { data: Utils.numberComma(totalData.total_amt), strong: true },
                ]
            ];
        } else if (currTab === ETC_TAB_TYPE.ACCOUNT) {
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
                        {tr.map((td: any, idx: number) => (
                            <td key={`etc_table_td_${idx}`} className={td.className || handleClassNameDefault(idx)}>
                                {td.strong ? <strong>{td.data}</strong> : td.data}
                            </td>
                        ))}
                    </tr>
                )
            })}
        </>
    )
}

/**
 *  기타내역 내 발주내역 최근 한달 내역 테이블 입니다.
 */
const EtcOrderTotalTableData: FC<{ franCode: number }> = ({ franCode }) => {
    const getColumnData = (header: string, data: any[], keyPrefix: string) => {
        return (
            <>
                {[{ data: header, className: 'align-center' }, ...data.map((el: any) => ({ data: el, className: 'align-right' }))].map((td: any, idx: number) => (
                    <td key={`${keyPrefix}_${idx}`} className={td.className}>{td.strong ? <strong>{td.data}</strong> : td.data}</td>
                ))}
            </>
        );
    };
 
    const { data, isSuccess: totalSuccess } = ETC_SERVICE.useOrderDetailStatistic({ fran_store: franCode });

    return (
        <>
            {totalSuccess && (
                <>
                    <tr key="etc_table_tr_total">
                        {getColumnData('발주금액(합계)', data.map((el: any) => el.amount), 'etc_table_total_td')}
                    </tr>
                    <tr key="etc_table_tr_supply">
                        {getColumnData('공급가', data.map((el: any) => el.supply_amt), 'etc_table_supply_td')}
                    </tr>
                    <tr key="etc_table_tr_vat">
                        {getColumnData('부가세', data.map((el: any) => el.vat_amt), 'etc_table_vat_td')}
                    </tr>
                </>
            )}
        </>
    );
};

/**
 * 기타내역 내 음악 서비스 이용료 최근 한달 내역 테이블 입니다.
 */
const EtcMusicTotalTableData: FC<{ franCode: number }> = ({ franCode }) => {
    let tableBody: any = []; // 프로시저 성공 후 업데이트 
    const { data: totalData, isSuccess: totalSuccess } = ETC_SERVICE.useMusicTotal({fran_store: franCode});
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

/**
 * 기타내역 내 실물상품권 발주/판매 최근 한달 내역 테이블 입니다.
 */
const EtcGiftCardTotalTableData: FC<{ franCode: number }> = ({ franCode }) => {
    const getTableCell = (stockAmount: string, stockCount: any, className: string) => (
        <td className={`align-center ${className}`}>{stockCount}장 ({stockAmount})</td>
    );

    const { data: totalData, isSuccess: totalSuccess } = ETC_SERVICE.useChkGiftCardStock({ f_code: franCode });

    return (
        <>
            {totalSuccess && (
                <>
                    <tr>
                        <td>매장 보유 재고</td>
                        {getTableCell(totalData.fran_stock_amt1, totalData.fran_stock_cnt1, totalData.cnt1_class)}
                        {getTableCell(totalData.fran_stock_amt3, totalData.fran_stock_cnt3, totalData.cnt3_class)}
                        {getTableCell(totalData.fran_stock_amt5, totalData.fran_stock_cnt5, totalData.cnt5_class)}
                        {getTableCell(totalData.fran_stock_amt_total, totalData.fran_stock_cnt_total, totalData.total_class)}
                    </tr>
                    <tr>
                        <td>본사DB 재고</td>
                        {getTableCell(totalData.hq_stock_amt1, totalData.hq_stock_cnt1, totalData.cnt1_class)}
                        {getTableCell(totalData.hq_stock_amt3, totalData.hq_stock_cnt3, totalData.cnt3_class)}
                        {getTableCell(totalData.hq_stock_amt5, totalData.hq_stock_cnt5, totalData.cnt5_class)}
                        {getTableCell(totalData.hq_stock_amt_total, totalData.hq_stock_cnt_total, totalData.total_class)}
                    </tr>
                </>
            )}
        </>
    );
};

const tabList = [
    {
        title: `${format(subMonths(new Date(), 1), `yyyy년 M월 바나 딜리버리 수수료 내역`)}`,
        colgroup: ['188', '*', '150', '150', '150'],
        thead: ['기간', '품목', '수수료 공급가 (2%)', '부가세 (0.2%)', '수수료 합계 (2.2%)'],
        query: 'YDKG75HJE31EPGS47MXQ',
        queryKey: 'etc_delivery_total',
    },
    {
        title: `${format(subMonths(new Date(), 1), `yyyy년 M월 음악 서비스 이용료`)}`,
        colgroup: ['188', '*', '150', '150', '150'],
        thead: ['기간', '품목', '공급가', '부가세', '수수료 합계'],
        query: '', // 개별 프로시저
        queryKey: 'etc_music_fee',
    },
    {
        title: `실물 상품권 재고 현황`,
        colgroup: ['20%', '20%', '20%', '20%', '20%'],
        thead: ['재고 구분', '1만원권', '3만원권', '5만원권', '합계'],
        query: '', // 개별 프로시저
        queryKey: 'etc_giftcard_statistic',
    },
    {
        title: `월별 발주금액 통계`,
        colgroup: ['147', '147', '147', '147', '147', '147', '147', '147', '147', '147', '147', '147'],
        thead: Array.from({ length: 12 }, (_, idx1) => idx1).map((el, idx, thisArg) => idx + 1 !== thisArg.length ? format(subMonths(new Date(), el), 'yyyy-MM') : '구분').reverse(),
        query: '2Q65LKD2JBSZ3OWKWTWY',
        queryKey: 'etc_order_detail_statistic',
    }, {
        title: `${format(subMonths(new Date(), 1), `yyyy년 M월 로열티 내역`)}`,
        colgroup: ['256', '*', '170', '170', '170'],
        thead: ['기간', '품목', '공급가', '부가세', '합계'],
        query: 'C0UUYOSQY3S4OUKJE7XG',
        queryKey: 'etc_royalty_total',
    }, 
    {
        title: `가상 계좌 잔액`,
        colgroup: ['300', '270', '270', '*', '270', '270'],
        thead: ['매장', '은행', '계좌번호', '충 충전금액', '총 차감금액', '잔액'],
        query: 'FXFBHJ5WT2GYEO9EFZ46',
        queryKey: 'etc_virtual_acc_balance_total',
    }
]
