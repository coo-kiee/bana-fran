import React, { FC } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useQueryErrorResetBoundary } from 'react-query';
import { useRecoilValue } from "recoil";
import Utils from "utils/Utils";

// component   
import Loading from "pages/common/loading";
import SuspenseErrorPage from "pages/common/suspenseErrorPage";

// type 
import { ExtraOverallTableRowItemType } from 'types/membership/extraType' 
import { MembershipTotalType } from 'types/membership/extraType'

// state
import { franState } from "state";

// Service
import MEMBERSHIP_SERVICE from 'service/membershipService';

const ExtraOverall: FC<{ tableHead: ExtraOverallTableRowItemType[][] }> = ({ tableHead }) => {
    const { reset } = useQueryErrorResetBoundary();

    return (
        <table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
            <thead>
                {tableHead.map((trData, idx1) => {
                    return (
                        <tr key={`extra_overall_table_row_${idx1}`}>
                            {trData.map((tdData, idx2) => {
                                return (
                                    <th key={`extra_overall_table_row_item_${idx2}`} rowSpan={tdData.rowSpan || undefined} colSpan={tdData.colSpan || undefined} className={tdData.className || ''}>
                                        {tdData.itemName.length > 1 ? <>{tdData.itemName[0]}<p>({tdData.itemName[1]})</p></> : tdData.itemName[0]}
                                    </th>
                                )
                            })}
                        </tr>
                    )
                })}
            </thead>
            <tbody>
                <React.Suspense fallback={<Loading width={50} height={50} isTable={true} />}>
                    <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} isTable={true} />}>
                        <ExtraOverallData />
                    </ErrorBoundary>
                </React.Suspense>
            </tbody>
        </table>
    )
}

const ExtraOverallData = () => {
    const franCode = useRecoilValue(franState);

    let extraOverallTotal: MembershipTotalType = {
        convert_coupon_stamp_cnt: 0,
        expired_coupon_amount: 0,
        expired_coupon_cnt: 0,
        expired_point: 0,
        expired_stamp_cnt: 0,
        not_used_coupon_amount: '',
        not_used_coupon_cnt: 0,
        not_used_point: 0,
        notyet_coupon_stamp_cnt: 0,
        total_coupon_amount: '',
        total_coupon_cnt: 0,
        total_point: 0,
        total_stamp_cnt: 0,
        used_coupon_amount: '',
        used_coupon_cnt: 0,
        used_point: 0
    };
    const membershipTotalParams: { fran_store: number } = { fran_store: franCode };
    const { data, isSuccess } = MEMBERSHIP_SERVICE.useMembershipTotal(membershipTotalParams)

    if (isSuccess) {
        extraOverallTotal = data;
    }

    return (
        <tr>
            <td>{Utils.numberComma(extraOverallTotal.total_stamp_cnt)}</td>
            <td>{Utils.numberComma(extraOverallTotal.convert_coupon_stamp_cnt)}개</td>
            <td>{Utils.numberComma(extraOverallTotal.expired_stamp_cnt)}개</td>
            <td className="point">{Utils.numberComma(extraOverallTotal.notyet_coupon_stamp_cnt)}개</td>
            <td>{Utils.numberComma(extraOverallTotal.total_coupon_cnt)}개<p>({Utils.numberComma(extraOverallTotal.total_coupon_amount)}원)</p></td>
            <td>{Utils.numberComma(extraOverallTotal.used_coupon_cnt)}개<p>({Utils.numberComma(extraOverallTotal.used_coupon_amount)}원)</p></td>
            <td>{Utils.numberComma(extraOverallTotal.expired_coupon_cnt)}개<p>({Utils.numberComma(extraOverallTotal.expired_coupon_amount)}원)</p></td>
            <td className="point">{Utils.numberComma(extraOverallTotal.not_used_coupon_cnt)}개<p>({Utils.numberComma(extraOverallTotal.not_used_coupon_amount)}원)</p></td>
            <td>{Utils.numberComma(extraOverallTotal.total_point)}P</td>
            <td>{Utils.numberComma(extraOverallTotal.used_point)}P</td>
            <td>{Utils.numberComma(extraOverallTotal.expired_point)}P</td>
            <td className="point">{Utils.numberComma(extraOverallTotal.not_used_point)}P</td>
        </tr>
    )
} // 실제 컴포넌트

export default ExtraOverall;
