import { BOARD_TYPE } from "types/board/boardType";

const enum NOTICE_TYPE {
    CALCULATION,
    NOTICE,
};

const NOTICE_TAB = {
    [NOTICE_TYPE.CALCULATION]: { title: '정산 관련 공지', boradType: BOARD_TYPE.CALCULATION }, 
    [NOTICE_TYPE.NOTICE]: { title: '공지사항', boradType: BOARD_TYPE.NOTICE }, 
} as const;
type NoticeTabType = typeof NOTICE_TAB[keyof typeof NOTICE_TAB];

export { NOTICE_TYPE, NOTICE_TAB };
export type { NoticeTabType };