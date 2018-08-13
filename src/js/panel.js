import * as CONSTS from './consts'
import { SaveFile } from './saveFile'
import { system } from './system'
import { getNowString } from '../common'
import { EntryFormater } from './entryFormater';

let isRuning = false,
    hasRegWatchNetwork = false,
    records = null,
    targetSelectors = null,
    changedMap = {}

let connectionToBackground = chrome.runtime.connect({ name: CONSTS.CONNECT_ID_INIT_PANEL }),
    connectionToContent = null,
    stopNetworkRequestFinishedListen = null

const tabId = chrome.devtools.inspectedWindow.tabId

function getTargetSelectors() {
    if (targetSelectors) {
        const targetSelectorValue = (targetSelectors.value || '').trim()
        return targetSelectorValue.split('\n').map(val => val.trim()).filter(val => val)
    } else {
        return null
    }
}

function createEntryEl(id, type, html, className) {
    let entry = document.createElement(type)
    id && entry.setAttribute('id', id)
    entry.innerHTML = html
    className && entry.setAttribute('class', className)

    return entry
}

function getCheckboxHtml() {
    return `<input type='checkbox' checked />`
}

function appendRecord(type, record) {
    let recordEntry = document.createElement('div'),
        id = records.children.length

    recordEntry.className = 'summary'
    recordEntry.setAttribute('record_type', type)
    recordEntry.setAttribute('id', id)
    let recordSummary = createEntryEl(id + '', 'li', `${getCheckboxHtml()}${getNowString()}${type.value.renderSummary(record)}`)
    recordEntry.appendChild(recordSummary)
    let checkbox = recordSummary.querySelector('input[type="checkbox"]')
    if (checkbox) {
        checkbox.addEventListener('click', ev => ev.stopPropagation())
    }

    recordSummary.addEventListener('click', function (ev) {
        if (isRuning) {
            return
        }

        const theEntry = ev.currentTarget.parentElement,
            classList = Array.from(theEntry.classList),
            expandClassIndex = classList.indexOf('expand'),
            isExpand = expandClassIndex >= 0

        if (isExpand) {
            classList.splice(expandClassIndex, 1)
            let existingDetail = theEntry.querySelector('.detail')
            if (existingDetail) {
                theEntry.removeChild(existingDetail)
            }
        } else {
            let detailHtml = type.value.renderDetail(id, record),
                parser = new DOMParser(),
                detailEl = parser.parseFromString(detailHtml, 'text/html').body.firstChild

            detailEl.addEventListener('change', (ev) => {
                let getParentUntilRecordEntry = (el) => {
                    const parentEl = el.parentElement
                    if (parentEl) {
                        let theRecordType = parentEl.getAttribute('record_type')
                        if (theRecordType) {
                            return parentEl
                        } else {
                            return getParentUntilRecordEntry(parentEl)
                        }
                    } else {
                        return null
                    }
                }

                let recordTypeEl = getParentUntilRecordEntry(ev.target)
                if (recordTypeEl) {
                    const target = ev.target,
                        field = ev.target.getAttribute('entry_field'),
                        rawValue = target.value.trim(),
                        fieldFormatFunc = ev.target.getAttribute('entry_format'),
                        finalValue = fieldFormatFunc ? EntryFormater[fieldFormatFunc](rawValue) : rawValue,
                        id = recordTypeEl.id

                    changedMap[id] = Object.assign({}, changedMap[id], { id, [field]: finalValue })
                } else {
                    console.warn('not fuound parent element has record_type attribute.')
                }
            }, true)

            theEntry.appendChild(detailEl)
            classList.push('expand')
        }

        theEntry.className = classList.join(' ')
    })

    records && records.appendChild(recordEntry)
}

