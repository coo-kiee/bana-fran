const NoticeTable = () => {
    return (
        <table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
            <colgroup>
                <col width="90" />
                <col width="130" />
                <col width="*" />
                <col width="130" />
                <col width="130" />
            </colgroup>
            <tr>
                <th>번호</th>
                <th>분류</th>
                <th>제목</th>
                <th>첨부파일</th>
                <th>등록일</th>
            </tr>
            <tr>
                <td className="point">중요</td>
                <td>정산</td>
                <td className="content">바나프레소 직장 내 성희롱 예방교육 자료</td>
                <td className="point">2개</td>
                <td>2022-12-30</td>
            </tr>
            <tr>
                <td>9</td>
                <td>정산</td>
                <td className="content">바나프레소 직장 내 성희롱 예방교육 자료</td>
                <td>2개</td>
                <td>2022-12-30</td>
            </tr>
            <tr>
                <td>8</td>
                <td>정산</td>
                <td className="content">바나프레소 직장 내 성희롱 예방교육 자료</td>
                <td>2개</td>
                <td>2022-12-30</td>
            </tr>
            <tr>
                <td>7</td>
                <td>정산</td>
                <td className="content">바나프레소 직장 내 성희롱 예방교육 자료</td>
                <td>2개</td>
                <td>2022-12-30</td>
            </tr>
            <tr>
                <td>6</td>
                <td>정산</td>
                <td className="content">바나프레소 직장 내 성희롱 예방교육 자료</td>
                <td>2개</td>
                <td>2022-12-30</td>
            </tr>
            <tr>
                <td>5</td>
                <td>정산</td>
                <td className="content">바나프레소 직장 내 성희롱 예방교육 자료</td>
                <td>2개</td>
                <td>2022-12-30</td>
            </tr>
            <tr>
                <td>4</td>
                <td>정산</td>
                <td className="content">바나프레소 직장 내 성희롱 예방교육 자료</td>
                <td>2개</td>
                <td>2022-12-30</td>
            </tr>
            <tr>
                <td>3</td>
                <td>정산</td>
                <td className="content">바나프레소 직장 내 성희롱 예방교육 자료</td>
                <td>2개</td>
                <td>2022-12-30</td>
            </tr>
            <tr>
                <td>2</td>
                <td>정산</td>
                <td className="content">바나프레소 직장 내 성희롱 예방교육 자료</td>
                <td>2개</td>
                <td>2022-12-30</td>
            </tr>
            <tr>
                <td className="left-radius">1</td>
                <td>정산</td>
                <td className="content">바나프레소 직장 내 성희롱 예방교육 자료</td>
                <td>2개</td>
                <td className="right-radius">2022-12-30</td>
            </tr>
        </table>
    );
}

export default NoticeTable;