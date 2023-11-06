import { useQuery, UseQueryResult } from 'react-query';
import { queryFn } from 'hooks/useQuery';
import { AxiosError } from 'axios';
import { format, subMonths } from 'date-fns';
import Utils from 'utils/Utils';

// type
import { RequestParams } from 'types/common';
import {
  OrderDetailModalItemType,
  GiftCardListParams,
  OrderDetailListType,
  GiftCardDetailType,
  VirtualAccListType,
  OrderDetailListExcelType,
  SummaryDataType,
} from 'types/etc/etcType';

// 수수료 내역 (*_total 프로시저 공통 함수)
const useEtcTotal = <T extends { fran_store: number }, U>(
  query: string,
  params: T,
  queryKey: string,
  option: { [key: string]: any } = {},
): UseQueryResult<U, AxiosError<unknown, any>> => {
  // paramType, resultType, query, params, queryKey
  const reqData: RequestParams<T> = { ws: 'fprocess', query, params };
  return useQuery<U, AxiosError>([queryKey, params.fran_store], () => queryFn.getData(reqData), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    retry: false,
    suspense: true,
  });
};

const useMusicTotal = (fran_store: number) => {
  const reqData: RequestParams<{ fran_store: number }> = {
    ws: 'fprocess',
    query: '8WDCFLDHSNA7WRN9JCBS',
    params: { fran_store },
  };
  return useQuery<SummaryDataType[], AxiosError>(['etc_music_fee', fran_store], () => queryFn.getDataList(reqData), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    retry: false,
    suspense: true,
  });
};

const useChkGiftCardStock = (params: { f_code: number }) => {
  const reqData: RequestParams<{ f_code: number }> = { ws: 'fprocess', query: 'U1UQFUQ3JVHCLULFASVU', params };
  return useQuery<{ [key: string]: string }, AxiosError>(
    ['etc_gift_card_stock', params.f_code],
    () => queryFn.getData(reqData),
    {
      keepPreviousData: false,
      refetchOnWindowFocus: false,
      retry: false,
      suspense: true,
      select: (data) => {
        return {
          fran_stock_cnt1: Utils.numberComma(data.fran_stock_cnt1),
          fran_stock_amt1: Utils.numberComma(data.fran_stock_amt1),
          fran_stock_cnt3: Utils.numberComma(data.fran_stock_cnt3),
          fran_stock_amt3: Utils.numberComma(data.fran_stock_amt3),
          fran_stock_cnt5: Utils.numberComma(data.fran_stock_cnt5),
          fran_stock_amt5: Utils.numberComma(data.fran_stock_amt5),
          hq_stock_cnt1: Utils.numberComma(data.hq_stock_cnt1),
          hq_stock_amt1: Utils.numberComma(data.hq_stock_amt1),
          hq_stock_cnt3: Utils.numberComma(data.hq_stock_cnt3),
          hq_stock_amt3: Utils.numberComma(data.hq_stock_amt3),
          hq_stock_cnt5: Utils.numberComma(data.hq_stock_cnt5),
          hq_stock_amt5: Utils.numberComma(data.hq_stock_amt5),
          fran_stock_cnt_total: Utils.numberComma(data.fran_stock_cnt1 + data.fran_stock_cnt3 + data.fran_stock_cnt5),
          fran_stock_amt_total: Utils.numberComma(data.fran_stock_amt1 + data.fran_stock_amt3 + data.fran_stock_amt5),
          hq_stock_cnt_total: Utils.numberComma(data.hq_stock_cnt1 + data.hq_stock_cnt3 + data.hq_stock_cnt5),
          hq_stock_amt_total: Utils.numberComma(data.hq_stock_amt1 + data.hq_stock_amt3 + data.hq_stock_amt5),
          cnt1_class: data.fran_stock_cnt1 !== data.hq_stock_cnt1 ? 'negative-value' : '',
          cnt3_class: data.fran_stock_cnt3 !== data.hq_stock_cnt3 ? 'negative-value' : '',
          cnt5_class: data.fran_stock_cnt5 !== data.hq_stock_cnt5 ? 'negative-value' : '',
          total_class:
            data.fran_stock_cnt1 + data.fran_stock_cnt3 + data.fran_stock_cnt5 !==
              data.hq_stock_cnt1 + data.hq_stock_cnt3 + data.hq_stock_cnt5 || // 갯수가 다르거나
            data.fran_stock_amt1 + data.fran_stock_amt3 + data.fran_stock_amt5 !==
              data.hq_stock_amt1 + data.hq_stock_amt3 + data.hq_stock_amt5 // 가격이 다른경우
              ? 'negative-value'
              : '',
        };
      },
    },
  );
}; // web_fran_s_etc_gift_cert_stock

