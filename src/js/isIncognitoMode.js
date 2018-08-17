//detect whete the browser in incognito mode
export const IsIncognitoMode = () => new Promise(resolve => {
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