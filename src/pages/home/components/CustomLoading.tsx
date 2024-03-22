import Loading from 'pages/common/loading';
import styled from 'styled-components';

interface CustomLoadingProps {
  padding: string;
  loaderWidth?: number;
  loaderHeight?: number;
  loaderMarginTop?: number;
}

const CustomLoading = ({ padding, loaderWidth = 50, loaderHeight = 50, loaderMarginTop = 16 }: CustomLoadingProps) => {
  return (
    <Container padding={padding}>
      <Loading width={loaderWidth} height={loaderHeight} marginTop={loaderMarginTop} />
    </Container>
  );
};
export default CustomLoading;

const Container = styled.li<{ padding: string }>`
  ${({ padding }) => ({ padding })};
`;
