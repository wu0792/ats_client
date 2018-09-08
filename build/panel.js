/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./node_modules/enum/index.js
var node_modules_enum = __webpack_require__(2);
var enum_default = /*#__PURE__*/__webpack_require__.n(node_modules_enum);

// CONCATENATED MODULE: ./src/js/isElementVisible.js
const isElementVisible = (elem) => {
    if (!elem || elem.offsetParent === null) {
        return false
    } else {
        let anyOffset = !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length)
        if (!anyOffset) {
            return false
        } else {
            const style = window.getComputedStyle(elem)
            return style.display !== 'none' && style.visibility !== 'hidden'
        }
    }
}
// CONCATENATED MODULE: ./src/js/isElChildOf.js
const isElChildOf = (el, parentEl) => {
    return el === parentEl || (el.parentElement && isElChildOf(el.parentElement, parentEl))
}
// CONCATENATED MODULE: ./src/js/consts.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return CONNECT_ID_INIT_PANEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return CONNECT_ID_INIT_CONTENT; });
/* unused harmony export CONNECT_ID_WATCH_DOM_MUTATION */
/* unused harmony export CONNECT_ID_WATCH_USER_ACTIVITY */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return LISTEN_IN_CONTENT_PHASE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ACTION_TYPES; });




const { getSelector } = __webpack_require__(6)

const CONNECT_ID_INIT_PANEL = 'CONNECT_ID_INIT_PANEL'
const CONNECT_ID_INIT_CONTENT = 'CONNECT_ID_INIT_CONTENT'
const CONNECT_ID_WATCH_DOM_MUTATION = 'CONNECT_ID_WATCH_DOM_MUTATION'
const CONNECT_ID_WATCH_USER_ACTIVITY = 'CONNECT_ID_WATCH_USER_ACTIVITY'

let lastScrollDate = null,
    lastResizeDate = null

const COMMON_THRESHOLD = 500
const buttonTip = `title='0：左键；1：右键；2：滚轮键'`

/**
 * at which phase should the action type be listen:
 * INIT:  after we start the capture
 * RECORD: after we start record, generally it's dom mutation
 * NEVER: never be listened in content js
 */
const LISTEN_IN_CONTENT_PHASE = {
    INIT: 0,
    RECORD: 1,
    NEVER: 2
}

