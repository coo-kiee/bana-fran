import React from 'react';
import { useQueryErrorResetBoundary } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';

const ExtraContainer = () => {
    const { reset } = useQueryErrorResetBoundary();

    return (
        <section className="container">
            <header>
                <div className="page-title membership">
                    <p className="present">멤버십현황</p>
                    <p className="spot">스탬프/쿠폰/바나포인트</p>
                </div>
            </header>
            <section className="contents-wrap membership_current">
                <React.Suspense fallback={<div>로딩중</div>}>
                    <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <div onClick={resetErrorBoundary}>에러</div>} >
                        <ExtraConatainerData />
                    </ErrorBoundary>
                </React.Suspense>
            </section>
        </section>
    )
}

const ExtraConatainerData = () => {
    return (
        <div className='contents'>
            <div className="info-wrap">
                <p>※ 매장의 스탬프, 무료음료쿠폰, 바나포인트의 적립/사용 현황을 조회할 수 있습니다. (최대 12개월 이내)</p>
            </div>
            <div className="board-date-wrap">
                {/* <!--클레임 보상내역 --> */}
                <p className="title bullet">실시간 누적 현황
                    <span className="sub-title hyphen">무료음료쿠폰의 사용금액은 고객이 실제 결제 시 사용한 금액이므로 발급된 액면가보다 낮을 수 있습니다.</span>
                    <span className="sub-title hyphen point">월간랭킹보상쿠폰은 액면가 없는 무료음료쿠폰으로 실제 사용된 경우에만 금액에 합산됩니다.</span>
                </p>
                <table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
                    <thead>
                        <tr>
                            <th colSpan={4} className="boder-th-a">스탬프</th>
                            <th colSpan={4} className="price-area boder-th-b">무료음료쿠폰 (스탬프적립&월간랭킹보상)</th>
                            <th colSpan={4} className="boder-th-a">바나포인트 (적립&월간랭킹보상)</th>
                        </tr>
                        <tr>
                            {/* <!-- 스탬프 --> */}
                            <th className="height-63">총 지급 수</th>
                            <th className="height-63">총 쿠폰전환 수</th>
                            <th className="height-63">총 유효기관 소멸 수</th>
                            <th className="height-63">쿠폰 미전환 수</th>
                            {/* <!-- 무료음표쿠폰 --> */}
                            <th className="price-area height-63">총 발급수<p>(금액)</p></th>
                            <th className="price-area height-63">총 사용 수<p>(금액)</p></th>
                            <th className="price-area height-63">총 유효기관 소멸 수<p>(금액)</p></th>
                            <th className="price-area height-63">쿠폰 미전환 수<p>(금액)</p></th>
                            {/* <!-- 바나포인트 --> */}
                            <th className="height-63">총 지급 수</th>
                            <th className="height-63">총 쿠폰전환 수</th>
                            <th className="height-63">총 유효기관 소멸 수</th>
                            <th className="height-63">쿠폰 미전환 수</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>충무로점</td>
                            <td>800개</td>
                            <td>100개</td>
                            <td className="point">100개</td>
                            <td>1,000개<p>(3,000,000원)</p></td>
                            <td>1,100개<p>(3,000,000원)</p></td>
                            <td>100개<p>(3,000,000원)</p></td>
                            <td className="point">300개<p>(3,000,000원)</p></td>
                            <td>1,000,000P</td>
                            <td>1,000,000P</td>
                            <td>1,000,000P</td>
                            <td className="point">1,000,000P</td>
                        </tr>
                    </tbody>
                </table>
                {/* <!-- //클레임 보상내역 --> */}
                <div className="title bullet">상세내역</div>
                <div className="search-wrap">
                    <div className="input-wrap">
                        <input type="text" placeholder="2022-03-01" />
                        <i>~</i>
                        <input type="text" placeholder="2022-03-30" />
                    </div>
                    <button className="btn-search">조회</button>
                </div>
                <div className="search-result-wrap">
                    <div className="search-date">
                        <p>조회기간: 2022-12-31 ~ 2022-12-31</p>
                    </div>
                </div>
                <table className="board-wrap" cellPadding="0" cellSpacing="0">
                    <colgroup>
                        <col width="162" />
                        <col width="162" />
                        <col width="162" />
                        <col width="162" />
                        <col width="162" />
                        <col width="162" />
                        <col width="162" />
                        <col width="162" />
                        <col width="162" />
                        <col width="162" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th rowSpan={2}>일시</th>
                            <th colSpan={3} className="price-area boder-th-b">스탬프</th>
                            <th colSpan={3} className="boder-th-a">무료음료쿠폰(스탬프적립&월간랭킹보상)</th>
                            <th colSpan={3} className="price-area boder-th-b">바나포인트 (적립&월간뱅킹보상)</th>
                        </tr>
                        <tr>
                            <th className="price-area height-63">지급 수</th>
                            <th className="price-area height-63">쿠폰전환 수</th>
                            <th className="price-area height-63">유효기간 소멸 수</th>
                            <th className="height-63">발급 수<p>(금액)</p></th>
                            <th className="height-63">사용 수<p>(금액)</p></th>
                            <th className="height-63">유효기간 소멸 수<p>(금액)</p></th>
                            <th className="price-area height-63">공급가</th>
                            <th className="price-area height-63">부가세</th>
                            <th className="price-area height-63">합계</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="total">합계</td>
                            <td className="total">1,000개</td>
                            <td className="total">800개</td>
                            <td className="total">100개</td>
                            <td className="total">1,000개<p>(3,000,000원)</p></td>
                            <td className="total">500개<p>(3,000,000원)</p></td>
                            <td className="total">200개<p>(3,000,000원)</p></td>
                            <td className="total">1,000,000P</td>
                            <td className="total">1,000,000P</td>
                            <td className="total">1,000,000P</td>
                        </tr>
                        <tr>
                            <td>합계</td>
                            <td>1,000개</td>
                            <td>800개</td>
                            <td>100개</td>
                            <td>1,000개<p>(3,000,000원)</p></td>
                            <td>500개<p>(3,000,000원)</p></td>
                            <td>200개<p>(3,000,000원)</p></td>
                            <td>1,000,000P</td>
                            <td>1,000,000P</td>
                            <td>1,000,000P</td>
                        </tr>
                        <tr>
                            <td>합계</td>
                            <td>1,000개</td>
                            <td>800개</td>
                            <td>100개</td>
                            <td>1,000개<p>(3,000,000원)</p></td>
                            <td>500개<p>(3,000,000원)</p></td>
                            <td>200개<p>(3,000,000원)</p></td>
                            <td>1,000,000P</td>
                            <td>1,000,000P</td>
                            <td>1,000,000P</td>
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

export default ExtraContainer;