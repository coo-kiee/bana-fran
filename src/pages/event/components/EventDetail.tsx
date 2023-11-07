import { FC, useRef } from 'react';
import { subMonths } from 'date-fns';

// hook
import useSearchDate from 'hooks/common/useSearchDate';

// component
import PageInfoProvider from 'pages/common/pagination/PageInfoProvider';
import Table from 'pages/common/table';
import Calander from 'pages/common/calander';
import EventDetailTable from './EventDetailTable';
import Pages from 'pages/common/pagination/Pages';
import ExcelButton from 'pages/common/excel/ExcelButton';

// hook
import useUserInfo from 'hooks/user/useUser';

// type, constant
import { EVENT_TAB_TYPE, EventTabType } from 'constants/event';

const EventDetail: FC<{ tabType: EventTabType }> = ({ tabType }) => {
  const tableRef = useRef<HTMLTableElement>(null);
  const thRef = useRef<HTMLTableRowElement>(null);
  const {
    user: { fCodeName },
  } = useUserInfo();

  const excelFileName = tabType === EVENT_TAB_TYPE.COUPON_STATUS ? '쿠폰현황' : '사용내역';
  const addRowColor = {
    rowNums: EVENT_TAB_TYPE.COUPON_STATUS ? [1, 2] : [1],
    colors: EVENT_TAB_TYPE.COUPON_STATUS ? ['d3d3d3', 'd3d3d3'] : ['d3d3d3'],
  };

  const { searchDate, handleSearchDate } = useSearchDate({
    tabTypeObj: EVENT_TAB_TYPE,
    tabType,
    fromDate: tabType === 'coupon_status' ? subMonths(new Date(), 11) : subMonths(new Date(), 3),
    toDate: new Date(),
  });

  return (
    <div className="board-date-wrap">
      <div className="search-wrap">
        <Calander
          fromDate={searchDate.fromDate}
          toDate={searchDate.toDate}
          render={({ fromDate, toDate }) => (
            <button className="btn-search" onClick={() => handleSearchDate({ fromDate, toDate })}>
              조회
            </button>
          )}
          showMonthYearPicker={tabType === EVENT_TAB_TYPE.COUPON_STATUS ? true : false}
          dateFormat={tabType === EVENT_TAB_TYPE.COUPON_STATUS ? 'yyyy-MM' : 'yyyy-MM-dd'}
        />
      </div>

      <PageInfoProvider>
        <Table className="board-wrap" cellPadding="0" cellSpacing="0">
          <Table.ColGroup colGroupAttributes={EVENT_DETAIL_THEAD_COLGROUP_LIST[tabType].colgroup} />
          <Table.TableHead thData={EVENT_DETAIL_THEAD_COLGROUP_LIST[tabType].thead} trRef={thRef} />
          <EventDetailTable tabType={tabType} />
        </Table>
        <div className="result-function-wrap">
          <ExcelButton
            type={'table'}
            target={tableRef}
            tableRef={tableRef}
            sheetOption={{ origin: 'B3' }}
            colWidths={EVENT_DETAIL_THEAD_COLGROUP_LIST[tabType].colgroup.map(({ width }) =>
              width !== '*' ? { wpx: Number(width) } : { wpx: 400 },
            )}
            fileName={`${searchDate.fromDate}~${searchDate.toDate}_${fCodeName}_${excelFileName}`}
            addRowColor={addRowColor}
            // {...excelOption}
          />
          <Pages />
        </div>
      </PageInfoProvider>
    </div>
  );
};

export default EventDetail;

const EVENT_DETAIL_THEAD_COLGROUP_LIST = {
  [EVENT_TAB_TYPE.COUPON_STATUS]: {
    thead: [
      [
        { children: '생성일', rowSpan: 2 },
        { children: '쿠폰명', rowSpan: 2 },
        {
          children: (
            <>
              유효기간<p>(출력일로부터)</p>
            </>
          ),
          rowSpan: 2,
        },
        { children: '총 생성', rowSpan: 2 },
        { children: '미출력', rowSpan: 2 },
        { children: '출력', colSpan: 4, className: 'price-area' },
        {
          children: (
            <>
              사용율<p>(출력기준)</p>
            </>
          ),
          rowSpan: 2,
        },
        { children: '쿠폰금액', rowSpan: 2 },
        { children: '총 쿠폰 사용금액', rowSpan: 2 },
      ],
      [
        { children: '총 출력', className: 'price-area' },
        { children: '사용', className: 'price-area' },
        {
          children: (
            <>
              미사용<p>(만료전)</p>
            </>
          ),
          className: 'price-area',
        },
        {
          children: (
            <>
              미사용<p>(만료)</p>
            </>
          ),
          className: 'price-area',
        },
      ],
    ],
    colgroup: [
      { width: '180' },
      { width: '200' },
      { width: '130' },
      { width: '130' },
      { width: '130' },
      { width: '100' },
      { width: '100' },
      { width: '100' },
      { width: '100' },
      { width: '80' },
      { width: '180' },
      { width: '180' },
    ],
  },
  [EVENT_TAB_TYPE.COUPON_USAGE]: {
    thead: [
      [
        { children: '사용날짜' },
        { children: '쿠폰명' },
        { children: '쿠폰금액(사용금액)' },
        { children: '쿠폰발급(출력)일' },
        { children: '쿠폰번호' },
        { children: '유효기간' },
        { children: '사용자' },
      ],
    ],
    colgroup: [
      { width: '180' },
      { width: '*' },
      { width: '180' },
      { width: '180' },
      { width: '180' },
      { width: '180' },
      { width: '180' },
    ],
  },
};
