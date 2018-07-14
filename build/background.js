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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return CONNECT_ID_WATCH_PANEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CONNECT_ID_WATCH_CONTENT; });
const CONNECT_ID_WATCH_PANEL = 'CONNECT_ID_WATCH_PANEL'
const CONNECT_ID_WATCH_CONTENT = 'CONNECT_ID_WATCH_CONTENT'

/***/ }),

/***/ 7:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


let tabs = new Map(),
    activeTabId = 0

function ensureExist(tabId) {
    let existed = tabs.get(tabId)

    return existed || {
        network: [],
        mutation: [],
        activity: []
    }
}

chrome.runtime.onConnect.addListener(function (port) {
    switch (port.name) {
        case _consts__WEBPACK_IMPORTED_MODULE_0__[/* CONNECT_ID_WATCH_PANEL */ "b"]:
            port.onMessage.addListener(function (msg) {
                const { action, url, method, body, postData, date, tabId = 0 } = msg

                if (action === 'init' && tabId) {
                    activeTabId = tabId
                } else if (action === 'listen' && activeTabId) {
                    let existed = ensureExist(activeTabId)

                    existed.network.push({ url, method, body, postData, date })
                    tabs.set(activeTabId, existed)

                    chrome.storage.local.set({ [`ats_${activeTabId}`]: { data: existed, update_at: new Date() } })

                    console.log('receive network message, now the set is:')
                    console.log(existed)
                } else if (action === 'stop') {
                    console.log('background.js receive stop action from panel.')
                }
            })
            break
        // track network activity
        case _consts__WEBPACK_IMPORTED_MODULE_0__[/* CONNECT_ID_WATCH_CONTENT */ "a"]:
            port.onMessage.addListener(function (msg) {
                let action = msg.action
                if (action === 'user_activities') {
                    const { target, keyCode, ctrlKey, shiftKey, altKey } = msg

                    let existed = ensureExist(activeTabId)

                    existed.activity.push({ target, keyCode, ctrlKey, shiftKey, altKey })
                    tabs.set(activeTabId, existed)

                    console.log('receive user activity message, now the set is:')
                    console.log(existed)
                } else if (action === 'dom_mutation') {
                    const { type, target } = msg

                    let existed = ensureExist(activeTabId)

                    existed.mutation.push({ activeTabId, type, target })
                    tabs.set(activeTabId, existed)

                    console.log('receive mutation message, now the set is:')
                    console.log(existed)
                }
            })
            break
        default:
            break
    }
})



/***/ })

/******/ });