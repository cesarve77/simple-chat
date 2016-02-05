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