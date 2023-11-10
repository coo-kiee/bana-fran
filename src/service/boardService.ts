import { useQuery } from 'react-query';

// Hook
import { queryFn } from 'hooks/useQuery';
import useUserInfo from 'hooks/user/useUser';

// Type
import {
  BoardListQueryResult,
  BoardCategoryListQueryResult,
  BoardDetailQueryResult,
  BoardAttachListQueryResult,
} from 'types/board/boardType';

// 게시판 카테고리 가져오기
interface IUseBoardCategoryList {
  boardType: number;
  nFCode: number;
}
export const useBoardCategoryList = (params: IUseBoardCategoryList) => {
  const { user } = useUserInfo();

  const queryKey = [BOARD_QUERY_KEY.BOARD_CATEGORY_LIST, params, user];
  const data = {
    ws: 'fprocess',
    query: 'LX9H2OMNZZ3P6FOYJUOH', // web_bana_franchisee_board_code_list
    params: {
      nFCode: params.nFCode,
      grp_code: params.boardType * 10,
    },
  };

  return useQuery<BoardCategoryListQueryResult[]>(queryKey, () => queryFn.getDataList(data), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    retry: false,
    suspense: false,
    staleTime: 1000 * 60 * 5,
    enabled: user.staffNo > 0,
  });
};

// 게시판 목록 가져오기
interface IUseBoardList {
  f_code: number; // 가맹지점 코드
  staff_no: number; // 직원번호
  board_type: number; // 1 : 공지사항, 2 : 운영 매뉴얼, 3 : 교육자료실, 4 : 레시피자료실, 5 : 규정 및 가이드, 6 : 정산관련 공지
  search_category: number; // 게시판 별카테고리 0 : 전체, 1 : 메뉴얼, 2: 규정...
  search_text: string; // 검색 키워드
  page_idx: number; // 조회할 페이지
  page_size: number; // 조회할 건수
}
export const useBoardList = (params: IUseBoardList) => {
  const { user } = useUserInfo();

  const queryKey = [BOARD_QUERY_KEY.BOARD_LIST, params, user];
  const data = {
    ws: 'fprocess',
    query: 'D6MYCRZIGBVCL9AAULSD', // web_fran_s_board_list
    params,
  };

  return useQuery<BoardListQueryResult>(queryKey, () => queryFn.getDataOutputList(data), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    retry: false,
    suspense: false,
    staleTime: 1000 * 60 * 5,
    enabled: user.staffNo > 0,
  });
};

// 게시판 상세보기
interface IUseBoardDetail {
  f_code: number;
  staff_no: number;
  board_id: number;
}
export const useBoardDetail = (params: IUseBoardDetail) => {
  const { user } = useUserInfo();

  const queryKey = [BOARD_QUERY_KEY.BOARD_DETAIL, params, user];
  const data = {
    ws: 'fprocess',
    query: 'UMBVZRVADKA13KGG9YBF', // web_fran_s_board_select
    params,
  };

  return useQuery<BoardDetailQueryResult>(queryKey, () => queryFn.getData(data), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    retry: false,
    suspense: false,
    staleTime: 1000 * 60 * 5,
    enabled: user.staffNo > 0 && params.board_id > 0,
  });
};

// 게시판 상세 내용 가져오기
export const useBoardContent = (url: string) => {
  const { user } = useUserInfo();

  const queryKey = [BOARD_QUERY_KEY.BOARD_CONTENT, url, user];

  return useQuery<string>(queryKey, () => queryFn.axiosGet(url), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    retry: false,
    suspense: false,
    staleTime: 1000 * 60 * 5,
    enabled: user.staffNo > 0 && !!url,
  });
};

// 게시판 상세 파일첨부
export const useBoardAttachList = (boardId: number) => {
  const { user } = useUserInfo();

  const queryKey = [BOARD_QUERY_KEY.BOARD_ATTACH_LIST, boardId, user];
  const data = {
    ws: 'fprocess',
    query: 'HX0FUMTRIQP1THBAON9J', // web_fran_s_board_attach_list
    params: {
      board_id: boardId,
    },
  };

  return useQuery<BoardAttachListQueryResult[]>(queryKey, () => queryFn.getDataList(data), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    retry: false,
    suspense: false,
    staleTime: 1000 * 60 * 5,
    enabled: user.staffNo > 0 && boardId > 0,
  });
};

export const BOARD_QUERY_KEY = {
  BOARD_CATEGORY_LIST: 'boardCategoryList',
  BOARD_LIST: 'boardList',
  BOARD_DETAIL: 'boardDetail',
  BOARD_CONTENT: 'boardContent',
  BOARD_ATTACH_LIST: 'boardAttachList',
} as const;
