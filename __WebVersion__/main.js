import { hfEventTypes } from "./hfjs/base/hfEventTypes.js";
import { fn_getRect, fn_setLeft, fn_setTop } from "./hfjs/base/hfStyleFunctions.js";
import { HcScrollBar, HcScrollTargetArea, HeScrollType } from "./hfjs/customElements/HcScrollBar.js";


/**
 * GDO
 */
const _gdo = Object.seal({
    /**
     * @type {HTMLDivElement}
     */
    heAppRoot: document.querySelector('.app-root'),


    /**
     * @type {HTMLDivElement}
     */
    heViewBox: document.getElementById('viewBox'),

    /**
     * @type {HTMLDivElement}
     */
    heBody: document.getElementById('body'),


    /**
     * @type {HcScrollTargetArea}
     */
    targetArea: null,


    /**
     * @type {HcScrollBar}
     */
    scrbBoth: null,


    /**
     * @type {HcScrollBar}
     */
    scrbHori: null,


    /**
     * @type {HcScrollBar}
     */
    scrbVert: null,

});

/**
 * ??
 * @param {string} type
 */
const fn_updateBodyLocation = (type) => {
    if (type === HeScrollType.both) {
        const rx = _gdo.targetArea.getBodyLeft();
        const ry = _gdo.targetArea.getBodyTop();

        fn_setLeft(_gdo.heBody, rx);
        fn_setTop(_gdo.heBody, ry);
    }
    else if (type === HeScrollType.horizontal) {
        const rx = _gdo.targetArea.getBodyLeft();

        fn_setLeft(_gdo.heBody, rx);
    }
    else if (type === HeScrollType.vertical) {
        const ry = _gdo.targetArea.getBodyTop();

        fn_setTop(_gdo.heBody, ry);
    }
};

(() => {
    return;
    const rctViewport = fn_getRect(_gdo.heViewBox);
    const rctBody = fn_getRect(_gdo.heBody);
    _gdo.targetArea = new HcScrollTargetArea(rctViewport, rctBody);

    _gdo.scrbBoth = new HcScrollBar(_gdo.targetArea, HeScrollType.both, 'bscr');
    _gdo.scrbBoth.addEventListener(hfEventTypes.Scroll, () => {
        fn_updateBodyLocation(HeScrollType.both);

        const hsr = _gdo.scrbBoth.getHoriScrollRatio();
        const vsr = _gdo.scrbBoth.getVertScrollRatio();
        _gdo.scrbHori.setHoriScrollRatio(hsr);
        _gdo.scrbVert.setVertScrollRatio(vsr);
    });

    _gdo.scrbHori = new HcScrollBar(_gdo.targetArea, HeScrollType.horizontal, 'hscr');
    _gdo.scrbHori.addEventListener(hfEventTypes.Scroll, () => {
        fn_updateBodyLocation(HeScrollType.horizontal);

        const hsr = _gdo.scrbHori.getHoriScrollRatio();
        _gdo.scrbBoth.setHoriScrollRatio(hsr);
    });

    _gdo.scrbVert = new HcScrollBar(_gdo.targetArea, HeScrollType.vertical, 'vscr');
    _gdo.scrbVert.addEventListener(hfEventTypes.Scroll, () => {
        fn_updateBodyLocation(HeScrollType.vertical);

        const vsr = _gdo.scrbVert.getVertScrollRatio();
        _gdo.scrbBoth.setVertScrollRatio(vsr);
    });

    window.addEventListener(hfEventTypes.Resize, () => {
        // console.log('이거뭐냐');
        // console.log(_gdo.scrollBarBoth.getHoriScrollRatio());
        // console.log(_gdo.scrollBarBoth.getVertScrollRatio());

        const rct = fn_getRect(_gdo.heViewBox);
        // console.log(rct);
        _gdo.targetArea.updateViewportWidth(rct.width);
        _gdo.targetArea.updateViewportHeight(rct.height);
        _gdo.targetArea.calcBodyLeft(_gdo.scrbBoth.getHoriScrollRatio());
        _gdo.targetArea.calcBodyTop(_gdo.scrbBoth.getVertScrollRatio());

        let vwr = _gdo.targetArea.getViewportWidthRatio();
        let vhr = _gdo.targetArea.getViewportHeightRatio();
        _gdo.scrbBoth.setHoriGroundRatio(vwr);
        _gdo.scrbBoth.setVertGroundRatio(vhr);

        _gdo.scrbHori.setHoriGroundRatio(vwr);
        _gdo.scrbVert.setVertGroundRatio(vhr);
    });
})();

// console.log('>>> _gdo.heAppRoot:', _gdo.heAppRoot);
// console.log('>>> _gdo.heViewBox:', _gdo.heViewBox);
// console.log('>>> _gdo.heBody:', _gdo.heBody);
// console.log('>>> _gdo.scrollArea:', _gdo.scrollArea);



// const _vscr = new HcScrollBar('vscr');
// _vscr.fn_setScrollSizeRatio(0.35);
// _vscr.addEventListener(hfEventTypes.Scroll, (e) => {
//     const pry = _vscr.fn_getScrollPositionRatio();
//     console.log(pry);
// });






// (() => {
// _appRoot.innerHTML = `
// 	<div>
// 		<a href="https://vite.dev" target="_blank"></a>
// 		<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank"></a>
// 		<h1>Hello Vite!</h1>
// 		<div class="card">
// 			<button id="counter" type="button"></button>
// 		</div>
// 		<p class="read-the-docs">
// 			Click on the Vite logo to learn more
// 		</p>
// 	</div>
// `.trim();
// })();
