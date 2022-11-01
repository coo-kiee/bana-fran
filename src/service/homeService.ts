/* eslint-disable import/no-anonymous-default-export */
import { useQuery } from 'react-query'
import { queryFn } from 'hooks/useQuery'

interface Params extends Object {
    [key: string]: any,

}
// 공지사항/자료실 조회
const useBoardList = (params: Params) => {
    const reqData = {
        ws: 'fprocess',
        query: 'XBQQCPJERTDIZDUU4GAV',
        params: params,
    }; // web_fran_s_home_board_list
    return useQuery(['board_list', params.f_code, params.search_type], () => queryFn.getDataList(reqData), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        onError : (err:any) => {
            queryFn.axiosError(err);
        }
    });
};

// 멤버십 적립현황 
const useMembershipInfo = (params: Params) => {
    const reqData = {
        ws: 'fprocess',
        query: '1VK2GY5MTPAMXZB4TJFP',
        params: params,
    }; // web_fran_s_home_board_list
    return useQuery(['membership', params.f_code], () => queryFn.getDataList(reqData), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        onError : (err:any) => {
            queryFn.axiosError(err);
        }
    });
};

// Today - 총매출 조회.
const useSalesToday = (params: Params) => {
    const reqData = {
        ws: 'fprocess',
        query: 'ONDK5LDEKOVLAVRJKBKS',
        params: params,
    }; // web_fran_s_home_board_list
    return useQuery(['sales_today', params.f_code], () => queryFn.getDataList(reqData), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        onError : (err:any) => {
            queryFn.axiosError(err);
        }
    });
};

// 기간별 - 총매출 조회.
const useSalesTerms = (params: Params) => {
    const reqData = {
        ws: 'fprocess',
        query: 'OMG6XENQJIW8SLYTIROV',
        params: params,
    }; // web_fran_s_home_board_list
    return useQuery(['sales_terms', params.f_code, params.search_type, params.search_month], () => queryFn.getDataList(reqData), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        onError : (err:any) => {
            queryFn.axiosError(err);
        }
    });
};
export default {
    useBoardList,
    useMembershipInfo,
    useSalesToday,
    useSalesTerms,
}