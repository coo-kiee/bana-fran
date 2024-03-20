import { useCallback, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useLogin } from 'hooks/useLogin';
import { loginState } from 'state';
import SideMenubar from 'pages/common/sideMenubar';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const loginInfo = useRecoilValue(loginState);
  const { login, chkToken, getToken, removeToken } = useLogin();

  // 새로고침 로그인 처리.
  const loginCheck = useCallback(() => {
    if (chkToken()) {
      try {
        const params = {
          sID: '',
          sPW: '',
          btoken: 0,
          sCToken: getToken(),
          sIP: '@ip',
        };
        login(params);
      } catch (e) {
        removeToken();
        navigate('/');
      }
    } else {
      removeToken();
      navigate('/');
    }
  }, [chkToken, getToken, login, navigate, removeToken]);

  // 로그인 체크.
  useEffect(() => {
    if (!loginInfo.isLogin) {
      loginCheck();
    }
  }, [loginCheck, loginInfo.isLogin]);

  return (
    <article>
      <SideMenubar />
      <Outlet />
    </article>
  );
};

export default Layout;
