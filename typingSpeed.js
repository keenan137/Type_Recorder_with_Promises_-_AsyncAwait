/* ISSUES:
	Handle edge cases of adding keys that should not be displayed (handled inside typedTextArea->keydown)
	Play button can change to stop button which can be used to stop/erase text animation. OR add pause and stop buttons.
*/

const recordingBtn = document.querySelector("#recordingBtn");
const playBtn = document.querySelector("#playBtn");
const typedTextArea = document.querySelector("#typedTextArea");
const recordedTextArea = document.querySelector("#recordedTextArea");

let start, endTime, timeDiff;
let timeKeeper;

const startTime = () => {
	start = new Date();
};

const nextTime = () => {
	endTime = new Date();
	// time difference milliseconds
	timeDiff = endTime - start;
	start = endTime;
};

const automaticPlayback = async () => {
	console.log("Playing back text...");
	for (let x = 0; x < timeKeeper.length; x++) {
		let i = timeKeeper[x];
		try {
			await runPlaybackForCharacter(i.value, i.key);
		} catch (error) {
			playBtn.innerHTML = "Play";
			playBtn.style.backgroundColor = "green";
			console.log(
				"Something went wrong with runPlaybackForCharacter function.\n",
				error
			);
		}
	}
	playBtn.innerHTML = "Play";
	playBtn.style.backgroundColor = "green";

	console.log("Playback done.");
	console.log("Recorded data: ", timeKeeper);
};

function runPlaybackForCharacter(ms, characterValue) {
	console.log(characterValue, ms);
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			addCharacter(characterValue);
			resolve();
		}, ms);
	});
}
const addCharacter = function (key) {
	switch (key) {
		case "Backspace":
			recordedTextArea.value = recordedTextArea.value.slice(
				0,
				recordedTextArea.value.length - 1
			);
			break;
		case "Enter":
			recordedTextArea.value = recordedTextArea.value.concat("\r\n");
			break;
		case "Dead":
			recordedTextArea.value = recordedTextArea.value.concat("'");
			break;
		default:
			recordedTextArea.value = recordedTextArea.value.concat(key);
			break;
	}
};

const startRecording = () => {
	console.log("Started recording...");
	timeKeeper = [];
	typedTextArea.value = "";
	recordedTextArea.value = "";
	typedTextArea.disabled = false;
	typedTextArea.focus();
	playBtn.disabled = true;
	playBtn.style.backgroundColor = "green";
	recordingBtn.innerHTML = "Stop Recording";
	recordingBtn.style.backgroundColor = "red";
};

const stopRecording = () => {
	recordingBtn.style.backgroundColor = "green";
	recordingBtn.innerHTML = "Start Recording";
	automaticPlayback();
	playBtn.disabled = false;
	playBtn.innerHTML = "Playing";
	playBtn.style.backgroundColor = "red";
};

recordingBtn.addEventListener("click", (e) => {
	e.preventDefault();

	if (recordingBtn.innerHTML === "Start Recording") {
		startRecording();
	} else if (recordingBtn.innerHTML === "Stop Recording") {
		stopRecording();
	}
});

typedTextArea.addEventListener("focusin", () => {
	console.log("typeTextArea: focus received.");
	startTime();
});
typedTextArea.addEventListener("focusout", () => {
	console.log("typeTextArea: focus lost.");
	stopRecording();
});
typedTextArea.addEventListener("click", () => {
	startRecording();
	console.log("clicked");
});

typedTextArea.addEventListener("keydown", (e) => {
	nextTime();
	console.log(e);

	if (
		e.key &&
		e.key !== "Shift" &&
		!e.altKey &&
		!e.ctrlKey &&
		e.key !== "CapsLock"
	) {
		const key = e.key;
		const value = timeDiff;
		timeKeeper.push({
			key,
			value,
		});
	}
});

playBtn.addEventListener("click", () => {
	recordedTextArea.value = "";
	automaticPlayback();
});