const ACTION_TYPES = new enum_default.a({
    NETWORK: {
        listenInContentPhase: LISTEN_IN_CONTENT_PHASE.NEVER,
        renderTitle: (record) => {
            return `network: ${JSON.stringify(record)}`
        },
        renderSummary: (record) => {
            return `<span class='icon network' title='[network]网络请求'></span><div class='entry network'>${record.url}</div>`
        },
        renderDetail: (id, record) => {
            return `<div class='detail'>
                        <div class='item'>
                        <div class='title'>ID：</div>
                        <div class='value'>${id}</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TYPE：</div>
                        <div class='value'>[network]网络请求</div>
                        </div>
                        <div class='item'>
                        <div class='title'>URL：</div>
                        <div class='value'>${record.url}</div>
                        </div>
                        <div class='item'>
                        <div class='title'>METHOD：</div>
                        <div class='value'>${record.method}</div>
                        </div>
                        <div class='item'>
                        <div class='title'>STATUS：</div>
                        <div class='value'>${record.status}</div>
                        </div>
                        <div class='item'>
                        <div class='title'>BODY：</div>
                        <div class='value'>
                            <textarea entry_field='body'>${record.body}</textarea>
                        </div>
                        </div>
                        ${record.redirectUrl ? '' +
                    "<div class='item'>" +
                    "   <div class='title'>REDIRECT URL：</div>" +
                    "   <div class='value'>" +
                    "       <textarea entry_field='body'>" + record.redirectUrl + "</textarea>" +
                    "   </div>" +
                    "</div>"
                    : ''}
                    </div>`
        },
        wrapMessage: (msg) => {
            const { url, method, body, form, status, header, redirectUrl } = msg
            return { url, method, body, form, status, header, redirectUrl }
        }
    },
    NAVIGATE: {
        listenInContentPhase: LISTEN_IN_CONTENT_PHASE.NEVER,
        renderTitle: (record) => {
            const { url } = record

            return `页面跳转: url:${url}`
        },
        renderSummary: (record) => {
            return `<span class='icon navigate' title='[navigate]页面跳转'></span><div class='entry navigate'>${record.url}</div>`
        },
        renderDetail: (id, record) => {
            return `<div class='detail'>
                        <div class='item'>
                        <div class='title'>ID：</div>
                        <div class='value'>${id}</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TYPE：</div>
                        <div class='value'>[navigate]页面跳转</div>
                        </div>
                        <div class='item'>
                        <div class='title'>URL：</div>
                        <div class='value'>${record.url}</div>
                        </div>
                        <div class='item'>
                        <div class='title'>FLAG：</div>
                        <div class='value'>
                            <textarea entry_field='flag' placeholder='用来判断是否完成页面加载的选择器，分两类：\n1）加载完成即隐藏某元素，比如加载过程一直有.loading元素，加载完成即消失，可录入 !.loading \n2）加载完成即显示某元素，比如加载完成即显示 .main 元素，可录入 .main'>${record.flag}</textarea>
                        </div>
                        </div>                        
                    </div>`
        },
        wrapMessage: (msg) => {
            const { url, flag } = msg
            return { url, flag }
        }
    },
    MUTATION: {
        listenInContentPhase: LISTEN_IN_CONTENT_PHASE.RECORD,
        renderTitle: (record) => {
            return `dom: ${JSON.stringify(record)}`
        },
        renderSummary: (record) => {
            return `<span class='icon mutation' title='[mutation]页面DOM元素变化'></span><div class='entry mutation'>${record.target}</div>`
        },
        renderDetail: (id, record) => {
            return `<div class='detail'>
                        <div class='item'>
                        <div class='title'>ID：</div>
                        <div class='value'>${id}</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TYPE：</div>
                        <div class='value'>[mutation]页面DOM元素变化</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TYPE：</div>
                        <div class='value'>${record.type}</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TARGET：</div>
                        <div class='value'>
                            <textarea entry_field='target' entry_format='splitByLine'>${record.target.join('|')}</textarea>
                        </div>
                        </div>
                    </div>`
        },
        wrapMessage: (msg) => {
            const { type, target } = msg
            return { type, target }
        },
        listen: (theDocument, ports, rootTargetSelectors) => {
            const notifyPorts = (targetSelector, mutation) => {
                const message = {
                    action: ACTION_TYPES.MUTATION.key,
                    type: mutation.type,
                    target: targetSelector,
                    added: mutation.addedNodes,
                    attribute: mutation.attributeName,
                    removed: mutation.removedNodes
                }

                ports.forEach(port => port.postMessage(message))
            }

            const mutationObserver = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    let target = mutation.target

                    //record #text's parentElement
                    while (target.nodeName === '#text' && target.parentElement) {
                        target = target.parentElement
                    }

                    let el = target,
                        valid = true
                    while (el !== null) {
                        // skip the unnecessary record
                        if (['HEAD'].indexOf(el.nodeName) >= 0) {
                            valid = false
                            break
                        }

                        el = el.parentElement
                    }

                    if (valid === false) {
                        return
                    }

                    const isVisible = isElementVisible(target)
                    if (!isVisible) {
                        return
                    }

                    if (rootTargetSelectors && rootTargetSelectors.length) {
                        let isInRootTargets = false

                        rootTargetSelectors.forEach(rootTargetSelector => {
                            let rootTargets = Array.from(theDocument.querySelectorAll(rootTargetSelector))
                            if (rootTargets.some(rootTarget => isElChildOf(target, rootTarget))) {
                                isInRootTargets = true
                                return false
                            }
                        })

                        if (!isInRootTargets) {
                            return
                        }
                    }

                    const targetSelector = getSelector(target, theDocument)

                    if (targetSelector) {
                        notifyPorts(targetSelector, mutation)
                    }
                })
            })

            mutationObserver.observe(theDocument.documentElement, {
                attributes: true,
                characterData: true,
                childList: true,
                subtree: true,
                attributeOldValue: true,
                characterDataOldValue: true
            })

            return mutationObserver
        },
        stopListen: (_theDocument, mutationObserver) => {
            mutationObserver.disconnect()
        }
    },
    CHANGE: {
        listenInContentPhase: LISTEN_IN_CONTENT_PHASE.RECORD,
        renderTitle: (record) => {
            return `change: ${JSON.stringify(record)}`
        },
        renderSummary: (record) => {
            return `<span class='icon change' title='[change]内容改变'></span><div class='entry change'>${record.target}</div>`
        },
        renderDetail: (id, record) => {
            return `<div class='detail'>
                        <div class='item'>
                        <div class='title'>ID：</div>
                        <div class='value'>${id}</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TYPE：</div>
                        <div class='value'>[change]文本框/下拉框内容改变</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TARGET：</div>
                        <div class='value'>
                            <textarea entry_field='target' entry_format='splitByLine'>${record.target.join('|')}</textarea>
                        </div>
                        </div>
                        <div class='item'>
                        <div class='title'>VALUE：</div>
                        <div class='value'>
                            <textarea entry_field='value'>${record.value}</textarea>
                        </div>
                        </div>
                    </div>`
        },
        wrapMessage: (msg) => {
            const { target, value } = msg
            return { target, value }
        },
        listen: (theDocument, ports, rootTargetSelectors) => {
            const handler = (ev) => {
                const { target } = ev,
                    targetSelector = getSelector(target, theDocument)

                if (targetSelector) {
                    ports.forEach(port => port.postMessage({
                        action: ACTION_TYPES.CHANGE.key,
                        target: targetSelector,
                        value: target.value
                    }))
                }
            }

            theDocument.addEventListener('change', handler, true)

            return handler
        },
        stopListen: (theDocument, handler) => {
            theDocument.removeEventListener('change', handler, true)
        }
    },
    FOCUS: {
        listenInContentPhase: LISTEN_IN_CONTENT_PHASE.RECORD,
        renderTitle: (record) => {
            return `focus: ${JSON.stringify(record)}`
        },
        wrapMessage: (msg) => {
            const { target } = msg
            return { target }
        },
        renderSummary: (record) => {
            return `<span class='icon focus' title='[focus]元素得到焦点'></span><div class='entry focus'>${record.target}</div>`
        },
        renderDetail: (id, record) => {
            return `<div class='detail'>
                        <div class='item'>
                        <div class='title'>ID：</div>
                        <div class='value'>${id}</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TYPE：</div>
                        <div class='value'>[focus]元素得到焦点</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TARGET：</div>
                        <div class='value'>
                            <textarea entry_field='target' entry_format='splitByLine'>${record.target.join('|')}</textarea>
                        </div>
                        </div>
                    </div>`
        },
        listen: (theDocument, ports, rootTargetSelectors) => {
            const handler = (ev) => {
                const { target } = ev,
                    targetSelector = getSelector(target, theDocument)

                if (targetSelector) {
                    ports.forEach(port => port.postMessage({
                        action: ACTION_TYPES.FOCUS.key,
                        target: targetSelector
                    }))
                }
            }

            theDocument.addEventListener('focus', handler, true)

            return handler
        },
        stopListen: (theDocument, handler) => {
            theDocument.removeEventListener('focus', handler, true)
        }
    },
    BLUR: {
        listenInContentPhase: LISTEN_IN_CONTENT_PHASE.RECORD,
        renderTitle: (record) => {
            return `blur: ${JSON.stringify(record)}`
        },
        wrapMessage: (msg) => {
            const { target } = msg
            return { target }
        },
        renderSummary: (record) => {
            return `<span class='icon blur' title='[blur]元素丢失焦点'></span><div class='entry blur'>${record.target}</div>`
        },
        renderDetail: (id, record) => {
            return `<div class='detail'>
                        <div class='item'>
                        <div class='title'>ID：</div>
                        <div class='value'>${id}</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TYPE：</div>
                        <div class='value'>[blur]元素丢失焦点</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TARGET：</div>
                        <div class='value'>
                            <textarea entry_field='target' entry_format='splitByLine'>${record.target.join('|')}</textarea>
                        </div>
                        </div>
                    </div>`
        },
        listen: (theDocument, ports, rootTargetSelectors) => {
            const handler = (ev) => {
                const { target } = ev,
                    targetSelector = getSelector(target, theDocument)

                if (targetSelector) {
                    ports.forEach(port => port.postMessage({
                        action: ACTION_TYPES.BLUR.key,
                        target: targetSelector
                    }))
                }
            }

            theDocument.addEventListener('blur', handler, true)

            return handler
        },
        stopListen: (theDocument, handler) => {
            theDocument.removeEventListener('blur', handler, true)
        }
    },
    KEYDOWN: {
        listenInContentPhase: LISTEN_IN_CONTENT_PHASE.RECORD,
        renderTitle: (record) => {
            return `keydown: ${JSON.stringify(record)}`
        },
        wrapMessage: (msg) => {
            const { target, code } = msg
            return { target, code }
        },
        renderSummary: (record) => {
            return `<span class='icon keydown' title='[keydown]键盘按下'></span><div class='entry keydown'>${record.target}</div>`
        },
        renderDetail: (id, record) => {
            return `<div class='detail'>
                        <div class='item'>
                        <div class='title'>ID：</div>
                        <div class='value'>${id}</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TYPE：</div>
                        <div class='value'>[keydown]键盘按下</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TARGET：</div>
                        <div class='value'>
                            <textarea entry_field='target'>${record.target.join('|')}</textarea>
                        </div>
                        </div>
                        <div class='item'>
                        <div class='title'>CODE：</div>
                        <div class='value'>
                            <textarea entry_field='code'>${record.code}</textarea>
                        </div>
                        </div>
                    </div>`
        },
        listen: (theDocument, ports, rootTargetSelectors) => {
            const handler = (ev) => {
                const { target, code, repeat } = ev
                if (repeat) {
                    return
                }

                const targetSelector = getSelector(target, theDocument)

                if (targetSelector) {
                    ports.forEach(port => port.postMessage({
                        action: ACTION_TYPES.KEYDOWN.key,
                        target: targetSelector,
                        code
                    }))
                }
            }

            theDocument.addEventListener('keydown', handler, true)

            return handler
        },
        stopListen: (theDocument, handler) => {
            theDocument.removeEventListener('keydown', handler, true)
        }
    },
    KEYUP: {
        listenInContentPhase: LISTEN_IN_CONTENT_PHASE.RECORD,
        renderTitle: (record) => {
            return `keyup: ${JSON.stringify(record)}`
        },
        wrapMessage: (msg) => {
            const { target, code } = msg
            return { target, code }
        },
        renderSummary: (record) => {
            return `<span class='icon keyup' title='[keyup]键盘弹起'></span><div class='entry keyup'>${record.target}</div>`
        },
        renderDetail: (id, record) => {
            return `<div class='detail'>
                        <div class='item'>
                        <div class='title'>ID：</div>
                        <div class='value'>${id}</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TYPE：</div>
                        <div class='value'>[keyup]键盘弹起</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TARGET：</div>
                        <div class='value'>
                            <textarea entry_field='target' entry_format='splitByLine'>${record.target.join('|')}</textarea>
                        </div>
                        </div>
                        <div class='item'>
                        <div class='title'>CODE：</div>
                        <div class='value'>
                            <textarea>${record.code}</textarea>
                        </div>
                        </div>
                    </div>`
        },
        listen: (theDocument, ports, rootTargetSelectors) => {
            const handler = (ev) => {
                const { target, code, repeat } = ev
                if (repeat) {
                    return
                }

                const targetSelector = getSelector(target, theDocument)

                if (targetSelector) {
                    ports.forEach(port => port.postMessage({
                        action: ACTION_TYPES.KEYUP.key,
                        target: targetSelector,
                        code
                    }))
                }
            }

            theDocument.addEventListener('keyup', handler, true)

            return handler
        },
        stopListen: (theDocument, handler) => {
            theDocument.removeEventListener('keyup', handler, true)
        }
    },
    MOUSEDOWN: {
        listenInContentPhase: LISTEN_IN_CONTENT_PHASE.RECORD,
        renderTitle: (record) => {
            return `mousedown: ${JSON.stringify(record)}`
        },
        wrapMessage: (msg) => {
            const { target, button, x, y } = msg
            return { target, button, x, y }
        },
        renderSummary: (record) => {
            return `<span class='icon mousedown' title='[mousedown]鼠标键按下'></span><div class='entry mousedown'>${record.target}</div>`
        },
        renderDetail: (id, record) => {
            return `<div class='detail'>
                        <div class='item'>
                        <div class='title'>ID：</div>
                        <div class='value'>${id}</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TYPE：</div>
                        <div class='value'>[mousedown]鼠标键按下</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TARGET：</div>
                        <div class='value'>
                            <textarea entry_field='target' entry_format='splitByLine'>${record.target.join('|')}</textarea>
                        </div>
                        </div>
                        <div class='item'>
                        <div class='title' ${buttonTip}>BUTTON：</div>
                        <div class='value'>
                            <textarea ${buttonTip} entry_field='button'>${record.button}</textarea>
                        </div>
                        </div>
                    </div>`
        },
        listen: (theDocument, ports, rootTargetSelectors) => {
            const handler = (ev) => {
                const { target, button, pageX: x, pageY: y } = ev
                const targetSelector = getSelector(target, theDocument)

                if (targetSelector) {
                    ports.forEach(port => port.postMessage({
                        action: ACTION_TYPES.MOUSEDOWN.key,
                        target: targetSelector,
                        button,
                        x,
                        y
                    }))
                }
            }

            theDocument.addEventListener('mousedown', handler, true)

            return handler
        },
        stopListen: (theDocument, handler) => {
            theDocument.removeEventListener('mousedown', handler, true)
        }
    },
    MOUSEUP: {
        listenInContentPhase: LISTEN_IN_CONTENT_PHASE.RECORD,
        renderTitle: (record) => {
            return `mouseup: ${JSON.stringify(record)}`
        },
        wrapMessage: (msg) => {
            const { target, button, x, y } = msg
            return { target, button, x, y }
        },
        renderSummary: (record) => {
            return `<span class='icon mouseup' title='[mouseup]鼠标键弹起'></span><div class='entry mouseup'>${record.target}</div>`
        },
        renderDetail: (id, record) => {
            return `<div class='detail'>
                        <div class='item'>
                        <div class='title'>ID：</div>
                        <div class='value'>${id}</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TYPE：</div>
                        <div class='value'>[mouseup]鼠标键弹起</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TARGET：</div>
                        <div class='value'>
                            <textarea entry_field='target' entry_format='splitByLine'>${record.target.join('|')}</textarea>
                        </div>
                        </div>
                        <div class='item'>
                        <div class='title' ${buttonTip}>BUTTON：</div>
                        <div class='value'>
                        <textarea entry_field='button' ${buttonTip}>${record.button}</textarea>
                        </div>
                        </div>
                    </div>`
        },
        listen: (theDocument, ports, rootTargetSelectors) => {
            const handler = (ev) => {
                const { target, button, pageX: x, pageY: y } = ev
                const targetSelector = getSelector(target, theDocument)

                if (targetSelector) {
                    ports.forEach(port => port.postMessage({
                        action: ACTION_TYPES.MOUSEUP.key,
                        target: targetSelector,
                        button,
                        x,
                        y
                    }))
                }
            }

            theDocument.addEventListener('mouseup', handler, true)

            return handler
        },
        stopListen: (theDocument, handler) => {
            theDocument.removeEventListener('mouseup', handler, true)
        }
    },
    MOUSEOVER: {
        listenInContentPhase: LISTEN_IN_CONTENT_PHASE.RECORD,
        renderTitle: (record) => {
            return `mouseover: ${JSON.stringify(record)}`
        },
        wrapMessage: (msg) => {
            const { target, x, y } = msg
            return { target, x, y }
        },
        renderSummary: (record) => {
            return `<span class='icon mouseover' title='[mouseover]鼠标HOVER'></span><div class='entry mouseover'>${record.target}</div>`
        },
        renderDetail: (id, record) => {
            return `<div class='detail'>
                        <div class='item'>
                        <div class='title'>ID：</div>
                        <div class='value'>${id}</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TYPE：</div>
                        <div class='value'>[mouseover]鼠标HOVER</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TARGET：</div>
                        <div class='value'>
                            <textarea entry_field='target' entry_format='splitByLine'>${record.target.join('|')}</textarea>
                        </div>
                        </div>
                    </div>`
        },
        listen: (theDocument, ports, rootTargetSelectors) => {
            const handler = (ev) => {
                const { target, clientX: x, clientY: y } = ev,
                    targetSelector = getSelector(target, theDocument)

                if (targetSelector) {
                    ports.forEach(port => port.postMessage({
                        action: ACTION_TYPES.MOUSEOVER.key,
                        target: targetSelector,
                        x,
                        y
                    }))
                }
            }

            theDocument.addEventListener('mouseover', handler, true)

            return handler
        },
        stopListen: (theDocument, handler) => {
            theDocument.removeEventListener('mouseover', handler, true)
        }
    },
    SCROLL: {
        listenInContentPhase: LISTEN_IN_CONTENT_PHASE.INIT,
        renderTitle: (record) => {
            return `Scroll: ${JSON.stringify(record)}`
        },
        wrapMessage: (msg) => {
            const { x, y } = msg
            return { x, y }
        },
        renderSummary: (record) => {
            return `<span class='icon scroll' title='[scroll]屏幕滚动'></span><div class='entry scroll'>(x: ${record.x}, y:${record.y})</div>`
        },
        renderDetail: (id, record) => {
            return `<div class='detail'>
                        <div class='item'>
                        <div class='title'>ID：</div>
                        <div class='value'>${id}</div>
                        </div>
                        <div class='item'>
                        <div class='title'>TYPE：</div>
                        <div class='value'>[scroll]屏幕滚动</div>
                        </div>
                        <div class='item'>
                        <div class='title'>X：</div>
                        <div class='value'>
                            <textarea entry_field='x'>${record.x}</textarea>
                        </div>
                        </div>
                        <div class='item'>
                        <div class='title'>Y：</div>
                        <div class='value'>
                            <textarea entry_field='y'>${record.y}</textarea>
                        </div>
                        </div>                        
                    </div>`
        },
        listen: (theDocument, ports, rootTargetSelectors) => {
            const handler = (ev) => {
                if (lastScrollDate === null || (new Date() - lastScrollDate) >= COMMON_THRESHOLD) {
                    lastScrollDate = new Date()
                    const message = {
                        action: ACTION_TYPES.SCROLL.key,
                        x: scrollX,
                        y: scrollY
                    }

                    ports.forEach(port => port.postMessage(message))
                }
            }

            theDocument.addEventListener('scroll', handler)

            return handler
        },
        stopListen: (theDocument, handler) => {
            theDocument.removeEventListener('scroll', handler)
        }
    },
    RESIZE: {
        listenInContentPhase: LISTEN_IN_CONTENT_PHASE.INIT,
        renderTitle: (record) => {
            return `Resize: ${JSON.stringify(record)}`
        },
        wrapMessage: (msg) => {
            const { width, height } = msg
            return { width, height }
        },
        renderSummary: (record) => {
            return `<span class='icon resize' title='[resize]屏幕尺寸改变'></span><div class='entry resize'>(width: ${record.width}, height: ${record.height})</div>`
        },
        renderDetail: (id, record) => {
            return `<div class='detail'>
                        <div class='item'>
                        <div class='title'>ID：</div>
                        <div class='value'>${id}</div>     
                        </div>
                        <div class='item'>
                        <div class='title'>TYPE：</div>
                        <div class='value'>[resize]屏幕尺寸改变</div>
                        </div>
                        <div class='item'>
                        <div class='title'>WIDTH：</div>
                        <div class='value'>
                            <textarea entry_field='width'>${record.width}</textarea>
                        </div>
                        </div>
                        <div class='item'>
                        <div class='title'>HEIGHT：</div>
                        <div class='value'>
                            <textarea entry_field='height'>${record.height}</textarea>
                        </div>
                        </div>                        
                    </div>`
        },
        listen: (theDocument, ports, rootTargetSelectors) => {
            const handler = (ev) => {
                if (lastResizeDate === null || (new Date() - lastResizeDate) >= COMMON_THRESHOLD) {
                    lastResizeDate = new Date()
                    const message = {
                        action: ACTION_TYPES.RESIZE.key,
                        width: innerWidth,
                        height: innerHeight
                    }

                    ports.forEach(port => port.postMessage(message))
                }
            }

            theDocument.defaultView.addEventListener('resize', handler)

            theDocument.defaultView.dispatchEvent(new Event('resize'))

            return handler
        },
        stopListen: (theDocument, handler) => {
            theDocument.defaultView.removeEventListener('resize', handler)
        }
    },
})

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
var isType = function (type, value) {
  return typeof value === type;
};
exports.isType = isType;
var isObject = function (value) {
  return isType("object", value);
};
exports.isObject = isObject;
var isString = function (value) {
  return isType("string", value);
};
exports.isString = isString;
var isNumber = function (value) {
  return isType("number", value);
};
exports.isNumber = isNumber;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(12);


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(this, {}))

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = function() {
	throw new Error("define cannot be used indirect");
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function() {
  var CssSelectorGenerator, root,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CssSelectorGenerator = (function() {
    CssSelectorGenerator.prototype.default_options = {
      selectors: ['id', 'class', 'tag', 'nthchild']
    };

    function CssSelectorGenerator(options) {
      if (options == null) {
        options = {};
      }
      this.options = {};
      this.setOptions(this.default_options);
      this.setOptions(options);
    }

    CssSelectorGenerator.prototype.setOptions = function(options) {
      var key, results, val;
      if (options == null) {
        options = {};
      }
      results = [];
      for (key in options) {
        val = options[key];
        if (this.default_options.hasOwnProperty(key)) {
          results.push(this.options[key] = val);
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    CssSelectorGenerator.prototype.isElement = function(element) {
      return !!((element != null ? element.nodeType : void 0) === 1);
    };

    CssSelectorGenerator.prototype.getParents = function(element) {
      var current_element, result;
      result = [];
      if (this.isElement(element)) {
        current_element = element;
        while (this.isElement(current_element)) {
          result.push(current_element);
          current_element = current_element.parentNode;
        }
      }
      return result;
    };

    CssSelectorGenerator.prototype.getTagSelector = function(element) {
      return element.tagName.toLowerCase();
    };

    CssSelectorGenerator.prototype.sanitizeItem = function(item) {
      var characters;
      characters = (item.split('')).map(function(character) {
        if (character === ':') {
          return "\\" + (':'.charCodeAt(0).toString(16).toUpperCase()) + " ";
        } else if (/[ !"#$%&'()*+,.\/;<=>?@\[\\\]^`{|}~]/.test(character)) {
          return "\\" + character;
        } else {
          return escape(character).replace(/\%/g, '\\');
        }
      });
      return characters.join('');
    };

    CssSelectorGenerator.prototype.getIdSelector = function(element) {
      var id, sanitized_id;
      id = element.getAttribute('id');
      if ((id != null) && (id !== '') && !(/\s/.exec(id)) && !(/^\d/.exec(id))) {
        sanitized_id = "#" + (this.sanitizeItem(id));
        if (document.querySelectorAll(sanitized_id).length === 1) {
          return sanitized_id;
        }
      }
      return null;
    };

    CssSelectorGenerator.prototype.getClassSelectors = function(element) {
      var class_string, item, result;
      result = [];
      class_string = element.getAttribute('class');
      if (class_string != null) {
        class_string = class_string.replace(/\s+/g, ' ');
        class_string = class_string.replace(/^\s|\s$/g, '');
        if (class_string !== '') {
          result = (function() {
            var k, len, ref, results;
            ref = class_string.split(/\s+/);
            results = [];
            for (k = 0, len = ref.length; k < len; k++) {
              item = ref[k];
              results.push("." + (this.sanitizeItem(item)));
            }
            return results;
          }).call(this);
        }
      }
      return result;
    };

    CssSelectorGenerator.prototype.getAttributeSelectors = function(element) {
      var attribute, blacklist, k, len, ref, ref1, result;
      result = [];
      blacklist = ['id', 'class'];
      ref = element.attributes;
      for (k = 0, len = ref.length; k < len; k++) {
        attribute = ref[k];
        if (ref1 = attribute.nodeName, indexOf.call(blacklist, ref1) < 0) {
          result.push("[" + attribute.nodeName + "=" + attribute.nodeValue + "]");
        }
      }
      return result;
    };

    CssSelectorGenerator.prototype.getNthChildSelector = function(element) {
      var counter, k, len, parent_element, sibling, siblings;
      parent_element = element.parentNode;
      if (parent_element != null) {
        counter = 0;
        siblings = parent_element.childNodes;
        for (k = 0, len = siblings.length; k < len; k++) {
          sibling = siblings[k];
          if (this.isElement(sibling)) {
            counter++;
            if (sibling === element) {
              return ":nth-child(" + counter + ")";
            }
          }
        }
      }
      return null;
    };

    CssSelectorGenerator.prototype.testSelector = function(element, selector) {
      var is_unique, result;
      is_unique = false;
      if ((selector != null) && selector !== '') {
        result = element.ownerDocument.querySelectorAll(selector);
        if (result.length === 1 && result[0] === element) {
          is_unique = true;
        }
      }
      return is_unique;
    };

    CssSelectorGenerator.prototype.getAllSelectors = function(element) {
      var result;
      result = {
        t: null,
        i: null,
        c: null,
        a: null,
        n: null
      };
      if (indexOf.call(this.options.selectors, 'tag') >= 0) {
        result.t = this.getTagSelector(element);
      }
      if (indexOf.call(this.options.selectors, 'id') >= 0) {
        result.i = this.getIdSelector(element);
      }
      if (indexOf.call(this.options.selectors, 'class') >= 0) {
        result.c = this.getClassSelectors(element);
      }
      if (indexOf.call(this.options.selectors, 'attribute') >= 0) {
        result.a = this.getAttributeSelectors(element);
      }
      if (indexOf.call(this.options.selectors, 'nthchild') >= 0) {
        result.n = this.getNthChildSelector(element);
      }
      return result;
    };

    CssSelectorGenerator.prototype.testUniqueness = function(element, selector) {
      var found_elements, parent;
      parent = element.parentNode;
      found_elements = parent.querySelectorAll(selector);
      return found_elements.length === 1 && found_elements[0] === element;
    };

    CssSelectorGenerator.prototype.testCombinations = function(element, items, tag) {
      var item, k, l, len, len1, ref, ref1;
      ref = this.getCombinations(items);
      for (k = 0, len = ref.length; k < len; k++) {
        item = ref[k];
        if (this.testUniqueness(element, item)) {
          return item;
        }
      }
      if (tag != null) {
        ref1 = items.map(function(item) {
          return tag + item;
        });
        for (l = 0, len1 = ref1.length; l < len1; l++) {
          item = ref1[l];
          if (this.testUniqueness(element, item)) {
            return item;
          }
        }
      }
      return null;
    };

    CssSelectorGenerator.prototype.getUniqueSelector = function(element) {
      var found_selector, k, len, ref, selector_type, selectors;
      selectors = this.getAllSelectors(element);
      ref = this.options.selectors;
      for (k = 0, len = ref.length; k < len; k++) {
        selector_type = ref[k];
        switch (selector_type) {
          case 'id':
            if (selectors.i != null) {
              return selectors.i;
            }
            break;
          case 'tag':
            if (selectors.t != null) {
              if (this.testUniqueness(element, selectors.t)) {
                return selectors.t;
              }
            }
            break;
          case 'class':
            if ((selectors.c != null) && selectors.c.length !== 0) {
              found_selector = this.testCombinations(element, selectors.c, selectors.t);
              if (found_selector) {
                return found_selector;
              }
            }
            break;
          case 'attribute':
            if ((selectors.a != null) && selectors.a.length !== 0) {
              found_selector = this.testCombinations(element, selectors.a, selectors.t);
              if (found_selector) {
                return found_selector;
              }
            }
            break;
          case 'nthchild':
            if (selectors.n != null) {
              return selectors.n;
            }
        }
      }
      return '*';
    };

    CssSelectorGenerator.prototype.getSelector = function(element) {
      var all_selectors, item, k, l, len, len1, parents, result, selector, selectors;
      all_selectors = [];
      parents = this.getParents(element);
      for (k = 0, len = parents.length; k < len; k++) {
        item = parents[k];
        selector = this.getUniqueSelector(item);
        if (selector != null) {
          all_selectors.push(selector);
        }
      }
      selectors = [];
      for (l = 0, len1 = all_selectors.length; l < len1; l++) {
        item = all_selectors[l];
        selectors.unshift(item);
        result = selectors.join(' > ');
        if (this.testSelector(element, result)) {
          return result;
        }
      }
      return null;
    };

    CssSelectorGenerator.prototype.getCombinations = function(items) {
      var i, j, k, l, ref, ref1, result;
      if (items == null) {
        items = [];
      }
      result = [[]];
      for (i = k = 0, ref = items.length - 1; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
        for (j = l = 0, ref1 = result.length - 1; 0 <= ref1 ? l <= ref1 : l >= ref1; j = 0 <= ref1 ? ++l : --l) {
          result.push(result[j].concat(items[i]));
        }
      }
      result.shift();
      result = result.sort(function(a, b) {
        return a.length - b.length;
      });
      result = result.map(function(item) {
        return item.join('');
      });
      return result;
    };

    return CssSelectorGenerator;

  })();

  if ("function" !== "undefined" && __webpack_require__(4) !== null ? __webpack_require__(3) : void 0) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
      return CssSelectorGenerator;
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {
    root = typeof exports !== "undefined" && exports !== null ? exports : this;
    root.CssSelectorGenerator = CssSelectorGenerator;
  }

}).call(this);


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const Selector = __webpack_require__(5)
const selector = new Selector()

const getSelector = (target, theDocument) => {
    let avaliableSelectors = [],
        selector1 = target && target.getRootNode() === theDocument ? selector.getSelector(target) : ''

    // css-selector-generator
    selector1 && avaliableSelectors.push(selector1)

    // get the selector by className and nodeName
    const getJoinedClassName = (node) => {
        return Array.from(node.classList || []).map(name => `.${name}`).join('')
    }

    const getNodeName = (node) => {
        return node.nodeName.toLowerCase()
    }

    const checkIfUniqe = (toCheckSelector) => {
        let list = Array.from(theDocument.querySelectorAll(toCheckSelector))

        return list.length === 1 && list[0] === target
    }

    const getNthOfNodeInParent = (node) => {
        return node.parentElement ? (Array.from(node.parentElement.children).indexOf(node) + 1) : 0
    }

    const appendNthSelector = (selector, nth) => {
        return nth ? `${selector}:nth-child(${nth})` : ''
    }

    const getBasicSelectorForEl = (el) => {
        const pNodeName = getNodeName(el),
            pClassNames = getJoinedClassName(el),
            nth = getNthOfNodeInParent(el),
            nthSelector = appendNthSelector('', nth)

        return `${pNodeName}${pClassNames}${nthSelector}`
    }

    let searchTimes = 0
    let getValidSelector = (stepTarget, selectors) => {
        if (searchTimes >= 10) {
            return null
        }

        const joinedSelector = selectors.join(' ')

        if (checkIfUniqe(joinedSelector)) {
            return joinedSelector
        } else {
            if (stepTarget.parentElement) {
                const parentElement = stepTarget.parentElement,
                    parentSelector = getBasicSelectorForEl(parentElement),
                    selectorsWithParent = [parentSelector, ...selectors]

                return getValidSelector(stepTarget.parentElement, selectorsWithParent)
            } else {
                return null
            }
        }
    }

    let selector2 = getValidSelector(target, [getBasicSelectorForEl(target)])

    if (selector2) {
        avaliableSelectors.push(selector2)
    }

    return avaliableSelectors
}

module.exports = { getSelector }

/***/ }),
/* 7 */
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
var indexOf = Array.prototype.indexOf || function (find, i /*opt*/) {
  if (i === undefined) i = 0;
  if (i < 0) i += this.length;
  if (i < 0) i = 0;
  for (var n = this.length; i < n; i++) if (i in this && this[i] === find) return i;
  return -1;
};
exports.indexOf = indexOf;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _isType = __webpack_require__(1);

var isObject = _isType.isObject;
var isString = _isType.isString;

/**
 * Represents an Item of an Enum.
 * @param {String} key   The Enum key.
 * @param {Number} value The Enum value.
 */

var EnumItem = (function () {

  /*constructor reference so that, this.constructor===EnumItem//=>true */

  function EnumItem(key, value) {
    var options = arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, EnumItem);

    this.key = key;
    this.value = value;

    this._options = options;
    this._options.ignoreCase = this._options.ignoreCase || false;
  }

  /**
   * Checks if the flagged EnumItem has the passing object.
   * @param  {EnumItem || String || Number} value The object to check with.
   * @return {Boolean}                            The check result.
   */

  EnumItem.prototype.has = function has(value) {
    if (EnumItem.isEnumItem(value)) {
      return (this.value & value.value) !== 0;
    } else if (isString(value)) {
      if (this._options.ignoreCase) {
        return this.key.toLowerCase().indexOf(value.toLowerCase()) >= 0;
      }
      return this.key.indexOf(value) >= 0;
    } else {
      return (this.value & value) !== 0;
    }
  };

  /**
   * Checks if the EnumItem is the same as the passing object.
   * @param  {EnumItem || String || Number} key The object to check with.
   * @return {Boolean}                          The check result.
   */

  EnumItem.prototype.is = function is(key) {
    if (EnumItem.isEnumItem(key)) {
      return this.key === key.key;
    } else if (isString(key)) {
      if (this._options.ignoreCase) {
        return this.key.toLowerCase() === key.toLowerCase();
      }
      return this.key === key;
    } else {
      return this.value === key;
    }
  };

  /**
   * Returns String representation of this EnumItem.
   * @return {String} String representation of this EnumItem.
   */

  EnumItem.prototype.toString = function toString() {
    return this.key;
  };

  /**
   * Returns JSON object representation of this EnumItem.
   * @return {String} JSON object representation of this EnumItem.
   */

  EnumItem.prototype.toJSON = function toJSON() {
    return this.key;
  };

  /**
   * Returns the value to compare with.
   * @return {String} The value to compare with.
   */

  EnumItem.prototype.valueOf = function valueOf() {
    return this.value;
  };

  EnumItem.isEnumItem = function isEnumItem(value) {
    return value instanceof EnumItem || isObject(value) && value.key !== undefined && value.value !== undefined;
  };

  return EnumItem;
})();

module.exports = EnumItem;

/***/ }),
/* 10 */
/***/ (function(module, exports) {

exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';

exports.homedir = function () {
	return '/'
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var os = _interopRequire(__webpack_require__(10));

var EnumItem = _interopRequire(__webpack_require__(9));

var _isType = __webpack_require__(1);

var isString = _isType.isString;
var isNumber = _isType.isNumber;

var indexOf = __webpack_require__(8).indexOf;

var isBuffer = _interopRequire(__webpack_require__(7));

var endianness = os.endianness();

/**
 * Represents an Enum with enum items.
 * @param {Array || Object}  map     This are the enum items.
 * @param {String || Object} options This are options. [optional]
 */

var Enum = (function () {
  function Enum(map, options) {
    var _this = this;

    _classCallCheck(this, Enum);

    /* implement the "ref type interface", so that Enum types can
     * be used in `node-ffi` function declarations and invokations.
     * In C, these Enums act as `uint32_t` types.
     *
     * https://github.com/TooTallNate/ref#the-type-interface
     */
    this.size = 4;
    this.indirection = 1;

    if (options && isString(options)) {
      options = { name: options };
    }

    this._options = options || {};
    this._options.separator = this._options.separator || " | ";
    this._options.endianness = this._options.endianness || endianness;
    this._options.ignoreCase = this._options.ignoreCase || false;
    this._options.freez = this._options.freez || false;

    this.enums = [];

    if (map.length) {
      this._enumLastIndex = map.length;
      var array = map;
      map = {};

      for (var i = 0; i < array.length; i++) {
        map[array[i]] = Math.pow(2, i);
      }
    }

    for (var member in map) {
      guardReservedKeys(this._options.name, member);
      this[member] = new EnumItem(member, map[member], { ignoreCase: this._options.ignoreCase });
      this.enums.push(this[member]);
    }
    this._enumMap = map;

    if (this._options.ignoreCase) {
      this.getLowerCaseEnums = function () {
        var res = {};
        for (var i = 0, len = this.enums.length; i < len; i++) {
          res[this.enums[i].key.toLowerCase()] = this.enums[i];
        }
        return res;
      };
    }

    if (this._options.name) {
      this.name = this._options.name;
    }

    var isFlaggable = function () {
      for (var i = 0, len = _this.enums.length; i < len; i++) {
        var e = _this.enums[i];

        if (!(e.value !== 0 && !(e.value & e.value - 1))) {
          return false;
        }
      }
      return true;
    };

    this.isFlaggable = isFlaggable();
    if (this._options.freez) {
      this.freezeEnums(); //this will make instances of Enum non-extensible
    }
  }

  /**
   * Returns the appropriate EnumItem key.
   * @param  {EnumItem || String || Number} key The object to get with.
   * @return {String}                           The get result.
   */

  Enum.prototype.getKey = function getKey(value) {
    var item = this.get(value);
    if (item) {
      return item.key;
    }
  };

  /**
   * Returns the appropriate EnumItem value.
   * @param  {EnumItem || String || Number} key The object to get with.
   * @return {Number}                           The get result.
   */

  Enum.prototype.getValue = function getValue(key) {
    var item = this.get(key);
    if (item) {
      return item.value;
    }
  };

  /**
   * Returns the appropriate EnumItem.
   * @param  {EnumItem || String || Number} key The object to get with.
   * @return {EnumItem}                         The get result.
   */

  Enum.prototype.get = function get(key, offset) {
    if (key === null || key === undefined) {
      return;
    } // Buffer instance support, part of the ref Type interface
    if (isBuffer(key)) {
      key = key["readUInt32" + this._options.endianness](offset || 0);
    }

    if (EnumItem.isEnumItem(key)) {
      var foundIndex = indexOf.call(this.enums, key);
      if (foundIndex >= 0) {
        return key;
      }
      if (!this.isFlaggable || this.isFlaggable && key.key.indexOf(this._options.separator) < 0) {
        return;
      }
      return this.get(key.key);
    } else if (isString(key)) {

      var enums = this;
      if (this._options.ignoreCase) {
        enums = this.getLowerCaseEnums();
        key = key.toLowerCase();
      }

      if (key.indexOf(this._options.separator) > 0) {
        var parts = key.split(this._options.separator);

        var value = 0;
        for (var i = 0; i < parts.length; i++) {
          var part = parts[i];

          value |= enums[part].value;
        }

        return new EnumItem(key, value);
      } else {
        return enums[key];
      }
    } else {
      for (var m in this) {
        if (this.hasOwnProperty(m)) {
          if (this[m].value === key) {
            return this[m];
          }
        }
      }

      var result = null;

      if (this.isFlaggable) {
        for (var n in this) {
          if (this.hasOwnProperty(n)) {
            if ((key & this[n].value) !== 0) {
              if (result) {
                result += this._options.separator;
              } else {
                result = "";
              }
              result += n;
            }
          }
        }
      }

      return this.get(result || null);
    }
  };

  /**
   * Sets the Enum "value" onto the give `buffer` at the specified `offset`.
   * Part of the ref "Type interface".
   *
   * @param  {Buffer} buffer The Buffer instance to write to.
   * @param  {Number} offset The offset in the buffer to write to. Default 0.
   * @param  {EnumItem || String || Number} value The EnumItem to write.
   */

  Enum.prototype.set = function set(buffer, offset, value) {
    var item = this.get(value);
    if (item) {
      return buffer["writeUInt32" + this._options.endianness](item.value, offset || 0);
    }
  };

  /**
   * Define freezeEnums() as a property of the prototype.
   * make enumerable items nonconfigurable and deep freeze the properties. Throw Error on property setter.
   */

  Enum.prototype.freezeEnums = function freezeEnums() {
    function envSupportsFreezing() {
      return Object.isFrozen && Object.isSealed && Object.getOwnPropertyNames && Object.getOwnPropertyDescriptor && Object.defineProperties && Object.__defineGetter__ && Object.__defineSetter__;
    }

    function freezer(o) {
      var props = Object.getOwnPropertyNames(o);
      props.forEach(function (p) {
        if (!Object.getOwnPropertyDescriptor(o, p).configurable) {
          return;
        }

        Object.defineProperties(o, p, { writable: false, configurable: false });
      });
      return o;
    }

    function getPropertyValue(value) {
      return value;
    }

    function deepFreezeEnums(o) {
      if (typeof o !== "object" || o === null || Object.isFrozen(o) || Object.isSealed(o)) {
        return;
      }
      for (var key in o) {
        if (o.hasOwnProperty(key)) {
          o.__defineGetter__(key, getPropertyValue.bind(null, o[key]));
          o.__defineSetter__(key, function throwPropertySetError(value) {
            throw TypeError("Cannot redefine property; Enum Type is not extensible.");
          });
          deepFreezeEnums(o[key]);
        }
      }
      if (Object.freeze) {
        Object.freeze(o);
      } else {
        freezer(o);
      }
    }

    if (envSupportsFreezing()) {
      deepFreezeEnums(this);
    }

    return this;
  };

  /**
   * Return true whether the enumItem parameter passed in is an EnumItem object and 
   * has been included as constant of this Enum   
   * @param  {EnumItem} enumItem
   */

  Enum.prototype.isDefined = function isDefined(enumItem) {
    var condition = function (e) {
      return e === enumItem;
    };
    if (isString(enumItem) || isNumber(enumItem)) {
      condition = function (e) {
        return e.is(enumItem);
      };
    }
    return this.enums.some(condition);
  };

  /**
   * Returns JSON object representation of this Enum.
   * @return {String} JSON object representation of this Enum.
   */

  Enum.prototype.toJSON = function toJSON() {
    return this._enumMap;
  };

  /**
   * Extends the existing Enum with a New Map.
   * @param  {Array}  map  Map to extend from
   */

  Enum.prototype.extend = function extend(map) {
    if (map.length) {
      var array = map;
      map = {};

      for (var i = 0; i < array.length; i++) {
        var exponent = this._enumLastIndex + i;
        map[array[i]] = Math.pow(2, exponent);
      }

      for (var member in map) {
        guardReservedKeys(this._options.name, member);
        this[member] = new EnumItem(member, map[member], { ignoreCase: this._options.ignoreCase });
        this.enums.push(this[member]);
      }

      for (var key in this._enumMap) {
        map[key] = this._enumMap[key];
      }

      this._enumLastIndex += map.length;
      this._enumMap = map;

      if (this._options.freez) {
        this.freezeEnums(); //this will make instances of new Enum non-extensible
      }
    }
  };

  /**
   * Registers the Enum Type globally in node.js.
   * @param  {String} key Global variable. [optional]
   */

  Enum.register = function register() {
    var key = arguments[0] === undefined ? "Enum" : arguments[0];

    if (!global[key]) {
      global[key] = Enum;
    }
  };

  Enum.prototype[Symbol.iterator] = function () {
    var _this = this;

    var index = 0;
    return {
      next: function () {
        return index < _this.enums.length ? { done: false, value: _this.enums[index++] } : { done: true };
      }
    };
  };

  return Enum;
})();

module.exports = Enum;

// private

var reservedKeys = ["_options", "get", "getKey", "getValue", "enums", "isFlaggable", "_enumMap", "toJSON", "_enumLastIndex"];

function guardReservedKeys(customName, key) {
  if (customName && key === "name" || indexOf.call(reservedKeys, key) >= 0) {
    throw new Error("Enum key " + key + " is a reserved word!");
  }
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(11)))

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getNow; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getNowString; });
const getNow = () => +new Date()

