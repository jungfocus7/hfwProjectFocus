import { hfEventTypes } from "../base/hfEventTypes.js";
import {
    fn_setHeight,
    fn_setTop,
    fn_getRect,
    fn_updateRect,
    fn_containsRect,
    fn_setWidth,
    fn_applyRectToElement,
    fn_setLeft,
} from "../base/hfStyleFunctions.js";



/**
 * ???
 */
const HsDoubleHelper = Object.freeze({
    /**
     * 비율값이 0~1 사이에 있는 체크
     * @param {number} tv
     */
    checkRatio: (tv) => {
        if (Number.isFinite(tv)) {
            if (tv < 0.0) return 0.0;
            else if (tv > 1.0) return 1.0;
        }
        else {
            return 0.0;
        }

        return tv;
    },

    /**
     * 비율값 계산
     * @param {number} v1
     * @param {number} v2
     */
    calcRatio: (v1, v2) => {
        const tv = v1 / v2;

        return HsDoubleHelper.checkRatio(tv);
    },

});


/**
 * ???
 */
const HeScrollType = Object.freeze({
    none: 'none', both: 'both',
    horizontal: 'horizontal', vertical: 'vertical',
});


/**
 * ??
 */
class HcScrollTargetArea {
    //#region [초기화 영역역]
    #gdo = {
        /**
         * ViewportBounds (컨텐츠가 표시되는 영역)
         * @type {DOMRect}
         */
        viewportBounds: null,

        /**
         * BodyBounds (컨텐츠 영역)
         * @type {DOMRect}
         */
        bodyBounds: null,
    };


    /**
     * 생성자
     * @param {DOMRect} rctViewport
     * @param {DOMRect} rctBody
     */
    constructor(rctViewport, rctBody) {
        const gdo = this.#gdo;

        gdo.viewportBounds = rctViewport;
        gdo.bodyBounds = rctBody;
    }
    //#endregion


    //#region [viewportBounds]
    /**
     * @returns {DOMRect}
     */
    getViewportBounds() {
        const gdo = this.#gdo;

        return gdo.viewportBounds;
    }

    /**
     * @param {DOMRect} rct
     * @returns
     */
    updateViewportBounds(rct) {
        const gdo = this.#gdo;

        gdo.viewportBounds = rct;
    }

    /**
     * @param {number} tv
     */
    updateViewportWidth(tv) {
        const gdo = this.#gdo;

        gdo.viewportBounds.width = tv;
    }

    /**
     * @param {number} tv
     */
    updateViewportHeight(tv) {
        const gdo = this.#gdo;

        gdo.viewportBounds.height = tv;
    }

    /**
     * @param {number} tv
     */
    updateViewportLeft(tv) {
        const gdo = this.#gdo;

        gdo.viewportBounds.x = tv;
    }

    /**
     * @param {number} tv
     */
    updateViewportTop(tv) {
        const gdo = this.#gdo;

        gdo.viewportBounds.y = tv;
    }

    /**
     * @returns {number}
     */
    getViewportWidthRatio() {
        const gdo = this.#gdo;

        const tv = gdo.viewportBounds.width / gdo.bodyBounds.width;
        return HsDoubleHelper.checkRatio(tv);
    }

    /**
     * @returns {number}
     */
    getViewportHeightRatio() {
        const gdo = this.#gdo;

        const tv = gdo.viewportBounds.height / gdo.bodyBounds.height;
        return HsDoubleHelper.checkRatio(tv);
    }
    //#endregion


    //#region [bodyBounds]
    /**
     * @returns {DOMRect}
     */
    getBodyBounds() {
        const gdo = this.#gdo;

        return gdo.bodyBounds;
    }

    /**
     * @param {DOMRect} rct
     * @returns
     */
    updateBodyBounds(rct) {
        const gdo = this.#gdo;

        gdo.bodyBounds = rct;
    }

    /**
     * @param {number} tv
     */
    updateBodyWidth(tv) {
        const gdo = this.#gdo;

        gdo.bodyBounds.width = tv;
    }

    /**
     * @param {number} tv
     */
    updateBodyHeight(tv) {
        const gdo = this.#gdo;

        gdo.bodyBounds.height = tv;
    }

    /**
     * @param {number} tv
     */
    updateBodyLeft(tv) {
        const gdo = this.#gdo;

        gdo.bodyBounds.x = tv;
    }

    /**
     * @param {number} tv
     */
    updateBodyTop(tv) {
        const gdo = this.#gdo;

        gdo.bodyBounds.y = tv;
    }

    /**
     * @param {number} spr
     */
    calcBodyLeft(spr) {
        const gdo = this.#gdo;

        let df = gdo.viewportBounds.width - gdo.bodyBounds.width;
        if (df > 0.0) df = 0.0;

        const tv = df * spr;
        this.updateBodyLeft(tv);
    }

    /**
     * @param {number} spr
     */
    calcBodyTop(spr) {
        const gdo = this.#gdo;

        let df = gdo.viewportBounds.height - gdo.bodyBounds.height;
        if (df > 0.0) df = 0.0;

        const tv = df * spr;
        this.updateBodyTop(tv);
    }
    //#endregion
}
Object.freeze(HcScrollTargetArea);


