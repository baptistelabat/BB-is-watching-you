/*
 * Compatibility shim for js-cam-motion on modern browsers.
 *
 * js-cam-motion was written for the old, callback based
 * navigator.getUserMedia / webkitGetUserMedia API and attaches the stream with
 * `video.src = stream` or `URL.createObjectURL(stream)`. Modern browsers
 * removed (or broke) all of those for security reasons:
 *   - the camera is only available through navigator.mediaDevices.getUserMedia,
 *   - only in a secure context (https:// or http://localhost),
 *   - a MediaStream must be attached with `video.srcObject`.
 *
 * This file replaces navigator.getUserMedia with a wrapper around the modern
 * promise based API, so the unmodified library keeps working. Because the
 * library still assigns `video.src` afterwards, we attach the stream with
 * `srcObject` and make writes to `src` on that element a no-op.
 */
var CamMotionCompat = (function () {

	function problem() {
		if (!window.isSecureContext) {
			return "The camera is only available on a secure page. " +
				"Open this page from http://localhost or over https://.";
		}
		if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
			return "This browser does not support camera access (mediaDevices.getUserMedia).";
		}
		return null;
	}

	/**
	 * Create a hidden <video> element of the given size and patch
	 * navigator.getUserMedia so that the library streams the webcam into it.
	 * Pass the returned element to CamMotion.Engine as `videoNode`.
	 */
	function install(width, height) {
		var video = document.createElement("video");
		video.setAttribute("width", width);
		video.setAttribute("height", height);
		video.setAttribute("style", "display:none");
		// Required for autoplay without a user gesture and for iOS Safari.
		video.autoplay = true;
		video.muted = true;
		video.playsInline = true;
		document.body.appendChild(video);
		// The library does `video.src = stream` after the callback, which would
		// restart the media element. Ignore writes to `src` on this element.
		Object.defineProperty(video, "src", {
			configurable: true,
			get: function () { return ""; },
			set: function () {}
		});

		navigator.getUserMedia = function (constraints, onSuccess, onError) {
			var err = problem();
			if (err) {
				onError(new Error(err));
				return;
			}
			// Only ask for the camera: the microphone is not needed, and asking
			// for less is both safer and more likely to be granted.
			var preferred = { audio: false, video: { width: { ideal: width }, height: { ideal: height } } };
			navigator.mediaDevices.getUserMedia(preferred).catch(function (e) {
				// Some cameras/browsers (e.g. Firefox on Linux) fail with
				// NotReadableError or OverconstrainedError on a size request:
				// retry once with the camera's default settings.
				if (e && (e.name === "NotReadableError" || e.name === "OverconstrainedError" || e.name === "AbortError")) {
					console.warn("camera failed with preferred size, retrying with defaults", e);
					return new Promise(function (r) { setTimeout(r, 500); }).then(function () {
						return navigator.mediaDevices.getUserMedia({ audio: false, video: true });
					});
				}
				throw e;
			}).then(function (stream) {
				video.srcObject = stream;
				video.onloadedmetadata = function () {
					video.onloadedmetadata = null; // start the library only once
					var p = video.play();
					if (p && p.catch) { p.catch(function (e) { console.warn("video.play failed", e); }); }
					onSuccess(stream);
				};
			}).catch(onError);
		};
		// Make sure the library never falls back to the removed webkit path.
		navigator.webkitGetUserMedia = navigator.getUserMedia;

		return video;
	}

	return { install: install, problem: problem };
})();
