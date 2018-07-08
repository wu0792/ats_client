chrome.devtools.network.onRequestFinished.addListener(
    function (request) {
        let str = JSON.stringify(Array.from(arguments))
        // chrome.devtools.inspectedWindow.eval(`console.log(${str})`);

        request.getContent(function (content) {
            console.log(request)
            console.log(content)
            // console.log(`request:${JSON.stringify(request)},content:${content}`)

            // chrome.devtools.inspectedWindow.eval(`console.log('${encodeURIComponent(content)}')`, function (result, isException) {
            //     if (isException)
            //         console.log("the page is not using jQuery");
            //     else
            //         console.log("The page is using jQuery v" + result);
            // });
        })

        // if (request.response.bodySize > 1 * 1024) {
        //     chrome.devtools.inspectedWindow.eval(
        //         'console.log("Large image: " + unescape("' +
        //         escape(request.request.url) + '"))');
        // }
    });

// document.addEventListener('DOMContentLoaded', function () {
//     document.querySelector('#view').addEventListener('click', function () {
//         chrome.devtools.network.getHAR(function (har) {
//             let str = JSON.stringify(Array.from(arguments))
//             chrome.devtools.inspectedWindow.eval(`console.log(${str})`);
//         })
//     })
// })


// const networkSpy = `
// var open = window.XMLHttpRequest.prototype.open,
// send = window.XMLHttpRequest.prototype.send,
// onReadyStateChange;

// function openReplacement(method, url, async, user, password) {
// var syncMode = async !== false ? 'async' : 'sync';
// console.warn(
//     'Preparing ' +
//     syncMode +
//     ' HTTP request : ' +
//     method +
//     ' ' +
//     url
// );
// return open.apply(this, arguments);
// }

// function sendReplacement(data) {
// console.warn('Sending HTTP request data : ', data);

// if (this.onreadystatechange) {
//     this._onreadystatechange = this.onreadystatechange;
// }
// this.onreadystatechange = onReadyStateChangeReplacement;

// return send.apply(this, arguments);
// }

// function onReadyStateChangeReplacement() {
// console.warn('HTTP request ready state changed : ' + this.readyState);
// if (this._onreadystatechange) {
//     return this._onreadystatechange.apply(this, arguments);
// }
// }

// window.XMLHttpRequest.prototype.open = openReplacement;
// window.XMLHttpRequest.prototype.send = sendReplacement;`

// chrome.devtools.inspectedWindow.eval(networkSpy, function (result, isException) {
//     if (isException)
//         console.log("the page is not using jQuery");
//     else
//         console.log("The page is using jQuery v" + result);
// });