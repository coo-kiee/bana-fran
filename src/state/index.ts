import { atom } from 'recoil';
import { CouponType } from 'types/sales/salesType';

type UserInfoType = {
  staff_no: number;
  staff_name: string;
  login_id: string;
  f_list: Array<{ f_code: number; f_code_name: string }>;
};

type LoginAuthType = {
  isLogin: boolean;
  userInfo: UserInfoType;
};

type CouponInfoType = {
  nOrderID: number;
  type: CouponType;
};

type CouponModalType = {
  isOpen: boolean;
  posX: number;
  posY: number;
  clientY: number;
};

const loginState = atom<LoginAuthType>({
  key: 'loginAuth',
  default: {
    isLogin: false,
    userInfo: {
      staff_no: -1,
      staff_name: '',
      login_id: '',
      f_list: [],
    },
  },
});

const franState = atom<number>({
  key: 'franCode',
  default: 0,
});

const couponInfoState = atom<CouponInfoType>({
  key: 'couponInfo',
  default: {
    nOrderID: 0,
    type: '가맹점쿠폰',
  },
});

const couponModalState = atom<CouponModalType>({
  key: 'couponModal',
  default: {
    isOpen: false,
    posX: 0,
    posY: 0,
    clientY: 0,
  },
});

export { loginState, franState, couponInfoState, couponModalState };
export type { LoginAuthType, CouponInfoType, CouponModalType };
