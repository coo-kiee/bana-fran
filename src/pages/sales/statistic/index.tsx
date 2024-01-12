/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { format, subDays, subMonths } from 'date-fns';

// global state
import { franState, loginState } from 'state';

// API
import SALES_SERVICE from 'service/salesService';

// Constants
import {
  SALES_STATISTIC_SEARCH_OPTION,
  SALES_STATISTIC_TABLE_COLGROUP_INFO,
  SALES_STATISTIC_TABLE_THEAD_INFO,
  STATISTIC_SEARCH_LIST,
  STATISTIC_SEARCH_TYPE,
} from 'constants/sales';

// Types
import { SalesStatisticSearch, ChartFilter } from 'types/sales/salesType';
import { OPTION_TYPE } from 'types/etc/etcType';

// Hooks
import useHandlePageDataCnt from 'hooks/pagination/useHandlePageDataCnt';
import usePageInfo from 'hooks/pagination/usePageInfo';

// Components
import Loading from 'pages/common/loading';
import CalanderSearch from 'pages/common/calanderSearch';
import LineChart from 'pages/sales/statistic/chart';
import NoData from 'pages/common/noData';
import Sticky from 'pages/common/sticky';
import DataLoader from 'pages/common/dataLoader';
import ExcelButton from 'pages/common/excel/ExcelButton';
import Pages from 'pages/common/pagination/Pages';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';
import Table from 'pages/common/table';
import TablePrefixSum from './table/TablePrefixSum';
import TableRow from './table/TableRow';

