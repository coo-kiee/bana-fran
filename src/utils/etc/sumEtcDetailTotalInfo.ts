import { deepClone } from 'utils/deepClone';

// type, constants
import {
  EtcDetailSumInfo,
  DELIVERY_SUM_TYPE,
  GIFTCARD_SUM_TYPE,
  MUSIC_SUM_TYPE,
  ORDER_SUM_TYPE,
  ROYALTY_SUM_TYPE,
  ACCOUNT_SUM_TYPE,
} from 'constants/etc';
import {
  DeliveryDetailListType,
  GiftCardDetailType,
  MusicChargeDetailType,
  OrderDetailListType,
  RoyaltyDetailListType,
  VirtualAccListType,
} from 'types/etc/etcType';

export const etcDeliveryChargeTotalSumFn = (initial: EtcDetailSumInfo, datas: DeliveryDetailListType[]) => {
  const sumObj = datas.reduce((arr, cur) => {
    if (DELIVERY_SUM_TYPE.TOTAL in arr) arr[DELIVERY_SUM_TYPE.TOTAL].sum += cur.total_charge;
    if (DELIVERY_SUM_TYPE.SUPPLY_FEE_TAX_TOTAL in arr) arr[DELIVERY_SUM_TYPE.SUPPLY_FEE_TAX_TOTAL].sum += cur.suply_fee;
    if (DELIVERY_SUM_TYPE.SUPPLY_FEE_TOTAL in arr)
      arr[DELIVERY_SUM_TYPE.SUPPLY_FEE_TOTAL].sum += cur.suply_fee + cur.suply_fee_tax;

    return arr;
  }, deepClone(initial));

  return sumObj;
};

export const etcGiftCardTotalSumFn = (initial: EtcDetailSumInfo, datas: GiftCardDetailType[]) => {
  const sumObj = datas.reduce((arr, { rcp_type, gubun, item_amt }) => {
    if (
      (rcp_type === '키오스크' || rcp_type === 'POS') &&
      gubun === '판매' &&
      GIFTCARD_SUM_TYPE.KIOSK_POS_TOTAL in arr
    ) {
      arr[GIFTCARD_SUM_TYPE.KIOSK_POS_TOTAL].sum += item_amt;
    } else if (rcp_type === '어플' && gubun === '판매' && GIFTCARD_SUM_TYPE.APP_TOTAL in arr) {
      arr[GIFTCARD_SUM_TYPE.APP_TOTAL].sum += item_amt;
    } else if (gubun === '판매취소(폐기)' && GIFTCARD_SUM_TYPE.CANCELLATION_TOTAL in arr) {
      arr[GIFTCARD_SUM_TYPE.CANCELLATION_TOTAL].sum += item_amt;
    }
    return arr;
  }, deepClone(initial));

  return sumObj;
};

export const etcMusicChargeTotalSumFn = (initial: EtcDetailSumInfo, datas: MusicChargeDetailType[]) => {
  const sumObj = datas.reduce((arr, cur) => {
    if (cur.state.includes('음악') && MUSIC_SUM_TYPE.MUSIC_TOTAL in arr) {
      arr[MUSIC_SUM_TYPE.MUSIC_TOTAL].sum += cur.total_amount;
    }
    if (cur.state.includes('공연') && MUSIC_SUM_TYPE.ROYALTY_TOTAL in arr) {
      arr[MUSIC_SUM_TYPE.ROYALTY_TOTAL].sum += cur.total_amount;
    }
    return arr;
  }, deepClone(initial));

  return sumObj;
};

export const etcOrderTotalSumFn = (initial: EtcDetailSumInfo, datas: OrderDetailListType[]) => {
  const sumObj = datas.reduce((arr, { state, amount, supply_amt, vat_amt }) => {
    if (state !== 50 && ORDER_SUM_TYPE.TOTAL in arr) {
      arr[ORDER_SUM_TYPE.TOTAL].sum += amount;
    }
    if (state !== 50 && ORDER_SUM_TYPE.SUPPLY_FEE_TOTAL in arr) {
      arr[ORDER_SUM_TYPE.SUPPLY_FEE_TOTAL].sum += supply_amt;
    }
    if (state !== 50 && ORDER_SUM_TYPE.SUPPLY_FEE_TAX_TOTAL in arr) {
      arr[ORDER_SUM_TYPE.SUPPLY_FEE_TAX_TOTAL].sum += vat_amt;
    }
    return arr;
  }, deepClone(initial));

  return sumObj;
};

export const etcRoyaltyTotalSumFn = (initial: EtcDetailSumInfo, datas: RoyaltyDetailListType[]) => {
  const sumObj = datas.reduce((arr, { total_amount }) => {
    if (ROYALTY_SUM_TYPE.TOTAL in arr) {
      arr[ROYALTY_SUM_TYPE.TOTAL].sum += total_amount;
    }
    return arr;
  }, deepClone(initial));

  return sumObj;
};

export const etcVirtualAccountTotalSumFn = (initial: EtcDetailSumInfo, datas: VirtualAccListType[]) => {
  const sumObj = datas.reduce((arr, { division, deposit }) => {
    if (division === '충전' && ACCOUNT_SUM_TYPE.CHARGE in arr) {
      arr[ACCOUNT_SUM_TYPE.CHARGE].sum += deposit;
    }
    if (division === '차감' && ACCOUNT_SUM_TYPE.DEDUCT in arr) {
      arr[ACCOUNT_SUM_TYPE.DEDUCT].sum += deposit;
    }

    return arr;
  }, deepClone(initial));

  return sumObj;
};
