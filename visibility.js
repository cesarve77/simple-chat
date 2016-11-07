(function() {
    var hidden = "hidden";

    // Standards:
    if (hidden in document)
        document.addEventListener("visibilitychange", onchange);
    if ((hidden = "mozHidden") in document)
        document.addEventListener("mozvisibilitychange", onchange);
    if ((hidden = "webkitHidden") in document)
        document.addEventListener("webkitvisibilitychange", onchange);
    if ((hidden = "msHidden") in document)
        document.addEventListener("msvisibilitychange", onchange);
    // IE 9 and lower:
    if ("onfocusin" in document)
        document.onfocusin = document.onfocusout = onchange;
    // All others:
        window.onpageshow = window.onpagehide
            = window.onfocus = window.onblur = onchange;

    function onchange (evt) {
        var v = "visible", h = "hidden",
            evtMap = {
                focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h
            };

        evt = evt || window.event;
        if (evt.type in evtMap)
            window.visivility = evtMap[evt.type];
        else
            window.visivility = this[hidden] ? "hidden" : "visible";
    }

    // set the initial state (but only if browser supports the Page Visibility API)
    if( document[hidden] !== undefined )
        onchange({type: document[hidden] ? "blur" : "focus"});
})();


/// simple rectangle intersection code, so we can work out what part remains visible
var intersect = function(r1, r2, bool) {
    if ( bool ) {
        return !(r2.left > r1.right ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.bottom < r1.top);
    }
    else {
        var r3 = {
            left: Math.max(r1.left, r2.left),
            top: Math.max(r1.top, r2.top),
            right: Math.min(r1.right, r2.right),
            bottom: Math.min(r1.bottom, r2.bottom)
        };
        r3.width = r3.right - r3.left;
        r3.height = r3.bottom - r3.top;
        return r3;
    }
}
/// simple function to handle full page scroll, when needed.
var scrollrect = function(r1){
    /// update what we know of the page scroll (this affects ClientRects())
    scrollrect.scrollx = window.pageXOffset || document.documentElement.scrollLeft;
    scrollrect.scrolly = window.pageYOffset || document.documentElement.scrollTop;
    /// all because getBoundingClientRect() returns a read-only object (it seems?)
    return {
        left: r1.left + scrollrect.scrollx,
        top: r1.top + scrollrect.scrolly,
        right: r1.right + scrollrect.scrollx,
        bottom: r1.bottom + scrollrect.scrolly,
        width: r1.width,
        height: r1.height
    };
}
/// add in a jQuery pseudo selector :onscreen, which calculates screen presence
/// based on getBoundingClientRect() and the full page scroll.
$.extend(
    $.expr[':'],
    {
        /// check that an element is actually visible on the screen
        'onscreen': function (el, indx, args) {
            var $el, ov, r1, r2;
            r1 = el.getBoundingClientRect();
            el = el.parentNode;
            $el = $(el);
            /// this should loop back all the way to <body>, ignoring <html>
            do {
                /// handle different states of overflow
                ov = $el.css('overflow') || $el.css('overflow-x') + ':' + $el.css('overflow-y');
                /// special overflow for body
                if ( $el.is('body') ) { ov = 'body'; }
                /// if our parent acts as a rectangular mask, intersect the rects
                switch ( ov ) {
                    case 'hidden':
                    case 'scroll':
                    case 'scroll:hidden':
                    case 'hidden:scroll':
                        r1 = intersect(r1, el.getBoundingClientRect());
                        break;
                    case 'body':
                        r1 = intersect(r1, scrollrect(el.getBoundingClientRect()));
                        break;
                }
                if ( r1.width <= 0 || r1.height <= 0 ) {
                    return false;
                }
            } while ((el = el.parentNode) && el.parentNode && ($el[0] = el));
            return true;
        }
    }
);