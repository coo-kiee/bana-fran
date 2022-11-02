import { useState } from "react";

// type
import { SearchDateType } from "types/etcType";

// component
import EtcTable from "./etcTable";
import EtcSearch from "./etcSearch";
import EtcSearchDetail from "./etcSearchDetail";

const MusicCharge = () => {
    // TODO: 상태 관련
    const [searchDate, setSearchDate] = useState<SearchDateType>({
        from: '2022-03-01',
        to: '2022-03-01',
    }); // etcSearch 내부 검색 날짜

    // ? EtcTable 관련 자료 (프로시저 데이터 확인 후 수정하기)
    const colGroup = ['188', '*', '150', '150', '150'];
    const thead = ['기간', '품목', '공급가', '부가세', '수수료 합계 (2.2%)'];
    const tbody = [
        ['22/06/01~22/06/30', '음악 사용료', '6,000', '600', '6.600'],
        ['22/06/01~22/06/30', '공연권료', '4,000', '400', '4.400']
    ];

    // TODO: EtcSearchDetail 관련 데이터
    // ?프로시저 데이터 확인 후 detailSearchResult 수정 (isSuccess 이후?)
    const detailSearchResult = [
        ['음악 사용료 합계', '10,000'],
        ['공연권료 합계', '10,000'],
    ];
    const detailPriceInfo = [
        ['음악사용료/공연권료는 일할 계산되지 않습니다. (월 단위 요금 청구)'],
    ];

    return (
        <div id="tab2" className="tab-content active">
            <div className="info-wrap">
                <p>※ 매월 매장 음악 서비스 이용료를 조회할 수 있습니다. <strong>(가상계좌 자동 차감되므로 정산내역에는 반영되지 않습니다.)</strong></p>
            </div>
            <div className="board-date-wrap">
                {/* <!-- 수수료 내역 --> */}
                <p className="title bullet">2022년 3월 바나 딜리버리 수수료 내역</p>
                <EtcTable colGroup={colGroup} thead={thead} tbody={tbody} />
                {/* <table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
                    <colgroup>
                        <col width="188" />
                        <col width="*" />
                        <col width="150" />
                        <col width="150" />
                        <col width="150" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>기간</th>
                            <th>품목</th>
                            <th>공급가</th>
                            <th>부가세</th>
                            <th>수수료 합계(2.2%)</th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr>
                            <td className="align-center">22/06/01~22/06/30</td>
                            <td className="align-left">음악 사용료</td>
                            <td className="align-right">6,000</td>
                            <td className="align-right">600</td>
                            <td className="align-right">6.600</td>
                        </tr>
                        <tr>
                            <td className="align-center">22/06/01~22/06/30</td>
                            <td className="align-left">공연권료</td>
                            <td className="align-right">4,000</td>
                            <td className="align-right">400</td>
                            <td className="align-right">4.400</td>
                        </tr>
                    </tbody>
                </table> */}
                {/* <!-- // 수수료 내역 --> */}

                <p className="title bullet">상세내역</p>
                {/* <!-- 검색 --> */}
                <EtcSearch from={searchDate.from} to={searchDate.to} updateDate={setSearchDate} option={['구분 전체', 'test1', 'test2']} />
                {/* <div className="search-wrap">
                    <div className="input-wrap">
                        <input type="text" placeholder="2022-03-01" />
                        <i>~</i>
                        <input type="text" placeholder="2022-03-30" />
                    </div>
                    <div className="select-wrap">
                        <select name="" id="">
                            <option value="">구분 전체</option>
                        </select>
                    </div>
                    <button className="btn-search">조회</button>
                </div> */}
                {/* <!-- // 검색 --> */}

                {/* <!-- 조회 기간 --> */}
                <EtcSearchDetail searchDate={`${searchDate.from} ~ ${searchDate.to}`} searchResult={detailSearchResult} priceInfo={detailPriceInfo} />
                {/* <div className="search-result-wrap">
                    <div className="search-date">
                        <p>조회기간: 2022-12-31 ~ 2022-12-31</p>
                    </div>
                    <ul className="search-result">
                        <li className="hyphen">음악 사용료 합계<span className="colon"></span><span className="value">10,000원</span></li>
                        <li className="hyphen">공연권료 합계<span className="colon"></span><span className="value">10,000원</span></li>
                    </ul>
                    <div className="price-info">
                        <p className="hyphen">음악사용료/공연권료는 일할 계산되지 않습니다. (월 단위 요금 청구)</p>
                    </div>
                </div> */}
                {/* <!-- // 조회 기간 --> */}

                {/* <!-- 게시판 --> */}
                <table className="board-wrap" cellPadding="0" cellSpacing="0">
                    <colgroup>
                        <col width="188" />
                        <col width="*" />
                        <col width="150" />
                        <col width="150" />
                        <col width="150" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th rowSpan={2}>기간</th>
                            <th rowSpan={2}>내용</th>
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
                            <td className="align-center">22/06/01~22/06/30</td>
                            <td className="align-left">음악 사용료</td>
                            <td className="align-right">130,000</td>
                            <td className="align-right">130,000</td>
                            <td className="align-right"><strong>130,000</strong></td>
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

export default MusicCharge;