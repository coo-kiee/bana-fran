/* eslint-disable import/no-anonymous-default-export */
import { useQuery } from 'react-query';
import { queryFn } from 'hooks/useQuery';

// Types
import { CommonQueryParams, RequestParams } from 'types/common';
import {
  BoardListParams,
  SalesTermsParams,
  HomeBoardData,
  HomeMembershipData,
  HomeSalesTodayData,
  HomeSalesTermsData,
  HomeMonthlyOrderData,
  HomeCalculateListData,
} from 'types/home/homeType';

// 공지사항/자료실 조회
const useBoardList = (params: BoardListParams) => {
  const reqData: RequestParams<BoardListParams> = {
    ws: 'fprocess',
    query: 'XBQQCPJERTDIZDUU4GAV',
    params: params,
  }; // web_fran_s_home_board_list

  return useQuery<HomeBoardData[]>(
    ['board_list', params.f_code, params.search_type],
    () => queryFn.getDataList(reqData),
    {
      keepPreviousData: false,
      refetchOnWindowFocus: false,
      retry: false,
      suspense: true,
    },
  );
};

// 멤버십 적립 현황
const useMembershipInfo = (params: CommonQueryParams) => {
  const reqData: RequestParams<CommonQueryParams> = {
    ws: 'fprocess',
    query: '1VK2GY5MTPAMXZB4TJFP',
    params: params,
  }; // web_fran_s_home_membership_info

  return useQuery<HomeMembershipData[]>(['membership', params.f_code], () => queryFn.getDataList(reqData), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    retry: false,
    suspense: true,
  });
};

// Today - 총 매출 조회
const useSalesToday = (params: CommonQueryParams) => {
  const reqData: RequestParams<CommonQueryParams> = {
    ws: 'fprocess',
    query: 'ONDK5LDEKOVLAVRJKBKS',
    params: params,
  }; // web_fran_s_sales_today

  return useQuery<HomeSalesTodayData[]>(['sales_today', params.f_code], () => queryFn.getDataList(reqData), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    retry: false,
    suspense: true,
  });
};

// 기간별 - 총 매출 조회
const useSalesTerms = (params: SalesTermsParams) => {
  const reqData: RequestParams<SalesTermsParams> = {
    ws: 'fprocess',
    query: 'OMG6XENQJIW8SLYTIROV',
    params: { search_month: '', ...params }, // 입력받은 search_month가 없을 때 기본값 ''입력
  }; // web_fran_s_sales_term_info

  return useQuery<HomeSalesTermsData[]>(
    ['sales_terms', params.f_code, params.search_type, params.search_month],
    () => queryFn.getDataList(reqData),
    {
      keepPreviousData: false,
      refetchOnWindowFocus: false,
      retry: false,
      suspense: true,
    },
  );
};

// 월별 발주 금액
const useMonthlyOrderList = (params: CommonQueryParams) => {
  const reqData: RequestParams<CommonQueryParams> = {
    ws: 'fprocess',
    query: 'KSJX8NCX45QKXPKOYE9U',
    params: params,
  }; // web_fran_s_order_menu_month_list

  return useQuery<HomeMonthlyOrderData[]>(['monthly_order_list', params.f_code], () => queryFn.getDataList(reqData), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    retry: false,
    suspense: true,
  });
};

// 최근 정산 현황
const useHomeCalculateList = (params: CommonQueryParams) => {
  const reqData: RequestParams<CommonQueryParams> = {
    ws: 'fprocess',
    query: 'AU5I5YJNORRJDSYHCRXW',
    params: params,
  }; // web_fran_s_home_calculate_list

  return useQuery<HomeCalculateListData[]>(['home_calculate_list', params.f_code], () => queryFn.getDataList(reqData), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    retry: false,
    suspense: true,
  });
};

export default {
  useBoardList,
  useMembershipInfo,
  useSalesToday,
  useSalesTerms,
  useMonthlyOrderList,
  useHomeCalculateList,
};
