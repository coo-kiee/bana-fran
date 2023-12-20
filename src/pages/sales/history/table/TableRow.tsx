import { useSetRecoilState } from 'recoil';

// global state
import { couponInfoState, couponModalState } from 'state';

// Types
import { CouponType, DataProps, HISTORY_GIFT_CERT, HISTORY_ORDER_STATE, SalesHistoryData } from 'types/sales/salesType';

// Utils
import Utils from 'utils/Utils';

// filter options type
const { CANCEL } = HISTORY_ORDER_STATE;
const { GIFT_CERT } = HISTORY_GIFT_CERT;

const TableRow = ({ data }: DataProps<SalesHistoryData>) => {
  const {
    rcp_date, // 결제일시
    cancel_date, // 취소일시. order_state === 50일 때만 사용
    order_type_name, // 주문유형명
    order_state, // 주문상태. 50일 때 취소 / 5: 대기 10|20: 제조중, 30: 제조완료, 35: 배달중, 40: 완료, 50: 취소
    order_state_name, // 주문상태명
    phone, // 전화번호
    bOrderGiftCert, // 실물상품권/일반제품
    item_name, // 주문메뉴
    nCount, // 총 건수
    rcp_type, // 접수타입
    pay_type, // 결제방식. 0: 결제완료, 1: 현장카드, 2: 현장현금
    nChargeTotal, // 주문금액(메뉴), 합계
    nDeliveryCharge, // 배달비(앱주문)
    nOrderID, // 주문번호
    card_charge, // 카드
    e_coupon_charge, // 간편결제금액
    e_pay_charge, // 간편결제금액
    e_pay_type, // 간편결제수단
    cash_charge, // 현금
    bana_point, // 바나포인트
    paid_point, // 충전포인트
    bonus_point, // 보너스 충전포인트
    small_point, // 잔돈포인트
    fran_coupon_charge, // 가맹점쿠폰
    // 추가예정 바나포인트(보전)
    // 추가예정 스탬프쿠폰(보전)
    hd_coupon_charge, // 본사쿠폰(보전)
    hd_coupon_charge_2, // 본사쿠폰(미보전)
    etc_delivery_charge, // 쿠팡/배민 매출(배달비제외)
    nEtcDeliveryCharge, // 쿠팡/배민 배달비
    nStampCount, // 스탬프(계)
    nSavingPoint, // 바나포인트(적립)
  } = data;

  const setCouponInfo = useSetRecoilState(couponInfoState);
  const setOpenCouponModal = useSetRecoilState(couponModalState);

  // 표시 날짜 줄바꿈 추가
  const convertDateLineBreak = (dateText: string) => {
    const text = dateText.split(/\s/);
    return (
      <>
        {text[0]}
        <br />
        {text[1]}
      </>
    );
  };

  const handleClickPoint = (e: React.MouseEvent, type: CouponType) => {
    // modal 열기
    setOpenCouponModal({ isOpen: true, posX: e.pageX, posY: e.pageY, clientY: e.clientY });
    // coupon api params
    setCouponInfo({ nOrderID, type });
  };

  return (
    <tr>
      <td className="align-center">{convertDateLineBreak(rcp_date)}</td>
      <td className="align-center">{order_state === CANCEL ? convertDateLineBreak(cancel_date) : '-'}</td>
      <td className="align-center">{order_type_name}</td>
      <td className="align-center">{order_state_name}</td>
      <td className="align-center">{phone ? phone : '-'}</td>
      <td className="align-center">{Number(bOrderGiftCert) === GIFT_CERT ? '실물상품권' : '일반제품'}</td>
      <td className="align-center">{item_name}</td>
      <td className="align-center">{nCount}</td>
      <td className="align-center">{rcp_type}</td>
      <td className="align-center">{pay_type}</td>
      <td className="align-center">{Utils.numberComma(nChargeTotal)}</td>
      <td className="align-center">{nDeliveryCharge !== 0 ? Utils.numberComma(nDeliveryCharge) : '-'}</td>
      <td className="align-center">{Utils.numberComma(nChargeTotal + nDeliveryCharge)}</td>
      <td className="align-center">{card_charge !== 0 ? Utils.numberComma(card_charge) : ''}</td>
      <td className="align-center">
        {e_pay_type && (
          <>
            {`${Utils.numberComma(e_pay_charge)}`}
            <br />
            {`(${e_pay_type})`}
          </>
        )}
      </td>
      <td className="align-center">{cash_charge !== 0 ? Utils.numberComma(cash_charge) : ''}</td>
      <td className="align-center">{bana_point !== 0 ? Utils.numberComma(bana_point) : ''}</td>
      <td className="align-center">{paid_point !== 0 ? Utils.numberComma(paid_point) : ''}</td>
      <td className="align-center">{bonus_point !== 0 ? Utils.numberComma(bonus_point) : ''}</td>
      <td className="align-center">{small_point !== 0 ? Utils.numberComma(small_point) : ''}</td>
      <td className="align-center">
        {e_coupon_charge !== 0 && (
          <span className="underline pointer" onClick={(e) => handleClickPoint(e, '제휴사쿠폰')}>
            {Utils.numberComma(e_coupon_charge)}
          </span>
        )}
      </td>
      <td className="align-center">
        {fran_coupon_charge !== 0 && (
          <span className="underline pointer" onClick={(e) => handleClickPoint(e, '가맹점쿠폰')}>
            {Utils.numberComma(fran_coupon_charge)}
          </span>
        )}
      </td>
      <td className="align-center">{/* 바나포인트(보전) */}</td>
      <td className="align-center">{/* 스탬프쿠폰(보전) */}</td>
      <td className="align-center">
        {hd_coupon_charge !== 0 && (
          <span className="underline pointer" onClick={(e) => handleClickPoint(e, '본사쿠폰')}>
            {Utils.numberComma(hd_coupon_charge)}
          </span>
        )}
      </td>
      <td className="align-center">
        {hd_coupon_charge_2 !== 0 && (
          <span className="underline pointer" onClick={(e) => handleClickPoint(e, '본사쿠폰미보전')}>
            {Utils.numberComma(hd_coupon_charge_2)}
          </span>
        )}
      </td>
      <td className="align-center">{etc_delivery_charge !== 0 ? Utils.numberComma(etc_delivery_charge) : ''}</td>
      <td className="align-center">{nEtcDeliveryCharge !== 0 ? Utils.numberComma(nEtcDeliveryCharge) : ''}</td>
      <td className="align-center">{nStampCount !== 0 ? nStampCount : '-'}</td>
      <td className="align-center">{Utils.numberComma(nSavingPoint) || '-'}</td>
      <td className="align-center">-</td>
    </tr>
  );
};

export default TableRow;
