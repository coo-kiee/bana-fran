import { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { format, subDays, subYears } from 'date-fns';

// global state
import { couponModalState, franState, loginState } from 'state';

// API
import SALES_SERVICE from 'service/salesService';

// Types
import { Bit } from 'types/common';
import {
  HISTORY_GIFT_CERT,
  HISTORY_ORDER_STATE,
  HISTORY_ORDER_TYPE,
  HISTORY_PAY_TYPE,
  HISTORY_PAY_WITH,
  HISTORY_RCP_TYPE,
  HISTORY_SEARCH_TYPE_LIST,
  SalesHistorySearch,
} from 'types/sales/salesType';
import { OPTION_TYPE } from 'types/etc/etcType';
// Utils
import Utils from 'utils/Utils';

// Components
import CalanderSearch from 'pages/common/calanderSearch';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';
import Loading from 'pages/common/loading';
import Wrapper from 'pages/common/loading/Wrapper';
import Sticky from 'pages/common/sticky';
import DataLoader from 'pages/common/dataLoader';
import PrefixSum from 'pages/sales/history/PrefixSum';
import TableColGroup from 'pages/sales/components/TableColGroup';
import TableHead from './table/TableHead';
import TableRow from './table/TableRow';
import CouponDetail from './couponDetail';
import NoData from 'pages/common/noData';
import { useSalesHistoryFilterData } from 'hooks/sales';
import usePageInfo from 'hooks/pagination/usePageInfo';
import Pages from 'pages/common/pagination/Pages';
import useHandlePageDataCnt from 'hooks/pagination/useHandlePageDataCnt';

const SalesHistoryContainer = () => {
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
    searchOption: [
      { title: '주문유형 전체', value: 'total' },
      { title: '주문상태 전체', value: 'total' },
      { title: '접수타입 전체', value: 'total' },
      { title: '결제방식 전체', value: 'total' },
      { title: '결제수단 전체', value: 'total' },
      { title: '상품종류 전체', value: 'total' },
    ],
  });

  // 취소 주문 표시 여부 0: 취소주문감추기 1: 취소주문표시
  const [isCancelShow, setIsCancelShow] = useState<Bit>(1);
  // 쿠팡/배민 주문 제외 여부 0: 쿠팡/배민표시 1:쿠팡/배민제외
  const [isExcludeCouBae, setIsExcludeCouBae] = useState<Bit>(0);

  // 엑셀 컴포넌트 생성용
  const [isLoadingExcel, setIsLoadingExcel] = useState(false);
  const [isDownloadExcel, setIsDownloadExcel] = useState(false);

  // query
  const salesHistoryResult = SALES_SERVICE.useSalesHistory({
    from_date: searchConfig.from,
    to_date: searchConfig.to,
    f_code: fCode,
  });

  // pagination
  const { pageInfo, handleCurrentPage, checkCurrentPageData } = usePageInfo();
  useHandlePageDataCnt(salesHistoryResult);

  // filter data custom hook
  const { filteredData } = useSalesHistoryFilterData({
    data: salesHistoryResult.data,
    searchOption: searchConfig.searchOption,
    isCancelShow,
    isExcludeCouBae,
  });

  // select options 내용
  const searchOptionList = [
    {
      [HISTORY_ORDER_TYPE.TOTAL]: { title: '주문유형 전체', value: 'total' },
      [HISTORY_ORDER_TYPE.CAFE]: { title: '매장주문', value: '0' },
      [HISTORY_ORDER_TYPE.APP]: { title: '앱배달주문', value: '1' },
      [HISTORY_ORDER_TYPE.COUBAE]: { title: '쿠팡/배민주문', value: '쿠팡배민' },
    },
    {
      [HISTORY_ORDER_STATE.TOTAL]: { title: '주문상태 전체', value: 'total' },
      [HISTORY_ORDER_STATE.AWAIT]: { title: '대기', value: '0' },
      [HISTORY_ORDER_STATE.MAKING]: { title: '제조중', value: '10' },
      [HISTORY_ORDER_STATE.MAKING_FINISH]: { title: '제조완료', value: '30' },
      [HISTORY_ORDER_STATE.DELIVERY]: { title: '배달중', value: '35' },
      [HISTORY_ORDER_STATE.COMPLETE]: { title: '완료', value: '40' },
      // [HISTORY_ORDER_STATE.CANCEL]: { title: '취소', value: '50' },
    },
    {
      [HISTORY_RCP_TYPE.TOTAL]: { title: '접수타입 전체', value: 'total' },
      [HISTORY_RCP_TYPE.APP]: { title: '앱', value: '앱' },
      [HISTORY_RCP_TYPE.KIOSK]: { title: '키오스크', value: '키오스크' },
      [HISTORY_RCP_TYPE.POS]: { title: '직접결제POS', value: '직접결제POS' },
      [HISTORY_RCP_TYPE.FPROCESS]: { title: '매장앱', value: '매장앱' },
      [HISTORY_RCP_TYPE.NA]: { title: 'N/A', value: 'N/A' },
    },
    {
      [HISTORY_PAY_TYPE.TOTAL]: { title: '결제방식 전체', value: 'total' },
      [HISTORY_PAY_TYPE.COMPLETE]: { title: '결제완료', value: '결제완료' },
      [HISTORY_PAY_TYPE.CARD]: { title: '현장카드결제', value: '현장카드' },
      [HISTORY_PAY_TYPE.CASH]: { title: '현장현금결제', value: '현장현금' },
      // [HISTORY_PAY_TYPE.CANCEL]: { title: '결제취소', value: '결제취소' },
    },
    {
      [HISTORY_PAY_WITH.TOTAL]: { title: '결제수단 전체', value: 'total' },
      [HISTORY_PAY_WITH.CARD]: { title: '카드', value: '카드' },
      [HISTORY_PAY_WITH.KAKAO]: { title: '카카오페이', value: '카카오페이' },
      [HISTORY_PAY_WITH.NAVER]: { title: '네이버페이', value: '네이버페이' },
      [HISTORY_PAY_WITH.APPLE]: { title: '애플페이', value: '애플페이' },
      [HISTORY_PAY_WITH.CASH]: { title: '현금', value: '현금' },
      [HISTORY_PAY_WITH.COUPON]: { title: '쿠폰(전체)', value: '쿠폰(전체)' },
      [HISTORY_PAY_WITH.POINT]: { title: '포인트(전체)', value: '포인트(전체)' },
    },
    {
      [HISTORY_GIFT_CERT.TOTAL]: { title: '상품종류 전체', value: 'total' },
      [HISTORY_GIFT_CERT.PRODUCT]: { title: '일반제품', value: '0' },
      [HISTORY_GIFT_CERT.GIFT_CERT]: { title: '실물상품권', value: '1' },
    },
  ];

  // table colgroup 배열
  const tableColGroup = [
    '105',
    '105',
    '70',
    '70',
    '110',
    '70',
    '110',
    '42',
    '65',
    '65',
    '62',
    '62',
    '62',
    '62',
    '62',
    '62',
    '62',
    '62',
    '62',
    '62',
    '62',
    '62',
    '62',
    '62',
    '62',
    '62',
    '62',
    '62',
    '62',
  ]; // 총합 1990

  /* sticky 기준 ref */
  const stickyRef = useRef<HTMLTableRowElement>(null);
  const tableRef = useRef<HTMLTableElement>(null); // 실제 data가 들어간 table

  /* excel download */
  const excelRef = useRef<HTMLTableElement>(null); // excel 출력용 table

  const excelDownload = useCallback(() => {
    const { from, to } = searchConfig;
    if (excelRef.current) {
      // Excel - sheet options: 셀 시작 위치, 셀 크기
      const options = {
        type: 'table', // 필수 O
        sheetOption: { origin: 'A1' }, // 해당 셀부터 데이터 표시, default - A1, 필수 X
        colspan: [
          { wch: 13 },
          { wch: 13 },
          { wch: 13 },
          { wch: 13 },
          { wch: 13 },
          { wch: 13 },
          { wch: 28 },
          { wch: 6 },
          { wch: 15 },
          { wch: 11 },
          { wch: 11 },
          { wch: 11 },
          { wch: 11 },
          { wch: 11 },
          { wch: 11 },
          { wch: 11 },
          { wch: 11 },
          { wch: 11 },
          { wch: 11 },
          { wch: 11 },
          { wch: 11 },
          { wch: 11 },
          { wch: 11 },
          { wch: 11 },
          { wch: 11 },
          { wch: 11 },
          { wch: 11 },
          { wch: 11 },
          { wch: 11 },
        ], // 셀 너비 설정, 필수 X
        addRowColor: { row: [1, 2], color: ['d3d3d3', 'd3d3d3'] },
        sheetName: '주문내역', // 시트이름, 필수 X
      };
      try {
        Utils.excelDownload(excelRef.current, options, `${fCodeName}_주문내역(${from}~${to})`);
      } catch (error) {
        console.log(error);
      }
    }
    setIsDownloadExcel(false);
    setIsLoadingExcel(false);
  }, [fCodeName, searchConfig]);

  // search(refetch)
  const handleSearch = () => {
    salesHistoryResult.refetch();
  };

  // loading띄우고 excelDownload 진행
  useEffect(() => {
    isLoadingExcel && setIsDownloadExcel(true);
  }, [isLoadingExcel]);

  useEffect(() => {
    if (isDownloadExcel) excelDownload();
  }, [excelDownload, isDownloadExcel]);

  // 검색/필터 조건 변경시 현재 페이지 번호 초기화
  useEffect(() => {
    handleCurrentPage(1);
  }, [handleCurrentPage, searchConfig.searchOption]);

  // 페이지, row 바뀌면 쿠폰 상세 모달 제거
  useEffect(() => {
    setCouponModal((prev) => ({ ...prev, isOpen: false }));
  }, [pageInfo, setCouponModal]);

  return (
    <>
      <div className="info-wrap">
        <p>※ 주문내역을 조회할 수 있습니다. (최대 12개월 이내)</p>
      </div>
      <div className="fixed-paid-point-wrap">
        {/* <!-- 공통 검색 Calendar with select --> */}
        <CalanderSearch
          dateType="yyyy-MM-dd"
          searchInfo={searchConfig}
          setSearchInfo={setSearchConfig}
          optionType={OPTION_TYPE.SELECT} // 'SELECT'
          selectOption={searchOptionList}
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
              <p className="notification">
                - 본사쿠폰(미보전): 본사 발행 이벤트/프로모션 쿠폰 중 가맹점 부담 쿠폰. (23/5/1일부터{' '}
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
        {/* <!-- 주문내역 Table --> */}
        <Sticky reference={stickyRef.current} contentsRef={tableRef.current}>
          <TableColGroup tableColGroup={tableColGroup} />
          <TableHead />
        </Sticky>
        <table className="board-wrap board-top" cellPadding="0" cellSpacing="0" ref={tableRef}>
          <TableColGroup tableColGroup={tableColGroup} />
          <TableHead ref={stickyRef} />
          <tbody>
            <DataLoader
              isData={salesHistoryResult.data && salesHistoryResult.data.length > 0}
              isFetching={salesHistoryResult.isFetching}
              loader={<Loading width={100} height={100} marginTop={16} isTable={true} />}
              noData={<NoData isTable={true} rowSpan={1} colSpan={29} paddingTop={20} paddingBottom={20} />}
            >
              {salesHistoryResult.isError ? <SuspenseErrorPage /> : null}
              {filteredData.map((data, idx) => {
                return checkCurrentPageData(idx) ? <TableRow data={data} key={`history_row_${idx}`} /> : null;
              })}
            </DataLoader>
          </tbody>
        </table>
        {/* 쿠폰 상세 내역 모달 */}
        {couponModal.isOpen && <CouponDetail />}

        {/* Excel Table */}
        <DataLoader isData={isDownloadExcel} noData={null}>
          {/* Excel Loading */}
          {/* isFetching, loader 옵션 미사용, 별도 처리 */}
          <Wrapper isRender={isLoadingExcel} isFixed={true} width="100%" height="100%">
            <Loading marginTop={0} />
          </Wrapper>
          <table className="board-wrap board-top excel-table" cellPadding="0" cellSpacing="0" ref={excelRef}>
            <TableColGroup tableColGroup={tableColGroup} />
            <TableHead />
            <tbody>
              {filteredData.map((data) => (
                <TableRow data={data} key={`history_excel_${data.nOrderID}`} />
              ))}
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
            disabled={filteredData.length === 0 || isDownloadExcel}
          >
            엑셀다운
          </button>
        </div>
        <Pages />
      </div>
    </>
  );
};

export default SalesHistoryContainer;
