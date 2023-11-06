import { PropsWithChildren, useEffect, useRef } from 'react';

// Hook
import useModal from 'hooks/common/useModal';

// Util
import Utils from 'utils/Utils';

// Component
import Loading from '../loading';

interface IPDFContainer extends PropsWithChildren {
  fileName: string;
}
const PDFContainer = ({ fileName, children }: IPDFContainer) => {
  const pdfRef = useRef(null);

  const { popModal } = useModal();

  useEffect(() => {
    if (!pdfRef.current) return;

    const pdfDownload = async () => {
      const element = pdfRef.current as unknown as HTMLDivElement;

      await Utils.downloadPdf({
        element,
        fileName,
        pdfInfo: { orientation: 'landscape' },
        imgInfo: { pageWidth: 297, pageHeight: 210 },
      });

      popModal();
    };

    pdfDownload();
  }, [fileName, popModal]);

  return (
    <>
      <div
        style={{
          position: 'absolute',
          zIndex: 100,
          maxWidth: '2270px',
          top: '50vh',
          left: '50vw',
          display: 'flex',
        }}
      >
        <Loading marginTop={-100} />
      </div>
      <div style={{ position: 'absolute', opacity: 0, width: '2270px', top: 0 }}>
        <div ref={pdfRef}>{children}</div>
      </div>
    </>
  );
};

export default PDFContainer;
