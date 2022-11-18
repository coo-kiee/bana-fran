import styled from "styled-components";

interface StickyContainerProps {
    children: React.ReactNode;
}
const StickyContainer = ({children}: StickyContainerProps) => {

	return (
		<Sticky className='board-wrap' cellPadding='0' cellSpacing='0'>
			{/*  sticky header */}
			{children}
		</Sticky>
	);
};

export default StickyContainer;


const Sticky = styled.table`    
    position: fixed;
    top: 0;
	z-index: 1;
    border-radius: 0;
    margin-top: 0 !important;
    width: calc(100% - 290px);
`