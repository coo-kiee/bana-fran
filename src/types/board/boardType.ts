type Board = {
    attach_cnt: number,
    board_id: number,
    board_type: number,
    category: number,
    category_name: string,
    contents_type: number,
    delete_flag: string,
    important: string,
    insert_date: string,
    insert_user_name: string,
    modify_date: string,
    modify_user_name: string,
    new_flag: number,
    open_date_flag: string,
    open_end_date: string,
    open_flag: string,
    open_start_date: string,
    read_cnt: number,
    read_flag: number,
    rownum: string,
    title: string,
};

type Category = {
    code: number,
    code_name: string,
};

const MENU_TYPE = {
    NOTICE: 'notice',
    ARCHAIVE: 'archaive',
} as const;
type MenuType = typeof MENU_TYPE[keyof typeof MENU_TYPE];

const BOARD_TYPE = {
    NOTICE: { title: '공지사항', type: 1 },
    MANAGEMENT: { title: '운영 메뉴얼', type: 2 },
    EDUCATION: { title: '교육자료', type: 3 },
    RECIPE: { title: '레시피 자료실', type: 4 },
    RULE: { title: '규정 및 가이드', type: 5 },
    CALCULATION: { title: '정산 관련 공지', type: 6 },
} as const;
type BoardType = typeof BOARD_TYPE[keyof typeof BOARD_TYPE];

const BOARD_GROUP = {
    [MENU_TYPE.NOTICE]: [BOARD_TYPE.CALCULATION, BOARD_TYPE.NOTICE],
    [MENU_TYPE.ARCHAIVE]: [BOARD_TYPE.MANAGEMENT, BOARD_TYPE.EDUCATION, BOARD_TYPE.RECIPE, BOARD_TYPE.RULE],
} as const;

// const BOARD_TAB = {
//     [BOARD_TYPE.NOTICE]: { title: '공지사항', tabType: BOARD_TYPE.NOTICE }, 
//     [BOARD_TYPE.MANAGEMENT]: { title: '운영 메뉴얼', tabType: BOARD_TYPE.MANAGEMENT },
//     [BOARD_TYPE.EDUCATION]: { title: '교육자료', tabType: BOARD_TYPE.EDUCATION },
//     [BOARD_TYPE.RECIPE]: { title: '레시피 자료실', tabType: BOARD_TYPE.RECIPE },
//     [BOARD_TYPE.RULE]: { title: '규정 및 가이드', tabType: BOARD_TYPE.RULE },
//     [BOARD_TYPE.CALCULATION]: { title: '정산 관련 공지', tabType: BOARD_TYPE.CALCULATION }, 
// } as const;
// type BoardTabType = typeof BOARD_TAB[keyof typeof BOARD_TAB];

interface ListSearchCondition {
    f_code: number,
    staff_no: number,
    board_type: BoardType['type'],
    search_category: number,
    search_text: string,
    page_idx: number,
    page_size: number,
};

type BoardListResult = {
    list: Board[],
    out: { active_page_idx: number, total_cnt: number }
};

export { MENU_TYPE, BOARD_TYPE, BOARD_GROUP };
export type {
    Board, Category, MenuType, BoardType, ListSearchCondition,
    BoardListResult,
};