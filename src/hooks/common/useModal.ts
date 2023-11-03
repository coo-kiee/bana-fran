import { useState } from 'react';
import { useSetRecoilState } from 'recoil';

// State
import { IModalParams, modal, ModalType } from 'state/modal';

// Util
import { deepClone } from 'utils/deepClone';

const useModal = () => {
  const setModalState = useSetRecoilState(modal);

  const [openModal] = useState(() => (props: IModalParams) => {
    document.body.style.overflow = 'hidden';

    setModalState((prev) => ({
      ...prev,
      [props.type]: {
        component: props.component,
        callback: props.callback,
      },
    }));
  });

  const [closeModal] = useState(() => (type: ModalType) => {
    document.body.style.overflow = '';

    setModalState((prev) => {
      if (!(type in prev)) return prev;

      const temp = deepClone(prev);
      delete temp[type as keyof typeof prev];

      return temp;
    });
  });

  const [popModal] = useState(() => () => {
    document.body.style.overflow = '';

    setModalState((prev) => {
      const list = Object.entries(prev);
      list.pop();

      return Object.fromEntries(list);
    });
  });

  const [resetModal] = useState(() => () => {
    document.body.style.overflow = '';

    setModalState({});
  });

  return { openModal, closeModal, popModal, resetModal };
};

export default useModal;
