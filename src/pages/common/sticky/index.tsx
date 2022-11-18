import { useEffect, useState } from 'react';
// Components
import StickyContainer from 'pages/common/sticky/StickyContainer';

interface StickyProps {
    reference: any; // tableRow target ref (sticky 적용 기준이 될 tr)
    children: React.ReactNode;
};

const Sticky = ({ reference, children }: StickyProps) => {
    // reference: React ref.current
    // children: colgroup, th. table의 colgroup과 sticky(fixed)될 tr, th 요소들
	
    // sticky header display states
	const [showSticky, setShowSticky] = useState<boolean>(false);

	// handleSticky
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
            observer.observe(reference); // observe 시작
        }
	}, [reference]);

	return <>
        { showSticky ? (
            <StickyContainer>{children}</StickyContainer>
        ) : null }
    </>;
};

export default Sticky;
