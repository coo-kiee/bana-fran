import { useQuery } from 'react-query'
import { queryFn } from 'hooks/useQuery'
import { AxiosError } from 'axios';

// type
import { RequestParams } from 'types/common';
import { EtcTotalParams, EtcListParams, TotalResultType } from 'types/etc/etcType';
import { MembershipTotalType } from 'types/membership/extraType';

// TODO: 직전월 스탬프/쿠폰/바나포인트 내역 
const useMembershipTotal = (params: EtcTotalParams) => {
    const reqData: RequestParams<EtcTotalParams> = {
        ws: 'fprocess',
        query: 'MASFCWHJIICQKQGQFWMM',
        params: params,
    }; // web_fran_s_membership_total
    return useQuery<MembershipTotalType, AxiosError>(['membership_total', params.fran_store], () => queryFn.getData(reqData), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        onError: (err: any) => {
            queryFn.axiosError(err);
        }
    });
};

// TODO: 스탬프/쿠폰/바나포인트 상세 내역
const useMembershipList = (params: EtcListParams) => {
    const reqData: RequestParams<EtcListParams> = {
        ws: 'fprocess',
        query: 'KFVDLH7FKG9QKBVTK8TL',
        params: params,
    }; // web_fran_s_membership_list
    return useQuery(['membership_list', params.from_date, params.to_date], () => queryFn.getDataList(reqData), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        refetchOnMount: true,
        onError: (err: any) => {
            queryFn.axiosError(err);
        }
    });
};

const useRankInfo = (params: EtcTotalParams) => {
    const reqData: RequestParams<EtcTotalParams> = { ws: 'fprocess', query: 'PEEMIRR3J2XENHVL2HAE', params };
    return useQuery<any, AxiosError>(['membership_rank_info', params.fran_store], () => queryFn.getData(reqData), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        onError: (err: any) => {
            queryFn.axiosError(err);
        }
    });
}; // web_fran_s_membership_rank_info

// const useRankEdit = () => {

// }; // web_fran_u_membership_rank_info

const useRankList = (params: EtcListParams) => {
    const reqData: RequestParams<EtcListParams> = { ws: 'fprocess', query: 'KUUM9RON9HGD55IBRLQB', params };

    return useQuery<any, AxiosError>(['membership_rank_list', params.fran_store, params.from_date, params.to_date], () => queryFn.getDataList(reqData), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        onError: (err: any) => {
            queryFn.axiosError(err);
        }
    });
}; // web_fran_s_membership_rank_list

const MEMBERSHIP_SERVICE = {
    useMembershipTotal,
    useMembershipList,
    useRankInfo,
    useRankList
};

export default MEMBERSHIP_SERVICE;