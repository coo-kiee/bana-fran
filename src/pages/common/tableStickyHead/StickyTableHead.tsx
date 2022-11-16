import styled from "styled-components";

interface StickyTableHeadProps {
    children: React.ReactNode;
}
const StickyTableHead = ({children}: StickyTableHeadProps) => {

	return (
		<StickyContainer className='board-wrap' cellPadding='0' cellSpacing='0'>
			{/*  sticky header */}
			{children}
		</StickyContainer>
	);
};

export default StickyTableHead;


const StickyContainer = styled.table`    
    position: fixed;
    top: 0;
	z-index: 1;
    border-radius: 0;
    margin-top: 0 !important;
    width: calc(100% - 290px);
`