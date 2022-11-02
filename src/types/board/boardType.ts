type Board = {
    attach_cnt: number, // 첨부파일 개수
    board_id: number, // 게시판 Id
    board_type: number, // 게시판 타입
    category: number, // 카테고리 타입
    category_name: string, // 카테고리 이름
    contents_type: number,
    delete_flag: string,
    important: string, // 중요여부
    insert_date: string, // 등록일
    insert_user_name: string, // 등록자
    modify_date: string, // 수정일
    modify_user_name: string, // 수정자
    new_flag: number,
    open_date_flag: string,
    open_end_date: string,
    open_flag: string,
    open_start_date: string,
    read_cnt: number, // 조회수
    read_flag: number,
    rownum: string, // 게시판 번호
    title: string, // 게시판 제목
};

type Category = {
    code: number,
    code_name: string,
};

type BoardDetailType = {
    attach_cnt: number,
    board_id: number,
    board_type: number,
    category: number,
    category_name: string,
    contents: string, // 내용 text 파일 저장 경로 Url
    contents_type: number,
    delete_flag: number,
    important: string,
    insert_date: string,
    insert_user_name: string,
    modify_date: string,
    modify_user_name: string,
    open_date_flag: string,
    open_end_date: string,
    open_flag: string,
    open_start_date: string,
    read_cnt: number,
    title: string,
};

type FileType = {
    attach_id: number,
    board_id: number,
    file_size: string,
    file_url: string, // 첨부파일 저장 경로 Url
    insert_date: string,
    insert_user_name: string,
    origin_file_name: string,
    sFileSize: string, // file_size를 Byte 단위로 변경한 것 (ex. 60.86KB)
};

const MENU_TYPE = {
    NOTICE: 'notice', // 공지사항
    BOARD: 'board', // 자료실
} as const;
type MenuType = typeof MENU_TYPE[keyof typeof MENU_TYPE];

const BOARD_INFO = {
    NOTICE: { title: '일반 공지', type: 1 , detailTitle: ''}, // 일반 공지
    MANAGEMENT: { title: '운영 메뉴얼', type: 2 }, // 운영 메뉴얼
    EDUCATION: { title: '교육자료', type: 3 }, // 교육자료
    RECIPE: { title: '레시피 자료실', type: 4 }, // 레시피 자료실
    RULE: { title: '규정 및 가이드', type: 5 }, // 규정 및 가이드
    CALCULATION: { title: '정산 관련 공지', type: 6 }, // 정산 관련 공지
} as const;
type BoardInfo = typeof BOARD_INFO[keyof typeof BOARD_INFO];

const BOARD_GROUP = {
    [MENU_TYPE.NOTICE]: [BOARD_INFO.CALCULATION, BOARD_INFO.NOTICE],
    [MENU_TYPE.BOARD]: [BOARD_INFO.MANAGEMENT, BOARD_INFO.EDUCATION, BOARD_INFO.RECIPE, BOARD_INFO.RULE],
} as const;

interface ListSearchCondition {
    f_code: number, // 가맹지점 코드
    staff_no: number, // 직원번호
    board_type: BoardInfo['type'], // 1 : 공지사항, 2 : 운영 매뉴얼, 3 : 교육자료실, 4 : 레시피자료실, 5 : 규정 및 가이드, 6 : 정산관련 공지 )
    search_category: number, // 카테고리 0 : 전체, 1 : 메뉴얼, 2: 규정...
    search_text: string, // 검색 키워드
    page_idx: number, // 조회할 페이지
    page_size: number, // 조회할 건수
};

type BoardListResult = {
    list: Board[],
    out: { active_page_idx: number, total_cnt: number }
};

export { MENU_TYPE, BOARD_INFO, BOARD_GROUP };
export type {
    Board, Category, BoardDetailType, FileType, MenuType, BoardInfo, ListSearchCondition,
    BoardListResult,
};