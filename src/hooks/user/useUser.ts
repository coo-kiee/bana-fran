import { useRecoilValue } from 'recoil';
import { loginState, franState } from 'state';

const useUserInfo = () => {
  const { userInfo } = useRecoilValue(loginState);
  const fCode = useRecoilValue(franState);

  const fCodeName = userInfo?.f_list.filter((item: any) => item.f_code === fCode)[0]?.f_code_name || '';

  const staffNo = userInfo?.staff_no || 0;

  const user = {
    fCode,
    fCodeName,
    staffNo,
  };
  return { user };
};

export default useUserInfo;
