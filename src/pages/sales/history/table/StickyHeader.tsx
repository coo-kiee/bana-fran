import { useEffect, useRef } from "react";
import styled from "styled-components";

const StickyHeader = () => {
    const stickyRef = useRef<HTMLTableElement>(null);

    useEffect(() => {
        // window.screenY
    }, [])
	if (stickyRef.current) {
		const rect = stickyRef.current.getBoundingClientRect();
		console.log(rect);
	}
	return (
		<StickyContainer  className='board-wrap board-top sticky-container' cellPadding='0' cellSpacing='0' ref={stickyRef}>
			{/*  sticky header */}
			<colgroup>
				<col width='108' />
				<col width='108' />
				<col width='50' />
				<col width='64' />
				<col width='116' />
				<col width='78' />
				<col width='94' />
				<col width='47' />
				<col width='73' />
				<col width='55' />
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
			<thead>
				<tr>
					<th className='sticky'>결제일시</th>
					<th className='sticky'>취소일시</th>
					<th className='sticky'>주문유형</th>
					<th className='sticky'>주문상태</th>
					<th className='sticky'>전화번호</th>
					<th className='sticky'>판매구분</th>
					<th className='sticky'>주문메뉴</th>
					<th className='sticky'>총 건수</th>
					<th className='sticky'>접수타입</th>
					<th className='sticky'>결제방식</th>
					<th className='sticky'>주문금액</th>
					<th className='sticky'>배달비</th>
					<th className='price-area sticky'>합계</th>
					<th className='price-area sticky'>카드</th>
					<th className='price-area sticky'>현금</th>
					<th className='price-area sticky'>바나포인트</th>
					<th className='price-area sticky'>충전포인트</th>
					<th className='price-area sticky'>잔돈포인트</th>
					<th className='price-area sticky'>가맹점쿠폰</th>
					<th className='price-area sticky'>본사쿠폰</th>
					<th className='price-area boder-th-l sticky'>스탬프(개)</th>
					<th className='price-area sticky'>바나포인트(P)</th>
					<th className='sticky'>현금영수증</th>
				</tr>
			</thead>
		</StickyContainer>
	);
};

export default StickyHeader;


const StickyContainer = styled.table`    
    position: fixed;
    top: 0;
	z-index: 1;
    border-radius: 0;
    margin-top: 0 !important;
    width: calc(100% - 290px);
    // display: none;
`