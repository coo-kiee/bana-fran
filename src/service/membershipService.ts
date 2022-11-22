import { useMutation, useQuery } from 'react-query'
import { queryFn } from 'hooks/useQuery'
import { AxiosError } from 'axios';

// type
import { RequestParams } from 'types/common';
import { EtcTotalParams, EtcListParams } from 'types/etc/etcType';
import { MembershipListType, MembershipTotalType } from 'types/membership/extraType';
import { RankEditParams } from 'types/membership/monthRankType';
import Utils from 'utils/Utils';
import { format } from 'date-fns';

// TODO: 직전월 스탬프/쿠폰/바나포인트 내역 
const useMembershipTotal = (params: EtcTotalParams) => {
    const reqData: RequestParams<EtcTotalParams> = {
        ws: 'fprocess',
        query: 'MASFCWHJIICQKQGQFWMM',
        params: params,
    }; // web_fran_s_membership_total
    return useQuery<MembershipTotalType, AxiosError>(['membership_extra_total', params.fran_store], () => queryFn.getData(reqData), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: true,
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
    return useQuery<MembershipListType[], AxiosError>(['membership_extra_list', params.fran_store, params.from_date, params.to_date], () => queryFn.getDataList(reqData), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        // suspense: true,
        onError: (err: any) => {
            queryFn.axiosError(err);
        },
        select: (data: MembershipListType[]) => {
            const tempData = data.map((el, idx) => {
                let tempData: any = {}
                Object.entries(el).forEach((e) => {
                    const key = e[0] as keyof MembershipListType;
                    const value = e[1];
                    if (key === 'std_date') {
                        if (idx === 0) tempData['std_date'] = '합계';
                        else tempData['std_date'] = format(new Date(value), 'yyyy/MM/dd');
                    } // 날짜 처리
                    else tempData[key] = Utils.numberComma(value); // 단위 처리
                });
                return tempData;
            });
            // console.log(tempData === data) // false
            return tempData;
        }
    });
};

const useRankInfo = (params: EtcTotalParams) => {
    const reqData: RequestParams<EtcTotalParams> = { ws: 'fprocess', query: 'PEEMIRR3J2XENHVL2HAE', params };
    return useQuery<any, AxiosError>(['membership_rank_info', params.fran_store], () => queryFn.getData(reqData), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: true,
        onError: (err: any) => {
            queryFn.axiosError(err);
        }
    });
}; // web_fran_s_membership_rank_info

const useRankEdit = (params: RankEditParams) => {
    // 한번에 여러개 가져와서 map으로?
    const reqData: RequestParams<RankEditParams> = { ws: 'fprocess', query: 'HXKIEJM6QUTPFMM6LK5V', params };

    return useMutation({
        mutationFn: () => queryFn.getData(reqData)
    })
}; // web_fran_u_membership_rank_info

const useRankEditList = (data: RankEditParams[]) => {
    const mutateRank1 = useRankEdit(data[0]);
    const mutateRank2 = useRankEdit(data[1]);
    const mutateRank3 = useRankEdit(data[2]);
    const mutateRank4 = useRankEdit(data[3]);
    const mutateRank5 = useRankEdit(data[4]);

    return { mutateRank1, mutateRank2, mutateRank3, mutateRank4, mutateRank5 }
};

const useRankList = (params: EtcListParams) => {
    const reqData: RequestParams<EtcListParams> = { ws: 'fprocess', query: 'KUUM9RON9HGD55IBRLQB', params };

    return useQuery<any, AxiosError>(['membership_rank_list', params.fran_store, params.from_date, params.to_date], () => queryFn.getDataList(reqData), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: true,
        onError: (err: any) => {
            queryFn.axiosError(err);
        }
    });
}; // web_fran_s_membership_rank_list

const MEMBERSHIP_SERVICE = {
    useMembershipTotal,
    useMembershipList,
    useRankInfo,
    useRankList,
    useRankEditList
};

export default MEMBERSHIP_SERVICE;