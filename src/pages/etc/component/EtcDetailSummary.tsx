import { HTMLAttributes, PropsWithChildren } from 'react';
import { ETC_TAB_TYPE } from 'types/etc/etcType';

interface EtcDetailSummaryProps {
  /**
   * 조회기간 ... ex)'2023-07-01 ~ 2023-07-31'
   */
  searchDate: string;
  /**
   * 검색결과 정리 ... ex)[['바나 딜리버리 주문금액 합계', '10,000원'], ...]
   */
  summaryResult?: (HTMLAttributes<HTMLLIElement> & { title: string } & PropsWithChildren)[];
  currentTab: ETC_TAB_TYPE;
}

const EtcDetailSummary: React.FC<EtcDetailSummaryProps> = ({ searchDate, summaryResult, currentTab }) => {
  return (
    <div className="search-result-wrap">
      <div className="search-date">
        <p>조회기간: {searchDate}</p>
      </div>

      {summaryResult && (
        <ul className="search-result">
          {summaryResult.map(({ title, children, ...liAttributes }, idx) => (
            <li key={`detail_result_${idx}`} {...liAttributes}>
              {title}
              <span className="colon" />
              <span className="value">{children}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="price-info">
        {SUMMARY_INFO_LIST[currentTab].map(({ children }, idx) => (
          <p key={`detail_summary_${idx}`} className="hyphen">
            {children}
          </p>
        ))}
      </div>
    </div>
  );
};

export default EtcDetailSummary;

const SUMMARY_INFO_LIST = {
  [ETC_TAB_TYPE.DELIVERY]: [
    {
      children: (
        <>
          <span>주문금액</span>: 배달비를 제외한 카드/현금/포인트/쿠폰 결제금액의 합계.
        </>
      ),
    },
    {
      children: (
        <>
          <span>수수료 공급가</span>: 주문금액의 2% (부가세 별도.)
        </>
      ),
    },
  ],
  [ETC_TAB_TYPE.MUSIC]: [{ children: '음악사용료/공연권료는 일할 계산되지 않습니다. (월 단위 요금 청구)' }],
  [ETC_TAB_TYPE.GIFTCARD]: [
    { children: '키오스크/POS 판매금액은 가상계좌에서 자동 차감됩니다.' },
    { children: '어플 판매금액은 가상계좌에서 차감되지 않습니다.' },
    { children: '판매취소된 상품권은 폐기되므로 재고에 반영되지 않습니다.' },
  ],
  [ETC_TAB_TYPE.ORDER]: [],
  [ETC_TAB_TYPE.ROYALTY]: [{ children: '로열티는 일할 계산되지 않습니다. (월 단위 요금 청구)' }],
  [ETC_TAB_TYPE.ACCOUNT]: [],
};
