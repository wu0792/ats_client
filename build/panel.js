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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return CONNECT_ID_WATCH_PANEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CONNECT_ID_WATCH_CONTENT; });
const CONNECT_ID_WATCH_PANEL = 'CONNECT_ID_WATCH_PANEL'
const CONNECT_ID_WATCH_CONTENT = 'CONNECT_ID_WATCH_CONTENT'

/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


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

        connectionWatchPanel = chrome.runtime.connect({ name: _consts__WEBPACK_IMPORTED_MODULE_0__[/* CONNECT_ID_WATCH_PANEL */ "b"] })

        chrome.tabs.sendMessage(tabId, { name: _consts__WEBPACK_IMPORTED_MODULE_0__[/* CONNECT_ID_WATCH_PANEL */ "b"], action: 'start' }, () => {
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
        chrome.tabs.sendMessage(tabId, { action: 'stop', name: _consts__WEBPACK_IMPORTED_MODULE_0__[/* CONNECT_ID_WATCH_PANEL */ "b"] }, () => {
            appendLog('停止监听...')
        })
    })
})

/***/ })
/******/ ]);