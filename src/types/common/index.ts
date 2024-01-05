const RES_DATA_TYPE = {
  LIST: 0,
  OBJECT: 1,
};

type Bit = 0 | 1;

interface RequestParams<T> {
  ws: String;
  query: String;
  params: T;
}

// API Params
interface CommonQueryParams {
  f_code: number;
}

interface IUserInfo {
  login_id: number;
  f_list: Array<{
    f_code: number;
    f_code_name: string;
  }>;
  staff_name: string;
  staff_no: number;
}

export { RES_DATA_TYPE };

export type { Bit, RequestParams, CommonQueryParams, IUserInfo };
