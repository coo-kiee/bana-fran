const Royalty = () => {
    return (
        <div id="tab5" className="tab-content active">
            <div className="info-wrap">
                <p>※ 매우러 매장 로열티를 조회할 수 있습니다.<strong>(가상계좌 자동 차감되므로 정산내역에는 반영되지 않습니다.)</strong></p>
            </div>
            <div className="board-date-wrap">
                {/* <!-- 로열티 내역 --> */}
                <p className="title bullet">2022년 3월 로열티 내역</p>
                <table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
                    <colgroup>
                        <col width="256" />
                        <col width="*" />
                        <col width="170" />
                        <col width="170" />
                        <col width="170" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>기간</th>
                            <th>품목</th>
                            <th>공급가</th>
                            <th>부가세</th>
                            <th>합계</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="align-center">2022/03/01~2022/03/30</td>
                            <td className="align-left">로열티</td>
                            <td className="align-right">150,000</td>
                            <td className="align-right">150,000</td>
                            <td className="align-right"><strong>150,000</strong></td>
                        </tr>
                    </tbody>
                </table>
                {/* <!-- // 로열티 내역 --> */}

                <p className="title bullet">상세 내역</p>
                {/* <!-- 검색 --> */}
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
                {/* <!-- // 검색 --> */}

                {/* <!-- 조회 기간 --> */}
                <div className="search-result-wrap">
                    <div className="search-date">
                        <p>조회기간: 2022-12-31 ~ 2022-12-31</p>
                    </div>
                    <ul className="search-result">
                        <li className="hyphen">로열티 합계<span className="colon"></span><span className="value">10,000원</span></li>
                    </ul>
                    <div className="price-info">
                        <p className="hyphen">로열티는 일할 계산되지 않습니다. (월 단위 요금 청구)</p>
                    </div>
                </div>
                {/* <!-- // 조회 기간 --> */}
            </div>

            {/* <!-- 게시판 --> */}
            <table className="board-wrap" cellPadding="0" cellSpacing="0">
                <colgroup>
                    <col width="225" />
                    <col width="*" />
                    <col width="150" />
                    <col width="150" />
                    <col width="150" />
                </colgroup>
                <thead>
                    <tr>
                        <th rowSpan={2}>기간</th>
                        <th rowSpan={2}>구분</th>
                        <th colSpan={3} className="price-area">BGM 서비스 이용료</th>
                    </tr>
                    <tr>
                        <td className="price-area">공급가</td>
                        <td className="price-area">부가세</td>
                        <td className="price-area">합계</td>
                    </tr>
                </thead>
                <tbody>

                    <tr>
                        <td className="align-center">2022/04</td>
                        <td className="align-left">로열티</td>
                        <td className="align-center">136,364</td>
                        <td className="align-center">136,364</td>
                        <td className="align-center"><strong>150,000</strong></td>
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
            {/* <!-- // 엑셀다운, 페이징, 정렬 --> */}
        </div>

    )
}

export default Royalty;