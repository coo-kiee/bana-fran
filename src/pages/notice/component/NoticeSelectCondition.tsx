
const NoticeSelectCondition = () => {

    const selectType = ['전체'];

    return (
        <div className="sort-wrap">
            <select name="" id="">
                {
                   selectType.map(text => <option key={text} value="">{text}</option>)
                }
            </select>
            <input type="text" placeholder="제목/내용" />
            <button className="btn-search">조회</button>
        </div>
    );
}

export default NoticeSelectCondition;