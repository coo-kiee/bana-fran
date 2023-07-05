import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

// styled components props
interface StickyContainerProps extends React.HTMLAttributes<HTMLTableElement> {
    root: HTMLDivElement | null;
    contentsRef: HTMLTableElement | null;
}

interface StickyProps {
    reference: HTMLTableRowElement | null; // tableRow target ref (sticky 적용 기준이 될 tr 가리키는 ref.current)
    contentsRef: HTMLTableElement | null; // 실제 데이터가 그려진 table (sticky table) contentsRef가 viewport에 보여야 sticky 작동
    children: React.ReactNode; // children: colgroup, th. (table의 colgroup과 sticky(fixed)될 tr, th 요소들)
    root?: HTMLDivElement | null; // 스크롤 영역 기준 Element. 기본값 null(viewport) Modal등 Element 내부 스크롤에 사용
};

const Sticky = ({ reference, contentsRef, children, root = null }: StickyProps) => {
    // sticky header display state
	const [showSticky, setShowSticky] = useState(false);
    // sticky table이 viewport 내에 존재하는지
    const [isViewportIn, setIsViewportIn] = useState(false);

    // sticky container ref
    const stickyRef = useRef<HTMLTableElement>(null);

    // isViewportIn handler
	const getTableReady = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => setIsViewportIn(entry.isIntersecting));
    }

	// change sticky states (showSticky handler)
    const handleSticky = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => setShowSticky(!entry.isIntersecting));
    }

    // sticky observe (showSticky)
	useEffect(() => {
		if (reference && isViewportIn) {
            const observer = new IntersectionObserver(handleSticky, {root: root, rootMargin: '0px', threshold: 0.1});
            observer.observe(reference); // start observe
        }
	}, [reference, root, isViewportIn]);

    // table observe (isViewportIn)
	useEffect(() => {
		if (contentsRef) {
            const observer = new IntersectionObserver(getTableReady, {root: root, rootMargin: '0px', threshold: 0.01});
            observer.observe(contentsRef); // start observe
        }
	}, [contentsRef, root]);
    
    // 가로 스크롤시 left값 변화
    useEffect(() => {
        const handleScrollLeft = () => {
          const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
          if (stickyRef.current && scrollLeft) stickyRef.current.style.transform = `translateX(${-scrollLeft}px)`;
        };
    
        window.addEventListener('scroll', handleScrollLeft);

        return () => window.removeEventListener('scroll', handleScrollLeft);
    }, [])

	return( 
        isViewportIn && showSticky ? <StickyContainer className='board-wrap' root={root} contentsRef={contentsRef} ref={stickyRef} cellPadding={0} cellSpacing={0}>{children}</StickyContainer> : null
    );
};

export default Sticky;

const StickyContainer = styled.table<StickyContainerProps>`    
    position: ${(props) => (props.root ? 'sticky' : 'fixed')};
    top: 0;
	z-index: 10;
    border-radius: 0 !important;
    margin-top: 0 !important;
    width: ${(props) => (props.root ? '100%' : 'calc(100% - 290px)')};
    min-width: ${(props) => (props.contentsRef ? props.contentsRef.clientWidth : 0)}px;
	border-spacing: 0;
	padding: 0;
`