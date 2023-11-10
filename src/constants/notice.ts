export const NOTICE_TAB = {
  NORMAL: 1,
  CALCULATE: 6,
} as const;
export type NoticeTab = (typeof NOTICE_TAB)[keyof typeof NOTICE_TAB];

export const NOTICE_TAB_TITLE = {
  [NOTICE_TAB.NORMAL]: '일반 공지',
  [NOTICE_TAB.CALCULATE]: '정산 관련 공지',
} as const;

export const NOTICE_FILTER_TYPE = {
  CATEGORY: 'category',
} as const;

const NOTICE_NORMAL_FILTER_OPTION = {
  [NOTICE_FILTER_TYPE.CATEGORY]: [
    {
      label: '전체',
      value: 0,
    },
  ],
} as const;

const NOTICE_CALCULATE_FILTER_OPTION = {
  [NOTICE_FILTER_TYPE.CATEGORY]: [
    {
      label: '전체',
      value: 0,
    },
  ],
} as const;

export const NOTICE_FILTER_OPTION = {
  [NOTICE_TAB.NORMAL]: NOTICE_NORMAL_FILTER_OPTION,
  [NOTICE_TAB.CALCULATE]: NOTICE_CALCULATE_FILTER_OPTION,
} as const;
export type NoticeFilterOption = typeof NOTICE_FILTER_OPTION;

export const NOTICE_COLGROUP_INFO = [
  { width: '90' },
  { width: '130' },
  { width: '*' },
  { width: '130' },
  { width: '130' },
];

export const NOTICE_THEAD_INFO = [
  [{ children: '번호' }, { children: '분류' }, { children: '제목' }, { children: '첨부파일' }, { children: '등록일' }],
];
