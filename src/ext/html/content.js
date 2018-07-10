function watchDomMutations() {
    var connection = chrome.runtime.connect({
        name: "ats_watch_dom_mutation"
    })

    var mutationObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            var a = 1
            connection.postMessage({ tabId: 123, type: 'add', selector: '#abc' })
        });
    })

    mutationObserver.observe(document.documentElement, {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true,
        attributeOldValue: true,
        characterDataOldValue: true
    })
}

function watchUserActivities() {
    var connection = chrome.runtime.connect({
        name: "ats_watch_user_activities"
    })

    document.addEventListener('keydown', function (ev) {
        /*
            ev.target:      <input id=​"kw" name=​"wd" class=​"s_ipt" value maxlength=​"255" autocomplete=​"off">​
            ev.keyCode:     96
            ev.ctrlKey:     false
            ev.shiftKey:    false
        */

        const { target, keyCode, ctrlKey, shiftKey } = ev
        connection.postMessage({ tabId: 123, target: '#div1', keyCode, ctrlKey, shiftKey })
    })
}

document.addEventListener('DOMContentLoaded', function () {
    watchDomMutations()
    watchUserActivities()
})

