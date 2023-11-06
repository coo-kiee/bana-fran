import { ReactNode } from 'react';
import { atom } from 'recoil';

export type ModalType = 'Alert' | 'CONFIRM' | 'CUSTOM' | `CUSTOM${number}`;
export type ModalInfo = {
  component: JSX.Element | ReactNode;
  callback?: () => void;
};

export interface IModalParams extends ModalInfo {
  type: ModalType;
}
export type IModal = Record<ModalType, ModalInfo>;

export const modal = atom<IModal | {}>({
  key: 'modal',
  default: {},
});
