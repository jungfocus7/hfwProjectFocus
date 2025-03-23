/**
 * Element 스타일 객체 반환
 * @param {CSSStyleDeclaration | HTMLElement} to
 * @param {boolean} bw writeable
 * @returns {CSSStyleDeclaration}
 */
const fn_getStyles = (to, bw=false) => {
    if (to instanceof CSSStyleDeclaration)
        return to;
    else if (to instanceof HTMLElement) {
        if (bw === true)
            return to.style;
        else
            return getComputedStyle(to);
    }
    else return null;
};

/**
 * 넘버인지 확인후 반환
 * @param {number | string} tv
 * @param {number} dv
 * @returns {number}
 */
const fn_checkNumber = (tv, dv=0) => {
    let rv = NaN;
    if (typeof tv === 'number')
        rv = tv;
    else if (typeof tv === 'string')
        rv = parseFloat(tv);

    if (isFinite(rv) === true)
        return rv;
    else
        return dv;
};


/**
 * Element width(Number) 반환
 * @param {CSSStyleDeclaration | HTMLElement} to
 * @returns {number}
 */
const fn_getWidth = (to) => {
    const sts = fn_getStyles(to);
    if (sts !== null) {
        let tv = sts.getPropertyValue('width');
        return fn_checkNumber(tv);
    }
    else return 0.0;
};

/**
 * Element width(Number) 설정
 * @param {CSSStyleDeclaration | HTMLElement} to
 * @param {number} tv
 */
const fn_setWidth = (to, tv) => {
    const sts = fn_getStyles(to, true);
    if (sts !== null) {
        tv = fn_checkNumber(tv);
        sts.setProperty('width', `${tv}px`);
    }
};


/**
 * Element height(Number) 반환
 * @param {CSSStyleDeclaration | HTMLElement} to
 * @returns {number}
 */
const fn_getHeight = (to) => {
    const sts = fn_getStyles(to);
    if (sts !== null) {
        let tv = sts.getPropertyValue('height');
        return fn_checkNumber(tv);
    }
    else return 0.0;
};

/**
 * Element height(Number) 설정
 * @param {CSSStyleDeclaration | HTMLElement} to
 * @param {number} tv
 */
const fn_setHeight = (to, tv) => {
    const sts = fn_getStyles(to, true);
    if (sts !== null) {
        tv = fn_checkNumber(tv);
        sts.setProperty('height', `${tv}px`);
    }
};


/**
 * Element left(Number) 가져오기
 * @param {CSSStyleDeclaration | HTMLElement} to
 * @returns {number}
 */
const fn_getLeft = (to) => {
    const sts = fn_getStyles(to);
    if (sts !== null) {
        let tv = sts.getPropertyValue('left');
        return fn_checkNumber(tv);
    }
    else return 0.0;
};

/**
 * Element left(Number) 설정하기
 * @param {CSSStyleDeclaration | HTMLElement} to
 * @param {number} tv
 */
const fn_setLeft = (to, tv) => {
    const sts = fn_getStyles(to, true);
    if (sts !== null) {
        tv = fn_checkNumber(tv);
        sts.setProperty('left', `${tv}px`);
    }
};


/**
 * Element top(Number) 반환
 * @param {CSSStyleDeclaration | HTMLElement} to
 * @returns {number}
 */
const fn_getTop = (to) => {
    const sts = fn_getStyles(to);
    if (sts !== null) {
        let tv = sts.getPropertyValue('top');
        return fn_checkNumber(tv);
    }
    else return 0.0;
};

/**
 * Element top(Number) 설정
 * @param {CSSStyleDeclaration | HTMLElement} to
 * @param {number} tv
 */
const fn_setTop = (to, tv) => {
    const sts = fn_getStyles(to, true);
    if (sts !== null) {
        tv = fn_checkNumber(tv);
        sts.setProperty('top', `${tv}px`);
    }
};


/**
 * Element Rect 반환
 * @param {CSSStyleDeclaration | HTMLElement} to
 * @returns {DOMRect}
 */
const fn_getRect = (to) => {
    const sts = fn_getStyles(to);
    if (sts !== null) {
        let tx = fn_getLeft(sts);
        let ty = fn_getTop(sts);
        let tw = fn_getWidth(sts);
        let th = fn_getHeight(sts);
        let rct = new DOMRect(tx, ty, tw, th);
        return rct;
    }
    else return null;
};


/**
 * Element Rect 반환
 * @param {CSSStyleDeclaration | HTMLElement} to
 * @param {DOMRect} rct
 * @returns {DOMRect}
 */
const fn_updateRect = (to, rct) => {
    const sts = fn_getStyles(to);
    if (sts !== null) {
        let tw = fn_getWidth(sts);
        let th = fn_getHeight(sts);
        let tx = fn_getLeft(sts);
        let ty = fn_getTop(sts);
        rct.width = tw;
        rct.height = th;
        rct.x = tx;
        rct.y = ty;
    }
};


/**
 * Rect에 좌표(tx, ty)가 포함되는지 여부
 * @param {DOMRect} rct
 * @param {number} tx
 * @param {number} ty
 * @returns {boolean}
 */
const fn_containsRect = (rct, tx, ty) => {
    const rb = ((rct.left <= tx) && (rct.right >= tx)) &&
        ((rct.top <= ty) && (rct.bottom >= ty));
    return rb;
};


/**
 * Element에 Rect 적용하기
 * @param {CSSStyleDeclaration | HTMLElement} to
 * @param {DOMRect} rct
 */
const fn_applyRectToElement = (to, rct) => {
    const sts = fn_getStyles(to, true);
    if ((sts !== null) && (rct instanceof DOMRect)) {
        fn_setLeft(sts, rct.left);
        fn_setTop(sts, rct.top);
        fn_setWidth(sts, rct.width);
        fn_setHeight(sts, rct.height);
    }
};



export {
    fn_getStyles,
    fn_checkNumber,
    fn_getWidth, fn_setWidth,
    fn_getHeight, fn_setHeight,
    fn_getLeft, fn_setLeft,
    fn_getTop, fn_setTop,
    fn_getRect, fn_updateRect,
    fn_containsRect,
    fn_applyRectToElement
};
