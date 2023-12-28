import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { format, subDays, subYears } from 'date-fns';

// global state
import { couponModalState, franState, loginState } from 'state';

// API
import SALES_SERVICE from 'service/salesService';

// Constants
import {
  SALES_HISTORY_TABLE_COLGROUP_INFO,
  SALES_HISTORY_EXCEL_COLWIDTH_INFO,
  SALES_HISTORY_TABLE_THEAD_INFO,
  SALES_HISTORY_SEARCH_OPTION,
  HISTORY_SEARCH_TYPE_LIST,
} from 'constants/sales';

// Types
import { Bit } from 'types/common';
import { SalesHistorySearch } from 'types/sales/salesType';
import { OPTION_TYPE } from 'types/etc/etcType';

// Hooks
import { useSalesHistoryFilterData } from 'hooks/sales';

// Components
import CalanderSearch from 'pages/common/calanderSearch';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';
import Loading from 'pages/common/loading';
import Sticky from 'pages/common/sticky';
import DataLoader from 'pages/common/dataLoader';
import NoData from 'pages/common/noData';
import ExcelDownloader from 'pages/common/excel/ExcelDownloader';
import Pagination from 'pages/common/pagination';
import Table from 'pages/common/table';
import PrefixSum from 'pages/sales/history/PrefixSum';
import TableRow from './table/TableRow';
import CouponDetail from './couponDetail';

