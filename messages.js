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

	function allVoices() {
		return supported() ? window.speechSynthesis.getVoices() : [];
	}

	/** French voices available in this browser (may be empty until "voiceschanged"). */
	function frenchVoices() {
		return allVoices().filter(function (v) {
			return v.lang && v.lang.toLowerCase().replace("_", "-").indexOf("fr") === 0;
		});
	}

	/** Make sure the voice list starts loading (Chrome fills it asynchronously). */
	function loadVoices() {
		allVoices();
	}

	function pickVoice(voiceName) {
		var voices = frenchVoices();
		return voices.filter(function (v) { return v.name === voiceName; })[0] || voices[0] || null;
	}

	// Chrome may garbage-collect an utterance before it is spoken (and then
	// never speaks it): keep references to the utterances in progress.
	var inProgress = [];
	var busy = false;

	/**
	 * Speak a text in French. `report(state, detail)` is optional and is called
	 * with "start", "end", "error" (detail = error name) or "silent" when the
	 * browser did not start speaking within 3 seconds.
	 */
	function speak(text, voiceName, report) {
		report = report || function () {};
		if (!supported()) { report("error", "unsupported"); return; }
		if (!text) { return; }
		var u = new SpeechSynthesisUtterance(text);
		u.lang = LANG;
		u.volume = 1;
		var voice = pickVoice(voiceName);
		if (voice) { u.voice = voice; }

		var started = false, done = false;
		function finish(state, detail) {
			if (done) { return; }
			done = true;
			busy = false;
			var i = inProgress.indexOf(u);
			if (i >= 0) { inProgress.splice(i, 1); }
			report(state, detail);
		}
		u.onstart = function () { started = true; report("start"); };
		u.onend = function () { finish("end"); };
		u.onerror = function (e) { finish("error", e.error); };
		// Never stay blocked if the browser fires no event at all.
		setTimeout(function () { if (!started) { finish("silent"); } }, 3000);
		setTimeout(function () { finish("end"); }, 20000);

		busy = true;
		inProgress.push(u);
		var synth = window.speechSynthesis;
		if (synth.speaking || synth.pending) {
			synth.cancel();
			// Chrome drops an utterance spoken right after cancel(): wait a bit.
			setTimeout(function () { synth.resume(); synth.speak(u); }, 100);
		} else {
			synth.resume(); // Chrome sometimes leaves the engine paused
			synth.speak(u);
		}
	}

	/** True while a message started by speak() is being spoken. */
	function isBusy() { return busy; }

	function voiceHint() {
		if (!allVoices().length) {
			return "Aucune voix n'est installée pour ce navigateur " +
				"(sous Linux, installe speech-dispatcher ; sinon essaie Chrome, Edge ou Safari).";
		}
		if (!frenchVoices().length) {
			return "Aucune voix française n'est installée : ajoute-en une dans les réglages du système.";
		}
		return "Vérifie le volume, la sortie audio et que l'onglet n'est pas en sourdine.";
	}

	/** Short French description of a speak() report, or "" if all is fine. */
	function describe(state, detail) {
		if (state === "error" && detail === "unsupported") {
			return "Ce navigateur ne sait pas faire de synthèse vocale.";
		}
		if (state === "error" && detail === "not-allowed") {
			return "Le navigateur a bloqué le son : clique d'abord sur la page.";
		}
		if (state === "error") {
			return "Erreur de synthèse vocale (" + detail + "). " + voiceHint();
		}
		if (state === "silent") {
			return "Le navigateur n'a pas démarré la voix. " + voiceHint();
		}
		return "";
	}

	return {
		COUNT: COUNT, DEFAULTS: DEFAULTS, load: load, save: save, shareUrl: shareUrl,
		supported: supported, frenchVoices: frenchVoices, loadVoices: loadVoices,
		speak: speak, isBusy: isBusy, describe: describe, voiceHint: voiceHint
	};
})();
