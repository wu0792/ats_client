export default class NetWorkListener {
    constructor() {

    }

    init() {
        var open = window.XMLHttpRequest.prototype.open,
            send = window.XMLHttpRequest.prototype.send,
            onReadyStateChange;

        function openReplacement(method, url, async, user, password) {
            var syncMode = async !== false ? 'async' : 'sync';
            console.warn(
                'Preparing ' +
                syncMode +
                ' HTTP request : ' +
                method +
                ' ' +
                url
            );
            return open.apply(this, arguments);
        }

        function sendReplacement(data) {
            console.warn('Sending HTTP request data : ', data);

            if (this.onreadystatechange) {
                this._onreadystatechange = this.onreadystatechange;
            }
            this.onreadystatechange = onReadyStateChangeReplacement;

            return send.apply(this, arguments);
        }

        function onReadyStateChangeReplacement() {
            console.warn('HTTP request ready state changed : ' + this.readyState);
            if (this._onreadystatechange) {
                return this._onreadystatechange.apply(this, arguments);
            }
        }

        window.XMLHttpRequest.prototype.open = openReplacement;
        window.XMLHttpRequest.prototype.send = sendReplacement;
    }
}