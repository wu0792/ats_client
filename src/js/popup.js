'use strict';
function click(e) {
    chrome.tabs.executeScript(null,
        { code: "document.body.style.backgroundColor='" + e.target.id + "'" });
    window.close();
}

// chrome.runtime.sendMessage(string extensionId, any message, object options, function responseCallback)

// chrome.runtime.sendMessage(string extensionId, any message, object options, function responseCallback)

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#reload').addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs.length) {
                var activeTab = tabs[0]

                chrome.tabs.sendMessage(activeTab.id, { getActiveTab: true, tabId: activeTab.id, url: activeTab.url }, function (response) {
                    // chrome.webRequest.onBeforeRequest.addListener(function (detail) {
                    //     console.log(`onBeforeRequest: ${JSON.stringify(detail)}`)
                    // }, {
                    //         urls: ["http://*/*", "https://*/*"]
                    //     })

                    // chrome.webRequest.onCompleted.addListener(function () {
                    //     alert(`onCompleted arguements: ${JSON.stringify(Array.from(arguments))}`)
                    // }, {
                    //         urls: ["http://*/*", "https://*/*"]
                    //     })



                    chrome.webNavigation.onCompleted.addListener(function () {
                        // chrome.tabs.executeScript(activeTab.id, {
                        //     code: `window.abc = 321;window.def=444;window.location.href;`
                        // }, function (result) {
                        //     var a = 1
                        // });
                    })

                    chrome.tabs.executeScript({
                        code: 'document.body.style.backgroundColor="orange"'
                    });

                    chrome.tabs.executeScript(activeTab.id, {
                        code: `window.abc = 321;window.def=444;window.location.href;`
                    }, function (result) {
                        var a = 1
                    });

                    return
                    chrome.tabs.reload(activeTab.id, { bypassCache: false }, function () {
                        // chrome.tabs.executeScript(activeTab.id, {
                        //     code: `window.abc = 321`
                        // });
                        // alert('ok')

                        var js = `
var open = window.XMLHttpRequest.prototype.open,
send = window.XMLHttpRequest.prototype.send,
onReadyStateChange;

function openReplacement(method, url, async, user, password) {
var syncMode = async !== false ? 'async' : 'sync';
console.warn(
    'Preparing ' +
    syncMode +
    ' HTTP request : ' +
    method +
    ' ' +
    url
);
return open.apply(this, arguments);
}

function sendReplacement(data) {
console.warn('Sending HTTP request data : ', data);

if (this.onreadystatechange) {
    this._onreadystatechange = this.onreadystatechange;
}
this.onreadystatechange = onReadyStateChangeReplacement;

return send.apply(this, arguments);
}

function onReadyStateChangeReplacement() {
console.warn('HTTP request ready state changed : ' + this.readyState);
if (this._onreadystatechange) {
    return this._onreadystatechange.apply(this, arguments);
}
}

window.XMLHttpRequest.prototype.open = openReplacement;
window.XMLHttpRequest.prototype.send = sendReplacement;`
                    })
                });


            }
        })
    })
});