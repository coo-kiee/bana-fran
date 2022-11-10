/* eslint-disable import/no-anonymous-default-export */

import { useQuery } from 'react-query';

// Hook
import { queryFn } from 'hooks/useQuery';

// Type
import { CaculateDetail, CaculateDetailOut, CaculateFixDetail } from 'types/caculate/caculateType';

// 정산내역 확인 - 리스트 가져오기
const useCaculateDetailList = (queryKey: string | Array<string>, f_code: number, staffNo: number, std_month: string, option: { [key: string]: any } = {}) => {

    const data = {
        ws: "fprocess",
        query: "LHXFJMM3PJSB5YVRUFLS", // web_fran_s_calculate_detail_list
        params: {
            f_code,
            std_month,
        },
    };

    return useQuery<{ list: CaculateDetail[], out: CaculateDetailOut, sumAll: number }>(queryKey, () => queryFn.getDataOutputList(data), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: option.suspense ? option.suspense : true,
        enabled: staffNo > 0,
        onSuccess(data) {
            if (data.list.length > 0) {
                let sum = 0;
                for (const caculateData of data.list) {
                    sum += caculateData.total_amt;
                }
                data.sumAll = sum;
            };
            return data;
        },
    });
};

// 정산내역 확인 - 정산 확인
const useCaculateConfirmList = (staffNo: number, calculate_id: number) => {

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
const useCaculateRequestFix = (staffNo: number, calculate_id: number, comment: string) => {

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
const useCaculateFixList = (queryKey: string | Array<string>, nFCode: number, staffNo: number, calculate_id: number, option: { [key: string]: any } = {}) => {

    const data = {
        ws: "fprocess",
        query: "BPXPHMQ8I53JRD2FVYGX", // web_bana_fran_calculate_log_list
        params: {
            nFCode,
            calculate_id,
        },
    };

    return useQuery<CaculateFixDetail[]>(queryKey, () => queryFn.getDataList(data), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: option.suspense ? option.suspense : true,
        enabled: staffNo > 0,
    });
};

export default {
    useCaculateDetailList,
    useCaculateConfirmList,
    useCaculateRequestFix,
    useCaculateFixList,
};