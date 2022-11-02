import loadable, { LoadableComponent } from '@loadable/component'

const Home = loadable(() => import('pages/home'));
const Notice = loadable(() => import('pages/notice'));
const Board = loadable(() => import('pages/board'));
const Etc = loadable(() => import('pages/etc'));
const Extra = loadable(() => import('pages/membership/extra'));
const MonthRank = loadable(() => import('pages/membership/monthRank'));

// 사이드 메뉴
type SIDE_MENU_TYPE = {
    path: string,
    name: string,
    icon: string,
    id: number,
    component: LoadableComponent<any> | null,
    child: Array<Omit<SIDE_MENU_TYPE, 'child'>>
    addParameter: string[],
}

const sideMenus: Array<SIDE_MENU_TYPE> = [
    {
        path: "/home",
        name: "HOME",
        icon: "vcard",
        id: 100,
        component: Home,
        child: [],
        addParameter: []
    },
    {
        path: "/notice",
        name: "공지사항",
        icon: "vcard",
        id: 200,
        component: Notice,
        child: [],
        addParameter: []
    },
    {
        path: "/board",
        name: "자료실",
        icon: "vcard",
        id: 300,
        component: Board,
        child: [],
        addParameter: [':boardId']
    },
    {
        path: "/caculate",
        name: "정산관리",
        icon: "group",
        id: 400,
        component: null,
        child: [
            {
                path: "/list",
                name: "정산내역 확인",
                icon: "",
                id: 410,
                component: Home,
                addParameter: []
            },
            {
                path: "/point",
                name: "유상포인트 결제내역",
                icon: "",
                id: 420,
                component: Home,
                addParameter: []
            },
            {
                path: "/coupon",
                name: "본사 쿠폰 결제내역",
                icon: "",
                id: 430,
                component: Home,
                addParameter: []
            },
            {
                path: "/claim",
                name: "고객 클레임 보상내역",
                icon: "",
                id: 440,
                component: Home,
                addParameter: []
            },
            {
                path: "/etc",
                name: "기타 정산 내역",
                icon: "",
                id: 450,
                component: Home,
                addParameter: []
            }
        ],
        addParameter: []
    },
    {
        path: "/recruitQnaMgmt",
        name: "기타내역",
        icon: "question circle outline",
        id: 500,
        component: Etc,
        child: [],
        addParameter: []
    },
    {
        path: "/interviewMgmt",
        name: "매출관리",
        icon: "clipboard outline",
        id: 600,
        component: Home,
        child: [],
        addParameter: []
    },
    {
        path: "/membership",
        name: "멤버십현황",
        icon: "clipboard outline",
        id: 700,
        component: null,
        addParameter: [],
        child: [
            {
                path: "/extra",
                name: "스탬프/쿠폰/바나포인트",
                icon: "",
                id: 710,
                component: Extra,
                addParameter: []
            },
            {
                path: "/monthRank",
                name: "월간 랭킹 현황",
                icon: "",
                id: 720,
                component: MonthRank,
                addParameter: []
            },
        ]
    }
];

export {
    sideMenus
}

export type {
    SIDE_MENU_TYPE
}