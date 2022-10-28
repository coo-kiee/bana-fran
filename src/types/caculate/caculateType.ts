const CACULATE_TYPE = {
    LIST: 'list',
    POINT: 'point',
    COUPON: 'coupon',
    CLAIM: 'claim',
    ETC: 'etc',
} as const;
type CaculateType = typeof CACULATE_TYPE;

export {
    CACULATE_TYPE,
};

export type {
    CaculateType
};