const SalesHistory = () => {
  // global state
  const { userInfo } = useRecoilValue(loginState);
  const fCode = useRecoilValue(franState);
  const selectedFran = userInfo?.f_list.filter((info) => info.f_code === fCode);
  const fCodeName = selectedFran[0]?.f_code_name; // 가맹점명

  // 쿠폰 상세 내역 모달 열기
  const [couponModal, setCouponModal] = useRecoilState(couponModalState);

  const today = new Date();

  // filter options
  const [searchConfig, setSearchConfig] = useState<SalesHistorySearch>({
    from: format(new Date(subDays(today, 6)), 'yyyy-MM-dd'),
    to: format(new Date(today), 'yyyy-MM-dd'),
    searchOption: SALES_HISTORY_SEARCH_OPTION.map(({ total }) => total),
  });

  // 취소 주문 표시 여부 0: 취소주문감추기 1: 취소주문표시
  const [isCancelShow, setIsCancelShow] = useState<Bit>(1);
  // 쿠팡/배민 주문 제외 여부 0: 쿠팡/배민표시 1:쿠팡/배민제외
  const [isExcludeCouBae, setIsExcludeCouBae] = useState<Bit>(0);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowPerPage, setRowPerPage] = useState(20);

  // query
  const salesHistoryResult = SALES_SERVICE.useSalesHistory({
    from_date: searchConfig.from,
    to_date: searchConfig.to,
    f_code: fCode,
  });

  // filter data custom hook
  const { filteredData } = useSalesHistoryFilterData({
    data: salesHistoryResult.data,
    searchOption: searchConfig.searchOption,
    isCancelShow,
    isExcludeCouBae,
  });

  /* sticky 기준 ref */
  const stickyRef = useRef<HTMLTableRowElement>(null);
  const tableRef = useRef<HTMLTableElement>(null); // 실제 data가 들어간 table

  // search(refetch)
  const handleSearch = () => {
    setCurrentPage(1);
    salesHistoryResult.refetch();
  };

  // 검색/필터 조건 변경시 현재 페이지 번호 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [searchConfig.searchOption]);

  // 페이지, row 바뀌면 쿠폰 상세 모달 제거
  useEffect(() => {
    setCouponModal((prev) => ({ ...prev, isOpen: false }));
  }, [currentPage, rowPerPage, setCouponModal]);

  return (
    <>
      <div className="info-wrap">
        <p>※ 주문내역을 조회할 수 있습니다. (최대 12개월 이내)</p>
      </div>
      <div className="fixed-paid-point-wrap">
        {/* 공통 검색 Calendar with select */}
        <CalanderSearch
          dateType="yyyy-MM-dd"
          searchInfo={searchConfig}
          setSearchInfo={setSearchConfig}
          optionType={OPTION_TYPE.SELECT} // 'SELECT'
          selectOption={SALES_HISTORY_SEARCH_OPTION}
          optionList={HISTORY_SEARCH_TYPE_LIST} // option 맵핑할 때 사용
          handleSearch={handleSearch} // 실제 검색하는 함수 (ex. refetch)
          minDate={subYears(today, 1)} // 검색가능한 기간(시작일) 설정
        />
        <div className="search-result-wrap">
          <div className="search-date">
            <p>
              조회기간: {searchConfig.from} ~ {searchConfig.to}
            </p>
          </div>
          {/* 누적 합계 */}
          <PrefixSum data={salesHistoryResult.data || []} />
          <div className="detail-info-wrap">
            <div className="price-info">
              <p className="hyphen">
                앱주문 배달이 아닌 배민/쿠팡 주문건의 경우 배달비가 표시되지 않습니다. (쿠팡/배민 프로그램에서 확인
                요망)
              </p>
              <p className="hyphen">
                실물 상품권 주문금액은 어플 주문 건인 경우 본사계정으로 결제되며, 키오스크 주문건인 경우 가상계좌에서
                자동으로 출금됩니다.
              </p>
              <p className="hyphen notification">
                본사쿠폰(미보전): 본사 발행 이벤트/프로모션 쿠폰 중 가맹점 부담 쿠폰. (23/5/1일부터{' '}
                <span style={{ color: '#f1658a' }}>1,500원 앱전용 쿠폰</span> 가맹점 부담)
              </p>
            </div>
            <div className="board-filter">
              <div className="check-box">
                <input
                  className="check"
                  type="checkbox"
                  id="order"
                  checked={isCancelShow === 1}
                  onChange={(e) => {
                    setIsCancelShow(e.target.value === '0' ? 1 : 0);
                  }}
                  value={isCancelShow}
                />
                <label htmlFor="order">취소주문표시</label>
              </div>
              <div className="check-box">
                <input
                  className="check"
                  type="checkbox"
                  id="delivery"
                  checked={isExcludeCouBae === 1}
                  onChange={(e) => {
                    setIsExcludeCouBae(e.target.value === '0' ? 1 : 0);
                  }}
                  value={isExcludeCouBae}
                />
                <label htmlFor="delivery">쿠팡/배민 주문 제외</label>
              </div>
            </div>
          </div>
        </div>
        {/* 주문내역 Table */}
        <Sticky reference={stickyRef.current} contentsRef={tableRef.current}>
          <Table.ColGroup colGroupAttributes={SALES_HISTORY_TABLE_COLGROUP_INFO} />
          <Table.TableHead thData={SALES_HISTORY_TABLE_THEAD_INFO} multiLine />
        </Sticky>
        <table className="board-wrap board-top" cellPadding="0" cellSpacing="0" ref={tableRef}>
          <Table.ColGroup colGroupAttributes={SALES_HISTORY_TABLE_COLGROUP_INFO} />
          <Table.TableHead thData={SALES_HISTORY_TABLE_THEAD_INFO} trRef={stickyRef} multiLine />
          <tbody>
            <DataLoader
              isData={salesHistoryResult.data && salesHistoryResult.data.length > 0}
              isFetching={salesHistoryResult.isFetching}
              loader={<Loading width={100} height={100} marginTop={16} isTable />}
              noData={<NoData isTable rowSpan={1} colSpan={31} paddingTop={20} paddingBottom={20} />}
            >
              {salesHistoryResult.isError ? <SuspenseErrorPage isTable /> : null}
              {filteredData.map((data, idx) => {
                const isDisplay = (currentPage - 1) * rowPerPage <= idx && currentPage * rowPerPage > idx;
                return isDisplay ? <TableRow data={data} key={`history_row_${idx}`} /> : null;
              })}
            </DataLoader>
          </tbody>
        </table>
        {/* 쿠폰 상세 내역 모달 */}
        {couponModal.isOpen && <CouponDetail />}
      </div>
      {/* 엑셀다운, 페이징, 정렬 */}
      <div className="result-function-wrap">
        <ExcelDownloader
          dataCnt={filteredData.length}
          type={'table'}
          sheetOption={{ origin: 'A1' }}
          colWidths={SALES_HISTORY_EXCEL_COLWIDTH_INFO}
          fileName={`${fCodeName}_주문내역(${searchConfig.from}~${searchConfig.to})`}
          addRowColor={{ rowNums: [1, 2], colors: ['d3d3d3', 'd3d3d3'] }}
          sheetName="주문내역"
        >
          {/* excel content */}
          <Table.TableHead thData={SALES_HISTORY_TABLE_THEAD_INFO} multiLine />
          <tbody>
            {filteredData.map((data) => (
              <TableRow data={data} key={`history_excel_${data.nOrderID}`} />
            ))}
          </tbody>
        </ExcelDownloader>
        <Pagination
          dataCnt={filteredData.length}
          pageInfo={{ row: rowPerPage, currentPage }}
          handlePageChange={setCurrentPage}
          handlePageRow={setRowPerPage}
        />
      </div>
    </>
  );
};

export default SalesHistory;
