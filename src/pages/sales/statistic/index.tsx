/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { format, isAfter, subDays, subMonths } from 'date-fns';

// global state
import { franState, loginState } from 'state';

// API
import SALES_SERVICE from 'service/salesService';
// Types
import { SalesStatisticSearch, ChartFilter, STATISTIC_SEARCH_LIST, STATISTIC_SEARCH_TYPE } from 'types/sales/salesType';
import { OPTION_TYPE } from 'types/etc/etcType';
// Utils
import Utils from 'utils/Utils';
// Components
import Loading from 'pages/common/loading';
import CalanderSearch from 'pages/common/calanderSearch';
import LineChart from 'pages/sales/statistic/chart';
import NoData from 'pages/common/noData';
import Sticky from 'pages/common/sticky';
import Wrapper from 'pages/common/loading/Wrapper';
import DataLoader from 'pages/common/dataLoader';
import TableColGroup from 'pages/sales/components/TableColGroup';
import TableHead from './table/TableHead';
import TablePrefixSum from './table/TablePrefixSum';
import TableRow from './table/TableRow';
import useHandlePageDataCnt from 'hooks/pagination/useHandlePageDataCnt';
import usePageInfo from 'hooks/pagination/usePageInfo';
import Pages from 'pages/common/pagination/Pages';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';

