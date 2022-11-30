import { useMutation, useQuery, useQueryClient } from 'react-query'
import { queryFn } from 'hooks/useQuery'
import { AxiosError } from 'axios';
import Utils from 'utils/Utils';
import { format } from 'date-fns';

// type
import { RequestParams } from 'types/common';
import { EtcTotalParams, EtcListParams } from 'types/etc/etcType';
import { MembershipListType, MembershipTotalType } from 'types/membership/extraType';
import { RankEditParams, RankInfoItemType, RankListItemType } from 'types/membership/monthRankType';

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
    });
};

// TODO: 스탬프/쿠폰/바나포인트 상세 내역
const useMembershipList = (params: EtcListParams) => {
    const reqData: RequestParams<EtcListParams> = {
        ws: 'fprocess',
        query: 'KFVDLH7FKG9QKBVTK8TL',
        params: params,
    }; 
    return useQuery<MembershipListType[], AxiosError>(['membership_extra_list', params.from_date, params.to_date, params.fran_store], () => queryFn.getDataList(reqData), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: false, 
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
            return tempData;
        }
    });
}; // web_fran_s_membership_list

// TODO: 현재 설정된 랭킹 보상 내역
const useRankInfo = (params: EtcTotalParams) => {
    const reqData: RequestParams<EtcTotalParams> = { ws: 'fprocess', query: 'PEEMIRR3J2XENHVL2HAE', params };
    return useQuery<RankInfoItemType, AxiosError>(['membership_rank_info', params.fran_store], () => queryFn.getData(reqData), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: true,
    });
}; // web_fran_s_membership_rank_info

// TODO: 랭킹 보상 설정
const useRankEdit = (params: RankEditParams) => {
    // 한번에 여러개 가져와서 map으로?
    const reqData: RequestParams<RankEditParams> = { ws: 'fprocess', query: 'HXKIEJM6QUTPFMM6LK5V', params };

    return useMutation({
        mutationFn: () => queryFn.getData(reqData)
    })
}; // web_fran_u_membership_rank_info

const useRankEditList = (data: RankEditParams[]) => {
    const queryClient = useQueryClient();

    const { mutateAsync: mutateRank1 } = useRankEdit(data[0]);
    const { mutateAsync: mutateRank2 } = useRankEdit(data[1]);
    const { mutateAsync: mutateRank3 } = useRankEdit(data[2]);
    const { mutateAsync: mutateRank4 } = useRankEdit(data[3]);
    const { mutateAsync: mutateRank5 } = useRankEdit(data[4]);

    const useRankEditMutate = async () => {
        try {
            // mutate
            await mutateRank1();
            await mutateRank2();
            await mutateRank3();
            await mutateRank4();
            await mutateRank5();

            await queryClient.invalidateQueries(["membership_rank_info", data[0].fran_store]);
            alert('등록이 완료되었습니다.')
        } catch (err) {
            alert(`문제가 생겼습니다.\n관리자에게 문의하세요.`);
        }
    }

    return useRankEditMutate;
}; // web_fran_u_membership_rank_info -> useMutations 만들기

// TODO: 월간랭킹현황
const useRankList = (params: EtcListParams) => {
    const reqData: RequestParams<EtcListParams> = { ws: 'fprocess', query: 'KUUM9RON9HGD55IBRLQB', params };

    return useQuery<RankListItemType[], AxiosError>(['membership_rank_list', params.fran_store, params.from_date, params.to_date], () => queryFn.getDataList(reqData), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: true,
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