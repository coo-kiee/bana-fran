import { useMutation, useQuery, useQueryClient } from 'react-query';
import { queryFn } from 'hooks/useQuery';
import { AxiosError } from 'axios';
import { format, isBefore, isSameDay } from 'date-fns';

// hook
import useUserInfo from 'hooks/user/useUser';

// type
import { RequestParams } from 'types/common';
import { MembershipListType, MembershipTotalType } from 'types/membership/extraType';
import { RankEditParams, RankInfoItemType, RankListItemType } from 'types/membership/monthRankType';

// 직전월 스탬프/쿠폰/바나포인트 내역
const useMembershipTotal = (params: { fran_store: number }) => {
  const { user } = useUserInfo();
  const reqData: RequestParams<{ fran_store: number }> = {
    ws: 'fprocess',
    query: 'MASFCWHJIICQKQGQFWMM',
    params: params,
  }; // web_fran_s_membership_total

  return useQuery<MembershipTotalType, AxiosError>(
    ['membership_extra_total', params.fran_store],
    () => queryFn.getData(reqData),
    {
      keepPreviousData: false,
      refetchOnWindowFocus: false,
      retry: false,
      // suspense: true,
      // useErrorBoundary: true,
      enabled: user.staffNo > 0,
    },
  );
};

// 스탬프/쿠폰/바나포인트 상세 내역
const useMembershipList = (queryKey: string[], [franCode, from, to]: [number, string, string]) => {
  const reqData: RequestParams<{ fran_store: number; from_date: string; to_date: string }> = {
    ws: 'fprocess',
    query: 'KFVDLH7FKG9QKBVTK8TL',
    params: { fran_store: franCode, from_date: from + '-01', to_date: to + '-01' },
  };

  return useQuery<MembershipListType[], AxiosError>(queryKey, () => queryFn.getDataList(reqData), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    retry: false,
    // suspense: false,
    useErrorBoundary: true,
    select: ([total, ...rest]) => {
      const totalData = {
        ...total,
        std_date: '합계',
      };
      const restData = rest
        .filter(({ std_date }) => isBefore(new Date(std_date), new Date()) || isSameDay(new Date(std_date), new Date()))
        .map((el) => ({ ...el, std_date: format(new Date(el.std_date), 'yyyy/MM/dd') }));

      return [totalData, ...restData];
    },
  });
}; // web_fran_s_membership_list

// 현재 설정된 랭킹 보상 내역
const useRankInfo = (params: { fran_store: number }) => {
  const reqData: RequestParams<{ fran_store: number }> = { ws: 'fprocess', query: 'PEEMIRR3J2XENHVL2HAE', params };

  return useQuery<RankInfoItemType, AxiosError>(
    ['membership_rank_info', params.fran_store],
    () => queryFn.getData(reqData),
    {
      keepPreviousData: false,
      refetchOnWindowFocus: false,
      retry: false,
      suspense: true,
      useErrorBoundary: true,
    },
  );
}; // web_fran_s_membership_rank_info

// 랭킹 보상 설정
const useRankEdit = (params: RankEditParams) => {
  const reqData: RequestParams<RankEditParams> = { ws: 'fprocess', query: 'HXKIEJM6QUTPFMM6LK5V', params };

  return useMutation({
    mutationFn: () => queryFn.getData(reqData),
  });
}; // web_fran_u_membership_rank_info

const useRankEditList = (data: RankEditParams[]) => {
  const queryClient = useQueryClient();

  const { mutateAsync: mutateRank1 } = useRankEdit(data[0]);
  const { mutateAsync: mutateRank2 } = useRankEdit(data[1]);
  const { mutateAsync: mutateRank3 } = useRankEdit(data[2]);
  const { mutateAsync: mutateRank4 } = useRankEdit(data[3]);
  const { mutateAsync: mutateRank5 } = useRankEdit(data[4]);

  const useRankEditMutate = async () => {
    // mutate
    await mutateRank1();
    await mutateRank2();
    await mutateRank3();
    await mutateRank4();
    await mutateRank5();

    await queryClient.invalidateQueries(['membership_rank_info', data[0].fran_store]);
  };

  return useRankEditMutate;
}; // web_fran_u_membership_rank_info -> useMutations 만들기

// 월간랭킹현황
const useRankList = (queryKey: string[], [franCode, from, to]: [number, string, string]) => {
  const reqData: RequestParams<{ fran_store: number; from_date: string; to_date: string }> = {
    ws: 'fprocess',
    query: 'KUUM9RON9HGD55IBRLQB',
    params: {
      fran_store: franCode,
      from_date: from + '-01',
      to_date: to + '-01',
    },
  };

  return useQuery<RankListItemType[], AxiosError>(queryKey, () => queryFn.getDataList(reqData), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    retry: false,
    // suspense: true,
    useErrorBoundary: true,
  });
}; // web_fran_s_membership_rank_list

const MEMBERSHIP_SERVICE = {
  useMembershipTotal,
  useMembershipList,
  useRankInfo,
  useRankList,
  useRankEditList,
};

export default MEMBERSHIP_SERVICE;
