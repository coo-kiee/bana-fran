import React from "react";

interface Props {
    resetErrorBoundary: () => void
}

// Component
const SuspenseErrorPage: React.FC<Props> = () => {
    
    const moveTo = window.location.pathname;
    
    return (
        <div style= {{"width": "100%",  "height": "100%", "textAlign": "center"}}>
            <div style={{"fontSize": "25px", "color": "#996615", 'margin':'20px 20px', 'padding': '20px'}}>
                페이지 오류가 발생했습니다
            </div>
            <button style={{
                'backgroundColor': '#555555',
                'color': '#fff',
                'width': '200px',
                'height': '50px',
                'fontSize': '20px',
                'borderRadius': '3px',
                'marginBottom': '30px'
            }} onClick={() => window.location.replace(moveTo)}>새로고침</button>
        </div>
    )
}

export default SuspenseErrorPage;