import { ETC_TAB_TYPE } from 'types/etc/etcType';

export const ETC_COL_THEAD_LIST = {
  [ETC_TAB_TYPE.DELIVERY]: {
    colgroup: [
      { width: '188' },
      { width: '*' },
      { width: '120' },
      { width: '120' },
      { width: '150' },
      { width: '190' },
      { width: '136' },
      { width: '150' },
      { width: '150' },
      { width: '150' },
    ],
    thead: [
      [
        { children: '결제일시', rowSpan: 2 },
        { children: '메뉴', rowSpan: 2 },
        { children: '주문금액', rowSpan: 2 },
        { children: '배달비', rowSpan: 2 },
        { children: '결제방식', rowSpan: 2 },
        { children: '결제수단', rowSpan: 2 },
        { children: '주문자', rowSpan: 2 },
        { children: '바나 딜리버리 수수료', colSpan: 3, className: 'price-area' },
      ],
      [
        { children: '수수료 공급가 (2%)', className: 'price-area' },
        { children: '부가세 (0.2%)', className: 'price-area' },
        { children: '수수료 합계 (2.2%)', className: 'price-area' },
      ],
    ],
  },
  [ETC_TAB_TYPE.MUSIC]: {
    colgroup: [{ width: '188' }, { width: '*' }, { width: '150' }, { width: '150' }, { width: '150' }],
    thead: [
      [
        { children: '기간', rowSpan: 2 },
        { children: '내용', rowSpan: 2 },
        { children: 'BGM 서비스 이용료', colSpan: 3, className: 'price-area' },
      ],
      [
        { children: '공급가', className: 'price-area' },
        { children: '부가세', className: 'price-area' },
        { children: '합계', className: 'price-area' },
      ],
    ],
  },
  [ETC_TAB_TYPE.GIFTCARD]: {
    colgroup: [
      { width: '195' },
      { width: '195' },
      { width: '195' },
      { width: '195' },
      { width: '195' },
      { width: '195' },
    ],
    thead: [
      [
        { children: '일시' },
        { children: '구분' },
        { children: '상품권종' },
        { children: '수령(금액)' },
        { children: '판매기기' },
        { children: '가상계좌 충전/차감' },
      ],
    ],
  },
  [ETC_TAB_TYPE.ORDER]: {
    colgroup: [
      { width: '170' },
      { width: '170' },
      { width: '170' },
      { width: '84' },
      { width: '104' },
      { width: '84' },
      { width: '98' },
      { width: '98' },
      { width: '*' },
      { width: '120' },
      { width: '110' },
      { width: '150' },
    ],
    thead: [
      [
        { children: '일시' },
        { children: '최종수정일' },
        { children: '취소일' },
        { children: '접수자' },
        { children: '최종수정자' },
        { children: '취소자' },
        { children: '상태' },
        { children: '발주 건 수' },
        { children: '품목 상세' },
        { children: '공급가' },
        { children: '부가세' },
        { children: '발주 금액' },
      ],
    ],
  },
  [ETC_TAB_TYPE.ROYALTY]: {
    colgroup: [{ width: '225' }, { width: '*' }, { width: '150' }, { width: '150' }, { width: '150' }],
    thead: [
      [
        { children: '기간', rowSpan: 2 },
        { children: '구분', rowSpan: 2 },
        { children: '로열티 서비스 이용료', colSpan: 3, className: 'price-area' },
      ],
      [
        { children: '공급가', className: 'price-area' },
        { children: '부가세', className: 'price-area' },
        { children: '합계', className: 'price-area' },
      ],
    ],
  },
  [ETC_TAB_TYPE.ACCOUNT]: {
    colgroup: [
      { width: '8.42%' },
      { width: '8.42%' },
      { width: '24.91%' },
      { width: '24.91%' },
      { width: '8.42%' },
      { width: '24.92%' },
    ], // table과 sticky의 th width 불일치로 인한 %값 환산 적용 (원본: ["170", "170", "503", "503", "170", "503"])
    thead: [
      [
        { children: '거래일시' },
        { children: '거래구분' },
        { children: '거래금액' },
        { children: '상태' },
        { children: '거래 후 잔액' },
        { children: '적요' },
      ],
    ],
  },
};

