import React, { useState, FC } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from 'react-query';
import { format, subMonths } from 'date-fns';
import { useRecoilValue } from 'recoil';
import Utils from 'utils/Utils';

// component
import EtcTable from "pages/etc/component/EtcTable";
import CalanderSearch from 'pages/common/calanderSearch';
import EtcSearchDetail from 'pages/etc/component/EtcSearchDetail';
import Loading from "pages/common/loading";
import SuspenseErrorPage from "pages/common/suspenseErrorPage";

// state
import { franState } from 'state';

// API
import ETC_SERVICE from 'service/etcService';

// type
import { SearchInfoType, EtcTotalParams, TotalResultType, VirtualAccountOverallProps } from "types/etc/etcType"

const VirtualAccountOverall: FC<Omit<VirtualAccountOverallProps, 'title'>> = (props) => {
    const { tableColGroup, tableHead, searchInfo } = props;
    const { reset } = useQueryErrorResetBoundary();
    const title = `가상 계좌 잔액`;

    return (
        <>
            <React.Suspense fallback={
                <>
                    {/* 가상 계좌 잔액 내역 테이블 컴포넌트 */}
                    <p className="title bullet">{title}</p>
                    <table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
                        <colgroup>
                            {tableColGroup.map((col, idx) => <col key={`etc_table_colgroup_${idx}`} width={col} />)}
                        </colgroup>
                        <thead>
                            <tr>
                                {tableHead.map((head, idx) => <th key={`etc_table_thead_${idx}`}>{head}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            <Loading width={50} height={50} isTable={true} />
                        </tbody>
                    </table>

                    {/* 검색 컴포넌트 */}
                    <p className='title bullet'>상세내역</p>
                    <div className="search-wrap">
                        <div className="input-wrap">
                            <input type="text" placeholder={searchInfo.from} defaultValue={searchInfo.from} />
                            <i>~</i>
                            <input type="text" placeholder={searchInfo.to} defaultValue={searchInfo.to} />
                        </div>
                        <button className="btn-search">조회</button>
                    </div>

                    {/*조회기간 관련 */}
                    <div className="search-result-wrap">
                        <div className="search-date">
                            <p>조회기간: {`${searchInfo.from} ~ ${searchInfo.to}`}</p>
                        </div>
                    </div>
                </>
            }
            >
                <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => {
                    return (
                        <>
                            {/* 가상 계좌 상세 내역 테이블 컴포넌트 */}
                            <p className="title bullet">{title}</p>
                            <table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
                                <colgroup>
                                    {tableColGroup.map((col, idx) => <col key={`etc_table_colgroup_${idx}`} width={col} />)}
                                </colgroup>
                                <thead>
                                    <tr>
                                        {tableHead.map((head, idx) => <th key={`etc_table_thead_${idx}`}>{head}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} isTable={true} />
                                </tbody>
                            </table>

                            {/* 검색 컴포넌트 */}
                            <p className='title bullet'>상세내역</p>
                            <div className="search-wrap">
                                <div className="input-wrap">
                                    <input type="text" placeholder={searchInfo.from} defaultValue={searchInfo.from} />
                                    <i>~</i>
                                    <input type="text" placeholder={searchInfo.to} defaultValue={searchInfo.to} />
                                </div>
                                <button className="btn-search">조회</button>
                            </div>

                            {/*조회기간 관련 */}
                            <div className="search-result-wrap">
                                <div className="search-date">
                                    <p>조회기간: {`${searchInfo.from} ~ ${searchInfo.to}`}</p>
                                </div>
                            </div>
                        </>
                    )
                }}>
                    {/* 로열티 내역 */}
                    <VirtualAccountOverallData title={title} {...props} />
                </ErrorBoundary>
            </React.Suspense>
        </>
    )
}

export default VirtualAccountOverall;

// 실제 나타나야하는 컴포넌트
const VirtualAccountOverallData: FC<VirtualAccountOverallProps> = ({ title, tableColGroup, tableHead, searchInfo, handleSearchInfo }) => {
    //  EtcTable + SearchCalander + SearchDetail
    const franCode = useRecoilValue(franState);

    // TODO: 프로시저 
    let tableBody: any = [];
    let detailSearchResult: any = [];
    const etcVirtualAccBalanceParam: EtcTotalParams = { fran_store: franCode };
    const { data: totalData, isSuccess: etcvirtualAccBalanceTotalSuccess } = ETC_SERVICE.useEtcTotal<any, TotalResultType>('FXFBHJ5WT2GYEO9EFZ46', etcVirtualAccBalanceParam, 'etc_virtual_acc_balance_total');

    // TODO: 계좌번호 split fn
    // const handleAccount = (bank: string, accNum: string) => {
    //     if (bank === '우리은행') {
    //         return 
    //     }
    // };

    if (etcvirtualAccBalanceTotalSuccess) {
        tableBody = [
            [
                { data: `${totalData.fran_name}`, },
                { data: `${totalData.bank_code}` },
                { data: `${totalData.account}`, className: 'align-center' },
                { data: `${Utils.numberComma(totalData.total_charge)}원` },
                { data: `${Utils.numberComma(totalData.used_amount)}원` },
                { data: `${Utils.numberComma(totalData.balance)}원`, strong: true },
            ]
        ];
        detailSearchResult = [
            ['충전', `${Utils.numberComma(totalData.total_charge)}`], ['차감', `${Utils.numberComma(totalData.used_amount)}`],
        ];
    }

    return (
        <>
            {/* 가상 계좌 잔액 내역 테이블 */}
            <p className="title bullet">{title}</p>
            <table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
                <colgroup>
                    {tableColGroup.map((col, idx) => <col key={`etc_table_colgroup_${idx}`} width={col} />)}
                </colgroup>
                <thead>
                    <tr>
                        {tableHead.map((head, idx) => <th key={`etc_table_thead_${idx}`}>{head}</th>)}
                    </tr>
                </thead>
                <tbody>
                    <EtcTable title={title} colGroup={tableColGroup} thead={tableHead} tbody={tableBody} />
                </tbody>
            </table>

            {/* 검색 */}
            <VirtualAccOverallSearch handleSearchInfo={handleSearchInfo} />

            {/* 조회기간 관련 */}
            <EtcSearchDetail searchDate={`${searchInfo.from} ~ ${searchInfo.to}`} searchResult={detailSearchResult} />
        </>
    )
}

// 가상 계좌 검색 컴포넌트 
const VirtualAccOverallSearch: FC<{ handleSearchInfo: (currentTempSearchInfo: SearchInfoType) => void }> = ({ handleSearchInfo }) => {
    const [tempSearchInfo, setTempSearchInfo] = useState<SearchInfoType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM'), // 2022-10 
        to: format(new Date(), 'yyyy-MM'), // 2022-11 
    }); // etcSearch 내부 검색 날짜 관련 보여질 state

    return (
        <CalanderSearch
            title={`상세내역`}
            dateType={'yyyy-MM'}
            searchInfo={tempSearchInfo}
            setSearchInfo={setTempSearchInfo}
            handleSearch={() => handleSearchInfo(tempSearchInfo)} // 조회 버튼에 필요한 fn
            showMonthYearPicker={true}
        />
    )
}
