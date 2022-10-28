import loadable, { LoadableComponent } from '@loadable/component'

const Home = loadable(() => import('pages/home'));
const Notice = loadable(() => import('pages/notice'));
const Board = loadable(() => import('pages/board'));

// 사이드 메뉴
type SIDE_MENU_TYPE = {
    path: string,
    name: string,
    icon: string,
    id : number,
    component: LoadableComponent<any> | null,
    child: Array<Omit<SIDE_MENU_TYPE, 'child'>>
}

const sideMenus: Array<SIDE_MENU_TYPE> = [
    {
        path: "/home",
        name: "HOME",
        icon: "vcard",
        id : 100,
        component: Home,
        child: []
    },
    {
        path: "/notice",
        name: "공지사항",
        icon: "vcard",
        id : 200,
        component: Notice,
        child: []
    },
    {
        path: "/board",
        name: "자료실",
        icon: "vcard",
        id : 300,
        component: Board,
        child: []
    },
    {
        path: "/caculate",
        name: "정산관리",
        icon: "group",
        id : 400,
        component: null,
        child: [
            {
                path: "/list",
                name: "정산내역 확인",
                icon: "",
                id : 410,
                component: Home
            },
            {
                path: "/point",
                name: "유상포인트 결제내역",
                icon: "",
                id : 420,
                component: Home
            },
            {
                path: "/coupon",
                name: "본사 쿠폰 결제내역",
                icon: "",
                id : 430,
                component: Home
            },
            {
                path: "/claim",
                name: "고객 클레임 보상내역",
                icon: "",
                id : 440,
                component: Home
            },
            {
                path: "/etc",
                name: "기타 정산 내역",
                icon: "",
                id : 450,
                component: Home
            }
        ]
    },
    {
        path: "/recruitQnaMgmt",
        name: "기타내역",
        icon: "question circle outline",
        id : 500,
        component: Home,
        child: []
    },
    {
        path: "/interviewMgmt",
        name: "매출관리",
        icon: "clipboard outline",
        id : 600,
        component: Home,
        child: []
    },
    {
        path: "/interviewMgmt",
        name: "멤버십현황",
        icon: "clipboard outline",
        id : 700,
        component: Home,
        child: []
    }
];

export {
    sideMenus
}

export type {
    SIDE_MENU_TYPE
}