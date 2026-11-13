#!/bin/sh
# Download the voice messages played by BB-is-watching-you.html (output0.mp3 ... output3.mp3).
tts() {
	curl -sSfG -A Mozilla -o "$1" "https://translate.google.com/translate_tts" \
		-d ie=UTF-8 -d client=tw-ob -d tl=en --data-urlencode "q=$2"
}

tts output0.mp3 "hello fanny, how are you doing?"
tts output1.mp3 "how was your party?"
tts output2.mp3 "Baptiste went to bed. He is probably sleeping"
tts output3.mp3 "Have a good night!"
