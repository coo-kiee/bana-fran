import React, { useState, FC } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from 'react-query';
import { format, subMonths, lastDayOfMonth } from 'date-fns';
import { useRecoilValue } from 'recoil';

// state
import { franState } from 'state';

// component
import EtcTable from "pages/etc/component/EtcTable";
import Loading from "pages/common/loading";
import SuspenseErrorPage from "pages/common/suspenseErrorPage";
import CalanderSearch from 'pages/common/calanderSearch';
import EtcSearchDetail from 'pages/etc/component/EtcSearchDetail';

// type
import { SearchInfoType, EtcTotalParams, TotalResultType, RoyaltyOverallProps } from 'types/etc/etcType';
import ETC_SERVICE from 'service/etcService';

const RoyaltyOverall: FC<Omit<RoyaltyOverallProps, 'title'>> = (props) => {
    const { tableColGroup, tableHead, searchInfo } = props;
    // 로열티 내역(total) + 로열티 검색, 조회기간
    const { reset } = useQueryErrorResetBoundary();
    const title = `${format(subMonths(new Date(), 1), `yyyy년 M월 로열티 내역`)}`;

    return (
        <>
            <React.Suspense
                fallback={
                    <>
                        {/* 로열티 내역 테이블 컴포넌트 */}
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
                            {/* 로열티 내역 테이블 컴포넌트 */}
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
                }}
                >
                    {/* 로열티 내역 */}
                    <RoyaltyOverallData title={title} {...props} />
                </ErrorBoundary>
            </React.Suspense>
        </>
    )
}

const RoyaltyOverallData: FC<RoyaltyOverallProps> = ({ title, tableColGroup, tableHead, detailPriceInfo, handleSearchInfo, searchInfo }) => {
    const franCode = useRecoilValue(franState);

    // TODO: 프로시저 
    let tableBody: any = [];
    let detailSearchResult: any = [];
    const etcRoyaltyTotalParam: EtcTotalParams = { fran_store: franCode };
    const { data: totalData, isSuccess: etcRoyaltyTotalSuccess } = ETC_SERVICE.useEtcTotal<any, TotalResultType>('C0UUYOSQY3S4OUKJE7XG', etcRoyaltyTotalParam, 'etc_royalty_total');

    if (etcRoyaltyTotalSuccess) {
        // console.log('etcRoyaltyTotal: ', totalData)
        tableBody = [
            [
                { data: `${format(subMonths(new Date(), 1), 'yyyy/MM/01')}~${format(lastDayOfMonth(subMonths(new Date(), 1)), 'yyyy/MM/dd')}` },
                { data: '로열티' },
                { data: '150,000' },
                { data: '150,000' },
                { data: '150,000', strong: true },
            ]
        ];
        detailSearchResult = [
            ['로열티 합계', '10,000'],
            ['공연권료 합계', '10,000'],
        ]
    }

    return (
        <>
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
                <EtcTable title={title} colGroup={tableColGroup} thead={tableHead} tbody={tableBody} />
            </table>

            <RoyaltyOverallSearch handleSearchInfo={handleSearchInfo} />
            <EtcSearchDetail searchDate={`${searchInfo.from} ~ ${searchInfo.to}`} searchResult={detailSearchResult} priceInfo={detailPriceInfo} />
        </>
    )
}

interface RoyaltyOverallSearchProps {
    handleSearchInfo: (currentTempSearchInfo: SearchInfoType) => void
}
const RoyaltyOverallSearch: FC<RoyaltyOverallSearchProps> = ({ handleSearchInfo }) => {
    // 로열티 검색
    const [tempSearchInfo, setTempSearchInfo] = useState<SearchInfoType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM-01'),
        to: format(lastDayOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
    }); // etcSearch 내부 검색 날짜 관련 보여질 state 

    return (
        <CalanderSearch
            title={`상세내역`}
            dateType={'yyyy-MM-dd'}
            searchInfo={tempSearchInfo}
            setSearchInfo={setTempSearchInfo}
            handleSearch={() => handleSearchInfo(tempSearchInfo)} // 조회 버튼에 필요한 fn
        />
    )
}

export default RoyaltyOverall;