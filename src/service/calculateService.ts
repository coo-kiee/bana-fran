/* eslint-disable import/no-anonymous-default-export */

import { useMutation, useQuery, UseQueryResult } from 'react-query';

// Hook
import { queryFn } from 'hooks/useQuery';

// Type
import { CalculateCouponDetailListQueryResult, CalculateLastMonthEachQueryResult, CalculateEtcDetailListQueryResult, CalculateFixListQueryResult, CalculatePointDetailListQueryResult, CalculateChargeMultiplyKey, CALCULATE_CHARGE_MULTIPLY, CalculateLastMonthTotalQueryResult } from 'types/calculate/calculateType';

// 검색 월
const useCalculateMonthList = (f_code: number, staffNo: number, option: { [key: string]: any } = {}) => {

    const queryKey = [CALCULATE_QUERY_KEY.CALCULATE_MONTH_LIST, f_code, staffNo];
    const data = {
        ws: "fprocess",
        query: "YQULRZGJLB30OII4CFCJ", // web_fran_s_calculate_month_list
        params: {
            f_code,
        },
    };

    return useQuery<{ std_month: string }[]>(queryKey, () => queryFn.getDataList(data), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: option.suspense ? option.suspense : false,
        enabled: staffNo > 0,
    });
};

// 정산내역 확인
const useCalculateLastMonthTotal = (f_code: number, staffNo: number, std_month: string, isPDF: boolean, option: { [key: string]: any } = {}) => {

    const queryKey = [CALCULATE_QUERY_KEY.CALCULATE_LAST_MONTH_TOTAL, f_code, staffNo, std_month];
    const data = {
        ws: "fprocess",
        query: "LHXFJMM3PJSB5YVRUFLS", // web_fran_s_calculate_detail_list
        params: {
            f_code,
            std_month,
        },
    };

    return useQuery<CalculateLastMonthTotalQueryResult>(queryKey, () => queryFn.getDataOutputList(data), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: option.suspense ? option.suspense : true,
        enabled: !isPDF && staffNo > 0,
        onSuccess(data) {
            if (data.list.length > 0) {
                let sum = 0;
                for (const calculateData of data.list) {
                    sum += calculateData.total_amt * CALCULATE_CHARGE_MULTIPLY[calculateData.calculate_type as CalculateChargeMultiplyKey];
                };
                data.sumAll = sum;
            };
            return data;
        },
    });
};

// 정산내역 확인 - 정산 확인
const useCalculateConfirm = (staffNo: number, calculate_id: number, listRefetchFn: () => Promise<void>, closePopup: () => void) => {

    const data = {
        ws: "fprocess",
        query: "FCQFKBNEPSODBG4TA7SH", // web_fran_s_calculate_confirm
        params: {
            login_staff_no: staffNo,
            calculate_id,
        },
    };

    return useMutation({
        mutationFn: () => queryFn.axiosPost('/query', data),
        onSuccess: async () => {
            await listRefetchFn();
            closePopup();
            alert('정산확인을 했습니다.');
        },
        onError: () => alert('정산확인 요청에 실패했습니다.\n 관리자에게 문의하시기 바랍니다.'),
    });
};


// 정산내역 확인 - 수정요청
const useCalculateRequestFix = (staffNo: number, calculate_id: number, comment: string, closePopup: () => void) => {

    const data = {
        ws: "fprocess",
        query: "ZLKAMYA9AOODGMRFQIPT", // web_fran_s_calculate_log_update
        params: {
            login_staff_no: staffNo,
            calculate_id,
            comment,
        },
    };

    return useMutation({
        mutationFn: () => queryFn.axiosPost('/query', data),
        onSuccess: () => {
            closePopup();
            alert('수정요청을 완료했습니다.');
        },
        onError: () => alert('수정요청에 실패했습니다.\n 관리자에게 문의하시기 바랍니다.'),
    });
};

// 정산내역 확인 - 수정요청/변경이력 조회
const useCalculateFixList = (nFCode: number, staffNo: number, calculate_id: number, option: { [key: string]: any } = {}) => {

    const queryKey = [CALCULATE_QUERY_KEY.CALCULATE_FIX_LIST, nFCode, staffNo, calculate_id];
    const data = {
        ws: "fprocess",
        query: "BPXPHMQ8I53JRD2FVYGX", // web_bana_fran_calculate_log_list
        params: {
            nFCode,
            calculate_id,
        },
    };

    return useQuery<CalculateFixListQueryResult[]>(queryKey, () => queryFn.getDataList(data), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: option.suspense ? option.suspense : true,
        enabled: staffNo > 0,
    });
};

// 포인트/쿠폰/클레임/기타 각각 전월 내역 리스트
const useCalculateLastMonthEach = (f_code: number, staffNo: number, search_item_type: number, option: { [key: string]: any } = {}) => {

    const queryKey = [CALCULATE_QUERY_KEY.CALCULATE_LAST_MONTH_EACH, f_code, staffNo, search_item_type];
    const data = {
        ws: "fprocess",
        query: "3ABXWMJURCDQJPLVBJJW", // web_fran_s_calculate_detail_item
        params: {
            f_code,
            search_item_type,
        },
    };

    return useQuery<CalculateLastMonthEachQueryResult[]>(queryKey, () => queryFn.getDataList(data), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: option.suspense ? option.suspense : true,
        enabled: staffNo > 0,
    });
};

