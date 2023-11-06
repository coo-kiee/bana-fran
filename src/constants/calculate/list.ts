// 정산내역 확인 정산상태
export const LIST_STATUS = {
  ERROR: -1,
  NO_DATA: 5, // 미배포
  NOT_CONFIRM: 10, // 미확인
  FIX_REQUEST: 20, // 수정요청
  CONFIRM: 30, // 확인완료
};

export const LIST_TABLE_COLUMN_INFO = [
  { width: '188' },
  { width: '70' },
  { width: '130' },
  { width: '*' },
  { width: '130' },
  { width: '130' },
  { width: '130' },
  { width: '130' },
  { width: '130' },
  { width: '130' },
];

export const LIST_THEAD_INFO = [
  [
    { children: '정산기간' },
    { children: '구분' },
    { children: '품목' },
    { children: '상세내역' },
    { children: '수량' },
    { children: '단가' },
    { children: '공급가액' },
    { children: '부가세' },
    { children: '합계' },
    { children: '비고' },
  ],
];

export const LIST_HISTORY_COLUMN_INFO = [
  { width: '130' },
  { width: '98' },
  { width: '98' },
  { width: '372' },
  { width: '250' },
  { width: '250' },
];

export const LIST_HISTORY_THEAD_INFO = [
  [
    { children: '일시' },
    { children: '구분' },
    { children: '등록자' },
    { children: '수정요청/답변내용' },
    { children: '변경 전' },
    { children: '변경 후' },
  ],
];
