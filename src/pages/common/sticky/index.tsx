import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface StickyProps {
    reference: HTMLTableRowElement | null; // tableRow target ref (sticky 적용 기준이 될 tr 가리키는 ref.current)
    contentsRef: HTMLTableElement | null; // 실제 데이터가 그려진 table (sticky table) contentsRef가 viewport에 보여야 sticky 작동
    children: React.ReactNode; // children: colgroup, th. (table의 colgroup과 sticky(fixed)될 tr, th 요소들)
    root?: HTMLDivElement | null; // 스크롤 영역 기준 Element. 기본값 null(viewport) Modal등 Element 내부 스크롤에 사용
};

const Sticky = ({ reference, contentsRef, children, root = null }: StickyProps) => {
    // sticky header display states
	const [showSticky, setShowSticky] = useState<boolean>(false);
    // sticky table이 viewport 내에 존재하는지
    const [isViewportIn, setIsViewportIn] = useState<boolean>(false);

    // isViewportIn handler
	const getTableReady = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
            setIsViewportIn(entry.isIntersecting);
        });
    }
	// change sticky states (showSticky handler)
    const handleSticky = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
            setShowSticky(!entry.isIntersecting);
        });
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

	return( 
        isViewportIn && showSticky ? <StickyContainer className='board-wrap' root={root}>{children}</StickyContainer> : null
    );
};

export default Sticky;

const StickyContainer = styled.table<{root: HTMLDivElement | null}>`    
    position: ${(props) => (props.root ? 'sticky' : 'fixed')};
    top: 0;
	z-index: 10;
    border-radius: 0 !important;
    margin-top: 0 !important;
    width: ${(props) => (props.root ? '100%' : 'calc(100% - 290px)')};
	border-spacing: 0;
	padding: 0;
`