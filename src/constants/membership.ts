import { MEMBERSHIP_PAGE_TYPE } from 'types/membership/membershipType';

export const MEMBERSHIP_COL_THEAD_LIST = {
  [MEMBERSHIP_PAGE_TYPE.EXTRA]: {
    colgroup: [
      { width: '162' },
      { width: '162' },
      { width: '162' },
      { width: '162' },
      { width: '162' },
      { width: '162' },
      { width: '162' },
      { width: '162' },
      { width: '162' },
      { width: '162' },
    ],
    thead: [
      [
        { children: '일시', rowSpan: 2 },
        { children: '스탬프', colSpan: 3, className: 'price-area boder-th-b' },
        { children: '무료음료쿠폰(스탬프적립&월간랭킹보상)', colSpan: 3, className: 'boder-th-a' },
        { children: '바나포인트 (적립&월간랭킹보상)', colSpan: 3, className: 'price-area boder-th-b' },
      ],
      [
        { children: '지급 수', className: 'price-area height-63' },
        { children: '쿠폰전환 수', className: 'price-area height-63' },
        { children: '유효기간 소멸 수', className: 'price-area height-63' },
        { children: '발급 수(금액)', className: 'height-63' },
        { children: '사용 수(금액)', className: 'height-63' },
        { children: '유효기간 소멸 수(금액)', className: 'height-63' },
        { children: '적립', className: 'price-area height-63' },
        { children: '사용', className: 'price-area height-63' },
        { children: '유효기간 소멸', className: 'price-area height-63' },
      ],
    ],
  },
  [MEMBERSHIP_PAGE_TYPE.MONTHRANK]: {
    colgroup: [{ width: '325' }, { width: '325' }, { width: '325' }, { width: '325' }, { width: '325' }],
    thead: [
      [
        { children: '기준일' },
        { children: '매장' },
        { children: '당월 랭킹' },
        { children: '지급 대상자' },
        { children: '지급 경품' },
      ],
    ],
  },
};

export const MEMBERSHIP_HEADER_LIST = {
  [MEMBERSHIP_PAGE_TYPE.EXTRA]: {
    subtitle: '스탬프/쿠폰/바나포인트',
  },
  [MEMBERSHIP_PAGE_TYPE.MONTHRANK]: {
    subtitle: '월간 랭킹 현황',
  },
};

export const MEMBERSHIP_SUMMARY_LIST = {
  [MEMBERSHIP_PAGE_TYPE.EXTRA]: {
    notice: '매장의 스탬프, 무료음료쿠폰, 바나포인트의 적립/사용 현황을 조회할 수 있습니다. (최대 12개월 이내)',
    title: '실시간 누적 현황',
    bullets: [
      {
        children: '무료음료쿠폰의 사용금액은 고객이 실제 결제 시 사용한 금액이므로 발급된 액면가보다 낮을 수 있습니다.',
        className: 'sub-title hyphen',
      },
      {
        children: '월간랭킹보상쿠폰은 액면가 없는 무료음료쿠폰으로 실제 사용된 경우에만 금액에 합산됩니다.',
        className: 'sub-title hyphen point',
      },
    ],
  },
  [MEMBERSHIP_PAGE_TYPE.MONTHRANK]: {
    notice: '매장의 월간 랭킹 보상 지급 설정 및 현황을 조회할 수 있습니다.',
    title: '랭킹 보상 설정',
    bullets: [
      {
        children: '월간랭킹 1~5위 고객에 대한 보상(바나포인트/무료음료쿠폰)을 등록할 수 있습니다.',
        className: 'sub-title hyphen',
      },
      { children: '설정된 보상은 익월 1일에 자동 지급됩니다.', className: 'sub-title hyphen' },
      {
        children: '월간랭킹보상 무료음료쿠폰은 최대금액 제한없이 모든 음료가 구매가능한 쿠폰입니다.',
        className: 'sub-title hyphen',
      },
    ],
  },
};
