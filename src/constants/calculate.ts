import { AFFILIATE_TAB_TYPE, CALCULATE_TYPE } from 'types/calculate/calculateType';

const LIST_DETAIL_COLGROUP_INFO = [
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

const ETC_DETAIL_COLGROUP_INFO = [
  { width: '130' },
  { width: '130' },
  { width: '88' },
  { width: '150' },
  { width: '109' },
  { width: '130' },
  { width: '136' },
  { width: '130' },
  { width: '130' },
  { width: '*' },
  { width: '*' },
  { width: '130' },
  { width: '130' },
  { width: '130' },
];

const AFFILIATE_COUPON_DETAIL_COLGROUP_INFO = [
  { width: '130' },
  { width: '*' },
  { width: '*' },
  { width: '*' },
  { width: '130' },
  { width: '150' },
  { width: '130' },
  { width: '130' },
  { width: '130' },
];

const AFFILIATE_POINT_DETAIL_COLGROUP_INFO = [
  { width: '130' },
  { width: '*' },
  { width: '*' },
  { width: '*' },
  { width: '130' },
  { width: '150' },
  { width: '130' },
  { width: '130' },
  { width: '130' },
];

export const CALCULATE_DETAIL_TABLE_COLGROUP_INFO = {
  [CALCULATE_TYPE.LIST]: LIST_DETAIL_COLGROUP_INFO,
  [CALCULATE_TYPE.ETC]: ETC_DETAIL_COLGROUP_INFO,
  [AFFILIATE_TAB_TYPE.COUPON]: AFFILIATE_COUPON_DETAIL_COLGROUP_INFO,
  [AFFILIATE_TAB_TYPE.POINT]: AFFILIATE_POINT_DETAIL_COLGROUP_INFO,
} as const;

const LIST_DETAIL_THEAD_INFO = [
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

const ETC_DETAIL_THEAD_INFO = [
  [
    { children: '정산월', rowSpan: 2 },
    { children: '구분', rowSpan: 2 },
    { children: '내용', rowSpan: 2 },
    { children: '기타 정산 금액', rowSpan: 2, colSpan: 3, className: 'price-area boder-th-b' },
  ],
  [{ children: '공급가' }, { children: '부가세' }, { children: '합계' }],
];

const AFFILIATE_COUPON_DETAIL_THEAD_INFO = [
  [
    { children: '결제일시', rowSpan: 2 },
    { children: '쿠폰', rowSpan: 2 },
    { children: '발행사', rowSpan: 2 },
    { children: '주문메뉴', rowSpan: 2 },
    { children: '주문자', rowSpan: 2 },
    { children: '제휴사 쿠폰 사용금액\n(권면금액)', rowSpan: 2 },
    {
      children: '제휴사 쿠폰 결제내역 (수수료 차감전 기준)',
      rowSpan: 2,
      colSpan: 3,
      className: 'price-area boder-th-b',
    },
  ],
  [{ children: '공급가' }, { children: '부가세' }, { children: '합계' }],
];

const AFFILIATE_POINT_DETAIL_THEAD_INFO = [
  [
    { children: '결제일시', rowSpan: 2 },
    { children: '쿠폰', rowSpan: 2 },
    { children: '발행사', rowSpan: 2 },
    { children: '주문메뉴', rowSpan: 2 },
    { children: '주문자', rowSpan: 2 },
    { children: '제휴사 쿠폰 사용금액\n(권면금액)', rowSpan: 2 },
    {
      children: '제휴사 쿠폰 결제내역 (수수료 차감전 기준)',
      rowSpan: 2,
      colSpan: 3,
      className: 'price-area boder-th-b',
    },
  ],
  [{ children: '공급가' }, { children: '부가세' }, { children: '합계' }],
];

export const CALCULATE_DETAIL_TABLE_THEAD_INFO = {
  [CALCULATE_TYPE.LIST]: LIST_DETAIL_THEAD_INFO,
  [CALCULATE_TYPE.ETC]: ETC_DETAIL_THEAD_INFO,
  [AFFILIATE_TAB_TYPE.COUPON]: AFFILIATE_COUPON_DETAIL_THEAD_INFO,
  [AFFILIATE_TAB_TYPE.POINT]: AFFILIATE_POINT_DETAIL_THEAD_INFO,
} as const;

export const HEADER_PRECAUTIONS_INFO = {
  [CALCULATE_TYPE.LIST]: '※ 직전 월 정산내역을 확인 후 [정산확인]을 완료하시면 본사에서 세금계산서를 발행합니다.',
  [CALCULATE_TYPE.POINT]:
    '※ 유상포인트(충전포인트/잔돈포인트)의 결제내역을 조회 가능 합니다. (무상으로 제공되는 바나포인트는 제외).',
  [CALCULATE_TYPE.COUPON]:
    '※ 본사에서 비용을 부담하는 쿠폰의 결제내역을 조회 가능 합니다. (가맹점 비용 부담인 월간랭킹쿠폰, 스탬프적립쿠폰 등은 제외)',
  [CALCULATE_TYPE.CLAIM]:
    '※ 가맹점 과실로 발생한 고객 클레임 보상을 위해 본사가 발행한 쿠폰이 사용된 경우의 비용청구 및 보전내역을 조회할 수 있습니다.',
  [CALCULATE_TYPE.ETC]: '※ 기타 발생한 가맹점에 대한 비용 청구 및 보전 등의 정산내역을 조회할 수 있습니다.',
  [AFFILIATE_TAB_TYPE.COUPON]: '※ 제휴사 쿠폰 결제금액은 제휴사에서 직접 정산(수수료 차감 후)하여 지급합니다.',
} as const;