/**
 * @param {string} sct
 */
const fn_getGroundStyleStr = (sct) => {
    let rtx = '';

    if (sct === HeScrollType.vertical) {
        rtx = 'width: 20px; height: 100%;';
    }
    else if (sct === HeScrollType.horizontal) {
        rtx = 'width: 100%; height: 20px;';
    }
    else if (sct === HeScrollType.both) {
        rtx = 'width: 100%; height: 100%;';
    }

    return `
${rtx}
background-color: #595959;
position: static; display: inline-block;
overflow-x: hidden; overflow-y: hidden;
font-size: 0px; cursor: pointer;
    `.trim();
};

/**
 * @param {string} sct
 */
const fn_getThumbElementStr = (sct) => {
    let rtx = '';

    if (sct === HeScrollType.vertical) {
        rtx = 'rotate(-90deg);';
    }

    return `
<div style="background-color: #748B96;
    position: relative;
    width: 100%; height: 100%;
    left: 0px; top: 0px;
    pointer-events: none; overflow: visible;
    box-sizing: border-box; font-size: 0px;
    border: 3px solid #595959;">
    <span style="position: relative;
        display: inline-block;
        width: auto; height: auto;
        left: 50%; top: 50%;
        transform: translate(-50%, -50%) ${rtx}
        user-select: none; white-space: nowrap;
        font-size: 11px; color: #ffffff66;"></span>
</div>
    `.trim();
};

/** @type {number} */
const _minwh = 20.0;

class HcScrollBar extends EventTarget {
    /** GDO */
    #gdo = {
        /**
         * TargetArea
         * @type {HcScrollTargetArea}
         */
        targetArea: null,

        /**
         * LogicType
         * @type {string}
         */
        logicType: null,


        /**
         * ???
         * @type {HTMLDivElement}
         */
        heGround: null,

        /**
         * ???
         * @type {HTMLDivElement}
         */
        heThumb: null,

        /**
         * ???
         * @type {HTMLDivElement}
         */
        heSpan: null,

        /**
         * Ground Bounds
         * @type {DOMRect}
         */
        rctGround: null,

        /**
         * Thumb Bounds
         * @type {DOMRect}
         */
        rctThumb: null,


        /**
         * Horizontal Ground Ratio
         * @type {number}
         */
        hgr: 0.0,

        /**
         * Vertical Ground Ratio
         * @type {number}
         */
        vgr: 0.0,


        /**
         * Horizontal Scroll Position Ratio
         * @type {number}
         */
        hspr: 0.0,

        /**
         * Vertical Scroll Position Ratio
         * @type {number}
         */
        vspr: 0.0,


        /**
         * Mouse Event
         * @type {MouseEvent}
         */
        me: null,


