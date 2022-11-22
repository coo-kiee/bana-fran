/* eslint-disable import/no-anonymous-default-export */

import { useQuery, useQueryClient, UseQueryResult } from 'react-query';

// Hook
import { queryFn } from 'hooks/useQuery';

// Type
import { CalculateCouponDetail, CalculateDetail, CalculateDetailOut, CalculateDetailSum, CalculateFixDetail, CalculatePointDetail } from 'types/calculate/calculateType';
import { CALCULATE_CHARGE_TYPE } from 'pages/calculate/list/CalculateListTable';

// 검색 월
const useCalculateMonthList = (queryKey: string | Array<string>, f_code: number, staffNo: number, option: { [key: string]: any } = {}) => {

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

// 정산내역 확인 - 리스트 가져오기
const useCalculateDetailList = (queryKey: string | Array<string>, f_code: number, staffNo: number, std_month: string, option: { [key: string]: any } = {}) => {

    const data = {
        ws: "fprocess",
        query: "LHXFJMM3PJSB5YVRUFLS", // web_fran_s_calculate_detail_list
        params: {
            f_code,
            std_month,
        },
    };

    return useQuery<{ list: CalculateDetail[], out: CalculateDetailOut, sumAll: number }>(queryKey, () => queryFn.getDataOutputList(data), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: option.suspense ? option.suspense : true,
        enabled: staffNo > 0,
        onSuccess(data) {
            if (data.list.length > 0) {
                let sum = 0;
                for (const calculateData of data.list) {
                    sum += calculateData.total_amt * CALCULATE_CHARGE_TYPE[calculateData.calculate_type as keyof typeof CALCULATE_CHARGE_TYPE];
                };
                data.sumAll = sum;
            };
            return data;
        },
    });
};

// 정산내역 확인 - 정산 확인
const useCalculateConfirmList = (staffNo: number, calculate_id: number, listQuerykey: string[]) => {

    const queryClient = useQueryClient();

    const data = {
        ws: "fprocess",
        query: "FCQFKBNEPSODBG4TA7SH", // web_fran_s_calculate_confirm
        params: {
            login_staff_no: staffNo,
            calculate_id,
        },
    };

    const confirmList = () => {
        try {
            queryFn.axiosPost('/query', data);
            queryClient.refetchQueries(listQuerykey);
            alert('정산확인을 했습니다.');
        }
        catch (error) {
            // console.log(error);
            alert('정산확인 요청에 실패했습니다.\n 관리자에게 문의하시기 바랍니다.')
        };
    };

    return confirmList;
};


// 정산내역 확인 - 수정요청
const useCalculateRequestFix = (staffNo: number, calculate_id: number, comment: string) => {

    const data = {
        ws: "fprocess",
        query: "ZLKAMYA9AOODGMRFQIPT", // web_fran_s_calculate_log_update
        params: {
            login_staff_no: staffNo,
            calculate_id,
            comment,
        },
    };

    const requestFix = () => {
        try {
            queryFn.axiosPost('/query', data);
            alert('수정요청을 완료했습니다.');
            return true;
        }
        catch (error) {
            // console.log(error);
            alert('수정요청에 실패했습니다.\n 관리자에게 문의하시기 바랍니다.');
            return false;
        };
    };

    return requestFix;
};

// 정산내역 확인 - 수정요청/변경이력 조회
const useCalculateFixList = (queryKey: string | Array<string>, nFCode: number, staffNo: number, calculate_id: number, option: { [key: string]: any } = {}) => {

    const data = {
        ws: "fprocess",
        query: "BPXPHMQ8I53JRD2FVYGX", // web_bana_fran_calculate_log_list
        params: {
            nFCode,
            calculate_id,
        },
    };

    return useQuery<CalculateFixDetail[]>(queryKey, () => queryFn.getDataList(data), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: option.suspense ? option.suspense : true,
        enabled: staffNo > 0,
    });
};

// 포인트/쿠폰/클레임/기타 전월 내역 합계
const useCalculateDetailSum = (queryKey: string | Array<string>, f_code: number, staffNo: number, search_item_type: number, option: { [key: string]: any } = {}) => {

    const data = {
        ws: "fprocess",
        query: "3ABXWMJURCDQJPLVBJJW", // web_fran_s_calculate_detail_item
        params: {
            f_code,
            search_item_type,
        },
    };

    return useQuery<CalculateDetailSum[]>(queryKey, () => queryFn.getDataList(data), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: option.suspense ? option.suspense : true,
        enabled: staffNo > 0,
    });
};

// 유상포인트 결제내역 상세
type PointDetailParameter = (
    queryKey: string | Array<string>,
    f_code: number,
    staffNo: number,
    from_date: string,
    to_date: string,
    option?: { [key: string]: any },
) => UseQueryResult<CalculatePointDetail[], unknown>;
const useCalculatePointDetail: PointDetailParameter = (queryKey, f_code, staffNo, from_date, to_date, option = {}) => {

    const data = {
        ws: "fprocess",
        query: "6HURAKO83BCYD8ZXBORH", // web_fran_s_calculate_paid_point_list
        params: {
            f_code,
            from_date,
            to_date,
        },
    };

    return useQuery<CalculatePointDetail[]>(queryKey, () => queryFn.getDataList(data), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: option.suspense ? option.suspense : true,
        enabled: staffNo > 0,
    });
};

// 본사 쿠폰 결제내역 상세 - 쿠폰 리스트
const useCalculateCouponType = (queryKey: string | Array<string>, f_code: number, staffNo: number, option: { [key: string]: any } = {}) => {
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
type CouponDetailParameter = (
    queryKey: string | Array<string>,
    f_code: number,
    staffNo: number,
    from_date: string,
    to_date: string,
    option?: { [key: string]: any },
) => UseQueryResult<CalculateCouponDetail[], unknown>;
const useCalculateCouponDetail: CouponDetailParameter = (queryKey, f_code, staffNo, from_date, to_date, option = {}) => {

    const data = {
        ws: "fprocess",
        query: "NQSZNEAMQLUNQXDTAD70", // web_fran_s_calculate_hq_coupon_list
        params: {
            f_code,
            from_date,
            to_date,
        },
    };

    return useQuery<CalculateCouponDetail[]>(queryKey, () => queryFn.getDataList(data), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: option.suspense ? option.suspense : true,
        enabled: staffNo > 0,
    });
};

// 고객 클레임 보상내역 상세
type ClaimDetailParameter = (
    queryKey: string | Array<string>,
    f_code: number,
    staffNo: number,
    from_date: string,
    to_date: string,
    option?: { [key: string]: any },
) => UseQueryResult<CalculatePointDetail[], unknown>;
const useCalculateClaimDetail: ClaimDetailParameter = (queryKey, f_code, staffNo, from_date, to_date, option = {}) => {

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
type EtcDetailParameter = (
    queryKey: string | Array<string>,
    f_code: number,
    staffNo: number,
    from_date: string,
    to_date: string,
    option?: { [key: string]: any },
) => UseQueryResult<CalculatePointDetail[], unknown>;
const useCalculateEtcDetail: EtcDetailParameter = (queryKey, f_code, staffNo, from_date, to_date, option = {}) => {

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

export default {
    useCalculateMonthList,
    useCalculateDetailList,
    useCalculateConfirmList,
    useCalculateRequestFix,
    useCalculateFixList,
    useCalculateDetailSum,
    useCalculatePointDetail,
    useCalculateCouponType,
    useCalculateCouponDetail,
    useCalculateClaimDetail,
    useCalculateEtcDetail,
};