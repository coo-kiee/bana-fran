import React from "react";
import styled from "styled-components";

interface WrapperProps {
    isRender: boolean;
    isFixed?: boolean;
    width?: string;
    height?: string;
    children: React.ReactNode;
}
const Wrapper = ({isRender, isFixed = false, width = '100%', height = '100%', children}: WrapperProps) => {
    return (
        <LoadingWrapper isRender={isRender} isFixed={isFixed} width={width} height={height}>
            {children}
        </LoadingWrapper>
    );
}

export default Wrapper;

const LoadingWrapper = styled.div<WrapperProps>`
    position: ${({isFixed}) => isFixed ? 'fixed' : 'absolute'};
    top: 0;
    left: 0;
    z-index: 100;
    width: calc(${({width}) => width});
    height: ${({height}) => height};
    background: rgba(255, 255, 255, .7);
    display: ${({isRender}) => isRender ? 'flex' : 'none'};
    justify-content: center;
    align-items: center;
`;