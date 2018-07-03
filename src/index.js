import NetWorkListener from './network'
import $ from 'jquery'

var mutationObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        console.log(mutation);
    });
})

$(function () {
    const netWorkListener = new NetWorkListener()
    netWorkListener.init()

    mutationObserver.observe(document.documentElement, {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true,
        attributeOldValue: true,
        characterDataOldValue: true
    })
})