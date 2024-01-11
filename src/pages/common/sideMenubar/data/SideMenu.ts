import loadable, { LoadableComponent } from '@loadable/component';

const Home = loadable(() => import('pages/home'));
const Notice = loadable(() => import('pages/notice'));
const Board = loadable(() => import('pages/board'));
const CalculateList = loadable(() => import('pages/calculate/list'));
const CalculatePoint = loadable(() => import('pages/calculate/point'));
const CalculateCoupon = loadable(() => import('pages/calculate/coupon'));
const CalculateClaim = loadable(() => import('pages/calculate/claim'));
const CalculateEtc = loadable(() => import('pages/calculate/etc'));
const CalculateAffiliate = loadable(() => import('pages/calculate/affiliate'));
const CalculateBanaPoint = loadable(() => import('pages/calculate/bana-point'));
const CalculateStampCoupon = loadable(() => import('pages/calculate/stamp-coupon'));
const Etc = loadable(() => import('pages/etc'));
const Extra = loadable(() => import('pages/membership/extra'));
const MonthRank = loadable(() => import('pages/membership/monthRank'));
const SalesContainer = loadable(() => import('pages/sales'));
const EventContainer = loadable(() => import('pages/event'));

export const PAGE_URL = {
  HOME: '/home',
  NOTICE: '/notice',
  BOARD: '/board',
  CALCULATE: '/calculate',
  CALCULATE_LIST: '/list',
  CALCULATE_POINT: '/point',
  CALCULATE_COUPON: '/coupon',
  CALCULATE_CLAIM: '/claim',
  CALCULATE_ETC: '/etc',
  CALCULATE_AFFILIATE: '/affiliate',
  CALCULATE_BANA_POINT: '/banaPoint',
  CALCULATE_STAMP_COUPON: '/stampCoupon',
  ETC: '/etc',
  SALES: '/sales',
  SALES_HISTORY: '/history',
  SALES_STATISTIC: '/statistic',
  MEMBERSHIP: '/membership',
  MEMBERSHIP_EXTRA: '/extra',
  MEMBERSHIP_MONTHRANK: '/monthRank',
  EVENT: '/event',
  EVENT_COUPON: '/event/coupon',
} as const;

// 사이드 메뉴
type SIDE_MENU_TYPE = {
  path: string;
  name: string;
  icon: string;
  id: number;
  component: LoadableComponent<any> | null;
  child: Array<Omit<SIDE_MENU_TYPE, 'child'>>;
  addPath: string[];
};

const sideMenus: Array<SIDE_MENU_TYPE> = [
  {
    path: PAGE_URL.HOME,
    name: 'HOME',
    icon: 'vcard',
    id: 100,
    component: Home,
    child: [],
    addPath: [],
  },
  {
    path: PAGE_URL.NOTICE,
    name: '공지사항',
    icon: 'vcard',
    id: 200,
    component: Notice,
    child: [],
    addPath: [':bType', ':bType/:bId'],
  },
  {
    path: PAGE_URL.BOARD,
    name: '자료실',
    icon: 'vcard',
    id: 300,
    component: Board,
    child: [],
    addPath: [':bType', ':bType/:bId'],
  },
  {
    path: PAGE_URL.CALCULATE,
    name: '정산관리',
    icon: 'group',
    id: 400,
    component: null,
    child: [
      {
        path: PAGE_URL.CALCULATE_LIST,
        name: '정산내역 확인',
        icon: '',
        id: 410,
        component: CalculateList,
        addPath: [],
      },
      {
        path: PAGE_URL.CALCULATE_POINT,
        name: '유상포인트 결제내역',
        icon: '',
        id: 420,
        component: CalculatePoint,
        addPath: [],
      },
      {
        path: PAGE_URL.CALCULATE_COUPON,
        name: '본사 쿠폰 결제내역',
        icon: '',
        id: 430,
        component: CalculateCoupon,
        addPath: [],
      },
      {
        path: PAGE_URL.CALCULATE_CLAIM,
        name: '클레임 쿠폰 정산내역',
        icon: '',
        id: 440,
        component: CalculateClaim,
        addPath: [],
      },
      {
        path: PAGE_URL.CALCULATE_ETC,
        name: '기타 정산 내역',
        icon: '',
        id: 450,
        component: CalculateEtc,
        addPath: [],
      },
      {
        path: PAGE_URL.CALCULATE_AFFILIATE,
        name: '제휴사 쿠폰/포인트 결제내역',
        icon: '',
        id: 460,
        component: CalculateAffiliate,
        addPath: [],
      },
      {
        path: PAGE_URL.CALCULATE_BANA_POINT,
        name: '바나포인트 정산내역',
        icon: '',
        id: 470,
        component: CalculateBanaPoint,
        addPath: [],
      },
      {
        path: PAGE_URL.CALCULATE_STAMP_COUPON,
        name: '스탬프 쿠폰 정산내역',
        icon: '',
        id: 480,
        component: CalculateStampCoupon,
        addPath: [],
      },
    ],
    addPath: [],
  },
  {
    path: PAGE_URL.ETC,
    name: '기타내역',
    icon: 'question circle outline',
    id: 500,
    component: Etc,
    child: [],
    addPath: [],
  },
  {
    path: PAGE_URL.SALES,
    name: '매출관리',
    icon: 'clipboard outline',
    id: 600,
    component: null,
    child: [
      {
        path: PAGE_URL.SALES_HISTORY,
        name: '주문내역',
        icon: '',
        id: 610,
        component: SalesContainer,
        addPath: [],
      },
      {
        path: PAGE_URL.SALES_STATISTIC,
        name: '매출통계',
        icon: '',
        id: 620,
        component: SalesContainer,
        addPath: [],
      },
    ],
    addPath: [],
  },
  {
    path: PAGE_URL.MEMBERSHIP,
    name: '멤버십현황',
    icon: 'clipboard outline',
    id: 700,
    component: null,
    addPath: [],
    child: [
      {
        path: PAGE_URL.MEMBERSHIP_EXTRA,
        name: '스탬프/쿠폰/바나포인트',
        icon: '',
        id: 710,
        component: Extra,
        addPath: [],
      },
      {
        path: PAGE_URL.MEMBERSHIP_MONTHRANK,
        name: '월간 랭킹 현황',
        icon: '',
        id: 720,
        component: MonthRank,
        addPath: [],
      },
    ],
  },
  {
    path: PAGE_URL.EVENT_COUPON,
    name: '이벤트쿠폰현황',
    icon: 'clipboard outline',
    id: 800,
    component: EventContainer,
    child: [],
    addPath: [],
  },
];

export { sideMenus };

export type { SIDE_MENU_TYPE };
