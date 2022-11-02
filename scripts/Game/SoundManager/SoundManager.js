import _SoundManager_Legacy from "./_SoundManager_Legacy.js";
import _SoundManager_WebAudio from "./_SoundManager_WebAudio.js";

let SoundManager;
if ("AudioContext" in window) {
    SoundManager = _SoundManager_WebAudio;
    console.log(" Using _SoundManager_WebAudio class ", " web Audio Api");
} else {
    SoundManager = _SoundManager_Legacy;
    console.log(" Using _SoundManager_Legacy class ", " <audio>");
}

export default SoundManager;