const SalesStatistic = () => {
  // global state
  const { userInfo } = useRecoilValue(loginState);
  const fCode = useRecoilValue(franState);
  const selectedFran = userInfo.f_list.filter((info) => info.f_code === fCode);
  const fCodeName = selectedFran[0]?.f_code_name || ''; // 가맹점명

  const today = new Date();

  // filter options
  const [searchConfig, setSearchConfig] = useState<SalesStatisticSearch>({
    searchType: 'D',
    from: format(subMonths(today, 1), 'yyyy-MM-dd'),
    to: format(today, 'yyyy-MM-dd'),
  });
  const [chartFilter, setChartFilter] = useState<ChartFilter>({ total: 1, paid: 0, app: 0, free: 0 });

  // query
  // 월별 검색(M)이면 from/to에 -01 string 추가 M: yy-MM, D: yy-MM-dd 포멧
  const salesStatisticResult = SALES_SERVICE.useSalesStatistic({
    f_code: fCode,
    search_type: searchConfig.searchType,
    from_date: `${searchConfig.from}${searchConfig.searchType === STATISTIC_SEARCH_TYPE.MONTHLY ? '-01' : ''}`,
    to_date: `${searchConfig.to}${searchConfig.searchType === STATISTIC_SEARCH_TYPE.MONTHLY ? '-01' : ''}`,
  });

  // pagination
  const { checkCurrentPageData, handleDataCnt } = usePageInfo();
  useHandlePageDataCnt(salesStatisticResult);

  // data 역순 정렬 (table용)
  const reversedData = useMemo(() => {
    return salesStatisticResult.data ? [...salesStatisticResult.data].reverse() : [];
  }, [salesStatisticResult.data]);

  // 데이터 조회 후 검색 조건 저장 (조건 비교용. refetch 전까지 기존 값이 유지되도록)
  const searchTypeMemo = useMemo(() => {
    const { searchType } = searchConfig;
    switch (searchType) {
      case STATISTIC_SEARCH_TYPE.DAILY:
        return {
          type: searchType,
          text: '일별',
        };
      case STATISTIC_SEARCH_TYPE.MONTHLY:
        return {
          type: searchType,
          text: '월별',
        };
      case STATISTIC_SEARCH_TYPE.HOURLY:
        return {
          type: searchType,
          text: '시간대별',
        };
      default:
        return {
          type: searchType,
          text: '일별',
        };
    }
  }, [salesStatisticResult.data]);

  /* sticky 기준 ref */
  const stickyRef = useRef<HTMLTableRowElement>(null);
  const tableRef = useRef<HTMLTableElement>(null); // 실제 data가 들어간 table

  // 매출통계 자료 조회
  const handleSearch = useCallback(() => {
    salesStatisticResult.remove(); // 이전 query 제거
    salesStatisticResult.refetch();
  }, [salesStatisticResult]);

  // 매출통계 조회 타입(일/월/시간대별) 변경시 from/to 기본값 설정
  useEffect(() => {
    const today = new Date();
    if (searchConfig.searchType === STATISTIC_SEARCH_TYPE.DAILY) {
      // 일별 기본값: 1달
      setSearchConfig((prev) => ({
        ...prev,
        from: format(subMonths(today, 1), 'yyyy-MM-dd'),
        to: format(today, 'yyyy-MM-dd'),
      }));
    } else if (searchConfig.searchType === STATISTIC_SEARCH_TYPE.MONTHLY) {
      // 월별 기본값: 1달
      setSearchConfig((prev) => ({
        ...prev,
        from: format(subMonths(today, 1), 'yyyy-MM'),
        to: format(today, 'yyyy-MM'),
      }));
    } else {
      // 시간대별 기본값: 당일
      setSearchConfig((prev) => ({ ...prev, from: format(today, 'yyyy-MM-dd'), to: format(today, 'yyyy-MM-dd') }));
    }
  }, [searchConfig.searchType]);

  // error 발생 시 pageInfo dataCnt 초기화
  useEffect(() => {
    if (salesStatisticResult.isError) handleDataCnt(-1);
  }, [handleDataCnt, salesStatisticResult.isError]);

  return (
    <>
      <div className="info-wrap">
        <p>
          ※ 매출통계를 조회할 수 있습니다. (최대{' '}
          {searchConfig.searchType === STATISTIC_SEARCH_TYPE.MONTHLY ? '12개월' : '90일'} 이내)
        </p>
      </div>
      <div className="fixed-paid-point-wrap">
        <div className="chart-filter-wrap">
          {/* 공통 검색 Calendar with select */}
          <CalanderSearch
            dateType={searchConfig.searchType === STATISTIC_SEARCH_TYPE.MONTHLY ? 'yyyy-MM' : 'yyyy-MM-dd'}
            searchInfo={searchConfig}
            setSearchInfo={setSearchConfig}
            optionType={OPTION_TYPE.RADIO}
            radioOption={SALES_STATISTIC_SEARCH_OPTION}
            optionList={STATISTIC_SEARCH_LIST}
            handleSearch={handleSearch}
            minDate={
              searchConfig.searchType === STATISTIC_SEARCH_TYPE.MONTHLY
                ? new Date(today.getFullYear() - 1, today.getMonth(), 1)
                : subDays(today, 90)
            }
            showMonthYearPicker={searchConfig.searchType === STATISTIC_SEARCH_TYPE.MONTHLY ? true : false}
            showFullMonthYearPicker={searchConfig.searchType === STATISTIC_SEARCH_TYPE.MONTHLY ? true : false}
          />
          {/* checkbox filter */}
          <div className="chart-filter">
            <div className="checkbox-wrap">
              <input
                className="check"
                type="checkbox"
                id="total-sales"
                checked={chartFilter.total === 1}
                value={chartFilter.total}
                onChange={(e) => {
                  setChartFilter({ ...chartFilter, total: e.target.checked ? 1 : 0 });
                }}
              />
              <label htmlFor="total-sales">총 매출</label>
            </div>
            <div className="checkbox-wrap">
              <input
                className="check"
                type="checkbox"
                id="paid-sales"
                checked={chartFilter.paid === 1}
                value={chartFilter.paid}
                onChange={(e) => {
                  setChartFilter({ ...chartFilter, paid: e.target.checked ? 1 : 0 });
                }}
              />
              <label htmlFor="paid-sales">유상매출</label>
            </div>
            <div className="checkbox-wrap">
              <input
                className="check"
                type="checkbox"
                id="delivery-sales"
                checked={chartFilter.app === 1}
                value={chartFilter.app}
                onChange={(e) => {
                  setChartFilter({ ...chartFilter, app: e.target.checked ? 1 : 0 });
                }}
              />
              <label htmlFor="delivery-sales">배달매출</label>
            </div>
            <div className="checkbox-wrap">
              <input
                className="check"
                type="checkbox"
                id="free-sales"
                checked={chartFilter.free === 1}
                value={chartFilter.free}
                onChange={(e) => {
                  setChartFilter({ ...chartFilter, free: e.target.checked ? 1 : 0 });
                }}
              />
              <label htmlFor="free-sales">무상서비스</label>
            </div>
          </div>
        </div>
        {/* 차트 */}
        <div className="chart-wrap">
          <div className="line-chart chart">
            <DataLoader
              isFetching={salesStatisticResult.isFetching}
              isData={Boolean(salesStatisticResult.data)}
              loader={
                <div className="chart-loading-wrap">
                  <Loading width={100} height={100} marginTop={0} />
                </div>
              }
              noData={
                <div className="no-chart">
                  <NoData />
                </div>
              }
            >
              <LineChart
                chartFilter={chartFilter}
                data={salesStatisticResult.data || []}
                searchType={searchTypeMemo.type}
              />
            </DataLoader>
          </div>
        </div>
        <div className="search-result-wrap">
          <div className="detail-info-wrap">
            <div className="price-info">
              <p className="hyphen">총 매출(자체 앱주문 배달비 포함): 유상매출+무상서비스</p>
              <p className="notification">
                ※ 본사 쿠폰 매출(미보전): 본사 발행 이벤트/프로모션 쿠폰 중 가맹점 부담 쿠폰 매출
              </p>
            </div>
          </div>
        </div>
        {/* 매출통계 Table */}
        <Sticky reference={stickyRef.current} contentsRef={tableRef.current}>
          <Table.ColGroup colGroupAttributes={SALES_STATISTIC_TABLE_COLGROUP_INFO} />
          <Table.TableHead thData={SALES_STATISTIC_TABLE_THEAD_INFO} multiLine />
        </Sticky>
        <table className="board-wrap board-top" cellPadding="0" cellSpacing="0" ref={tableRef}>
          <Table.ColGroup colGroupAttributes={SALES_STATISTIC_TABLE_COLGROUP_INFO} />
          <Table.TableHead thData={SALES_STATISTIC_TABLE_THEAD_INFO} trRef={stickyRef} multiLine />
          <tbody>
            <DataLoader
              isFetching={salesStatisticResult.isFetching}
              isData={salesStatisticResult.data && salesStatisticResult.data.length > 0}
              loader={<Loading width={100} height={100} marginTop={16} isTable />}
              noData={<NoData isTable rowSpan={1} colSpan={21} paddingTop={20} paddingBottom={20} />}
            >
              <TablePrefixSum data={salesStatisticResult.data || []} />
              {/* Error handling */}
              {salesStatisticResult.isError ? <SuspenseErrorPage isTable /> : null}
              {reversedData.map((rData, idx) => {
                return (
                  <TableRow data={rData} key={`statistic_table_row_${idx}`} isDisplay={checkCurrentPageData(idx)} />
                );
              })}
            </DataLoader>
          </tbody>
        </table>
      </div>
      {/* 엑셀다운, 페이징, 정렬 */}
      <div className="result-function-wrap">
        <ExcelButton
          type={'table'}
          target={tableRef}
          tableRef={tableRef}
          sheetOption={{ origin: 'A1' }}
          colWidths={SALES_STATISTIC_TABLE_COLGROUP_INFO.map(() => ({ wpx: 100 }))}
          fileName={`${fCodeName}_${searchTypeMemo.text}_매출통계(${
            searchTypeMemo.type === STATISTIC_SEARCH_TYPE.HOURLY
              ? `${searchConfig.from}`
              : `${searchConfig.from}~${searchConfig.to}`
          })`}
          addRowColor={{ rowNums: [1, 2, 3], colors: ['d3d3d3', 'd3d3d3', 'ffc89f'] }}
          sheetName="매출통계"
        />
        <Pages />
      </div>
    </>
  );
};

export default SalesStatistic;
