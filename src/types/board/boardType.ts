type BoardListQueryResult = {
  list: Board[];
  out: { active_page_idx: number; total_cnt: number };
};

type Board = {
  attach_cnt: number; // 첨부파일 개수
  board_id: number; // 게시판 Id
  board_type: number; // 게시판 타입
  category: number; // 카테고리 타입
  category_name: string; // 카테고리 이름
  contents_type: number;
  delete_flag: string;
  important: string; // 중요여부
  insert_date: string; // 등록일
  insert_user_name: string; // 등록자
  modify_date: string; // 수정일
  modify_user_name: string; // 수정자
  new_flag: number;
  open_date_flag: string;
  open_end_date: string;
  open_flag: string;
  open_start_date: string;
  read_cnt: number; // 조회수
  read_flag: number;
  rownum: string; // 게시판 번호
  title: string; // 게시판 제목
};

type BoardCategoryListQueryResult = {
  code: number;
  code_name: string;
};

type BoardDetailQueryResult = {
  attach_cnt: number;
  board_id: number;
  board_type: number;
  category: number;
  category_name: string;
  contents: string; // 내용 text 파일 저장 경로 Url
  contents_type: number;
  delete_flag: number;
  important: string;
  insert_date: string;
  insert_user_name: string;
  modify_date: string;
  modify_user_name: string;
  open_date_flag: string;
  open_end_date: string;
  open_flag: string;
  open_start_date: string;
  read_cnt: number;
  title: string;
};

type BoardAttachListQueryResult = {
  attach_id: number;
  board_id: number;
  file_size: string;
  file_url: string; // 첨부파일 저장 경로 Url
  insert_date: string;
  insert_user_name: string;
  origin_file_name: string;
  sFileSize: string; // file_size를 Byte 단위로 변경한 것 (ex. 60.86KB)
};

export type {
  BoardListQueryResult,
  Board,
  BoardCategoryListQueryResult,
  BoardDetailQueryResult,
  BoardAttachListQueryResult,
};
