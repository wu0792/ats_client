import * as CONSTS from './consts'

let logs = null,
    errors = null,
    records = null

function createDiv(text, className) {
    let div = document.createElement('div')
    div.innerText = `${new Date()}:${text}`
    className && div.setAttribute('class', className)

    return div
}

function appendLog(log) {
    logs && logs.appendChild(createDiv(log))
}

function appendError(error) {
    errors && errors.appendChild(createDiv(error))
}

function appendRecord(type, record) {
    records && records.appendChild(createDiv(`【${records.children.length}】: [${type.value.renderTitle(record)}]`))
}

document.addEventListener('DOMContentLoaded', function () {
    logs = document.getElementById('logs')
    errors = document.getElementById('errors')
    records = document.getElementById('records')

    let isRuning = false,
        tabId = chrome.devtools.inspectedWindow.tabId

    const btnStart = document.getElementById('btnStart'),
        btnStop = document.getElementById('btnStop')

    let connectionRuntimeWatchPanel = null,
        connectionTabsWatchPanel = null,
        stopNetworkRequestFinishedListen = null

    btnStart.addEventListener('click', (ev) => {
        if (isRuning) {
            return
        }

        btnStart.disabled = true
        btnStop.disabled = false
        isRuning = true

        if (!connectionRuntimeWatchPanel) {
            connectionRuntimeWatchPanel = chrome.runtime.connect({ name: CONSTS.CONNECT_ID_INIT_PANEL })
        }

        if (!connectionTabsWatchPanel) {
            connectionTabsWatchPanel = chrome.tabs.connect(tabId, { name: CONSTS.CONNECT_ID_INIT_PANEL })
        }

        connectionRuntimeWatchPanel.postMessage({ action: 'init', tabId })
        connectionTabsWatchPanel.postMessage({ action: 'init', tabId })

        watchNetwork()

        connectionTabsWatchPanel.onMessage.addListener(function (request) {
            switch (request.action) {
                case CONSTS.ACTION_TYPES.DOM_MUTATION.key:
                    appendRecord(CONSTS.ACTION_TYPES.DOM_MUTATION, request)
                    break
                case CONSTS.ACTION_TYPES.USER_ACTIVITY.key:
                    appendRecord(CONSTS.ACTION_TYPES.USER_ACTIVITY, request)
                    break
                default:
                    break
            }
        })

        // chrome.runtime.onMessage.addListener(function (request) {
        //     switch (request.name) {
        //         case CONSTS.CONNECT_ID_WATCH_DOM_MUTATION:
        //             appendRecord(CONSTS.ACTION_TYPES.DOM_MUTATION, request.message)
        //             break
        //         case CONSTS.CONNECT_ID_WATCH_USER_ACTIVITY:
        //             appendRecord(CONSTS.ACTION_TYPES.USER_ACTIVITY, request.message)
        //             break
        //     }
        // })
    })

    function watchNetwork() {
        if (connectionRuntimeWatchPanel) {
            appendLog('开始网络监听')
            stopNetworkRequestFinishedListen = false
            chrome.devtools.network.onRequestFinished.addListener(
                function (request) {
                    //启用状态才需要继续
                    if (!stopNetworkRequestFinishedListen) {
                        request.getContent(function (content) {
                            const { request: innerRequest, startedDateTime: date } = request,
                                { url, postData, method } = innerRequest,
                                body = content

                            connectionRuntimeWatchPanel.postMessage({ action: 'listen', url, method, body, postData, date })
                            appendRecord(CONSTS.ACTION_TYPES.NETWORK, { url, method, body, postData, date })
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

        connectionRuntimeWatchPanel && connectionRuntimeWatchPanel.postMessage({ action: 'stop' })
        connectionTabsWatchPanel && connectionTabsWatchPanel.postMessage({ action: 'stop' })

        appendLog('停止监听...')
    })
})