const getNowString = () => {
    const now = new Date(),
        hour = now.getHours(),
        min = now.getMinutes(),
        sec = now.getSeconds()

    return `${hour < 10 ? '0' : ''}${hour}:${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`
}

/***/ }),
/* 14 */,
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./src/js/consts.js + 2 modules
var consts = __webpack_require__(0);

// CONCATENATED MODULE: ./src/js/saveFile.js
/**
 * 保存文件到本地
 */
class SaveFile {
    /**
     * 保存json格式
     * @param {待保存数据} data 
     * @param {document对象} theDocument 
     * @param {文件名} fileName 
     */
    static saveJson(data, theDocument, fileName) {
        let saveByteArray = (function () {
            let a = theDocument.createElement("a")
            theDocument.body.appendChild(a)
            a.style = "display: none"

            return function (data, name) {
                let blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
                let url = theDocument.defaultView.URL.createObjectURL(blob)
                a.href = url
                a.download = name
                a.click()
                theDocument.defaultView.URL.revokeObjectURL(url)
            }
        }())

        saveByteArray(data, fileName)
    }
}
// CONCATENATED MODULE: ./src/js/system.js
const system = {
    version: '1.0'
}
// EXTERNAL MODULE: ./src/common.js
var common = __webpack_require__(13);

