import React from 'react';
import { useQueryErrorResetBoundary } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { format, subMonths } from 'date-fns';

// component
import Loading from 'pages/common/loading';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';

// type
import { ETC_TAB_TYPE } from 'types/etc/etcType';

const EtcOverallTable = ({ currentTab, children }: { currentTab: ETC_TAB_TYPE; children: React.ReactNode }) => {
  const { reset } = useQueryErrorResetBoundary();
  const { title, colgroup, thead } = ETC_OVERALL_TABLE_INFO[currentTab];

  return (
    <>
      <p className="title bullet">{title}</p>
      <table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
        <colgroup>
          {colgroup.map((colWidth, idx) => (
            <col key={`etc_table_colgroup_${idx}`} width={colWidth} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {thead.map((head, idx) => (
              <th key={`etc_table_thead_${idx}`}>{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <React.Suspense fallback={<Loading width={50} height={50} isTable={true} />}>
            <ErrorBoundary
              onReset={reset}
              onError={(err) => console.log(err)}
              fallbackRender={({ resetErrorBoundary }) => (
                <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} isTable={true} />
              )}
            >
              {children}
            </ErrorBoundary>
          </React.Suspense>
        </tbody>
      </table>
    </>
  );
};

const ETC_OVERALL_TABLE_INFO = {
  [ETC_TAB_TYPE.DELIVERY]: {
    title: format(subMonths(new Date(), 1), `yyyy년 M월 바나 딜리버리 수수료 내역`),
    colgroup: ['188', '*', '150', '150', '150'],
    thead: ['기간', '품목', '수수료 공급가 (2%)', '부가세 (0.2%)', '수수료 합계 (2.2%)'],
  },
  [ETC_TAB_TYPE.MUSIC]: {
    title: format(subMonths(new Date(), 1), `yyyy년 M월 음악 서비스 이용료`),
    colgroup: ['188', '*', '150', '150', '150'],
    thead: ['기간', '품목', '공급가', '부가세', '수수료 합계'],
  },
  [ETC_TAB_TYPE.GIFTCARD]: {
    title: '실물 상품권 재고 현황',
    colgroup: ['20%', '20%', '20%', '20%', '20%'],
    thead: ['재고 구분', '1만원권', '3만원권', '5만원권', '합계'],
  },
  [ETC_TAB_TYPE.ORDER]: {
    title: '월별 발주금액 통계',
    colgroup: Array.from({ length: 14 }, (_) => '147'),
    thead: [
      '구분',
      ...Array.from({ length: 13 }, (_, idx1) => idx1).map((el) => format(subMonths(new Date(), 12 - el), 'yyyy-MM')),
    ],
  },
  [ETC_TAB_TYPE.ROYALTY]: {
    title: format(subMonths(new Date(), 1), `yyyy년 M월 로열티 내역`),
    colgroup: ['256', '*', '170', '170', '170'],
    thead: ['기간', '품목', '공급가', '부가세', '합계'],
  },
  [ETC_TAB_TYPE.ACCOUNT]: {
    title: '가상 계좌 잔액',
    colgroup: ['300', '270', '270', '*', '270', '270'],
    thead: ['매장', '은행', '계좌번호', '충 충전금액', '총 차감금액', '잔액'],
  },
} as const;

export default EtcOverallTable;
