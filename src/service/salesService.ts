/* eslint-disable import/no-anonymous-default-export */
import { useQuery } from 'react-query';
import { queryFn } from 'hooks/useQuery';

// Constants
import { STATISTIC_SEARCH_TYPE } from 'constants/sales';
// Types
import { RequestParams } from 'types/common';
import {
  SalesHistoryParams,
  SalesHistoryData,
  SalesStatisticParams,
  SalesStatisticData,
  SalesCouponDetailParams,
  SalesCouponDetailData,
  SalesStatisticHourlyParams,
} from 'types/sales/salesType';

// 주문 내역 조회
const useSalesHistory = (params: SalesHistoryParams) => {
  const reqData: RequestParams<SalesHistoryParams> = {
    ws: 'fprocess',
    query: 'KTBKHHVNSBCJHXUADDII',
    params: params,
  }; // web_fran_s_sales_order_list

  return useQuery<SalesHistoryData[]>(['sales_history_list', params.f_code], () => queryFn.getDataList(reqData), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    retry: false,
    cacheTime: 1000 * 60 * 10,
    // suspense: true,
  });
};

// 쿠폰 상세 내역 조회
const useSalesOrderCouponDetail = (params: SalesCouponDetailParams) => {
  const reqData: RequestParams<SalesCouponDetailParams> = {
    ws: 'fprocess',
    query: 'LH3XVONJWEDX19MRXNNY',
    params: params,
  }; // web_fran_s_sales_order_use_coupon_info

  return useQuery<SalesCouponDetailData[]>(['sales_coupon_detail', params], () => queryFn.getDataList(reqData), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    retry: false,
    suspense: true,
  });
};

// 매출 통계 조회(일/월/시간대별)
const useSalesStatistic = (params: SalesStatisticParams) => {
  const isSearchHourly = params.search_type === STATISTIC_SEARCH_TYPE.HOURLY;

  // 일/월별 query
  const reqData: RequestParams<SalesStatisticParams> = {
    ws: 'fprocess',
    query: 'M2AWHBEO7CTAJMF2B1AW',
    params: params,
  }; // web_fran_s_sales_stat_list

  // 시간대별 query
  const reqHourlyData: RequestParams<SalesStatisticHourlyParams> = {
    ws: 'fprocess',
    query: 'AF5F9E6E52B6D8E08B2932CD7B80A99C',
    params: {
      f_code: params.f_code,
      from_date: params.from_date,
    },
  }; // web_fran_s_sales_stat_hourly_list

  return useQuery<SalesStatisticData[]>(
    ['sales_statistic_list', params.f_code],
    () => queryFn.getDataList(isSearchHourly ? reqHourlyData : reqData),
    {
      keepPreviousData: false,
      refetchOnWindowFocus: false,
      retry: false,
      cacheTime: 1000 * 60 * 10,
    },
  );
};

export default {
  useSalesHistory,
  useSalesOrderCouponDetail,
  useSalesStatistic,
};
