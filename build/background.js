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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ({

/***/ 5:
/***/ (function(module, exports) {

var mutationSet = new Map()
/**
 * [
 *   1: {
 *      url: 'abc.com',
 *      mutaions: [
 *          {
 *              type: 'add',
 *              selector: '#searchBtn'
 *          }
 *      ]
 *   }
 * ]
 */

function getActiveTab(cb) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs.length) {
            var activeTab = tabs[0]

            cb({ id: activeTab.id, url: activeTab.url })
        }
    })
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.ats_domMutation === true) {
            let cb = function ({ id, url }) {
                let existed = mutationSet.get(id)
                if (!existed) {
                    existed = {
                        url,
                        mutation: []
                    }
                }

                existed.mutation.push({
                    time: new Date(),
                    type: 'add',
                    selector: '#btn123'
                })

                mutationSet.set(id, existed)

                console.log('receive mutation message, now the set is:')
                console.log(mutationSet)
            }

            getActiveTab(cb)
        }
    });

var tabs = new Map()

function ensureExist(tabId) {
    let existed = tabs.get(tabId)

    return existed || {
        network: [],
        mutation: [],
        activity: []
    }
}

chrome.runtime.onConnect.addListener(function (port) {
    // track network activity
    if (port.name == "ats_devtools") {
        port.onMessage.addListener(function (msg) {
            const { url, method, body, postData, date, tabId = 0 } = msg
            let existed = ensureExist(tabId)

            existed.network.push({ url, method, body, postData, date })
            tabs.set(tabId, existed)

            chrome.storage.local.set({ [`ats_${tabId}`]: { data: existed, update_at: new Date() } })

            console.log('receive network message, now the set is:')
            console.log(existed)
        })
    }
    //track dom mutations
    else if (port.name === 'ats_watch_dom_mutation') {
        port.onMessage.addListener(function (msg) {
            const { tabId = 0, type, target } = msg

            let existed = ensureExist(tabId)

            existed.mutation.push({ tabId, type, target })
            tabs.set(tabId, existed)

            chrome.storage.local.set({ [`ats_${tabId}`]: { data: existed, update_at: new Date() } })

            console.log('receive mutation message, now the set is:')
            console.log(existed)
        })
    }
    //track user activities
    else if (port.name === 'ats_watch_user_activities') {
        port.onMessage.addListener(function (msg) {
            const { tabId = 0, target, keyCode, ctrlKey, shiftKey } = msg

            let existed = ensureExist(tabId)

            existed.activity.push({ target, keyCode, ctrlKey, shiftKey })
            tabs.set(tabId, existed)

            chrome.storage.local.set({ [`ats_${tabId}`]: { data: existed, update_at: new Date() } })

            console.log('receive user activity message, now the set is:')
            console.log(existed)
        })
    }
})



/***/ })

/******/ });