// CONCATENATED MODULE: ./src/js/entryFormater.js
class EntryFormater {
    /**
     * split by |
     * @param {value to format} value 
     */
    static splitByLine(value) {
        return (value || '').trim().split('|').filter(val => val)
    }
}
// CONCATENATED MODULE: ./src/js/isIncognitoMode.js
//detect whete the browser in incognito mode
const IsIncognitoMode = () => new Promise(resolve => {
    var fs = window.RequestFileSystem || window.webkitRequestFileSystem
    if (!fs) {
        //unknown
        resolve(false)
    } else {
        fs(window.TEMPORARY, 100,
            () => resolve(false),
            () => resolve(true))
    }
})
// CONCATENATED MODULE: ./src/js/panel.js







let isRuning = false,
    hasRegWatchNetwork = false,
    records = null,
    targetSelectors = null,
    changedMap = {},
    phase = consts["d" /* LISTEN_IN_CONTENT_PHASE */].NEVER,
    currentUrl = ''

let connectionToBackground = chrome.runtime.connect({ name: consts["c" /* CONNECT_ID_INIT_PANEL */] }),
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
    let recordSummary = createEntryEl(id + '', 'li', `${getCheckboxHtml()}${Object(common["b" /* getNowString */])()}${type.value.renderSummary(record)}`)
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

