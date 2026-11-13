/*
 * Messages spoken by the smiley, using the browser's speech synthesis.
 * Messages are saved in this browser (localStorage). They can also be passed
 * in the page URL (?m=...&m=...&voice=...), so a link can carry them.
 */
var Messages = (function () {
	var COUNT = 5;
	var LANG = "fr-FR";
	var KEY = "bb-is-watching-you.messages";
	var DEFAULTS = [
		"Bonjour toi !",
		"Je te vois !",
		"Comment s'est passée ta journée ?",
		"Souris, tu es filmé !",
		"Bonne nuit !"
	];

	function fromUrl() {
		var params = new URLSearchParams(window.location.search);
		var m = params.getAll("m");
		if (!m.length) { return null; }
		return { messages: m.slice(0, COUNT), voice: params.get("voice") || "" };
	}

	function fromStorage() {
		try {
			var data = JSON.parse(window.localStorage.getItem(KEY));
			if (data && Array.isArray(data.messages)) { return data; }
		} catch (e) { /* storage unavailable or invalid */ }
		return null;
	}

	/** Returns {messages: [5 strings], voice: voice name or ""}. */
	function load() {
		var data = fromUrl() || fromStorage() || { messages: DEFAULTS, voice: "" };
		var messages = [];
		for (var i = 0; i < COUNT; i++) {
			messages.push(typeof data.messages[i] === "string" ? data.messages[i] : "");
		}
		return { messages: messages, voice: data.voice || "" };
	}

	function save(data) {
		try {
			window.localStorage.setItem(KEY, JSON.stringify(data));
			return true;
		} catch (e) {
			return false;
		}
	}

	function shareUrl(data, page) {
		var params = new URLSearchParams();
		data.messages.forEach(function (m) { params.append("m", m); });
		if (data.voice) { params.set("voice", data.voice); }
		return new URL(page + "?" + params.toString(), window.location.href).href;
	}

	function supported() {
		return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
	}

	/** French voices available in this browser (may be empty until "voiceschanged"). */
	function frenchVoices() {
		if (!supported()) { return []; }
		return window.speechSynthesis.getVoices().filter(function (v) {
			return v.lang && v.lang.toLowerCase().indexOf("fr") === 0;
		});
	}

	function speak(text, voiceName) {
		if (!supported() || !text) { return; }
		var u = new SpeechSynthesisUtterance(text);
		u.lang = LANG;
		var voices = frenchVoices();
		var voice = voices.filter(function (v) { return v.name === voiceName; })[0] || voices[0];
		if (voice) { u.voice = voice; }
		window.speechSynthesis.cancel();
		window.speechSynthesis.speak(u);
	}

	/** Some browsers (Safari) only allow speech after a first call inside a click. */
	function unlock() {
		if (!supported()) { return; }
		var u = new SpeechSynthesisUtterance("");
		u.volume = 0;
		window.speechSynthesis.speak(u);
	}

	return {
		COUNT: COUNT, DEFAULTS: DEFAULTS, load: load, save: save, shareUrl: shareUrl,
		supported: supported, frenchVoices: frenchVoices, speak: speak, unlock: unlock
	};
})();
