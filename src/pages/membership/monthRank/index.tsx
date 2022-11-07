import React, { useState } from 'react';
import { useQueryErrorResetBoundary } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';

// type
import { PopupOrderDetailType } from 'types/etc/etcType';

// component
import PrizeEdit from './component/PrizeEdit';

interface MonthRankContainerDataProps {
    setPopupOrderDetail: React.Dispatch<React.SetStateAction<PopupOrderDetailType>>
}
const MonthRankContainer = () => {
    const { reset } = useQueryErrorResetBoundary();
    const [popupOrderDetail, setPopupOrderDetail] = useState<PopupOrderDetailType>({
        show: false,
        data: []
    }); // EtcOrderDetail 열림 여부

    return (
        <>
            <section className="container">
                <header>
                    <div className="page-title membership">
                        <p className="present">멤버십현황</p>
                        <p className="spot">월간 랭킹 현황</p>
                    </div>
                </header>
                <section className="contents-wrap membership_ranking">
                    <React.Suspense fallback={<div>로딩중</div>}>
                        <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <div onClick={resetErrorBoundary}>에러</div>} >
                            <MonthRankContainerData setPopupOrderDetail={setPopupOrderDetail} />
                        </ErrorBoundary>
                    </React.Suspense>
                </section>
            </section>
            {popupOrderDetail.show && <PrizeEdit setPopupOrderDetail={setPopupOrderDetail} />}
        </>
    )
}

const MonthRankContainerData: React.FC<MonthRankContainerDataProps> = ({ setPopupOrderDetail }) => {
    return (
        <div className="contents">
            <div className="info-wrap">
                <p>※ 매장의 월간 랭킹 보상 지급 설정 및 현황을 조회할 수 있습니다.</p>
            </div>
            <div className="board-date-wrap">
                {/* <!--클레임 보상내역 --> */}
                <p className="title bullet">랭킹 보상 설정
                    <span className="sub-title hyphen">월간랭킹 1~5위 고객에 대한 보상(바나포인트/무료음료쿠폰)을 등록할 수 있습니다.</span>
                    <span className="sub-title hyphen">설정된 보상은 익월 1일에 자동 지급됩니다.</span>
                    <span className="sub-title hyphen">월강랭킹보상 무료음료쿠폰은 최대금액 제한없이 모든 음료가 구매가능한 쿠폰입니다.</span>
                </p>
                <table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
                    <colgroup>
                        <col width="232" />
                        <col width="232" />
                        <col width="232" />
                        <col width="232" />
                        <col width="232" />
                        <col width="232" />
                        <col width="232" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>매장</th>
                            <th>1위</th>
                            <th>2위</th>
                            <th>3위</th>
                            <th>4위</th>
                            <th>5위</th>
                            <th>설정</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>충무로점</td>
                            <td>바나포인트<p>(20,000점)</p></td>
                            <td>음료무료쿠폰<p>(2장)</p></td>
                            <td>없음</td>
                            <td>없음</td>
                            <td>없음</td>
                            <td className="setting-view" onClick={() => setPopupOrderDetail((prev) => ({ ...prev, show: true }))}>설정하기</td>
                        </tr>
                    </tbody>
                </table>
                {/* <!-- //클레임 보상내역 --> */}
                <div className="title bullet">보상 지급 내역</div>
                <div className="search-wrap">
                    <div className="input-wrap">
                        <input type="text" placeholder="2022-03-01" />
                        <i>~</i>
                        <input type="text" placeholder="2022-03-30" />
                    </div>
                    <button className="btn-search">조회</button>
                </div>
                <table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
                    <colgroup>
                        <col width="325" />
                        <col width="325" />
                        <col width="325" />
                        <col width="325" />
                        <col width="325" />
                    </colgroup>
                    <thead>

                        <tr>
                            <th>기준일</th>
                            <th>매장</th>
                            <th>당월 랭킹</th>
                            <th>지급 대상자</th>
                            <th>지급 경품</th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr>
                            <td>2022-04</td>
                            <td>충무로점</td>
                            <td>1</td>
                            <td>0101234**** <span>(닉네임)</span></td>
                            <td>바나포인트<p>(20,000점)</p></td>
                        </tr>
                        <tr>
                            <td>2022-04</td>
                            <td>충무로점</td>
                            <td>1</td>
                            <td>0101234**** <span>(닉네임)</span></td>
                            <td>바나포인트<p>(20,000점)</p></td>
                        </tr>
                        <tr>
                            <td>2022-04</td>
                            <td>충무로점</td>
                            <td>1</td>
                            <td>0101234**** <span>(닉네임)</span></td>
                            <td>바나포인트<p>(20,000점)</p></td>
                        </tr>
                        <tr>
                            <td>2022-04</td>
                            <td>충무로점</td>
                            <td>1</td>
                            <td>0101234**** <span>(닉네임)</span></td>
                            <td>바나포인트<p>(20,000점)</p></td>
                        </tr>
                    </tbody>
                </table>
                <div className="result-function-wrap">
                    <div className="function">
                        <button className="goast-btn">엑셀다운</button>
                    </div>
                    <div className="paging-wrap">
                        <button className="btn-prev"></button>
                        <ul className="paging">
                            <li className="active">1</li>
                            <li>2</li>
                            <li>3</li>
                            <li>4</li>
                            <li>5</li>
                        </ul>
                        <button className="btn-next"></button>
                    </div>
                    <select className="filter-number" name="" id="">
                        <option value="">50개</option>
                    </select>
                </div>
            </div>
        </div>
    )
}

export default MonthRankContainer;