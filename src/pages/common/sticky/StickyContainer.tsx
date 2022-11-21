import styled from "styled-components";

interface StickyContainerProps {
    children: React.ReactNode;
}
const StickyContainer = ({children}: StickyContainerProps) => {

	return (
		<Sticky className='board-wrap'>
			{children}
		</Sticky>
	);
};

export default StickyContainer;


const Sticky = styled.table`    
    position: fixed;
    top: 0;
	z-index: 10;
    border-radius: 0;
    margin-top: 0 !important;
    width: calc(100% - 290px);
	border-spacing: 0;
	padding: 0;
`