// 유상포인트 결제내역 상세
type CalculatePointDetailListParameter = (
    f_code: number,
    staffNo: number,
    from_date: string,
    to_date: string,
    option?: { [key: string]: any },
) => UseQueryResult<CalculatePointDetailListQueryResult[], unknown>;
const useCalculatePointDetailList: CalculatePointDetailListParameter = (f_code, staffNo, from_date, to_date, option = {}) => {

    const queryKey = [CALCULATE_QUERY_KEY.CALCULATE_POINT_DETAIL_LIST, f_code, staffNo, from_date, to_date];
    const data = {
        ws: "fprocess",
        query: "6HURAKO83BCYD8ZXBORH", // web_fran_s_calculate_paid_point_list
        params: {
            f_code,
            from_date,
            to_date,
        },
    };

    return useQuery<CalculatePointDetailListQueryResult[]>(queryKey, () => queryFn.getDataList(data), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: option.suspense ? option.suspense : true,
        enabled: staffNo > 0,
    });
};

// 본사 쿠폰 결제내역 상세 - 쿠폰 리스트
const useCalculateCouponList = (f_code: number, staffNo: number, option: { [key: string]: any } = {}) => {

    const queryKey = [CALCULATE_QUERY_KEY.CALCULATE_COUPON_LIST, f_code, staffNo];
    const data = {
        ws: "fprocess",
        query: "1ERHH8TI5ER8Z2SNLA5K", // web_fran_s_calculate_hq_coupon_code
        params: {
            f_code,
        },
    };

    return useQuery<{ code: number, code_name: string }[]>(queryKey, () => queryFn.getDataList(data), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: option.suspense ? option.suspense : false,
        enabled: staffNo > 0,
    });
};

// 본사 쿠폰 결제내역 상세
type CalculateCouponDetailListParameter = (
    f_code: number,
    staffNo: number,
    from_date: string,
    to_date: string,
    option?: { [key: string]: any },
) => UseQueryResult<CalculateCouponDetailListQueryResult[], unknown>;
const useCalculateCouponDetailList: CalculateCouponDetailListParameter = (f_code, staffNo, from_date, to_date, option = {}) => {

    const queryKey = [CALCULATE_QUERY_KEY.CALCULATE_COUPON_DETAIL_LIST, f_code, staffNo, from_date, to_date];
    const data = {
        ws: "fprocess",
        query: "NQSZNEAMQLUNQXDTAD70", // web_fran_s_calculate_hq_coupon_list
        params: {
            f_code,
            from_date,
            to_date,
        },
    };

    return useQuery<CalculateCouponDetailListQueryResult[]>(queryKey, () => queryFn.getDataList(data), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: option.suspense ? option.suspense : true,
        enabled: staffNo > 0,
    });
};

// 고객 클레임 보상내역 상세
type CalculateClaimDetailListParameter = (
    queryKey: string | Array<string>,
    f_code: number,
    staffNo: number,
    from_date: string,
    to_date: string,
    option?: { [key: string]: any },
) => UseQueryResult<CalculatePointDetailListQueryResult[], unknown>;
const useCalculateClaimDetailList: CalculateClaimDetailListParameter = (queryKey, f_code, staffNo, from_date, to_date, option = {}) => {

    const data = {
        ws: "fprocess",
        query: "6HURAKO83BCYD8ZXBORH", // web_fran_s_calculate_paid_point_list
        params: {
            f_code,
            from_date,
            to_date,
        },
    };

    return useQuery<any[]>(queryKey, () => queryFn.getDataList(data), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: option.suspense ? option.suspense : true,
        enabled: staffNo > 0,
    });
};

// 기타 정산 내역 상세
type CalculateEtcDetailListParameter = (
    f_code: number,
    staffNo: number,
    from_date: string,
    to_date: string,
    option?: { [key: string]: any },
) => UseQueryResult<CalculateEtcDetailListQueryResult[], unknown>;
const useCalculateEtcDetailList: CalculateEtcDetailListParameter = (f_code, staffNo, from_date, to_date, option = {}) => {

    const queryKey = [CALCULATE_QUERY_KEY.CALCULATE_ETC_DETAIL_LIST, f_code, staffNo, from_date, to_date];
    const data = {
        ws: "fprocess",
        query: "SBGCJDVEODLVS2XGQX1D", // web_fran_s_calculate_etc_list
        params: {
            f_code,
            from_date,
            to_date,
        },
    };

    return useQuery<CalculateEtcDetailListQueryResult[]>(queryKey, () => queryFn.getDataList(data), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: option.suspense ? option.suspense : true,
        enabled: staffNo > 0,
    });
};

export default {
    useCalculateMonthList,
    useCalculateLastMonthTotal,
    useCalculateConfirm,
    useCalculateRequestFix,
    useCalculateFixList,
    useCalculateLastMonthEach,
    useCalculatePointDetailList,
    useCalculateCouponList,
    useCalculateCouponDetailList,
    useCalculateClaimDetailList,
    useCalculateEtcDetailList,
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
} as const;