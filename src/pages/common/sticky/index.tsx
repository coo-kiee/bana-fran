import { useEffect, useState } from 'react';
// Components
import StickyContainer from './StickyContainer';

interface StickyProps {
    reference: HTMLTableRowElement | null; // tableRow target ref (sticky 적용 기준이 될 tr 가리키는 ref.current)
    children: React.ReactNode; // children: colgroup, th. table의 colgroup과 sticky(fixed)될 tr, th 요소들
};

const Sticky = ({ reference, children }: StickyProps) => {
    // sticky header display states
	const [showSticky, setShowSticky] = useState<boolean>(false);

	// change sticky states
    const handleSticky = (entries: any, observer: any) => {
        // console.log(observer)
        entries.forEach((entry: any) => {
            if (!entry.isIntersecting) setShowSticky((prev) => !prev);
            entry.intersectionRatio <= 0.1 ? setShowSticky(true) : setShowSticky(false);
        });
    }

	useEffect(() => {
		if (reference) {
            const observer = new IntersectionObserver(handleSticky, {root: null, rootMargin: '0px', threshold: 0.1});
            observer.observe(reference); // start observe
        }
	}, [reference]);

	return <>
        { showSticky ? <StickyContainer>{children}</StickyContainer> : null }
    </>;
};

export default Sticky;
