chrome.devtools.network.onRequestFinished.addListener(
    function (request) {
        request.getContent(function (content) {
            let url = request.request.url,
                method = request.request.method,
                body = content

            console.log({ url, method, body })
        })
    })