const SalesStatistic = () => {
  // global state
  const { userInfo } = useRecoilValue(loginState);
  const fCode = useRecoilValue(franState);
  const selectedFran = userInfo?.f_list.filter((info) => info.f_code === fCode);
  const fCodeName = selectedFran[0]?.f_code_name || ''; // 가맹점명

  const today = new Date();
  // filter options
  const [searchConfig, setSearchConfig] = useState<SalesStatisticSearch>({
    searchType: 'D',
    from: format(subMonths(today, 1), 'yyyy-MM-dd'),
    to: format(today, 'yyyy-MM-dd'),
  });
  const [chartFilter, setChartFilter] = useState<ChartFilter>({ total: 1, paid: 0, app: 0, free: 0 });

  // 엑셀 컴포넌트 생성용
  const [isLoadingExcel, setIsLoadingExcel] = useState(false);
  const [isDownloadExcel, setIsDownloadExcel] = useState(false);

  // query
  // 월별 검색(M)이면 from/to에 -01 string 추가 M: yy-MM, D: yy-MM-dd 포멧
  const salesStatisticResult = SALES_SERVICE.useSalesStatistic({
    f_code: fCode,
    search_type: searchConfig.searchType,
    from_date: searchConfig.searchType === 'M' ? searchConfig.from + '-01' : searchConfig.from,
    to_date: searchConfig.searchType === 'M' ? searchConfig.to + '-01' : searchConfig.to,
  });

  // pagination
  const { checkCurrentPageData } = usePageInfo();
  useHandlePageDataCnt(salesStatisticResult);

  // data 역순 정렬 (table용)
  const sortedData = useMemo(() => {
    return salesStatisticResult.data ? [...salesStatisticResult.data].reverse() : [];
  }, [salesStatisticResult.data]);

  // 데이터 조회 후 검색 조건 저장 (조건 비교용. refetch 전까지 기존 값이 유지되도록)
  const searchTypeMemo = useMemo(() => {
    return searchConfig.searchType;
  }, [salesStatisticResult.data]);

  /* 검색 기간 필터링 (onChange) */
  // select options list
  const searchOptionList = [
    {
      [STATISTIC_SEARCH_TYPE.DAY]: { title: '일별', id: 'day', value: 'D' },
      [STATISTIC_SEARCH_TYPE.MONTH]: { title: '월별', id: 'month', value: 'M' },
    },
  ];

  // table colgroup 배열
  const tableColGroup = [
    '122',
    '122',
    '122',
    '122',
    '122',
    '122',
    '122',
    '122',
    '122',
    '122',
    '122',
    '122',
    '122',
    '122',
    '122',
    '122',
    '122',
    '122',
    '122',
  ];

  /* sticky 기준 ref */
  const stickyRef = useRef<HTMLTableRowElement>(null);
  const tableRef = useRef<HTMLTableElement>(null); // 실제 data가 들어간 table

  /* excel download */
  const excelRef = useRef<HTMLTableElement>(null); // excel 출력용 table

  const excelDownload = useCallback(() => {
    const { searchType, from, to } = searchConfig;
    if (excelRef.current) {
      // Excel - sheet options: 셀 시작 위치, 셀 크기
      const options = {
        type: 'table', // 필수 O
        sheetOption: { origin: 'A1' }, // 해당 셀부터 데이터 표시, default - A1, 필수 X
        colspan: [
          { wch: 16 },
          { wch: 16 },
          { wch: 16 },
          { wch: 16 },
          { wch: 16 },
          { wch: 16 },
          { wch: 16 },
          { wch: 16 },
          { wch: 16 },
          { wch: 16 },
          { wch: 16 },
          { wch: 16 },
          { wch: 22 },
          { wch: 16 },
          { wch: 16 },
          { wch: 16 },
          { wch: 16 },
          { wch: 16 },
          { wch: 16 },
        ], // 셀 너비 설정, 필수 X
        addRowColor: { row: [1, 2, 3], color: ['d3d3d3', 'd3d3d3', 'ffc89f'] },
        sheetName: '매출통계', // 시트이름, 필수 X
      };
      try {
        Utils.excelDownload(
          excelRef.current,
          options,
          `${fCodeName}_${searchType === 'D' ? '일별' : '월별'}_매출통계(${from}~${to})`,
        );
      } catch (error) {
        console.log(error);
      }
    }
    setIsDownloadExcel(false);
    setIsLoadingExcel(false);
  }, [fCodeName, searchConfig]);

  // 제한 조건(90일)을 넘어가면 refecth를 막고 날짜 바꿔주는 함수
  const handleSearch = useCallback(() => {
    const today = new Date();
    const limitDate = subDays(today, 90);
    const { searchType, from, to } = searchConfig;
    // 90일 이내의 날짜인지
    const isFromWithinRange = isAfter(new Date(from + ' 23:59:59'), limitDate);
    const isToWithinRange = isAfter(new Date(to + ' 23:59:59'), limitDate);
    const isPeriodWithinRange = isFromWithinRange && isToWithinRange;

    if (searchType === 'D' && !isPeriodWithinRange) {
      // 범위에 맞는 날짜로 변경
      setSearchConfig((prev) => ({
        ...prev,
        from: isFromWithinRange ? from : format(limitDate, 'yyyy-MM-dd'),
        to: isToWithinRange ? to : format(today, 'yyyy-MM-dd'),
      }));
      return alert('일별 매출 통계는 오늘부터 90일 전까지만 조회할 수 있습니다.');
    }

    salesStatisticResult.refetch();
  }, [searchConfig, salesStatisticResult.refetch]);

  // loading띄우고 excelDownload 진행
  useEffect(() => {
    isLoadingExcel && setIsDownloadExcel(true);
  }, [isLoadingExcel]);

  useEffect(() => {
    if (isDownloadExcel) excelDownload();
  }, [excelDownload, isDownloadExcel]);

  return (
    <>
      <div className="info-wrap">
        <p>※ 매출통계를 조회할 수 있습니다. (최대 {searchConfig.searchType === 'M' ? '12개월' : '90일'} 이내)</p>
      </div>
      <div className="fixed-paid-point-wrap">
        <div className="chart-filter-wrap">
          {/* <!-- 공통 검색 Calendar with select --> */}
          <CalanderSearch
            dateType={searchConfig.searchType === 'M' ? 'yyyy-MM' : 'yyyy-MM-dd'}
            searchInfo={searchConfig}
            setSearchInfo={setSearchConfig}
            optionType={OPTION_TYPE.RADIO}
            radioOption={searchOptionList}
            optionList={STATISTIC_SEARCH_LIST}
            handleSearch={handleSearch}
            minDate={
              searchConfig.searchType === 'M'
                ? new Date(today.getFullYear() - 1, today.getMonth(), 1)
                : subDays(today, 90)
            }
            showMonthYearPicker={searchConfig.searchType === 'M' ? true : false}
            showFullMonthYearPicker={searchConfig.searchType === 'M' ? true : false}
          />
          {/* <!-- checkbox filter --> */}
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
        {/* <!-- 차트 --> */}
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
              <LineChart chartFilter={chartFilter} data={salesStatisticResult.data || []} searchType={searchTypeMemo} />
            </DataLoader>
          </div>
        </div>
        <div className="search-result-wrap">
          <div className="detail-info-wrap">
            <div className="price-info" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="hyphen">총 매출(자체 앱주문 배달비 포함): 유상매출+무상서비스</p>
              <p className="notification">
                ※ 본사 쿠폰 매출(미보전): 본사 발행 이벤트/프로모션 쿠폰 중 가맹점 부담 쿠폰 매출
              </p>
            </div>
          </div>
        </div>
        {/* <!-- 매출통계 Table --> */}
        <Sticky reference={stickyRef.current} contentsRef={tableRef.current}>
          <TableColGroup tableColGroup={tableColGroup} />
          <TableHead />
        </Sticky>
        <table className="board-wrap board-top" cellPadding="0" cellSpacing="0" ref={tableRef}>
          <TableColGroup tableColGroup={tableColGroup} />
          <TableHead ref={stickyRef} />
          <tbody>
            <DataLoader
              isFetching={salesStatisticResult.isFetching}
              isData={salesStatisticResult.data && salesStatisticResult.data.length > 0}
              loader={<Loading width={100} height={100} marginTop={16} isTable={true} />}
              noData={<NoData isTable={true} rowSpan={1} colSpan={19} paddingTop={20} paddingBottom={20} />}
            >
              <TablePrefixSum data={salesStatisticResult.data || []} />
              {salesStatisticResult.isError ? <SuspenseErrorPage isTable /> : null}
              {sortedData.map((sData, idx) => {
                return checkCurrentPageData(idx) ? <TableRow data={sData} key={`statistic_table_row_${idx}`} /> : null;
              })}
            </DataLoader>
          </tbody>
        </table>
        {/* Excel Table */}
        <DataLoader isData={isDownloadExcel}>
          {/* Excel Loading */}
          {/* isFetching, loader 옵션 미사용, 별도 처리 */}
          <Wrapper isRender={isLoadingExcel} isFixed={true} width="100%" height="100%">
            <Loading marginTop={0} />
          </Wrapper>
          <table className="board-wrap board-top excel-table" cellPadding="0" cellSpacing="0" ref={excelRef}>
            <TableColGroup tableColGroup={tableColGroup} />
            <TableHead />
            <tbody>
              <TablePrefixSum data={salesStatisticResult.data || []} />
              {sortedData?.map((statisticData, idx) => {
                return <TableRow data={statisticData} key={`statistic_excel_row_${idx}`} />;
              })}
            </tbody>
          </table>
        </DataLoader>
      </div>
      {/* <!-- 엑셀다운, 페이징, 정렬 --> */}
      <div className="result-function-wrap">
        <div className="function">
          <button
            className="goast-btn"
            onClick={() => setIsLoadingExcel(true)}
            disabled={salesStatisticResult.isFetching || isDownloadExcel}
          >
            엑셀다운
          </button>
        </div>
        <Pages />
      </div>
    </>
  );
};

export default SalesStatistic;
