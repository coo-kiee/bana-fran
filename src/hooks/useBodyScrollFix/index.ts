import { useEffect } from 'react';

const useBodyScrollFix = () => {
  useEffect(() => {
    if (document) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.removeAttribute('style');
    }; // style 제거
  }, []);
};

export default useBodyScrollFix;
