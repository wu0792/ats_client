function addToWatch() {
    var mutationObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            chrome.runtime.sendMessage({ ats_domMutation: true })
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

document.addEventListener('DOMContentLoaded', function () {
    addToWatch()
})

