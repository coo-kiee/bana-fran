import React from "react";

interface Props {
    resetErrorBoundary: () => void
}

// Component
const SuspenseErrorPage: React.FC<Props> = (props: Props) => {
    const { resetErrorBoundary } = props;

    return (
        <div style= {{"width": "100%",  "height": "100%", "textAlign": "center"}}>
            <div style={{"fontSize": "25px", "color": "#996615", 'margin':'20px 20px'}}>
                페이지 오류가 발생하였습니다.
            </div>
            <button style={{
                'backgroundColor': '#555555',
                'color': '#fff',
                'width': '200px',
                'height': '50px',
                'fontSize': '20px',
                'borderRadius': '3px'
            }} onClick={() => resetErrorBoundary()}>재시도</button>
        </div>
    )
}

export default SuspenseErrorPage;