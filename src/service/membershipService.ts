import { useQuery } from 'react-query'
import { queryFn } from 'hooks/useQuery'
import { AxiosError } from 'axios';

// type
import { RequestParams } from 'types/dataType';
import { EtcTotalParams, EtcListParams, TotalResultType } from 'types/etc/etcType';

// TODO: 직전월 스탬프/쿠폰/바나포인트 내역 
const useMembershipTotal = (params: EtcTotalParams) => {
    const reqData: RequestParams<EtcTotalParams> = {
        ws: 'fprocess',
        query: 'MASFCWHJIICQKQGQFWMM',
        params: params,
    }; // web_fran_s_membership_total
    return useQuery<TotalResultType, AxiosError>(['membership_total', params.fran_store], () => queryFn.getData(reqData), {
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
        enabled: false,
        refetchOnMount: true,
        onError: (err: any) => {
            queryFn.axiosError(err);
        }
    });
};

const MEMBERSHIP_SERVICE = {
    useMembershipTotal,
    useMembershipList
};

export default MEMBERSHIP_SERVICE;