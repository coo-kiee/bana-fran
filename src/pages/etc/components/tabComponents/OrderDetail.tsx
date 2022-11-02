// type
import { TabItemProps } from "types/etcType";

// component
import EtcTable from "../EtcTable";
import EtcSearch from "../EtcSearch";
import EtcSearchDetail from "../EtcSearchDetail";
import EtcDetailTable from "../EtcDetailTable";
import EtcDetailFooter from "../EtcDetailFooter";

const OrderDetail = () => {
    return (
        <div id="tab4" className="tab-content active">
            <div className="info-wrap">
                <p>※ 상세 발주 내역을 조회할 수 있습니다.<strong>(가상계좌 자동 차감되므로 정산내역에는 반영되지 않습니다.)</strong></p>
            </div>
            <div className="board-date-wrap">
                {/* <!-- 월별 발주내역 --> */}
                <p className="title bullet">월별 발주금액 통계</p>
                <table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
                    <colgroup>
                        <col width="147" />
                        <col width="147" />
                        <col width="147" />
                        <col width="147" />
                        <col width="147" />
                        <col width="147" />
                        <col width="147" />
                        <col width="147" />
                        <col width="147" />
                        <col width="147" />
                        <col width="147" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>2022-02</th>
                            <th>2022-03</th>
                            <th>2022-04</th>
                            <th>2022-05</th>
                            <th>2022-06</th>
                            <th>2022-07</th>
                            <th>2022-08</th>
                            <th>2022-09</th>
                            <th>2022-10</th>
                            <th>2022-11</th>
                            <th>2022-12</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="align-right">100,000</td>
                            <td className="align-right">100,000</td>
                            <td className="align-right">100,000</td>
                            <td className="align-right">100,000</td>
                            <td className="align-right">100,000</td>
                            <td className="align-right">100,000</td>
                            <td className="align-right">100,000</td>
                            <td className="align-right">100,000</td>
                            <td className="align-right">100,000</td>
                            <td className="align-right">100,000</td>
                            <td className="align-right">100,000</td>
                        </tr>
                    </tbody>
                </table>
                {/* <!-- // 월별 발주내역 --> */}

                <p className="title bullet">일별 발주 상세 내역</p>
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

                {/* <!-- 조회 기간 --> */}
                <div className="search-result-wrap">
                    <div className="search-date">
                        <p>조회기간: 2022-12-31 ~ 2022-12-31</p>
                    </div>
                    <ul className="search-result">
                        <li className="hyphen">발주금액 합계<span className="colon"></span><span className="value">10,000원</span></li>
                    </ul>
                </div>
                {/* <!-- // 조회 기간 --> */}

                {/* <!-- 게시판 --> */}
                <table className="board-wrap" cellPadding="0" cellSpacing="0">
                    <colgroup>
                        <col width="170" />
                        <col width="170" />
                        <col width="170" />
                        <col width="84" />
                        <col width="104" />
                        <col width="84" />
                        <col width="98" />
                        <col width="98" />
                        <col width="*" />
                        <col width="150" />
                    </colgroup>
                    <thead>

                        <tr>
                            <th>일시</th>
                            <th>최종수정일</th>
                            <th>취소일</th>
                            <th>접수자</th>
                            <th>최종수정자</th>
                            <th>취소자</th>
                            <th>상태</th>
                            <th>발주 건 수</th>
                            <th>발주 건 수</th>
                            <th>발주 건 수</th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr>
                            <td className="align-center">2022/12/31 12:30</td>
                            <td className="align-center">2022/12/31 12:30</td>
                            <td className="align-center">2022/12/31 12:30</td>
                            <td className="align-center">홍길동</td>
                            <td className="align-center">홍길동</td>
                            <td className="align-center">홍길동</td>
                            <td className="align-center">배송완료</td>
                            <td className="align-right">10</td>
                            <td className="align-left order-view">디카페인 원두 (콜롬비아/500G) 외 9건</td>
                            <td className="align-right">10,000</td>
                        </tr>
                        <tr>
                            <td className="align-center">2022/12/31 12:30</td>
                            <td className="align-center">2022/12/31 12:30</td>
                            <td className="align-center">2022/12/31 12:30</td>
                            <td className="align-center">홍길동</td>
                            <td className="align-center">홍길동</td>
                            <td className="align-center">홍길동</td>
                            <td className="align-center">대기</td>
                            <td className="align-right">10</td>
                            <td className="align-left">디카페인 원두 (콜롬비아/500G) 외 9건</td>
                            <td className="align-right">10,000</td>
                        </tr>
                        <tr>
                            <td className="align-center">2022/12/31 12:30</td>
                            <td className="align-center">2022/12/31 12:30</td>
                            <td className="align-center">2022/12/31 12:30</td>
                            <td className="align-center">홍길동</td>
                            <td className="align-center">홍길동</td>
                            <td className="align-center">홍길동</td>
                            <td className="align-center">대기</td>
                            <td className="align-right">10</td>
                            <td className="align-left">디카페인 원두 (콜롬비아/500G) 외 9건</td>
                            <td className="align-right">10,000</td>
                        </tr>
                        <tr>
                            <td className="align-center">2022/12/31 12:30</td>
                            <td className="align-center">2022/12/31 12:30</td>
                            <td className="align-center">2022/12/31 12:30</td>
                            <td className="align-center">홍길동</td>
                            <td className="align-center">홍길동</td>
                            <td className="align-center">홍길동</td>
                            <td className="align-center">배송완료</td>
                            <td className="align-right">10</td>
                            <td className="align-left">디카페인 원두 (콜롬비아/500G) 외 9건</td>
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
                {/* <!-- // 엑셀다운, 페이징, 정렬 --> */}
            </div>
        </div>
    )
}

export default OrderDetail;