import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
  containerId?: string; // 렌더될 위치
}

const Portal = ({ children, containerId }: PortalProps) => {
  const container = document.getElementById(containerId || 'root');
  return container && createPortal(children, container);
};

export default Portal;
