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

                chrome.runtime.sendMessage({ getActiveTab: true, tabId: activeTab.id }, function (response) {
                    // alert(`response:${JSON.stringify(response)}`)
                    // console.log(response);
                });
            }
        })
    })
});