function connectionToContentOnDisconnect() {
    connectionToContent = null
    doConnectToContent()
}

function connectionToContentOnMessage(request) {
    const theActionEnum = consts["a" /* ACTION_TYPES */].get(request.action)
    if (theActionEnum) {
        appendRecord(theActionEnum, request)
    }
}

function doConnectToContent() {
    if (!connectionToContent) {
        connectionToContent = chrome.tabs.connect(tabId, { name: consts["c" /* CONNECT_ID_INIT_PANEL */] })
    }

    connectionToContent.postMessage({ action: 'init', tabId, url: currentUrl, rootTargetSelectors: getTargetSelectors() })
    phase === consts["d" /* LISTEN_IN_CONTENT_PHASE */].RECORD && connectionToContent.postMessage({ action: 'record' })

    connectionToContent.onDisconnect.removeListener(connectionToContentOnDisconnect)
    connectionToContent.onDisconnect.addListener(connectionToContentOnDisconnect)

    connectionToContent.onMessage.removeListener(connectionToContentOnMessage)
    connectionToContent.onMessage.addListener(connectionToContentOnMessage)
}

function checkIncognitoMode() {
    IsIncognitoMode().then(incognitoMode => {
        if (!incognitoMode) {
            const tip = document.getElementById('tip')
            tip.innerHTML = '建议您在隐身窗口模式使用该程序，打开隐身窗口快捷键： Ctrl + Shift + N <br/><b>注</b>：请先在配置页面 chrome://extensions 允许该扩展在隐身窗口启用'
            tip.classList.remove('hide')
        }
    })
}