export const ETC_ORDER_EXCEL_COL_THEAD_LIST = {
  thead: [
    [
      { children: '일시' },
      { children: '최종수정일' },
      { children: '취소일' },
      { children: '접수자' },
      { children: '최종수정자' },
      { children: '취소자' },
      { children: '상태' },
      { children: '발주 건 수' },
      { children: '품목 상세' },
      { children: '단가' },
      { children: '수량' },
      { children: '공급가' },
      { children: '부가세' },
      { children: '발주 금액' },
    ],
  ],
  colgroup: [
    { width: '170' },
    { width: '170' },
    { width: '170' },
    { width: '84' },
    { width: '104' },
    { width: '84' },
    { width: '98' },
    { width: '98' },
    { width: '*' },
    { width: '120' },
    { width: '80' },
    { width: '120' },
    { width: '110' },
    { width: '150' },
  ],
};

export const ETC_ORDER_MODAL_COL_THEAD_LIST = {
  thead: [
    [
      { children: '품목' },
      { children: '단가' },
      { children: '수량' },
      { children: '공급가' },
      { children: '부가세' },
      { children: '합계(발주금액)' },
      { children: '특이사항' },
    ],
  ],
  colgroup: [
    { width: '226' },
    { width: '100' },
    { width: '100' },
    { width: '100' },
    { width: '100' },
    { width: '100' },
    { width: '191' },
  ],
};

/* 바나 딜리버리 수수료 select 필터 관련 */
export const ETC_DELIVERY_CHARGE_FILTER_TYPE = {
  DELIVERY_PAY_TYPE: 'delivery_pay_type',
} as const;
export const ETC_DELIVERY_CHARGE_FILTER_OPTION = {
  [ETC_DELIVERY_CHARGE_FILTER_TYPE.DELIVERY_PAY_TYPE]: [
    {
      label: '구분 전체',
      value: '',
    },
    {
      label: '현장카드',
      value: '현장카드',
    },
    {
      label: '현장현금',
      value: '현장현금',
    },
    {
      label: '어플선결제',
      value: '어플선결제',
    },
  ],
} as const;
export type deliveryChargeFilterOption = typeof ETC_DELIVERY_CHARGE_FILTER_OPTION;

/* 바나 실물 상품권 select 필터 관련 */
export const ETC_GIFTCARD_FILTER_TYPE = {
  POINT: 'point',
  GIFTCARD_TYPE: 'giftcard_type',
  DEVICE: 'device',
} as const;
export const ETC_GIFTCARD_FILTER_OPTION = {
  [ETC_GIFTCARD_FILTER_TYPE.POINT]: [
    {
      label: '포인트 구분 전체',
      value: '',
    },
    { label: '판매', value: '판매' },
    { label: '판매취소(폐기)', value: '판매취소(폐기)' },
    { label: '임의추가', value: '임의추가' },
    { label: '임의폐기', value: '임의폐기' },
    { label: 'N/A', value: 'N/A' },
  ],
  [ETC_GIFTCARD_FILTER_TYPE.GIFTCARD_TYPE]: [
    {
      label: '상품권종 전체',
      value: '',
    },
    { label: '1만원권', value: 510 },
    { label: '3만원권', value: 511 },
    { label: '5만원권', value: 512 },
  ],
  [ETC_GIFTCARD_FILTER_TYPE.DEVICE]: [
    {
      label: '처리기기 전체',
      value: '',
    },
    { label: '매장앱', value: '매장앱' },
    { label: '어플', value: '어플' },
    { label: '키오스크', value: '키오스크' },
    { label: 'POS', value: 'POS' },
    { label: 'N/A', value: 'N/A' },
  ],
} as const;
export type giftcardFilterOption = typeof ETC_GIFTCARD_FILTER_OPTION;

/* 발주내역 필터 관련 */
export const ETC_ORDER_FILTER_TYPE = {
  STATE: 'state',
} as const;
export const ETC_ORDER_FILTER_OPTION = {
  [ETC_ORDER_FILTER_TYPE.STATE]: [
    {
      label: '상태 전체',
      value: '',
    },
    { label: '대기', value: 0 },
    { label: '발주확인', value: 10 },
    { label: '패킹완료', value: 20 },
    { label: '배송출발', value: 30 },
    { label: '일부배달완료', value: 35 },
    { label: '배송완료', value: 40 },
    { label: '취소', value: 50 },
  ],
} as const;
export type orderFilterOption = typeof ETC_ORDER_FILTER_OPTION;
