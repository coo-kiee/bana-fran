interface EtcDetailSummaryProps {
    /**
     * 조회기간 ... ex)'2023-07-01 ~ 2023-07-31'
     */
    searchDate: string,
    /**
     * 검색결과 정리 ... ex)[['바나 딜리버리 주문금액 합계', '10,000원'], ...]
     */
    summaryResult?: Array<string[]>,
    /**
     * 검색결과 내 금액 관련 정보 ... ex) [['주문금액', '배달비를 제외한 카드/현금/포인트/쿠폰 결제금액의 합계.'], ...]
     * 
     * 발주내역, 로열티, 가상계좌에선 없음
     */
    summaryInfo?: Array<string[]>, // 검색결과 내 금액 관련 정보 ... [['주문금액', '배달비를 제외한 카드/현금/포인트/쿠폰 결제금액의 합계.'], ...] (발주내역, 로열티, 가상계좌에선 없음)
}

const EtcDetailSummary: React.FC<EtcDetailSummaryProps> = ({ searchDate, summaryResult, summaryInfo }) => {
    return (
        <div className="search-result-wrap">
            <div className="search-date">
                <p>조회기간: {searchDate}</p>
            </div>
            {summaryResult &&
                <ul className="search-result">
                    {summaryResult.map(([title, value], idx) => (
                        <li key={`etc_search_detail_result_${idx}`} className="hyphen">
                            {title}
                            <span className="colon" />
                            <span className="value">{value}원</span>
                        </li>
                    ))}
                </ul>
            }
            {summaryInfo &&
                <div className="price-info">
                    {summaryInfo.map((info, idx) => {
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

export default EtcDetailSummary;