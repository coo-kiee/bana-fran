import { useQuery, UseQueryResult } from 'react-query';
import { queryFn } from 'hooks/useQuery';
import { AxiosError } from 'axios';

// hook
import useUserInfo from 'hooks/user/useUser';

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
  OrderDetailSummaryDataType,
  OrderDetailListExcelTotalType,
} from 'types/etc/etcType';

// 수수료 내역 (*_total 프로시저 공통 함수)
const useEtcTotal = <T extends { fran_store: number }, U>(
  query: string,
  params: T,
  queryKey: string,
  option: { [key: string]: any } = {},
): UseQueryResult<U, AxiosError<unknown, any>> => {
  const { user } = useUserInfo();
  // paramType, resultType, query, params, queryKey
  const reqData: RequestParams<T> = { ws: 'fprocess', query, params };

  return useQuery<U, AxiosError>([queryKey, params.fran_store], () => queryFn.getData(reqData), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    retry: false,
    // suspense: true,
    enabled: user.staffNo > 0,
  });
};

const useMusicTotal = (fran_store: number) => {
  const { user } = useUserInfo();

  const reqData: RequestParams<{ fran_store: number }> = {
    ws: 'fprocess',
    query: '8WDCFLDHSNA7WRN9JCBS',
    params: { fran_store },
  };
  return useQuery<SummaryDataType[], AxiosError>(['etc_music_fee', fran_store], () => queryFn.getDataList(reqData), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    retry: false,
    // suspense: true,
    // useErrorBoundary: true,
    enabled: user.staffNo > 0,
  });
};

const useChkGiftCardStock = (params: { f_code: number }) => {
  const { user } = useUserInfo();

  const reqData: RequestParams<{ f_code: number }> = { ws: 'fprocess', query: 'U1UQFUQ3JVHCLULFASVU', params };
  return useQuery<{ [key: string]: string }, AxiosError>(
    ['etc_gift_card_stock', params.f_code],
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
}; // web_fran_s_etc_gift_cert_stock

const useOrderDetailStatistic = (fran_store: number, option: { [key: string]: any } = {}) => {
  const { user } = useUserInfo();
  const reqData: RequestParams<{ fran_store: number }> = {
    ws: 'fprocess',
    query: '2Q65LKD2JBSZ3OWKWTWY',
    params: { fran_store },
  };

  return useQuery<OrderDetailSummaryDataType[]>(
    ['etc_order_detail_statistic', fran_store],
    () => queryFn.getDataList(reqData),
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

  return useQuery<OrderDetailListExcelType[], AxiosError, OrderDetailListExcelType[][]>(
    queryKey,
    () => queryFn.getDataList(reqData),
    {
      keepPreviousData: false,
      refetchOnWindowFocus: false,
      retry: false,
      // suspense: false,
      // useErrorBoundary: true,
      select: (data) => {
        const processedData = data.reduce((acc, cur) => {
          if (Object.keys(acc).includes(String(cur.nOrderID)))
            acc[`${cur.nOrderID}`] = [...acc[cur.nOrderID], cur]; // nOrderID가 이미 존재 -> 추가
          else acc[`${cur.nOrderID}`] = [cur]; // nOrderID 존재 X -> 새로 추가
          return acc;
        }, {} as OrderDetailListExcelTotalType); // [1245: [{ ... }, { ... }, ...]]

        return Object.values(processedData);
      },
    },
  );
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
      // suspense: true,
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