function doConnectToContent(url) {
    if (!connectionToContent) {
        connectionToContent = chrome.tabs.connect(tabId, { name: CONSTS.CONNECT_ID_INIT_PANEL })
    }

    connectionToContent.postMessage({ action: 'init', tabId, url, rootTargetSelectors: getTargetSelectors() })
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
    records = document.getElementById('records')
    targetSelectors = document.getElementById('targetSelectors')

    const btnStart = document.getElementById('btnStart'),
        btnStop = document.getElementById('btnStop'),
        btnSave = document.getElementById('btnSave')

    targetSelectors.addEventListener('change', ev => {
        const targetSelectors = getTargetSelectors(),
            markerClassName = '__ats__target__'

        chrome.tabs.executeScript(tabId, {
            code: `Array.from(document.querySelectorAll('.${markerClassName}')).forEach(el => el.remove())`
        })

        targetSelectors.forEach(selector => {
            selector = selector.trim()
            if (!selector) {
                return
            }

            chrome.tabs.executeScript(tabId, {
                code: `{
            let invalidSelectors = []
            const theTargetList = Array.from(document.querySelectorAll('${selector}'))

            if (theTargetList.length) {
                theTargetList.forEach(theTarget => {
                    const rect = theTarget.getBoundingClientRect()
                    let div = document.createElement('div')
                    div.style.position = 'absolute'
                    div.style.border = 'dashed 1px red'
                    div.style.top = rect.top + 'px'
                    div.style.left = rect.left + 'px'
                    div.style.width = rect.width + 'px'
                    div.style.height = rect.height + 'px'
                    div.style.opacity = '.3'
                    div.style.backgroundColor = 'wheat'
                    div.style.zIndex = '100000'
                    div.className = '${markerClassName}'
    
                    document.body.appendChild(div)
                })
            } else {
                invalidSelectors.push(selector)
            }
            
            if(invalidSelectors.length){
                alert('invalid selectors: ' + invalidSelectors.join(','))
            }
        }` })
        })
    })

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
        let { action, data } = request
        switch (action) {
            case 'start':
                btnStart.disabled = true
                btnStop.disabled = false
                btnSave.disabled = true
                isRuning = true

                watchNetwork()
                break
            case 'dump':
                const now = new Date()

                var checkedIds = Array.from(records.querySelectorAll('#records .summary input[type="checkbox"]')).filter(checkbox => checkbox.checked).map(checkbox => {
                    return +checkbox.parentElement.getAttribute('id')
                })

                //choose checked items to export
                data = Object.keys(data).reduce((prev, next) => {
                    prev[next] = data[next].filter(entry => {
                        return checkedIds.indexOf(entry.id) >= 0
                    })

                    return prev
                }, {})

                //modify the user changed entries
                Object.keys(data).forEach(actionType => {
                    data[actionType].forEach(entry => {
                        const id = entry.id
                        if (changedMap[id]) {
                            Object.assign(entry, changedMap[id])
                        }
                    })
                })

                SaveFile.saveJson({
                    id: +now,
                    version: system.version,
                    rootTargets: getTargetSelectors(),
                    createAt: `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
                    data
                }, document, `ats_data.json`)
                break
            default:
                break
        }
    })

    function watchNetwork() {
        if (connectionToBackground) {
            stopNetworkRequestFinishedListen = false
            !hasRegWatchNetwork && chrome.devtools.network.onRequestFinished.addListener(
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
                                appendRecord(CONSTS.ACTION_TYPES.NETWORK, { url, method, body, form, status })
                            })
                        }
                    }
                })

            hasRegWatchNetwork = true
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

        isRuning = true
        records.className = 'recording'
        records.innerHTML = ''
        changedMap = {}

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

        records.className = 'stop'

        stopWatchNetwork()

        connectionToBackground && connectionToBackground.postMessage({ action: 'stop' })
        connectionToContent && connectionToContent.postMessage({ action: 'stop' })
    })

    btnSave.addEventListener('click', (ev) => {
        if (isRuning) {
            return
        }

        connectionToBackground && connectionToBackground.postMessage({ action: 'save' })
        connectionToContent && connectionToContent.postMessage({ action: 'save' })
    })
})