import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface StickyProps {
    reference: HTMLTableRowElement | null; // tableRow target ref (sticky 적용 기준이 될 tr 가리키는 ref.current)
    children: React.ReactNode; // children: colgroup, th. (table의 colgroup과 sticky(fixed)될 tr, th 요소들)
    root?: HTMLDivElement | null; // 스크롤 영역 기준 Element. 기본값 null(viewport)
};

const Sticky = ({ reference, children, root = null }: StickyProps) => {
    // sticky header display states
	const [showSticky, setShowSticky] = useState<boolean>(false);

	// change sticky states
    const handleSticky = (entries: any, observer: any) => {
        entries.forEach((entry: any) => {
            if (!entry.isIntersecting) setShowSticky((prev) => !prev);
            entry.intersectionRatio <= 0.1 ? setShowSticky(true) : setShowSticky(false); // 10퍼센트 이하로 보이면 sticky 작동
        });
    }

	useEffect(() => {
		if (reference) {
            const observer = new IntersectionObserver(handleSticky, {root: root, rootMargin: '0px', threshold: 0.1});
            observer.observe(reference); // start observe
        }
	}, [reference, root]);

	return <>
        { showSticky ? <StickyContainer className='board-wrap' root={root}>{children}</StickyContainer> : null }        
    </>;
};

export default Sticky;

const StickyContainer = styled.table<{root: any}>`    
    position: ${(props) => (props.root ? 'sticky' : 'fixed')};
    top: 0;
	z-index: 10;
    border-radius: 0 !important;
    margin-top: 0 !important;
    width: ${(props) => (props.root ? '100%' : 'calc(100% - 290px)')};
	border-spacing: 0;
	padding: 0;
`