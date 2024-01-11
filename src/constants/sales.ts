/* history */
// search options

/* option value에 사용할 값 관련 타입들 */

// 주문유형(ORDER_TYPE)
export const HISTORY_ORDER_TYPE = {
  TOTAL: 'total',
  COUBAE: '쿠팡배민',
  CAFE: 0,
  APP: 1,
  COUPANG: 2,
  BAEMIN: 3,
};
// 주문상태(ORDER_STATE)
export const HISTORY_ORDER_STATE = {
  TOTAL: 'total',
  AWAIT: 5,
  MAKING: 10,
  MAKING20: 20,
  MAKING_FINISH: 30,
  DELIVERY: 35,
  COMPLETE: 40,
  CANCEL: 50,
};
// 접수타입(RCP_TYPE)
export const HISTORY_RCP_TYPE = {
  TOTAL: 'total',
  APP: '앱',
  KIOSK: '키오스크',
  POS: '직접결제POS',
  FPROCESS: '매장앱',
  NA: 'N/A',
};
// 결제방식(PAY_TYPE)
export const HISTORY_PAY_TYPE = {
  TOTAL: 'total',
  COMPLETE: '결제완료',
  CARD: '현장카드',
  CASH: '현장현금',
  // CANCEL: '결제취소',
};
// 결제수단(PAY_WITH)
export const HISTORY_PAY_WITH = {
  TOTAL: 'total',
  CARD: '카드',
  KAKAO: '카카오페이',
  NAVER: '네이버페이',
  APPLE: '애플페이',
  CASH: '현금',
  COUPON: '쿠폰(전체)',
  POINT: '포인트(전체)',
};
// 상품종류(GIFT_CERT)
export const HISTORY_GIFT_CERT = {
  TOTAL: 'total',
  PRODUCT: 0,
  GIFT_CERT: 1,
};

// select안에서 사용할 option의 타입 LIST
export const HISTORY_SEARCH_TYPE_LIST = [
  [HISTORY_ORDER_TYPE.TOTAL, HISTORY_ORDER_TYPE.CAFE, HISTORY_ORDER_TYPE.APP, HISTORY_ORDER_TYPE.COUBAE],
  [
    HISTORY_ORDER_STATE.TOTAL,
    HISTORY_ORDER_STATE.AWAIT,
    HISTORY_ORDER_STATE.MAKING,
    HISTORY_ORDER_STATE.MAKING_FINISH,
    HISTORY_ORDER_STATE.DELIVERY,
    HISTORY_ORDER_STATE.COMPLETE,
    // HISTORY_ORDER_STATE.CANCEL,
  ],
  [
    HISTORY_RCP_TYPE.TOTAL,
    HISTORY_RCP_TYPE.APP,
    HISTORY_RCP_TYPE.KIOSK,
    HISTORY_RCP_TYPE.POS,
    HISTORY_RCP_TYPE.FPROCESS,
    HISTORY_RCP_TYPE.NA,
  ],
  [
    HISTORY_PAY_TYPE.TOTAL,
    HISTORY_PAY_TYPE.COMPLETE,
    HISTORY_PAY_TYPE.CARD,
    HISTORY_PAY_TYPE.CASH,
    // HISTORY_PAY_TYPE.CANCEL,
  ],
  [
    HISTORY_PAY_WITH.TOTAL,
    HISTORY_PAY_WITH.CARD,
    HISTORY_PAY_WITH.KAKAO,
    HISTORY_PAY_WITH.NAVER,
    HISTORY_PAY_WITH.APPLE,
    HISTORY_PAY_WITH.CASH,
    HISTORY_PAY_WITH.COUPON,
    HISTORY_PAY_WITH.POINT,
  ],
  [HISTORY_GIFT_CERT.TOTAL, HISTORY_GIFT_CERT.PRODUCT, HISTORY_GIFT_CERT.GIFT_CERT],
];

