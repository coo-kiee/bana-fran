import { createPortal } from 'react-dom';
import { useRecoilValue } from 'recoil';

// State
import { IModalParams, modal, ModalType } from 'state/modal';

// Hook
import useModal from 'hooks/common/useModal';

const Modal = () => {
  const modalState = useRecoilValue(modal);
  const { closeModal } = useModal();

  const handleConfirm = (type: ModalType, callback?: () => void) => {
    if (callback) callback();
    else closeModal(type);
  };

  const renderModal = ({ type, component, callback }: IModalParams) => {
    let children = component;

    switch (type) {
      case 'Alert':
        children = (
          <div className="alert-layer modify-layer active">
            <div className="msg-wrap">
              <p className="title">{component}</p>
              <button className="btn-close modify-close" onClick={() => closeModal(type)}></button>
              <button className="cta-btn" onClick={() => handleConfirm(type, callback)}>
                확 인
              </button>
            </div>
          </div>
        );
        break;
      case 'CONFIRM':
        children = (
          <div className="alert-layer modify-layer active">
            <div className="msg-wrap">
              <p className="title">{component}</p>
              <button className="btn-close modify-close" onClick={() => closeModal(type)}></button>
              <button className="cta-btn" onClick={() => handleConfirm(type, callback)}>
                확 인
              </button>
              &nbsp;&nbsp;
              <button className="cta-btn" style={{ background: '#3a3a4d' }} onClick={() => closeModal(type)}>
                취 소
              </button>
            </div>
          </div>
        );
        break;

      default:
        break;
    }

    return createPortal(children, document.body);
  };

  return (
    <>{Object.entries(modalState).map(([type, modalInfo]) => renderModal({ type, ...modalInfo } as IModalParams))}</>
  );
};

export default Modal;
