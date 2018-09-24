//send ajax response message to the background.js
if (typeof chrome !== 'undefined') {
	var id = document.getElementById('__ats_id__'),
		seq = 0
	XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send
	XMLHttpRequest.prototype.send = function (value) {
		this.addEventListener("load", function () {
			chrome.runtime.sendMessage(id.value, { type: 'network', seq: this.seq, url: this.responseURL, body: this.responseText });
		}, false)
		this.realSend(value)
		this.seq = seq++
	}
}