const useOrderDetailStatistic = (fran_store: number, option: { [key: string]: any } = {}) => {
  const reqData: RequestParams<{ fran_store: number }> = {
    ws: 'fprocess',
    query: '2Q65LKD2JBSZ3OWKWTWY',
    params: { fran_store },
  };

  return useQuery(['etc_order_detail_statistic', fran_store], () => queryFn.getDataList(reqData), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    retry: false,
    suspense: true,
    select: (data: Array<{ date_monthly: string; supply_amt: number; vat_amt: number; amount: number }>) => {
      const previousMonths: { [key: string]: string }[] = Array.from({ length: 13 }, (_, idx1) => idx1).map((el) => ({
        date_monthly: format(subMonths(new Date(), 12 - el), 'yyyy-MM'),
        amount: Utils.numberComma(data[12 - el] ? data[12 - el].amount : 0),
        supply_amt: Utils.numberComma(data[12 - el] ? data[12 - el].supply_amt : 0),
        vat_amt: Utils.numberComma(data[12 - el] ? data[12 - el].vat_amt : 0),
      }));

      return {
        amount: previousMonths.map((el) => el.amount),
        supply_amt: previousMonths.map((el) => el.supply_amt),
        vat_amt: previousMonths.map((el) => el.vat_amt),
      };
    },
  });
};

// 상세 내역
const useEtcList = <T>(
  query: string,
  queryKey: string[],
  params: [number, string, string],
  option: { [key: string]: any } = {},
): UseQueryResult<T, AxiosError<unknown, any>> => {
  const [franCode, from, to] = params;

  const reqData: RequestParams<{ fran_store: number; from_date: string; to_date: string }> = {
    ws: 'fprocess',
    query,
    params: {
      fran_store: franCode,
      from_date: from.length === 7 ? from + '-01' : from,
      to_date: to.length === 7 ? to + '-01' : to,
    },
  };
  return useQuery<T, AxiosError>(queryKey, () => queryFn.getDataList(reqData), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    retry: false,
    useErrorBoundary: true,
    // suspense: true,
    // enabled: false,
  });
}; // *_list 프로시저 공통 함수
const useGiftCardList = (queryKey: string[], params: [number, string, string]) => {
  const [franCode, from, to] = params;

  const reqData: RequestParams<GiftCardListParams> = {
    ws: 'fprocess',
    query: 'B2XZPTGEAIHS14XICOKT',
    params: {
      f_code: franCode,
      from_date: from + '-01',
      to_date: to + '-01',
    },
  };

  return useQuery<GiftCardDetailType[], AxiosError>(queryKey, () => queryFn.getDataList(reqData), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    retry: false,
    useErrorBoundary: true,
  });
}; // web_fran_s_etc_gift_cert_detail_list

const useDetailList = (queryKey: string[], params: [number, string, string]) => {
  const [franCode, from, to] = params;
  const reqData: RequestParams<{ fran_store: number; from_date: string; to_date: string }> = {
    ws: 'fprocess',
    query: 'JNXWSFKFWJJD8DRH9OEU',
    params: { fran_store: franCode, from_date: from, to_date: to },
  };

  return useQuery<OrderDetailListType[], AxiosError>(queryKey, () => queryFn.getDataList(reqData), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    retry: false,
    // suspense: false,
    useErrorBoundary: true,
  });
}; // 발주내역 (suspense 때문에 따로 분리 + 테스트)

const useDetailListExcel = (queryKey: string[], params: [number, string, string]) => {
  const [franCode, from, to] = params;
  const reqData: RequestParams<{ f_code: number; from_date: string; to_date: string }> = {
    ws: 'fprocess',
    query: 'QUUTFIHQCF8PKO0LPKKF',
    params: { f_code: franCode, from_date: from, to_date: to },
  };

  return useQuery<OrderDetailListExcelType[], AxiosError>(queryKey, () => queryFn.getDataList(reqData), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    retry: false,
    // suspense: false,
    // useErrorBoundary: true,
  });
}; // 발주내역 (suspense 때문에 따로 분리 + 테스트)

const useVirtualAccList = (queryKey: string[], params: [number, string, string]) => {
  const [franCode, from, to] = params;
  const reqData: RequestParams<{ fran_store: number; from_date: string; to_date: string }> = {
    ws: 'fprocess',
    query: 'CS4QOSEGOQGJ8QCALM7L',
    params: { fran_store: franCode, from_date: from + '-01', to_date: to + '-01' },
  };

  return useQuery<VirtualAccListType[], AxiosError>(queryKey, () => queryFn.getDataList(reqData), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    retry: false,
    // suspense: false,
    useErrorBoundary: true,
  });
}; // 가상계좌 (suspense 때문에 따로 분리 + 테스트)

// 발주 상세내역 관련
const useOrderDetailModal = (params: { order_code: number }) => {
  const reqData: RequestParams<{ order_code: number }> = { ws: 'fprocess', query: 'R7UCMHCQJ7DPFZXTVPRP', params };

  return useQuery<Array<OrderDetailModalItemType>, AxiosError>(
    ['etc_order_detail_modal', params.order_code],
    () => queryFn.getDataList(reqData),
    {
      keepPreviousData: false,
      refetchOnWindowFocus: false,
      enabled: params.order_code !== 0,
      retry: false,
      suspense: true,
      useErrorBoundary: true,
    },
  );
};

const ETC_SERVICE = {
  useEtcTotal,
  useEtcList,
  useMusicTotal,
  useChkGiftCardStock,
  useGiftCardList,
  useOrderDetailStatistic,
  useDetailList,
  useDetailListExcel,
  useVirtualAccList,
  useOrderDetailModal,
};

export default ETC_SERVICE;
