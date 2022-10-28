const CaculateListContainer = () => {
    return (
        <>
            {/* <section class="container">
                <header>
                    <div class="page-title calculate">
                        <p class="present">정산관리</p>
                        <p class="spot">정산내역 확인</p>
                    </div>
                </header>
                <section class="contents-wrap calculate-wrap">
                    <div class="contents">
                        <div class="info-wrap">
                            <p>※ 직전 월 정산내역을 확인 후 [정산확인]을 완료하시면 본사에서 세금계산서를 발행합니다.</p>
                            <p>※ 당월 5일까지 직전월의 정산확인을 하지 않을 시 자동으로 정산확인 완료 처리됩니다.</p>
                        </div>
                        <!-- 셀렉트박스, 정산확인, 수정요청, 변경이력 -->
                        <div class="function-wrap">
                            <div class="select-wrap">
                                <select name="" id="">
                                    <option value="">2022-06</option>
                                </select>
                                <button class="goast-btn">선택</button>
                            </div>
                            <p class="text-info">※ ‘보전’은 본사로부터 보전받을 금액이며, '청구'는 본사가 가맹점에 청구하는 금액을 의미합니다.</p>
                            <div class="btn-wrap">
                                <!-- class명 inactive 추가시 비활성화 -->
                                <button class="btn-check">정산확인</button>
                                <button class="btn-modify-request modify-view">수정요청</button>
                                <button class="btn-modify-history history-view">수정요청/변경이력</button>
                            </div>
                        </div>
                        <!-- // 셀렉트박스, 정산확인, 수정요청, 변경이력 -->
                        <!-- 게시판 -->
                        <table class="board-wrap board-top" cellpadding="0" cellspacing="0">
                            <colgroup>
                                <col width="188">
                                    <col width="70">
                                        <col width="130">
                                            <col width="*">
                                                <col width="130">
                                                    <col width="130">
                                                        <col width="130">
                                                            <col width="130">
                                                                <col width="130">
                                                                    <col width="130">
                                                                    </colgroup>
                                                                    <tr>
                                                                        <th>정산기간</th>
                                                                        <th>구분</th>
                                                                        <th>품목</th>
                                                                        <th>상세내역</th>
                                                                        <th>수량</th>
                                                                        <th>단가</th>
                                                                        <th>공급가액</th>
                                                                        <th>부가세</th>
                                                                        <th>합계</th>
                                                                        <th>비고</th>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>22/06/01~22/06/30</td>
                                                                        <td>보전</td>
                                                                        <td>유상포인트</td>
                                                                        <td>충전/잔돈포인트 고객사용내역 보전</td>
                                                                        <td></td>
                                                                        <td></td>
                                                                        <td class="align-right">117,000</td>
                                                                        <td class="align-right">13,000</td>
                                                                        <td class="align-right"><strong>130,000</strong></td>
                                                                        <td></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>22/06/01~22/06/30</td>
                                                                        <td>보전</td>
                                                                        <td>유상포인트</td>
                                                                        <td>충전/잔돈포인트 고객사용내역 보전</td>
                                                                        <td></td>
                                                                        <td></td>
                                                                        <td class="align-right">0</td>
                                                                        <td class="align-right">0</td>
                                                                        <td class="align-right"><strong>0</strong></td>
                                                                        <td></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>22/06/01~22/06/30</td>
                                                                        <td>보전</td>
                                                                        <td>유상포인트</td>
                                                                        <td>충전/잔돈포인트 고객사용내역 보전</td>
                                                                        <td></td>
                                                                        <td></td>
                                                                        <td class="align-right negative-value">-117,000</td>
                                                                        <td class="align-right negative-value">-13,000</td>
                                                                        <td class="align-right negative-value"><strong>-130,000</strong></td>
                                                                        <td></td>
                                                                    </tr>
                                                                </table>
                                                                <!-- // 게시판 -->
                                                                <!-- 엑셀다운, 인쇄, 합계 -->
                                                                <div class="result-function-wrap">
                                                                    <div class="function">
                                                                        <button class="goast-btn">엑셀다운</button>
                                                                        <button class="goast-btn">인쇄</button>
                                                                    </div>
                                                                    <div class="result">
                                                                        합계 :<span>239,200</span>
                                                                    </div>
                                                                </div>
                                                                <!-- //엑셀다운, 인쇄, 합계 -->
                                                            </div>
                                                        </section>
                                                    </section>
                                                    <!-- 수정요청 레이어 -->
                                                    <div class="alert-layer modify-layer">
                                                        <div class="msg-wrap">
                                                            <p class="title">수정요청</p>
                                                            <textarea class="text-area" name="" id="" placeholder="수정 요청하실 품목과 금액 등 자세한 내용을 입력해주세요."></textarea>
                                                            <button class="btn-close modify-close"></button>
                                                            <button class="cta-btn">등록하기</button>
                                                        </div>
                                                    </div>
                                                    <!-- // 수정요청 레이어 -->
                                                    <!-- 수정요청/변경이력 레이어 -->
                                                    <div class="alert-layer history-layer">
                                                        <div class="msg-wrap">
                                                            <p class="title">수정요청/변경이력</p>
                                                            <table class="board-wrap" cellpadding="0" cellspacing="0">
                                                                <colgroup>
                                                                    <col width="130">
                                                                        <col width="98">
                                                                            <col width="98">
                                                                                <col width="372">
                                                                                    <col width="250">
                                                                                        <col width="250">
                                                                                        </colgroup>
                                                                                        <tr>
                                                                                            <th>일시</th>
                                                                                            <th>구분</th>
                                                                                            <th>등록자</th>
                                                                                            <th>수정요청/답변내용</th>
                                                                                            <th>변경 전</th>
                                                                                            <th>변경 후</th>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>2022-12-31 12:30</td>
                                                                                            <td>본사등록</td>
                                                                                            <td>홍길동<br>(충무로점)</td>
                                                                                            <td>확인결과 유상포인트 금액 문제없습니다.</td>
                                                                                            <td class="content">
                                                                                                <strong>
                                                                                                    [유상포인트] 충전/잔돈포인트
                                                                                                    고객사용내역 보전
                                                                                                </strong>
                                                                                                <p>합계: 1,100원</p>
                                                                                                <p>공급가액: 1,000원</p>
                                                                                                <p>부가세: 100원</p>
                                                                                                <br>
                                                                                                    <strong>
                                                                                                        [본사 쿠폰] 본사 서비스 쿠폰
                                                                                                        고객 사용내역 보전
                                                                                                    </strong>
                                                                                                    <p>합계: 1,100원</p>
                                                                                            </td>
                                                                                            <td class="content">
                                                                                                <strong>
                                                                                                    [유상포인트] 충전/잔돈포인트
                                                                                                    고객사용내역 보전
                                                                                                </strong>
                                                                                                <p>합계: 1,100원</p>
                                                                                                <p>공급가액: 1,000원</p>
                                                                                                <p>부가세: 100원</p>
                                                                                                <br>
                                                                                                    <strong>
                                                                                                        [본사 쿠폰] 본사 서비스 쿠폰
                                                                                                        고객 사용내역 보전
                                                                                                    </strong>
                                                                                                    <p>합계: 1,100원</p>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>2022-12-31 12:30</td>
                                                                                            <td>본사등록</td>
                                                                                            <td>본사</td>
                                                                                            <td>확인결과 유상포인트 금액 문제없습니다.</td>
                                                                                            <td class="content">
                                                                                                <strong>[본사 쿠폰] 본사 서비스 쿠폰 고객 사용내역 보전</strong>
                                                                                            </td>
                                                                                            <td></td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>2022-12-31 12:30</td>
                                                                                            <td>본사등록</td>
                                                                                            <td>본사</td>
                                                                                            <td>확인결과 유상포인트 금액 문제없습니다.</td>
                                                                                            <td></td>
                                                                                            <td></td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>2022-12-31 12:30</td>
                                                                                            <td>본사등록</td>
                                                                                            <td>본사</td>
                                                                                            <td>확인결과 유상포인트 금액 문제없습니다.</td>
                                                                                            <td></td>
                                                                                            <td class="content">
                                                                                                <strong>[본사 쿠폰] 본사 서비스 쿠폰 고객 사용내역 보전</strong>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </table>
                                                                                    <button class="btn-close history-close"></button>
                                                                                    <button class="cta-btn">등록하기</button>
                                                                                </div>
                                                                            </div>
                                                                            <!-- // 수정요청/변경이력 레이어 --></col> */}
        </>
    );
}

export default CaculateListContainer;