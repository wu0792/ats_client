//notify background
var connection = chrome.runtime.connect({
    name: "ats_devtools"
})

chrome.devtools.network.onRequestFinished.addListener(
    function (request) {
        request.getContent(function (content) {
            const { request: innerRequest, startedDateTime: date } = request,
                { url, postData, method } = innerRequest,
                body = content,
                tabId = chrome.devtools.inspectedWindow.tabId

            connection.postMessage({ type: 'network.request', url, method, body, postData, date, tabId })
        })
    })