const VirtualAccount = () => {
    return (
        <div id="tab6" className="tab-content active">
            <div className="info-wrap">
                <p>※ 가상계좌 충전/차감 내역을 조회할 수 있습니다.</p>
            </div>
            <div className="board-date-wrap">
                <p className="title bullet">가상 계좌 잔액</p>
                {/* <!-- 가상계좌 잔액 --> */}
                <table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
                    <colgroup>
                        <col width="300" />
                        <col width="270" />
                        <col width="270" />
                        <col width="*" />
                        <col width="270" />
                        <col width="270" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>매장</th>
                            <th>은행</th>
                            <th>계좌번호</th>
                            <th>충 충전금액</th>
                            <th>총 차감금액</th>
                            <th>잔액</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="align-center">충무로점</td>
                            <td className="align-left">OO은행</td>
                            <td className="align-center">1111-111-1111-1111</td>
                            <td className="align-right">10,000,000원</td>
                            <td className="align-right">9,000,000원</td>
                            <td className="align-right"><strong>1,000,000원</strong></td>
                        </tr>
                    </tbody>
                </table>
                {/* <!-- // 가상계좌 잔액 --> */}
                <p className="title bullet">상세 내역</p>
                {/* <!-- 검색 --> */}
                <div className="search-wrap">
                    <div className="input-wrap">
                        <input type="text" placeholder="2022-03-01" />
                        <i>~</i>
                        <input type="text" placeholder="2022-03-30" />
                    </div>
                    <button className="btn-search">조회</button>
                </div>
                {/* <!-- // 검색 --> */}
                {/* <!-- 조회기간 --> */}
                <div className="search-result-wrap">
                    <div className="search-date">
                        <p>조회기간: 2022-12-31 ~ 2022-12-31</p>
                    </div>
                    <ul className="search-result">
                        <li className="hyphen">충전<span className="colon"></span><span className="value">10,000원</span></li>
                        <li className="hyphen">차감<span className="colon"></span><span className="value">10,000원</span></li>
                    </ul>
                </div>
                {/* <!-- // 조회기간 --> */}
            </div>
            {/* <!-- 게시판 --> */}
            <table className="board-wrap" cellPadding="0" cellSpacing="0">
                <colgroup>
                    <col width="170" />
                    <col width="170" />
                    <col width="503" />
                    <col width="503" />
                    <col width="280" />
                </colgroup>
                <thead>

                    <tr>
                        <th>거래일시</th>
                        <th>거래구분</th>
                        <th>거래금액</th>
                        <th>적요</th>
                        <th>발주 건 수</th>
                    </tr>
                </thead>
                <tbody>

                    <tr>
                        <td className="align-center">2022/12/31 12:30</td>
                        <td className="align-center negative-value">차감</td>
                        <td className="align-right negative-value">150,000</td>
                        <td className="align-center">로열티</td>
                        <td className="align-right">10,000</td>
                    </tr>
                    <tr>
                        <td className="align-center">2022/12/31 12:30</td>
                        <td className="align-center negative-value">차감</td>
                        <td className="align-right negative-value">150,000</td>
                        <td className="align-center">바나딜리버리 수수료</td>
                        <td className="align-right">10,000</td>
                    </tr>
                    <tr>
                        <td className="align-center">2022/12/31 12:30</td>
                        <td className="align-center positive-value">차감</td>
                        <td className="align-right positive-value">150,000</td>
                        <td className="align-center">실물 상품권 판매취소</td>
                        <td className="align-right">10,000</td>
                    </tr>
                    <tr>
                        <td className="align-center">2022/12/31 12:30</td>
                        <td className="align-center negative-value">차감</td>
                        <td className="align-right negative-value">150,000</td>
                        <td className="align-center">실물 상품권 판매</td>
                        <td className="align-right">10,000</td>
                    </tr>
                    <tr>
                        <td className="align-center">2022/12/31 12:30</td>
                        <td className="align-center negative-value">차감</td>
                        <td className="align-right negative-value">150,000</td>
                        <td className="align-center">공연권료</td>
                        <td className="align-right">10,000</td>
                    </tr>
                    <tr>
                        <td className="align-center">2022/12/31 12:30</td>
                        <td className="align-center negative-value">차감</td>
                        <td className="align-right negative-value">150,000</td>
                        <td className="align-center">음악사용료</td>
                        <td className="align-right">10,000</td>
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
    )
}

export default VirtualAccount;