        /**
         * Mouse Down Point
         * @type {{x: number, y: number}}
         */
        mdpt: null,

    };


    /**
     * 생성자
     * @param {HcScrollTargetArea} targetArea
     * @param {string} type
     * @param {string} eid
     */
    constructor(targetArea, type, eid) {
        super();

        const gdo = this.#gdo;

        gdo.targetArea = targetArea;
        gdo.logicType = type;

        gdo.heGround = document.getElementById(eid);
        gdo.heGround.setAttribute('style', fn_getGroundStyleStr(HeScrollType.vertical));
        gdo.heGround.innerHTML = fn_getThumbElementStr(HeScrollType.vertical);

        gdo.heThumb = gdo.heGround.children[0];
        gdo.heSpan = gdo.heThumb.children[0];
        gdo.heSpan.innerText = '';

        gdo.rctGround = fn_getRect(gdo.heGround);
        gdo.rctThumb = fn_getRect(gdo.heThumb);

        if (gdo.logicType === HeScrollType.both) { }
        else if (gdo.logicType === HeScrollType.horizontal) { }
        else if (gdo.logicType === HeScrollType.vertical) {
            gdo.hgr = 1.0;
            gdo.vgr = gdo.targetArea.getViewportHeightRatio();
            gdo.hspr = 0.0;
            gdo.vspr = 0.0;
        }
        else {
            return;
        }

        this.#fn_updateGroundThumbRects();


        gdo.heGround.addEventListener(hfEventTypes.MouseDown, this.#fn_mouseDown);
        // window.addEventListener(hfEventTypes.Resize, this.#fn_resize);
        // this.#fn_resize(null);


        Object.seal(this);
    }


    /**
     * ???
     * @param {string} type
     * @returns {number}
     */
    #fn_calcComScrollSize(type) {
        const gdo = this.#gdo;

        let df = 0.0;
        if (type === HeScrollType.horizontal) { }
        else if (type === HeScrollType.vertical) {
            df = gdo.rctGround.height - gdo.rctThumb.height;
            if (df < 0.0) df = 0.0;
        }

        return df;
    }

    /**
     * ???
     * @param {string} type
     * @returns {void}
     */
    #fn_applyRectThumb(type) {
        const gdo = this.#gdo;

        if (type === HeScrollType.both) {
            // fn_applyRectToElement(gdo.heThumb, gdo.rctThumb);
        }
        else if (type === HeScrollType.horizontal) {
            // fn_setWidth(gdo.heThumb, gdo.rctThumb.width);
            // fn_setLeft(gdo.heThumb, gdo.rctThumb.left);
        }
        else if (type === HeScrollType.vertical) {
            fn_setHeight(gdo.heThumb, gdo.rctThumb.height);
            fn_setTop(gdo.heThumb, gdo.rctThumb.top);
        }
    }

    /**
     * ???
     * @returns {void}
     */
    #fn_printSpanLog() {
        const gdo = this.#gdo;

        if (gdo.logicType === HeScrollType.both) { }
        else if (gdo.logicType === HeScrollType.horizontal) { }
        else if (gdo.logicType === HeScrollType.vertical) {
            const tsr = (100 * gdo.vgr).toFixed(1);
            const spr = (100 * gdo.vspr).toFixed(1);
			gdo.heSpan.innerText = `${tsr}% / ${spr}%`;
        }
    }

    /**
     * ???
     * @returns {void}
     */
    #fn_updateGroundThumbRects() {
        const gdo = this.#gdo;

        if (gdo.logicType == HeScrollType.none) return;

        fn_updateRect(gdo.heGround, gdo.rctGround);

        let tw = gdo.rctGround.width * gdo.hgr;
        if (tw < _minwh) tw = _minwh;
        gdo.rctThumb.width = tw;

        let th = gdo.rctGround.height * gdo.vgr;
        if (th < _minwh) th = _minwh;
        gdo.rctThumb.height = th;

        let hss = this.#fn_calcComScrollSize(HeScrollType.horizontal);
        gdo.rctThumb.x = hss * gdo.hspr;

        let vss = this.#fn_calcComScrollSize(HeScrollType.vertical);
        gdo.rctThumb.y = vss * gdo.vspr;


        this.#fn_applyRectThumb(HeScrollType.both);
        this.#fn_printSpanLog();

        // this.dispatchEvent(new Event('xxx'));
    }

    // /**
    //  * Thumb 포지션 설정
    //  * @param {number} val
    //  * @param {boolean} bApply
    //  * @returns {void}
    //  */
    // #fn_setThumbPosition(val, bApply=true) {

    // }

    /**
     * ??
     * @returns {number}
     */
    #fn_calcHoriScrollSize() {
        const gdo = this.#gdo;

        let df = gdo.rctGround.width - gdo.rctThumb.width;
        if (df < 0.0) df = 0.0;

        return df;
    }

    /**
     * ??
     * @returns {number}
     */
    #fn_calcVertScrollSize() {
        const gdo = this.#gdo;

        let df = gdo.rctGround.height - gdo.rctThumb.height;
        if (df < 0.0) df = 0.0;

        return df;
    }

    /**
     * ??
     * @param {number} tx
     */
    #fn_checkUpdateThumbLeft(tx) {
        // const gdo = this.#gdo;

        // if (gdo.hgr >= 1.0) return false;
        // if (tx === gdo.rctThumb.left) return false;

        // if ((m_twr >= 1.0) || (tx == m_rctThumb.Left)) return false;
        // //Debug.WriteLine("prCheckUpdateThumbLeft");

        // double bx = 0.0;
        // double ex = prCalcHoriScrollSize();

        // double cx = tx;
        // if (cx < bx) cx = bx;
        // else if (cx > ex) cx = ex;
        // m_rctThumb.X = cx;

        // double v1 = cx - bx;
        // double v2 = ex - bx;
        // m_hspr = HcDoubleHelper.CalcRatio(v1, v2);

        // TargetArea.CalcBodyLeft(m_hspr);

        // return true;
    }

    /**
     * ??
     * @param {number} ty
     */
    #fn_checkUpdateThumbTop(ty) {
        const gdo = this.#gdo;

        if (gdo.vgr >= 1.0) return false;
        if (ty === gdo.rctThumb.top) return false;

        let by = 0.0;
        let ey = 0.0;

        let cy = ty;
        if (cy < by) cy = by;
        else if (cy > ey) cy = ey;
        gdo.rctThumb.y = cy;

        let v1 = cy - by;
        let v2 = ey - by;
        gdo.vspr = HsDoubleHelper.calcRatio(v1, v2);

        gdo.targetArea.calcBodyTop(gdo.vspr);

        return true;
    }

    /**
     * ??
     * @param {number} tx
     * @param {number} ty
     */
    #fn_updateThumbLocation(tx, ty) {

    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    /**
     * Mouse Move
     * @param {MouseEvent} e
     * @returns {void}
     */
    #fn_mouseMove = (e) => {
        const gdo = this.#gdo;

        if (gdo.mdpt === null) return;
    };

    /**
     * Mouse Up
     * @param {MouseEvent} e
     * @returns {void}
     */
    #fn_mouseUp = (e) => {
    };

    /**
     * Mouse Down
     * @param {MouseEvent} e
     * @returns {void}
     */
    #fn_mouseDown = (e) => {
        const gdo = this.#gdo;
        gdo.me = e;

        if (gdo.me.button !== 0) return;
        // if (e.button !== 0) return;
        if (gdo.mdpt !== null) return;

        gdo.mdpt = {
            x: e.clientX - gdo.rctThumb.left,
            y: e.clientY - gdo.rctThumb.top,
        };

        window.addEventListener(hfEventTypes.MouseMove, this.#fn_mouseMove);
        window.addEventListener(hfEventTypes.MouseUp, this.#fn_mouseUp);
        window.addEventListener(hfEventTypes.Blur, this.#fn_mouseUp);

        if (fn_containsRect(gdo.rctThumb, e.offsetX, e.offsetY)) {
            this.#fn_mouseMove(e);
        }
        else {
            // const cv = e.clientY - (gdo.rctThumb.height / 2);
            // this.#fn_setThumbPosition(cv);
            this.#fn_printSpanLog();
        }
    };

}
Object.freeze(HcScrollBar);


export {
    HsDoubleHelper,
    HeScrollType,
    HcScrollTargetArea,
    HcScrollBar,
};
