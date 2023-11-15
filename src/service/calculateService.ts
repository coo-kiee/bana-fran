import { useMutation, useQuery } from 'react-query';

// Hook
import { queryFn } from 'hooks/useQuery';
import useUserInfo from 'hooks/user/useUser';
import useModal from 'hooks/common/useModal';

// Type
import {
  CalculateCouponDetailListQueryResult,
  CalculateLastMonthEachQueryResult,
  CalculateEtcDetailListQueryResult,
  CalculateFixListQueryResult,
  CalculatePointDetailListQueryResult,
  CalculateLastMonthTotalQueryResult,
  CalculateClaimDetailListQueryResult,
  CalculateAffiliateDetailListQueryResult,
  CalculateCouponListQueryResult,
} from 'types/calculate/calculateType';

// Const
import { ClaimTabType, CLAIM_TAB_TYPE } from 'constants/calculate/claim';
import { AffiliateTabType, AFFILIATE_TAB_TYPE } from 'constants/calculate/affiliate';

// 검색 월
interface IUseCalculateMonthList {
  f_code: number;
}
export const useCalculateMonthList = (params: IUseCalculateMonthList) => {
  const { user } = useUserInfo();

  const queryKey = [CALCULATE_QUERY_KEY.CALCULATE_MONTH_LIST, params, user];
  const data = {
    ws: 'fprocess',
    query: 'YQULRZGJLB30OII4CFCJ', // web_fran_s_calculate_month_list
    params,
  };

  return useQuery<{ std_month: string }[]>(queryKey, () => queryFn.getDataList(data), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    retry: false,
    suspense: false,
    enabled: user.staffNo > 0,
  });
};

// 정산내역 확인

interface IUseCalculateLastMonthTotal {
  f_code: number;
  std_month: string;
}
export const useCalculateLastMonthTotal = (params: IUseCalculateLastMonthTotal) => {
  const { user } = useUserInfo();

  const queryKey = [CALCULATE_QUERY_KEY.CALCULATE_LAST_MONTH_TOTAL, params, user];
  const data = {
    ws: 'fprocess',
    query: 'LHXFJMM3PJSB5YVRUFLS', // web_fran_s_calculate_detail_list
    params,
  };

  return useQuery<CalculateLastMonthTotalQueryResult>(queryKey, () => queryFn.getDataOutputList(data), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    retry: false,
    suspense: false,
    enabled: user.staffNo > 0,
  });
};

// 정산내역 확인 - 정산 확인
interface IUseCalculateConfirm {
  login_staff_no: number;
  calculate_id: number;
}
export const useCalculateConfirm = () => {
  const { openModal } = useModal();

  const data = {
    ws: 'fprocess',
    query: 'FCQFKBNEPSODBG4TA7SH', // web_fran_s_calculate_confirm
  };

  return useMutation({
    mutationFn: (params: IUseCalculateConfirm) => queryFn.axiosPost('/query', { ...data, params }),
    onError() {
      openModal({ type: 'ALERT', component: '정산확인 요청에 실패했습니다.\n 관리자에게 문의하시기 바랍니다.' });
    },
  });
};

// 정산내역 확인 - 수정요청
interface IUseCalculateRequestFix {
  login_staff_no: number;
  calculate_id: number;
  comment: string;
}
export const useCalculateRequestFix = () => {
  const { openModal } = useModal();

  const data = {
    ws: 'fprocess',
    query: 'ZLKAMYA9AOODGMRFQIPT', // web_fran_s_calculate_log_update
  };

  return useMutation({
    mutationFn: (params: IUseCalculateRequestFix) => queryFn.axiosPost('/query', { ...data, params }),
    onError() {
      openModal({ type: 'ALERT', component: '수정요청에 실패했습니다.\n 관리자에게 문의하시기 바랍니다.' });
    },
  });
};

// 정산내역 확인 - 수정요청/변경이력 조회
interface IUseCalculateFixList {
  nFCode: number;
  calculate_id: number;
}
export const useCalculateFixList = (params: IUseCalculateFixList) => {
  const { user } = useUserInfo();

  const queryKey = [CALCULATE_QUERY_KEY.CALCULATE_FIX_LIST, params, user];
  const data = {
    ws: 'fprocess',
    query: 'BPXPHMQ8I53JRD2FVYGX', // web_bana_fran_calculate_log_list
    params,
  };

  return useQuery<CalculateFixListQueryResult[]>(queryKey, () => queryFn.getDataList(data), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    retry: false,
    suspense: false,
    enabled: user.staffNo > 0,
  });
};

// 포인트/쿠폰/클레임/기타 각각 전월 내역 리스트
export const useCalculateLastMonthEach = (params: { f_code: number; search_item_type: number }) => {
  const { user } = useUserInfo();
  const queryKey = [CALCULATE_QUERY_KEY.CALCULATE_LAST_MONTH_EACH, params, user];
  const data = {
    ws: 'fprocess',
    query: '3ABXWMJURCDQJPLVBJJW', // web_fran_s_calculate_detail_item
    params,
  };

  return useQuery<CalculateLastMonthEachQueryResult[]>(queryKey, () => queryFn.getDataList(data), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    retry: false,
    suspense: false,
    enabled: user.staffNo > 0,
  });
};

// 유상포인트 결제내역 상세
interface IUseCalculatePointDetailList {
  f_code: number;
  from_date: string;
  to_date: string;
}
export const useCalculatePointDetailList = (params: IUseCalculatePointDetailList) => {
  const { user } = useUserInfo();

  const queryKey = [CALCULATE_QUERY_KEY.CALCULATE_POINT_DETAIL_LIST, params, user];
  const data = {
    ws: 'fprocess',
    query: '6HURAKO83BCYD8ZXBORH', // web_fran_s_calculate_paid_point_list
    params,
  };

  return useQuery<CalculatePointDetailListQueryResult[]>(queryKey, () => queryFn.getDataList(data), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    retry: false,
    suspense: false,
    enabled: user.staffNo > 0,
  });
};

