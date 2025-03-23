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
 * HsDoubleHelper
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
 * HeScrollType
 */
const HeScrollType = Object.freeze({
    both: 'both', horizontal: 'horizontal', vertical: 'vertical'
});


/**
 * HcScrollTargetArea 구현체
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
 * ???
 * @param {string} sct
 */
const fn_getGroundStyleStr = (sct) => {
    let rtx = '';

    if (sct === HeScrollType.both) {
        rtx = 'width: 100%; height: 100%;';
    }
    else if (sct === HeScrollType.horizontal) {
        rtx = 'width: 100%; height: 20px;';
    }
    else if (sct === HeScrollType.vertical) {
        rtx = 'width: 20px; height: 100%;';
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
 * ???
 * @param {string} sct
 */
const fn_getThumbElementStr = (sct) => {
    let rtx = ';';

    if (sct === HeScrollType.vertical) {
        rtx = ' rotate(-90deg);';
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
        transform: translate(-50%, -50%)${rtx}
        user-select: none; white-space: nowrap;
        font-size: 11px; color: #ffffff66;"></span>
</div>
    `.trim();
};


/**
 * Thumb의 넓이/높이 최소값
 * @type {number}
 */
const _minwh = 20.0;


/**
 * HcScrollBar 클래스 구현체
 */
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
         * Mouse Down X
         * @type {number}
         */
        mdx: -1,


        /**
         * Mouse Down Y
         * @type {number}
         */
        mdy: -1,

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
        gdo.heGround.setAttribute('style', fn_getGroundStyleStr(gdo.logicType));
        gdo.heGround.innerHTML = fn_getThumbElementStr(gdo.logicType);

        gdo.heThumb = gdo.heGround.children[0];
        gdo.heSpan = gdo.heThumb.children[0];
        gdo.heSpan.innerText = '';

        gdo.rctGround = fn_getRect(gdo.heGround);
        gdo.rctThumb = fn_getRect(gdo.heThumb);

        if (gdo.logicType === HeScrollType.both) { }
        else if (gdo.logicType === HeScrollType.horizontal) {
            gdo.hgr = gdo.targetArea.getViewportWidthRatio();
            gdo.vgr = 1.0;
            gdo.hspr = 0.0;
            gdo.vspr = 0.0;
        }
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
     * Thumb Width 계산하여 적용
     * @returns {void}
     */
    #fn_calcUpdateThumbWidth() {
        const gdo = this.#gdo;

        let tw = gdo.rctGround.width * gdo.hgr;
        if (tw < _minwh) tw = _minwh;
        gdo.rctThumb.width = tw;
    }

    /**
     * Thumb Height 계산하여 적용용
     * @returns {void}
     */
    #fn_calcUpdateThumbHeight() {
        const gdo = this.#gdo;

        let th = gdo.rctGround.height * gdo.vgr;
        if (th < _minwh) th = _minwh;
        gdo.rctThumb.height = th;
    }

    /**
     * 수평 스크롤사이즈 계산하여 반환
     * @returns {number}
     */
    #fn_calcHoriScrollSize() {
        const gdo = this.#gdo;

        let df = gdo.rctGround.width - gdo.rctThumb.width;
        if (df < 0.0) df = 0.0;

        return df;
    }

    /**
     * 수직 스크롤사이즈 계산하여 반환
     * @returns {number}
     */
    #fn_calcVertScrollSize() {
        const gdo = this.#gdo;

        let df = gdo.rctGround.height - gdo.rctThumb.height;
        if (df < 0.0) df = 0.0;

        return df;
    }

    /**
     * Thumb Left 계산하여 적용
     * @returns {void}
     */
    #fn_calcUpdateThumbLeft() {
        const gdo = this.#gdo;

        let hd = this.#fn_calcHoriScrollSize();
        let tx = hd * gdo.hspr;
        gdo.rctThumb.x = tx;
    }

    /**
     * Thumb Top 계산하여 적용
     * @returns {void}
     */
    #fn_calcUpdateThumbTop() {
        const gdo = this.#gdo;

        let vd = this.#fn_calcVertScrollSize();
        let ty = vd * gdo.vspr;
        gdo.rctThumb.y = ty;
    }

    /**
     * Thumb에 Rect 적용하기
     * @param {boolean} bFirst
     * @returns {void}
     */
    #fn_applyRectThumb(bFirst) {
        const gdo = this.#gdo;

        if ((bFirst === true) || (gdo.logicType === HeScrollType.both)) {
            fn_applyRectToElement(gdo.heThumb, gdo.rctThumb);
        }
        else if (gdo.logicType === HeScrollType.horizontal) {
            fn_setWidth(gdo.heThumb, gdo.rctThumb.width);
            fn_setLeft(gdo.heThumb, gdo.rctThumb.left);
        }
        else if (gdo.logicType === HeScrollType.vertical) {
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

        if (gdo.logicType === HeScrollType.both) {
//             const phsr = 100 * gdo.hgr;
//             const phpr = 100 * gdo.hspr;
//             const pvsr = 100 * gdo.vgr;
//             const pvpr = 100 * gdo.vspr;
//             const txt = `
// ${phsr.ToString("F1")}%/${phpr.ToString("F1")}%
// ${pvsr.ToString("F1")}%/${pvpr.ToString("F1")}%`.Trim();
//             m_elTxb.Text = txt;
        }
        else if (gdo.logicType === HeScrollType.horizontal) {
            const tsr = (100 * gdo.hgr).toFixed(1);
            const spr = (100 * gdo.hspr).toFixed(1);
            const txt = `${tsr}% / ${spr}%`;
            gdo.heSpan.innerText = txt;
        }
        else if (gdo.logicType === HeScrollType.vertical) {
            const tsr = (100 * gdo.vgr).toFixed(1);
            const spr = (100 * gdo.vspr).toFixed(1);
            const txt = `${tsr}% / ${spr}%`;
            gdo.heSpan.innerText = txt;
        }
    }

    /**
     * ???
     * @returns {void}
     */
    #fn_updateGroundThumbRects() {
        const gdo = this.#gdo;

        if (gdo.logicType === null) return;

        fn_updateRect(gdo.heGround, gdo.rctGround);

        this.#fn_calcUpdateThumbWidth();
        this.#fn_calcUpdateThumbHeight();

        this.#fn_calcUpdateThumbLeft();
        this.#fn_calcUpdateThumbTop();

        this.#fn_applyRectThumb(true);
        this.#fn_printSpanLog();
    }


    /**
     * ???
     * @param {number} tx
     * @returns {boolean}
     */
    #fn_checkThumbLeftCore(tx) {
        const gdo = this.#gdo;

        if (gdo.hgr >= 1.0) return false;
        if (tx === gdo.rctThumb.left) return false;

        let bx = 0.0;
        let ex = this.#fn_calcHoriScrollSize();

        let cx = tx;
        if (cx < bx) cx = bx;
        else if (cx > ex) cx = ex;
        gdo.rctThumb.x = cx;

        let v1 = cx - bx;
        let v2 = ex - bx;
        gdo.hspr = HsDoubleHelper.calcRatio(v1, v2);

        gdo.targetArea.calcBodyLeft(gdo.hspr);

        return true;
    }

    /**
     * ???
     * @param {number} ty
     * @returns {boolean}
     */
    #fn_checkThumbTopCore(ty) {
        const gdo = this.#gdo;

        if (gdo.vgr >= 1.0) return false;
        if (ty === gdo.rctThumb.top) return false;

        let by = 0.0;
        let ey = this.#fn_calcVertScrollSize();

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
     * ???
     * @param {number} tx
     * @param {number} ty
     */
    #fn_updateThumbPosition(tx, ty) {
        const gdo = this.#gdo;

        let bAfter = false;

        if (this.#fn_checkThumbLeftCore(tx)) {
            fn_setLeft(gdo.heThumb, gdo.rctThumb.left);

            bAfter = true;
        }

        if (this.#fn_checkThumbTopCore(ty)) {
            fn_setTop(gdo.heThumb, gdo.rctThumb.top);

            bAfter = true;
        }

        if (bAfter === true) {
            this.#fn_printSpanLog();

            // Scroll?.Invoke(this, null);
        }
    }

    /**
     * ???
     * @param {number} tx
     */
    #fn_updateThumbLeft(tx) {
        const gdo = this.#gdo;

        if (this.#fn_checkThumbLeftCore(tx)) {
            fn_setLeft(gdo.heThumb, gdo.rctThumb.left);
            this.#fn_printSpanLog();

            // Scroll?.Invoke(this, null);
        }
    }

    /**
     * ???
     * @param {number} ty
     */
    #fn_updateThumbTop(ty) {
        const gdo = this.#gdo;

        if (this.#fn_checkThumbTopCore(ty)) {
            fn_setTop(gdo.heThumb, gdo.rctThumb.top);
            this.#fn_printSpanLog();

            // Scroll?.Invoke(this, null);
        }
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    /**
     * Mouse Move
     * @param {MouseEvent} e
     * @returns {void}
     */
    #fn_mouseMove = (e) => {
        if (e.button !== 0) return;
        if (e.buttons !== 1) return;

        const gdo = this.#gdo;

        if (gdo.logicType === HeScrollType.both) {
            let tx = e.clientX - gdo.mdx;
            let ty = e.clientY - gdo.mdy;

            this.#fn_updateThumbPosition(tx, ty);
        }
        else if (gdo.logicType === HeScrollType.horizontal) {
            let tx = e.clientX - gdo.mdx;

            this.#fn_updateThumbLeft(tx);
        }
        else if (gdo.logicType === HeScrollType.vertical) {
            let ty = e.clientY - gdo.mdy;

            this.#fn_updateThumbTop(ty);
        }

        // console.log('fn_mouseMove');
    };

    /**
     * Mouse Up
     * @param {MouseEvent | Event} e
     * @returns {void}
     */
    #fn_mouseUp = (e) => {
        if (e === null) return;

        window.removeEventListener(hfEventTypes.MouseMove, this.#fn_mouseMove);
        window.removeEventListener(hfEventTypes.MouseUp, this.#fn_mouseUp);
        window.removeEventListener(hfEventTypes.Blur, this.#fn_mouseUp);

        // console.log('fn_mouseUp');
    };

    /**
     * Mouse Down
     * @param {MouseEvent} e
     * @returns {void}
     */
    #fn_mouseDown = (e) => {
        if (e.button !== 0) return;
        if (e.buttons !== 1) return;

        window.addEventListener(hfEventTypes.MouseMove, this.#fn_mouseMove);
        window.addEventListener(hfEventTypes.MouseUp, this.#fn_mouseUp);
        window.addEventListener(hfEventTypes.Blur, this.#fn_mouseUp);

        const gdo = this.#gdo;
        if (fn_containsRect(gdo.rctThumb, e.offsetX, e.offsetY)) {
            gdo.mdx = e.clientX - gdo.rctThumb.left;
            gdo.mdy = e.clientY - gdo.rctThumb.top;

            this.#fn_mouseMove(e);
        }
        else {
            if (gdo.logicType === HeScrollType.both) {
                let tx = e.clientX - (gdo.rctThumb.width / 2);
                let ty = e.clientY - (gdo.rctThumb.height / 2);

                this.#fn_updateThumbPosition(tx, ty);
            }
            else if (gdo.logicType === HeScrollType.horizontal) {
                let tx = e.clientX - (gdo.rctThumb.width / 2);

                this.#fn_updateThumbLeft(tx);
            }
            else if (gdo.logicType === HeScrollType.vertical) {
                let ty = e.clientY - (gdo.rctThumb.height / 2);

                this.#fn_updateThumbTop(ty);
            }

            gdo.mdx = e.clientX - gdo.rctThumb.left;
            gdo.mdy = e.clientY - gdo.rctThumb.top;
        }

        // console.log('fn_mouseDown');
    };

}
Object.freeze(HcScrollBar);


export {
    HsDoubleHelper,
    HeScrollType,
    HcScrollTargetArea,
    HcScrollBar,
};
