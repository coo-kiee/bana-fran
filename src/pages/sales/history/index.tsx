type Props = {};


const SalesHistory = (props: Props) => {
    
	return (
		<div>
			<div className='fixed-paid-point-wrap'>
				<p className='title bullet'>상세내역</p>
				{/* <!-- 검색 --> */}
				<div className='search-wrap'>
					<div className='input-wrap'>
						<input type='text' placeholder='2022-03-01' />
						<i>~</i>
						<input type='text' placeholder='2022-03-30' />
					</div>
					<div className='select-wrap'>
						<select name='' id=''>
							<option value=''>주문유형 전체</option>
						</select>
						<select name='' id=''>
							<option value=''>주문상태 전체</option>
						</select>
						<select name='' id=''>
							<option value=''>접수타임 전체</option>
						</select>
						<select name='' id=''>
							<option value=''>결제방식 전체</option>
						</select>
						<select name='' id=''>
							<option value=''>일반제품</option>
						</select>
					</div>
					<button className='btn-search'>조회</button>
				</div>
				{/* <!-- // 검색 --> */}
				{/* <!-- 조회기간 --> */}
				<div className='search-result-wrap'>
					<div className='search-date'>
						<p>조회기간: 2022-12-31 ~ 2022-12-31</p>
					</div>
					<ul className='search-result'>
						<li>
							충전포인트 사용금액 합계<span className='colon'></span>
							<span className='value'>10,000원</span>
						</li>
						<li>
							잔돈포인트 사용금액 합계<span className='colon'></span>
							<span className='value'>10,000원</span>
						</li>
						<li>
							유상(충전+잔돈)포인트 사용금액 합계<span className='colon'></span>
							<span className='value'>10,000원</span>
						</li>
						<li>
							충전포인트 사용금액 합계<span className='colon'></span>
							<span className='value'>10,000원</span>
						</li>
						<li>
							잔돈포인트 사용금액 합계<span className='colon'></span>
							<span className='value'>10,000원</span>
						</li>
						<li>
							유상(충전+잔돈)포인트 사용금액 합계<span className='colon'></span>
							<span className='value'>10,000원</span>
						</li>
						<li>
							충전포인트 사용금액 합계<span className='colon'></span>
							<span className='value'>10,000원</span>
						</li>
						<li>
							잔돈포인트 사용금액 합계<span className='colon'></span>
							<span className='value'>10,000원</span>
						</li>
						<li>
							유상(충전+잔돈)포인트 사용금액 합계<span className='colon'></span>
							<span className='value'>10,000원</span>
						</li>
						<li>
							충전포인트 사용금액 합계<span className='colon'></span>
							<span className='value'>10,000원</span>
						</li>
						<li>
							잔돈포인트 사용금액 합계<span className='colon'></span>
							<span className='value'>10,000원</span>
						</li>
						<li>
							유상(충전+잔돈)포인트 사용금액 합계<span className='colon'></span>
							<span className='value'>10,000원</span>
						</li>
					</ul>
					<div className='detail-info-wrap'>
						<div className='price-info'>
							<p className='hyphen'>
								앱주문 배달이 아닌 배민/쿠팡 주문건의 경우 배달비가 표시되지 않습니다. (쿠팡/배민
								프로그램에서 확인 요망)
							</p>
							<p className='hyphen'>
								실물 상품권 주문금액은 어플 주문 건인 경우 본사계정으로 결제되며, 키오스크 주문건인 경우
								가상계좌에서 자동으로 출금됩니다.
							</p>
						</div>
						<div className='board-filter'>
							<div className='check-box'>
								<input className='check' type='checkbox' id='order' />
								<label htmlFor='order'>최소주문표시</label>
							</div>
							<div className='check-box'>
								<input className='check' type='checkbox' id='gift' />
								<label htmlFor='gift'>실물상품권 주문 제외</label>
							</div>
							<div className='check-box'>
								<input className='check' type='checkbox' id='delivery' />
								<label htmlFor='delivery'>쿠팡/배민 주문 제외</label>
							</div>
						</div>
					</div>
				</div>
				{/* <!-- // 조회기간 --> */}
				{/* <!-- 게시판 --> */}
				<table className='board-wrap board-top' cellPadding='0' cellSpacing='0'>
					<colgroup>
						<col width='108' />
						<col width='108' />
						<col width='50' />
						<col width='64' />
						<col width='116' />
						<col width='78' />
						<col width='94' />
						<col width='47' />
						<col width='78' />
						<col width='50' />
						<col width='62' />
						<col width='62' />
						<col width='62' />
						<col width='62' />
						<col width='62' />
						<col width='62' />
						<col width='62' />
						<col width='62' />
						<col width='62' />
						<col width='62' />
						<col width='62' />
						<col width='62' />
						<col width='62' />
					</colgroup>
					<tbody>
                        <tr>
                            <th rowSpan={2}>
                                결제<span className='block'>일시</span>
                            </th>
                            <th rowSpan={2}>
                                취소<span className='block'>일시</span>
                            </th>
                            <th rowSpan={2}>
                                주문<span className='block'>유형</span>
                            </th>
                            <th rowSpan={2}>
                                주문<span className='block'>상태</span>
                            </th>
                            <th rowSpan={2}>
                                전화<span className='block'>번호</span>
                            </th>
                            <th rowSpan={2}>
                                판매<span className='block'>구분</span>
                            </th>
                            <th rowSpan={2}>
                                주문<span className='block'>메뉴</span>
                            </th>
                            <th rowSpan={2}>
                                총<span className='block'>건수</span>
                            </th>
                            <th rowSpan={2}>
                                접수<span className='block'>타입</span>
                            </th>
                            <th rowSpan={2}>
                                결제<span className='block'>방식</span>
                            </th>
                            <th rowSpan={2}>
                                주문금액<span className='block'>(메뉴)</span>
                            </th>
                            <th rowSpan={2}>
                                배달비<span className='block'>(앱주문)</span>
                            </th>
                            <th colSpan={8} className='price-area'>
                                결제상세(앱주문 배달비 포함)
                            </th>
                            <th colSpan={2} className='price-area'>
                                적립
                            </th>
                            <th rowSpan={2}>현금영수증</th>
                        </tr>
                        <tr>
                            <td className='price-area'>합계</td>
                            <td className='price-area'>카드</td>
                            <td className='price-area'>현금</td>
                            <td className='price-area'>바나포인트</td>
                            <td className='price-area'>충전포인트</td>
                            <td className='price-area'>잔돈포인트</td>
                            <td className='price-area'>가맹점쿠폰</td>
                            <td className='price-area'>본사쿠폰</td>
                            <td className='price-area'>스탬프(개)</td>
                            <td className='price-area'>바나포인트(P)</td>
                        </tr>
                        <tr>
                            <td className='align-center'>
                                2020/12/30<span className='block'>12:30</span>
                            </td>
                            <td className='align-center'>
                                2020/12/30<span className='block'>12:30</span>
                            </td>
                            <td className='align-center'>매장</td>
                            <td className='align-center'>재직중</td>
                            <td className='align-center'>0101234****</td>
                            <td className='align-center'>일반제품</td>
                            <td className='align-center'>아메리카노 외 1건</td>
                            <td className='align-right'>2</td>
                            <td className='align-right'>키오스크</td>
                            <td className='align-center'>결제완료</td>
                            <td className='align-center'>5,000</td>
                            <td className='align-center'></td>
                            <td className='align-center'>2,900</td>
                            <td className='align-center'>2,900</td>
                            <td className='align-center'>2,900</td>
                            <td className='align-center'>2,900</td>
                            <td className='align-center'></td>
                            <td className='align-center'>2,900</td>
                            <td className='align-center'></td>
                            <td className='align-center'></td>
                            <td className='align-center'>2</td>
                            <td className='align-right'>500</td>
                            <td className='align-center'></td>
                        </tr>
                    </tbody>
				</table>
				{/* <!-- 게시판 --> */}
			</div>
			{/* <!-- 엑셀다운, 페이징, 정렬 --> */}
			<div className='result-function-wrap'>
				<div className='function'>
					<button className='goast-btn'>엑셀다운</button>
				</div>
				<div className='paging-wrap'>
					<button className='btn-prev'></button>
					<ul className='paging'>
						<li className='active'>1</li>
						<li>2</li>
						<li>3</li>
						<li>4</li>
						<li>5</li>
					</ul>
					<button className='btn-next'></button>
				</div>
				<select className='filter-number' name='' id=''>
					<option value=''>50개</option>
				</select>
			</div>
		</div>
	);
};

export default SalesHistory;