// statistic option types
export const STATISTIC_SEARCH_TYPE = {
  DAILY: 'D',
  MONTHLY: 'M',
  HOURLY: 'H',
};

// select안에서 사용할 option의 타입 LIST
export const STATISTIC_SEARCH_LIST = [
  STATISTIC_SEARCH_TYPE.DAILY,
  STATISTIC_SEARCH_TYPE.MONTHLY,
  STATISTIC_SEARCH_TYPE.HOURLY,
];

export const SALES_HISTORY_SEARCH_OPTION = [
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

// table thead
export const SALES_HISTORY_TABLE_THEAD_INFO = [
  [
    { children: '결제\n일시', rowSpan: 2 },
    { children: '취소\n일시', rowSpan: 2 },
    { children: '주문\n유형', rowSpan: 2 },
    { children: '주문\n상태', rowSpan: 2 },
    { children: '전화\n번호', rowSpan: 2 },
    { children: '판매\n구분', rowSpan: 2 },
    { children: '주문\n메뉴', rowSpan: 2 },
    { children: '총\n건수', rowSpan: 2 },
    { children: '접수\n타입', rowSpan: 2 },
    { children: '결제\n방식', rowSpan: 2 },
    { children: '주문금액\n(메뉴)', rowSpan: 2 },
    { children: '배달비\n(앱주문)', rowSpan: 2 },
    { children: '결제상세(앱주문 배달비 포함)', colSpan: 15, className: 'price-area boder-th-b' },
    { children: '적립', colSpan: 2, className: 'price-area boder-th-b boder-th-l' },
    // { children: '현금영수증', rowSpan: 2 },
  ],
  [
    { children: '합계', className: 'price-area boder-th-b' },
    { children: '카드', className: 'price-area' },
    { children: '간편결제', className: 'price-area' },
    { children: '현금', className: 'price-area' },
    { children: '바나포인트', className: 'price-area' },
    { children: '충전포인트', className: 'price-area' },
    { children: '보너스\n충전포인트', className: 'price-area' },
    { children: '잔돈포인트', className: 'price-area' },
    { children: '제휴사쿠폰', className: 'price-area' },
    { children: '가맹점쿠폰', className: 'price-area' },
    { children: '스탬프쿠폰\n(보전)', className: 'price-area' },
    { children: '본사쿠폰\n(보전)', className: 'price-area' },
    { children: '본사쿠폰\n(미보전)', className: 'price-area' },
    { children: '쿠팡/배민\n(주문금액)', className: 'price-area' },
    { children: '쿠팡/배민\n(배달비)', className: 'price-area' },
    { children: '스탬프(개)', className: 'price-area boder-th-l' },
    { children: '바나포인트(P)', className: 'price-area' },
  ],
];

// table colgroup
export const SALES_HISTORY_TABLE_COLGROUP_INFO = [
  { width: '102' },
  { width: '102' },
  { width: '70' },
  { width: '70' },
  { width: '110' },
  { width: '70' },
  { width: '120' },
  { width: '40' },
  { width: '62' },
  { width: '62' },
  { width: '62' },
  { width: '62' },
  { width: '62' },
  { width: '62' },
  { width: '62' },
  { width: '62' },
  { width: '62' },
  { width: '62' },
  { width: '62' },
  { width: '62' },
  { width: '62' },
  { width: '62' },
  { width: '62' },
  { width: '62' },
  { width: '62' },
  { width: '62' },
  { width: '62' },
  { width: '62' },
  { width: '62' },
  // { width: '62' },
]; // 총합 1986

// excel width px
export const SALES_HISTORY_EXCEL_COLWIDTH_INFO = [
  { wpx: 80 },
  { wpx: 80 },
  { wpx: 80 },
  { wpx: 80 },
  { wpx: 80 },
  { wpx: 80 },
  { wpx: 170 },
  { wpx: 30 },
  { wpx: 92 },
  { wpx: 68.25 },
  { wpx: 68.25 },
  { wpx: 68.25 },
  { wpx: 68.25 },
  { wpx: 68.25 },
  { wpx: 68.25 },
  { wpx: 68.25 },
  { wpx: 68.25 },
  { wpx: 68.25 },
  { wpx: 68.25 },
  { wpx: 68.25 },
  { wpx: 68.25 },
  { wpx: 68.25 },
  { wpx: 68.25 },
  { wpx: 68.25 },
  { wpx: 68.25 },
  { wpx: 68.25 },
  { wpx: 68.25 },
  { wpx: 68.25 },
  { wpx: 68.25 },
  // { wpx: 68.25 },
];

/* statistic */
// search options
export const SALES_STATISTIC_SEARCH_OPTION = [
  {
    [STATISTIC_SEARCH_TYPE.DAILY]: { title: '일별', id: 'daily', value: STATISTIC_SEARCH_TYPE.DAILY },
    [STATISTIC_SEARCH_TYPE.MONTHLY]: { title: '월별', id: 'monthly', value: STATISTIC_SEARCH_TYPE.MONTHLY },
    [STATISTIC_SEARCH_TYPE.HOURLY]: { title: '시간대별', id: 'hourly', value: STATISTIC_SEARCH_TYPE.HOURLY },
  },
];

// table thead
export const SALES_STATISTIC_TABLE_THEAD_INFO = [
  [
    { children: '일시', rowSpan: 2 },
    { children: '총매출\n(부가세 포함)', rowSpan: 2, className: 'bg-a' },
    { children: '앱 주문\n배달매출\n(배달비 포함)', rowSpan: 2, className: 'bg-b' },
    { children: '배달비\n(앱 주문)', rowSpan: 2, className: 'bg_d' },
    { children: '유상매출\n합계\n(부가세 포함)', rowSpan: 2, className: 'bg-e bg-e-right' },
    { children: '유상 매출 상세 (부가세 포함)', colSpan: 12, className: 'bg-e bg-e-bottom' },
    { children: '무상서비스\n비용 합계', rowSpan: 2, className: 'bg-right' },
    { children: '무상서비스 비용 상세', colSpan: 3, className: 'bg-bottom' },
  ],
  [
    { children: '카드매출\n(키오스크/POS)', className: 'bg-e height-63' },
    { children: '카드매출\n(어플)', className: 'bg-e height-63' },
    { children: '간편결제\n(키오스크/POS)', className: 'bg-e height-63' },
    { children: '간편결제\n(어플)', className: 'bg-e height-63' },
    { children: '현금매출\n(배달/POS)', className: 'bg-e height-63' },
    { children: '쿠팡/배민\n(주문금액)', className: 'bg-e height-63' },
    { children: '쿠팡/배민\n(배달비)', className: 'bg-e height-63' },
    { children: '유상포인트\n매출', className: 'bg-e height-63' },
    { children: '제휴사 쿠폰\n매출', className: 'bg-e height-63' },
    { children: '바나포인트\n(보전)', className: 'bg-e height-63' },
    { children: '스탬프쿠폰\n(보전)', className: 'bg-e height-63' },
    { children: '본사 쿠폰 매출\n(보전)', className: 'bg-e height-63' },
    { children: '가맹점\n바나포인트\n사용금액' },
    { children: '가맹점 쿠폰\n사용금액' },
    { children: '본사 쿠폰 매출\n(미보전)' },
  ],
];

// table colgroup
export const SALES_STATISTIC_TABLE_COLGROUP_INFO = [
  { width: '122' },
  { width: '122' },
  { width: '122' },
  { width: '122' },
  { width: '122' },
  { width: '122' },
  { width: '122' },
  { width: '122' },
  { width: '122' },
  { width: '122' },
  { width: '122' },
  { width: '122' },
  { width: '122' },
  { width: '122' },
  { width: '122' },
  { width: '122' },
  { width: '122' },
  { width: '122' },
  { width: '122' },
  { width: '122' },
  { width: '122' },
];
