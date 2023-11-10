export const BOARD_TAB = {
  MANAGEMENT: 2,
  EDUCATION: 3,
  RECIPE: 4,
  RULE: 5,
} as const;
export type BoardTab = (typeof BOARD_TAB)[keyof typeof BOARD_TAB];

export const BOARD_TAB_TITLE = {
  [BOARD_TAB.MANAGEMENT]: '운영 메뉴얼',
  [BOARD_TAB.EDUCATION]: '교육자료',
  [BOARD_TAB.RECIPE]: '레시피 자료실',
  [BOARD_TAB.RULE]: '규정 및 가이드',
} as const;

export const BOARD_FILTER_TYPE = {
  CATEGORY: 'category',
} as const;

const BOARD_MANAGEMENT_FILTER_OPTION = {
  [BOARD_FILTER_TYPE.CATEGORY]: [
    {
      label: '전체',
      value: 0,
    },
  ],
} as const;

const BOARD_EDUCATION_FILTER_OPTION = {
  [BOARD_FILTER_TYPE.CATEGORY]: [
    {
      label: '전체',
      value: 0,
    },
  ],
} as const;

const BOARD_RECIPE_FILTER_OPTION = {
  [BOARD_FILTER_TYPE.CATEGORY]: [
    {
      label: '전체',
      value: 0,
    },
  ],
} as const;

const BOARD_RULE_FILTER_OPTION = {
  [BOARD_FILTER_TYPE.CATEGORY]: [
    {
      label: '전체',
      value: 0,
    },
  ],
} as const;

export const BOARD_FILTER_OPTION = {
  [BOARD_TAB.MANAGEMENT]: BOARD_MANAGEMENT_FILTER_OPTION,
  [BOARD_TAB.EDUCATION]: BOARD_EDUCATION_FILTER_OPTION,
  [BOARD_TAB.RECIPE]: BOARD_RECIPE_FILTER_OPTION,
  [BOARD_TAB.RULE]: BOARD_RULE_FILTER_OPTION,
} as const;
export type BoardFilterOption = typeof BOARD_FILTER_OPTION;

export const BOARD_COLGROUP_INFO = [
  { width: '90' },
  { width: '130' },
  { width: '*' },
  { width: '130' },
  { width: '130' },
];

export const BOARD_THEAD_INFO = [
  [{ children: '번호' }, { children: '분류' }, { children: '제목' }, { children: '첨부파일' }, { children: '등록일' }],
];
