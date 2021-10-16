/* ISSUES/FEATURES:
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

const automaticPlayback = async function () {
	console.log("Playing back text...");
	for (let x = 0; x < timeKeeper.length; x++) {
		let i = timeKeeper[x];
		console.log(i);
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

let typedAreaLostFocus = false;
const stopRecording = () => {
	automaticPlayback();
	playBtn.disabled = false;
	playBtn.innerHTML = "Playing";
	playBtn.style.backgroundColor = "red";
};

recordingBtn.addEventListener("click", (e) => {
	e.preventDefault();
	if (!typedAreaLostFocus) {
		if (recordingBtn.innerHTML === "Reset") {
			recordingBtn.style.backgroundColor = "green";
			recordingBtn.innerHTML = "Start Recording";
			typedTextArea.value = "";
			recordedTextArea.value = "";
			typedTextArea.disabled = false;
			playBtn.disabled = true;
		} else if (recordingBtn.innerHTML === "Start Recording") {
			console.log("Start Recording");
			startRecording();
		} else if (recordingBtn.innerHTML === "Stop Recording") {
			console.log("Stop Recording");
			recordingBtn.innerHTML = "Reset";
			typedTextArea.value = "";
			recordedTextArea.value = "";
			typedTextArea.disabled = false;
			stopRecording();
		}
	} else {
		if (recordingBtn.innerHTML === "Reset") {
			if (recordedTextArea.value !== "") {
				recordingBtn.style.backgroundColor = "green";
				recordingBtn.innerHTML = "Start Recording";
			}
			typedTextArea.value = "";
			recordedTextArea.value = "";
			typedTextArea.disabled = false;
			playBtn.disabled = true;
		}
		typedAreaLostFocus = false;
	}
});

typedTextArea.addEventListener("focusin", () => {
	console.log("typeTextArea: focus received.");
	typedAreaLostFocus = false;
	startTime();
});

typedTextArea.addEventListener("focusout", () => {
	console.log("typeTextArea: focus lost.");
	if (recordingBtn.innerHTML === "Stop Recording") {
		recordingBtn.innerHTML = "Reset";
		typedTextArea.value = "";
		recordedTextArea.value = "";
		typedTextArea.disabled = false;
		playBtn.disabled = true;
	}
	typedAreaLostFocus = true;
	stopRecording();
});
typedTextArea.addEventListener("click", () => {
	console.log("clicked");
	startRecording();
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
	stopRecording();
});
