import * as CONSTS from './consts'
import { SaveFile } from './saveFile'
import { system } from './system';

let logs = null,
    errors = null,
    records = null

let connectionToBackground = chrome.runtime.connect({ name: CONSTS.CONNECT_ID_INIT_PANEL }),
    connectionToContent = null,
    stopNetworkRequestFinishedListen = null

const tabId = chrome.devtools.inspectedWindow.tabId

function createDiv(text, className) {
    let div = document.createElement('div')
    div.innerText = `${new Date()}:${text}`
    className && div.setAttribute('class', className)

    return div
}

function appendLog(log) {
    logs && logs.appendChild(createDiv(log))
}

function clearLogs() {
    if (logs) {
        logs.innerHTML = ''
    }
}

function appendError(error) {
    errors && errors.appendChild(createDiv(error))
}

function appendRecord(type, record) {
    // records && records.appendChild(createDiv(`【${records.children.length}】: [${type.value.renderTitle(record)}]`))
    records && records.appendChild(createDiv(`【${records.children.length}】: [${type.key}]`))
}

function doConnectToContent(url) {
    if (!connectionToContent) {
        connectionToContent = chrome.tabs.connect(tabId, { name: CONSTS.CONNECT_ID_INIT_PANEL })
    }

    connectionToContent.postMessage({ action: 'init', tabId, url })
    connectionToContent.onDisconnect.addListener(function () {
        connectionToContent = null
        doConnectToContent(url)
    })

    connectionToContent.onMessage.addListener(function (request) {
        const theActionEnum = CONSTS.ACTION_TYPES.get(request.action)
        if (theActionEnum) {
            appendRecord(theActionEnum, request)
        }
    })
}

document.addEventListener('DOMContentLoaded', function () {
    logs = document.getElementById('logs')
    errors = document.getElementById('errors')
    records = document.getElementById('records')

    let isRuning = false

    const btnStart = document.getElementById('btnStart'),
        btnStop = document.getElementById('btnStop'),
        btnClear = document.getElementById('btnClear'),
        btnSave = document.getElementById('btnSave')

    btnClear.addEventListener('click', () => records.innerHTML = '')

    connectionToBackground.onDisconnect.addListener(function () {
        connectionToBackground = null
    })

    chrome.webNavigation.onCommitted.addListener((ev) => {
        const { tabId: currentTabId, url, frameId, timeStamp } = ev

        // frameId 表示当前page中frame的ID，0表示window.top对应frame，正数表示其余subFrame
        if (isRuning && currentTabId === tabId && frameId === 0) {
            doConnectToContent(url)
            connectionToBackground.postMessage({ action: CONSTS.ACTION_TYPES.NAVIGATE.key, url })
            appendRecord(CONSTS.ACTION_TYPES.NAVIGATE, { url })
        }
    })

    connectionToBackground.onMessage.addListener(function (request) {
        const { action, data } = request
        switch (action) {
            case 'start':
                btnStart.disabled = true
                btnStop.disabled = false
                btnSave.disabled = true
                isRuning = true

                clearLogs()
                watchNetwork()
                break
            case 'dump':
                const now = new Date()
                SaveFile.saveJson({
                    id: +now,
                    version: system.version,
                    create_at: now.toISOString(),
                    data
                }, document, `ats_data.json`)
                break
            default:
                break
        }
    })

    function watchNetwork() {
        if (connectionToBackground) {
            appendLog('开始网络监听')
            stopNetworkRequestFinishedListen = false
            chrome.devtools.network.onRequestFinished.addListener(
                function (request) {
                    //启用状态才需要继续
                    if (!stopNetworkRequestFinishedListen) {
                        //skip the images
                        if (request.response && request.response.content && request.response.content.mimeType && request.response.content.mimeType.match(/^image\//i)) {
                            return
                        } else {
                            request.getContent(function (content) {
                                const { request: innerRequest, response } = request,
                                    toRecordHeaderTypes = ['Access-Control-Allow-Credentials', 'Content-Type', 'Access-Control-Allow-Origin', 'Content-Security-Policy'],
                                    { url, postData: form, method } = innerRequest,
                                    status = response.status,
                                    headers = response.headers || [],
                                    body = content

                                let finalHeadersIsValid = false,
                                    finalHeaders = {}

                                toRecordHeaderTypes.forEach(headerType => {
                                    let matchedHeader = headers.find(header => (header.name || '').toLowerCase() === headerType.toLocaleLowerCase())

                                    if (matchedHeader) {
                                        finalHeadersIsValid = true
                                        finalHeaders = Object.assign({}, finalHeaders, { [headerType]: headerType === 'Content-Type' ? matchedHeader.value.replace(/\bcharset=([\w\-]+)\b/ig, 'charset=utf-8') : matchedHeader.value })
                                    }
                                })

                                connectionToBackground.postMessage({ action: CONSTS.ACTION_TYPES.NETWORK.key, url, status, method, body, form, header: (finalHeadersIsValid ? finalHeaders : null) })
                                appendRecord(CONSTS.ACTION_TYPES.NETWORK, { url, method, body, form })
                            })
                        }
                    }
                })
        } else {
            appendError('connectionWatchPanel为空，不能启动监听网络，可能尚未启动初始化')
        }
    }

    function stopWatchNetwork() {
        if (!stopNetworkRequestFinishedListen) {
            stopNetworkRequestFinishedListen = true
        }
    }

    btnStart.addEventListener('click', (ev) => {
        if (isRuning) {
            return
        }

        connectionToBackground.postMessage({ action: 'init', tabId })
    })

    btnStop.addEventListener('click', (ev) => {
        if (!isRuning) {
            return
        }

        btnStart.disabled = false
        btnStop.disabled = true
        btnSave.disabled = false
        isRuning = false

        stopWatchNetwork()

        connectionToBackground && connectionToBackground.postMessage({ action: 'stop' })
        connectionToContent && connectionToContent.postMessage({ action: 'stop' })

        appendLog('停止监听...')
    })

    btnSave.addEventListener('click', (ev) => {
        if (isRuning) {
            return
        }

        connectionToBackground && connectionToBackground.postMessage({ action: 'save' })
        connectionToContent && connectionToContent.postMessage({ action: 'save' })
    })
})