// 본사 쿠폰 결제내역 상세 - 쿠폰 리스트
export const useCalculateCouponList = (params: { f_code: number }) => {
  const { user } = useUserInfo();

  const queryKey = [CALCULATE_QUERY_KEY.CALCULATE_COUPON_LIST, params, user];
  const data = {
    ws: 'fprocess',
    query: '1ERHH8TI5ER8Z2SNLA5K', // web_fran_s_calculate_hq_coupon_code
    params,
  };

  return useQuery<CalculateCouponListQueryResult[]>(queryKey, () => queryFn.getDataList(data), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    retry: false,
    suspense: false,
    enabled: user.staffNo > 0,
  });
};

// 본사 쿠폰 결제내역 상세 - 사용 내역
interface IUseCalculateCouponDetailList {
  f_code: number;
  from_date: string;
  to_date: string;
}
export const useCalculateCouponDetailList = (params: IUseCalculateCouponDetailList) => {
  const { user } = useUserInfo();

  const queryKey = [CALCULATE_QUERY_KEY.CALCULATE_COUPON_DETAIL_LIST, params, user];
  const data = {
    ws: 'fprocess',
    query: 'NQSZNEAMQLUNQXDTAD70', // web_fran_s_calculate_hq_coupon_list
    params,
  };

  return useQuery<CalculateCouponDetailListQueryResult[]>(queryKey, () => queryFn.getDataList(data), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    retry: false,
    suspense: false,
    enabled: user.staffNo > 0,
  });
};

// 고객 클레임 보상내역 상세
interface IUseCalculateClaimDetailList {
  tabType: ClaimTabType;
  params: {
    search_type?: string | undefined;
    f_code: number;
    from_date: string;
    to_date: string;
  };
}
export const useCalculateClaimDetailList = ({ params, tabType }: IUseCalculateClaimDetailList) => {
  const { user } = useUserInfo();

  // web_fran_s_calculate_claim_coupon_list :  web_fran_s_calculate_claim_calculate_list
  const queryKey = [CALCULATE_QUERY_KEY.CALCULATE_CLAIM_DETAIL_LIST, params, user, tabType];
  const query = tabType === CLAIM_TAB_TYPE.ALL ? 'CBGQY93OOIW9CXDSUJKA' : 'BC206IV3AOO0MB7PRRZE';
  const data = {
    ws: 'fprocess',
    query,
    params,
  };

  return useQuery<CalculateClaimDetailListQueryResult[]>(queryKey, () => queryFn.getDataList(data), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    retry: false,
    suspense: false,
    enabled: user.staffNo > 0,
  });
};

// 기타 정산 내역 상세
interface IUseCalculateEtcDetailList {
  f_code: number;
  from_date: string;
  to_date: string;
}
export const useCalculateEtcDetailList = (params: IUseCalculateEtcDetailList) => {
  const { user } = useUserInfo();

  const queryKey = [CALCULATE_QUERY_KEY.CALCULATE_ETC_DETAIL_LIST, params, user];
  const data = {
    ws: 'fprocess',
    query: 'SBGCJDVEODLVS2XGQX1D', // web_fran_s_calculate_etc_list
    params,
  };

  return useQuery<CalculateEtcDetailListQueryResult[]>(queryKey, () => queryFn.getDataList(data), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    retry: false,
    suspense: false,
    enabled: user.staffNo > 0,
  });
};

// 제휴사 결제내역 상세
interface IUseCalculateAffiliateDetailList {
  tabType: AffiliateTabType;
  params: {
    f_code: number;
    from_date: string;
    to_date: string;
  };
}
export const useCalculateAffiliateDetailList = ({ params, tabType }: IUseCalculateAffiliateDetailList) => {
  const { user } = useUserInfo();

  const queryKey = [CALCULATE_QUERY_KEY.CALCULATE_AFFILIATE_DETAIL_LIST, params, user, tabType];
  // web_fran_s_calculate_external_coupon_list :
  const query = tabType === AFFILIATE_TAB_TYPE.COUPON ? 'F3A2PGABD6HJXQ1SDNDK' : '';
  const data = {
    ws: 'fprocess',
    query,
    params,
  };

  return useQuery<CalculateAffiliateDetailListQueryResult[]>(queryKey, () => queryFn.getDataList(data), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    retry: false,
    suspense: false,
    enabled: user.staffNo > 0,
  });
};

export const CALCULATE_QUERY_KEY = {
  CALCULATE_MONTH_LIST: 'calculateMonthList',
  CALCULATE_LAST_MONTH_TOTAL: 'calculateLastMonthTotal',
  CALCULATE_FIX_LIST: 'calculateFixList',
  CALCULATE_LAST_MONTH_EACH: 'calculateLastMonthEach',
  CALCULATE_POINT_DETAIL_LIST: 'calculatePointDetailList',
  CALCULATE_COUPON_LIST: 'calculateCouponList',
  CALCULATE_COUPON_DETAIL_LIST: 'calculateCouponDetailList',
  CALCULATE_CLAIM_DETAIL_LIST: 'calculateClaimDetailList',
  CALCULATE_ETC_DETAIL_LIST: 'calculateEtcDetailList',
  CALCULATE_AFFILIATE_DETAIL_LIST: 'calculateAffiliateDetailList',
} as const;
