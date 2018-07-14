import * as CONNECT_ID from './consts'

let logRoot = null,
    errorRoot = null

function createDiv(text, className) {
    let div = document.createElement('div')
    div.innerText = `${new Date()}:${text}`
    className && div.setAttribute('class', className)

    return div
}

function appendLog(log) {
    logRoot && logRoot.appendChild(createDiv(log))
}

function appendError(error) {
    errorRoot && errorRoot.appendChild(createDiv(error))
}

document.addEventListener('DOMContentLoaded', function () {
    logRoot = document.getElementById('logRoot')
    errorRoot = document.getElementById('errorRoot')

    let isRuning = false,
        tabId = chrome.devtools.inspectedWindow.tabId

    const btnStart = document.getElementById('btnStart'),
        btnStop = document.getElementById('btnStop')

    let
        //notify init background and content
        connectionWatchPanel = null,
        stopNetworkRequestFinishedListen = null
    // connectionInitContent = null,
    //notify unlink background and content
    // connectionStopBackground = null
    // connectionStopContent = null


    btnStart.addEventListener('click', (ev) => {
        if (isRuning) {
            return
        }

        btnStart.disabled = true
        btnStop.disabled = false
        isRuning = true

        connectionWatchPanel = chrome.runtime.connect({ name: CONNECT_ID.CONNECT_ID_WATCH_PANEL })

        chrome.tabs.sendMessage(tabId, { name: CONNECT_ID.CONNECT_ID_WATCH_PANEL, action: 'start' }, () => {
            appendLog('开始监听...')

            connectionWatchPanel.postMessage({ action: 'init', tabId })
            watchNetwork()
        })
    })

    function watchNetwork() {
        if (connectionWatchPanel) {
            appendLog('开始网络监听')
            stopNetworkRequestFinishedListen = false
            chrome.devtools.network.onRequestFinished.addListener(
                function (request) {
                    if (!stopNetworkRequestFinishedListen) {
                        request.getContent(function (content) {
                            const { request: innerRequest, startedDateTime: date } = request,
                                { url, postData, method } = innerRequest,
                                body = content

                            connectionWatchPanel.postMessage({ action: 'listen', url, method, body, postData, date })
                        })
                    }
                })
        } else {
            appendError('connectionWatchPanel为空，不能启动监听网络，可能尚未启动初始化')
        }
    }

    function stopWatchNetwork() {
        if (!stopNetworkRequestFinishedListen) {
            appendLog('停止网络监听')
            stopNetworkRequestFinishedListen = true
        } else {
            appendError('无法停止监听网络，因为当前不是监听状态')
        }
    }

    btnStop.addEventListener('click', (ev) => {
        if (!isRuning) {
            return
        }

        btnStart.disabled = false
        btnStop.disabled = true
        isRuning = false

        stopWatchNetwork()
        connectionWatchPanel && connectionWatchPanel.postMessage({ action: 'stop' })
        chrome.tabs.sendMessage(tabId, { action: 'stop', name: CONNECT_ID.CONNECT_ID_WATCH_PANEL }, () => {
            appendLog('停止监听...')
        })
    })
})