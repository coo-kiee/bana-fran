import { PopupOrderDetailType } from 'types/etc/etcType'

interface PrizeEditProps {
    setPopupOrderDetail: React.Dispatch<React.SetStateAction<PopupOrderDetailType>>
}

const PrizeEdit: React.FC<PrizeEditProps> = ({ setPopupOrderDetail }) => {
    return (
        <div className="alert-layer setting-layer active">
            <div className="msg-wrap">
                <p className="title">충무로점 보상등록</p>
                <table className="board-wrap" cellPadding="0" cellSpacing="0">
                    <colgroup>
                        <col width="61" />
                        <col width="91" />
                        <col width="272" />
                        <col width="215" />
                    </colgroup>
                    <tbody>
                        <tr>
                            <td className="rank">1위</td>
                            <td>
                                <div className="contents none">
                                    <input className="radio" type="radio" name="choice" value="none" id="none" />
                                    <label htmlFor="none">없음</label>
                                </div>
                            </td>
                            <td>
                                <div className="contents point">
                                    <div>
                                        <input className="radio" type="radio" name="choice" value="point" id="point" />
                                        <label htmlFor="point">바나포인트</label>
                                    </div>
                                    <div>
                                        <input type="text" />
                                        <span>점</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="contents coupon">
                                    <div>
                                        <input className="radio" type="radio" name="choice" value="coupon" id="coupon" />
                                        <label htmlFor="coupon">음료무료쿠폰</label>
                                    </div>
                                    <div>
                                        <input type="text" />
                                        <span>점</span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="rank">2위</td>
                            <td>
                                <div className="contents none">
                                    <input className="radio" type="radio" name="choice" value="none" id="none" />
                                    <label htmlFor="none">없음</label>
                                </div>
                            </td>
                            <td>
                                <div className="contents point">
                                    <div>
                                        <input className="radio" type="radio" name="choice" value="point" id="point" />
                                        <label htmlFor="point">바나포인트</label>
                                    </div>
                                    <div>
                                        <input type="text" />
                                        <span>점</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="contents coupon">
                                    <div>
                                        <input className="radio" type="radio" name="choice" value="coupon" id="coupon" />
                                        <label htmlFor="coupon">음료무료쿠폰</label>
                                    </div>
                                    <div>
                                        <input type="text" />
                                        <span>점</span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="rank">3위</td>
                            <td>
                                <div className="contents none">
                                    <input className="radio" type="radio" name="choice" value="none" id="none" />
                                    <label htmlFor="none">없음</label>
                                </div>
                            </td>
                            <td>
                                <div className="contents point">
                                    <div>
                                        <input className="radio" type="radio" name="choice" value="point" id="point" />
                                        <label htmlFor="point">바나포인트</label>
                                    </div>
                                    <div>
                                        <input type="text" />
                                        <span>점</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="contents coupon">
                                    <div>
                                        <input className="radio" type="radio" name="choice" value="coupon" id="coupon" />
                                        <label htmlFor="coupon">음료무료쿠폰</label>
                                    </div>
                                    <div>
                                        <input type="text" />
                                        <span>점</span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="rank">4위</td>
                            <td>
                                <div className="contents none">
                                    <input className="radio" type="radio" name="choice" value="none" id="none" />
                                    <label htmlFor="none">없음</label>
                                </div>
                            </td>
                            <td>
                                <div className="contents point">
                                    <div>
                                        <input className="radio" type="radio" name="choice" value="point" id="point" />
                                        <label htmlFor="point">바나포인트</label>
                                    </div>
                                    <div>
                                        <input type="text" />
                                        <span>점</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="contents coupon">
                                    <div>
                                        <input className="radio" type="radio" name="choice" value="coupon" id="coupon" />
                                        <label htmlFor="coupon">음료무료쿠폰</label>
                                    </div>
                                    <div>
                                        <input type="text" />
                                        <span>점</span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="rank">5위</td>
                            <td>
                                <div className="contents none">
                                    <input className="radio" type="radio" name="choice" value="none" id="none" />
                                    <label htmlFor="none">없음</label>
                                </div>
                            </td>
                            <td>
                                <div className="contents point">
                                    <div>
                                        <input className="radio" type="radio" name="choice" value="point" id="point" />
                                        <label htmlFor="point">바나포인트</label>
                                    </div>
                                    <div>
                                        <input type="text" />
                                        <span>점</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="contents coupon">
                                    <div>
                                        <input className="radio" type="radio" name="choice" value="coupon" id="coupon" />
                                        <label htmlFor="coupon">음료무료쿠폰</label>
                                    </div>
                                    <div>
                                        <input type="text" />
                                        <span>점</span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button className="btn-close setting-close" onClick={() => setPopupOrderDetail((prev) => ({ ...prev, show: false }))}></button>
                <button className="close-btn" onClick={() => setPopupOrderDetail((prev) => ({ ...prev, show: false }))}>닫기</button>
                <button className="cta-btn">저장</button>
            </div>
        </div>
    )
}

export default PrizeEdit;