document.addEventListener('DOMContentLoaded', function () {
    checkIncognitoMode()
    records = document.getElementById('records')
    targetSelectors = document.getElementById('targetSelectors')

    const btnStart = document.getElementById('btnStart'),
        btnRecord = document.getElementById('btnRecord'),
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
            }
        }` })
        })
    })

    connectionToBackground.onDisconnect.addListener(function () {
        connectionToBackground = null
    })

    chrome.webNavigation.onCommitted.addListener((ev) => {
        const { tabId: currentTabId, url, frameId } = ev

        // frameId 表示当前page中frame的ID，0表示window.top对应frame，正数表示其余subFrame
        if (isRuning && currentTabId === tabId && frameId === 0) {
            currentUrl = url
            doConnectToContent()
            connectionToBackground.postMessage({ action: consts["a" /* ACTION_TYPES */].NAVIGATE.key, url, flag: '' })
            appendRecord(consts["a" /* ACTION_TYPES */].NAVIGATE, { url, flag: '' })

            chrome.tabs.executeScript(tabId, {
                code: `
                var hidden = document.createElement('input')
                hidden.type = 'hidden'
                hidden.id = '__ats_id__'
                hidden.value = '${chrome.runtime.id}'
                document.body.appendChild(hidden)

                var s = document.createElement('script')
                s.type = 'text/javascript'
                s.src = '//localhost:8888/network.js'
                document.head.appendChild(s)
                `
            })
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

                chrome.tabs.executeScript(tabId, {
                    code: `({outerWidth,outerHeight,innerWidth,innerHeight})`
                }, result => {
                    const initSize = result[0]

                    SaveFile.saveJson({
                        id: +now,
                        version: system.version,
                        initSize,
                        rootTargets: getTargetSelectors(),
                        createAt: `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
                        data
                    }, document, `ats_data.json`)
                })
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

                                const isRedirect = Math.floor(request.response.status / 100) === 3,
                                    redirectUrl = isRedirect ? request.response.redirectURL : undefined

                                let finalHeadersIsValid = false,
                                    finalHeaders = {}

                                toRecordHeaderTypes.forEach(headerType => {
                                    let matchedHeader = headers.find(header => (header.name || '').toLowerCase() === headerType.toLocaleLowerCase())

                                    if (matchedHeader) {
                                        finalHeadersIsValid = true
                                        finalHeaders = Object.assign({}, finalHeaders, { [headerType]: headerType === 'Content-Type' ? matchedHeader.value.replace(/\bcharset=([\w\-]+)\b/ig, 'charset=utf-8') : matchedHeader.value })
                                    }
                                })

                                connectionToBackground.postMessage({ action: consts["a" /* ACTION_TYPES */].NETWORK.key, url, redirectUrl, status, method, body, form, header: (finalHeadersIsValid ? finalHeaders : null) })
                                appendRecord(consts["a" /* ACTION_TYPES */].NETWORK, { url, redirectUrl, method, body, form, status })
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
        btnRecord.disabled = false
        records.className = 'recording'
        records.innerHTML = ''
        changedMap = {}
        phase = consts["d" /* LISTEN_IN_CONTENT_PHASE */].INIT

        connectionToBackground.postMessage({ action: 'init', tabId })
    })

    btnRecord.addEventListener('click', (ev) => {
        if (!isRuning) {
            return
        }

        btnRecord.disabled = true
        phase = consts["d" /* LISTEN_IN_CONTENT_PHASE */].RECORD

        connectionToContent.postMessage({ action: 'record' })
    })

    btnStop.addEventListener('click', (ev) => {
        if (!isRuning) {
            return
        }

        btnStart.disabled = false
        btnRecord.disabled = true
        btnStop.disabled = true
        btnSave.disabled = false
        isRuning = false
        phase = consts["d" /* LISTEN_IN_CONTENT_PHASE */].NEVER

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

/***/ })
/******/ ]);