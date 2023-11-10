import React from 'react';
import { useQueryErrorResetBoundary } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { format, subMonths } from 'date-fns';

// component
import Loading from 'pages/common/loading';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';

// type
import { ETC_TAB_TYPE } from 'types/etc/etcType';
import Table from 'pages/common/table';

const EtcOverallTable = ({ tabType, children }: { tabType: ETC_TAB_TYPE; children: React.ReactNode }) => {
  const { reset } = useQueryErrorResetBoundary();
  const { title, colgroup, thead } = ETC_OVERALL_TABLE_INFO[tabType];

  return (
    <>
      <p className="title bullet">{title}</p>
      <Table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
        <Table.ColGroup colGroupAttributes={colgroup} />
        <Table.TableHead thData={thead} />
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
      </Table>
    </>
  );
};

const ETC_OVERALL_TABLE_INFO = {
  [ETC_TAB_TYPE.DELIVERY]: {
    title: format(subMonths(new Date(), 1), `yyyy년 M월 바나 딜리버리 수수료 내역`),
    colgroup: [{ width: '188' }, { width: '*' }, { width: '150' }, { width: '150' }, { width: '150' }],
    thead: [
      [
        { children: '기간' },
        { children: '품목' },
        { children: '수수료 공급가 (2%)' },
        { children: '부가세 (0.2%)' },
        { children: '수수료 합계 (2.2%)' },
      ],
    ],
  },
  [ETC_TAB_TYPE.MUSIC]: {
    title: format(subMonths(new Date(), 1), `yyyy년 M월 음악 서비스 이용료`),
    colgroup: [{ width: '188' }, { width: '*' }, { width: '150' }, { width: '150' }, { width: '150' }],
    thead: [
      [
        { children: '기간' },
        { children: '품목' },
        { children: '수수료 공급가 (2%)' },
        { children: '부가세 (0.2%)' },
        { children: '수수료 합계 (2.2%)' },
      ],
    ],
  },
  [ETC_TAB_TYPE.GIFTCARD]: {
    title: '실물 상품권 재고 현황',
    colgroup: [{ width: '20%' }, { width: '20%' }, { width: '20%' }, { width: '20%' }, { width: '20%' }],
    thead: [
      [
        { children: '재고 구분' },
        { children: '1만원권' },
        { children: '3만원권' },
        { children: '5만원권' },
        { children: '합계' },
      ],
    ],
  },
  [ETC_TAB_TYPE.ORDER]: {
    title: '월별 발주금액 통계',
    colgroup: Array.from({ length: 14 }, (_) => ({ width: '147' })),
    thead: [
      [
        { children: '구분' },
        ...Array.from({ length: 13 }, (_, idx1) => idx1).map((el) => ({
          children: format(subMonths(new Date(), 12 - el), 'yyyy-MM'),
        })),
      ],
    ],
  },
  [ETC_TAB_TYPE.ROYALTY]: {
    title: format(subMonths(new Date(), 1), `yyyy년 M월 로열티 내역`),
    colgroup: [{ width: '256' }, { width: '*' }, { width: '170' }, { width: '170' }, { width: '170' }],
    thead: [
      [
        { children: '기간' },
        { children: '품목' },
        { children: '공급가' },
        { children: '부가세' },
        { children: '합계' },
      ],
    ],
  },
  [ETC_TAB_TYPE.ACCOUNT]: {
    title: '가상 계좌 잔액',
    colgroup: [
      { width: '300' },
      { width: '270' },
      { width: '270' },
      { width: '*' },
      { width: '270' },
      { width: '270' },
    ],
    thead: [
      [
        { children: '매장' },
        { children: '은행' },
        { children: '계좌번호' },
        { children: '총 충전금액' },
        { children: '총 차감금액' },
        { children: '잔액' },
      ],
    ],
  },
};

export default EtcOverallTable;
