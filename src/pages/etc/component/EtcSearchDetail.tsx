import React from "react";

interface EtcSearchDetailProps {
    searchDate: string, // 조회기간 ... `${from} ~ ${to}`
    searchResult: Array<string[]>, // 검색결과 정리 ... [['바나 딜리버리 주문금액 합계', '10,000원'], ...]
    priceInfo?: Array<string[]>, // 검색결과 내 금액 관련 정보 ... [['주문금액', '배달비를 제외한 카드/현금/포인트/쿠폰 결제금액의 합계.'], ...] (발주내역, 로열티, 가상계좌에선 없음)
}

// TODO: 조회기간, 총 합계 같은 데이터 관련 (.search-result-wrap 부분)
const EtcSearchDetail: React.FC<EtcSearchDetailProps> = ({ searchDate, searchResult, priceInfo }) => {
    console.log(`EtcSearchDetail`)
    return (
        <div className="search-result-wrap">
            <div className="search-date">
                <p>조회기간: {searchDate}</p>
            </div>
            <ul className="search-result">
                {searchResult.map((result, idx) => {
                    const [title, value] = result;
                    return <li key={`etc_search_detail_result_${idx}`} className="hyphen">{title}<span className="colon"></span><span className="value">{value}원</span></li>
                })}
            </ul>
            {priceInfo &&
                <div className="price-info">
                    {priceInfo && priceInfo.map((info, idx) => {
                        return info.length > 1 ?
                            <p key={`etc_search_detail_info_${idx}`} className="hyphen"><span>{info[0]}</span><span className="colon"></span>{info[1]}</p>
                            :
                            <p key={`search_detail_${idx}`} className="hyphen">{info}</p>
                    })}
                </div>
            }
        </div>
    )
}

export default React.memo(EtcSearchDetail);