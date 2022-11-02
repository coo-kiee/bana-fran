const GiftCard = () => {
    return (
        <div id="tab3" className="tab-content active">
            <div className="info-wrap">
                <p>※ 실물 상품권 발주/위탁판매내역을 조회할 수 있습니다.<strong>(가상계좌 자동 차감되므로 정산내역에는 반영되지 않습니다.)</strong></p>
            </div>
            <div className="board-date-wrap">
                {/* <!-- 재고 현황 --> */}
                <p className="title bullet">실물 상품권 재고 현황</p>
                <table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
                    <colgroup>
                        <col width="25%" />
                        <col width="25%" />
                        <col width="25%" />
                        <col width="25%" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>1만원권</th>
                            <th>3만원권</th>
                            <th>5만원권</th>
                            <th>합계</th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr>
                            <td className="align-center">10장 (100,000원)</td>
                            <td className="align-center">9장 (270,000원)</td>
                            <td className="align-center">2장 (100,000원)</td>
                            <td className="align-center">21장 (470,000원)</td>
                        </tr>
                    </tbody>
                </table>
                {/* <!-- //재고 현황 --> */}

                {/* <!-- 상세 내역 --> */}
                <p className="title bullet">상세내역</p>
                <div className="search-wrap">
                    <div className="input-wrap">
                        <input type="text" placeholder="2022-03-01" />
                        <i>~</i>
                        <input type="text" placeholder="2022-03-30" />
                    </div>
                    <div className="select-wrap">
                        <select name="" id="">
                            <option value="">판매기기 전체</option>
                        </select>
                    </div>
                    <button className="btn-search">조회</button>
                </div>
                {/* <!-- // 상세 내역 --> */}

                {/* <!-- 조회 기간 --> */}
                <div className="search-result-wrap">
                    <div className="search-date">
                        <p>조회기간: 2022-12-31 ~ 2022-12-31</p>
                    </div>
                    <ul className="search-result">
                        <li className="hyphen">발주금액 합계<span className="colon"></span><span className="value">10,000원</span></li>
                        <li className="hyphen">키오스크/POS 판매금액 합계<span className="colon"></span><span className="value">10,000원</span></li>
                        <li className="hyphen">어플 판매금액 합계<span className="colon"></span><span className="value">10,000원</span></li>
                        <li className="hyphen">판매취소(폐기)금액 합계<span className="colon"></span><span className="value">10,000원</span></li>
                    </ul>
                    <div className="price-info">
                        <p className="hyphen">키오스크/POS 판매금액은 가상계좌에서 자동 차감됩니다.</p>
                        <p className="hyphen">어플 판매금액은 가상계좌에서 차감되지 않습니다.</p>
                        <p className="hyphen">판매취소된 상품권은 폐기되므로 재고에 반영되지 않습니다.</p>
                    </div>
                </div>
                {/* <!-- // 조회 기간 --> */}

                {/* <!-- 게시판 --> */}
                <table className="board-wrap" cellPadding="0" cellSpacing="0">
                    <colgroup>
                        <col width="195" />
                        <col width="195" />
                        <col width="195" />
                        <col width="195" />
                        <col width="195" />
                        <col width="195" />
                        <col width="150" />
                        <col width="150" />
                        <col width="150" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th rowSpan={2}>일시</th>
                            <th rowSpan={2}>구분</th>
                            <th rowSpan={2}>상품권종</th>
                            <th rowSpan={2}>수령(금액)</th>
                            <th rowSpan={2}>판매기기</th>
                            <th rowSpan={2}>가상계좌<br />충전/차감</th>
                            <th colSpan={3} className="price-area">재고</th>
                        </tr>
                        <tr>
                            <td className="price-area">1만원권</td>
                            <td className="price-area">3만원권</td>
                            <td className="price-area">5만원권</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="align-center">2022/12/31 12:30</td>
                            <td className="align-center">판매취소(폐기)</td>
                            <td className="align-center">3만원</td>
                            <td className="align-center">1장 (30,000)</td>
                            <td className="align-center">어플</td>
                            <td className="align-right">+10,000</td>
                            <td></td>
                            <td></td>
                            <td className="align-center">1장 (50,000)</td>
                        </tr>
                        <tr>
                            <td className="align-center">2022/12/31 12:30</td>
                            <td className="align-center">판매취소(폐기)</td>
                            <td className="align-center">3만원</td>
                            <td className="align-center">1장 (30,000)</td>
                            <td className="align-center">어플</td>
                            <td className="align-right negative-value">-10,000</td>
                            <td className="align-center">1장 (10,000)</td>
                            <td className="align-center">1장 (30,000)</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
                {/* <!-- // 게시판 --> */}

                {/* <!-- 엑셀다운, 페이징, 정렬 --> */}
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
                {/* <!-- 엑셀다운, 페이징, 정렬 --> */}
            </div>
        </div>
    )
}

export default GiftCard;