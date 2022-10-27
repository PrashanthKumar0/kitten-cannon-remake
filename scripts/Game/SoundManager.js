export default class SoundManager {
    constructor() {
        this.__sound_map = {};
        this.onLoad = (song_name, progress_percentage) => { };
        this.__progress = 0;
        this.loaded = false;
    }
    addSound(sound_name, sound_url, volume = 1.0) {
        if (this.__sound_map[sound_name] != undefined) return this;
        this.__sound_map[sound_name] = {
            url: sound_url,
            audio: null,
            vol: volume,
        };
        return this;
    }

    loadAll() {
        let sound_map_keys = Object.keys(this.__sound_map);
        let total_files = sound_map_keys.length;
        if (total_files == 0) return;
        sound_map_keys.forEach((sound_map_key) => {
            let sound_obj = this.__sound_map[sound_map_key];
            if (sound_obj.audio != null) return;

            sound_obj.audio = new Audio();
            sound_obj.audio.src = sound_obj.url;

            sound_obj.audio.oncanplaythrough = () => {
                this.__progress++;
                let percentage = (this.__progress / total_files) * 100;
                this.onLoad(sound_map_key, percentage);
                this.loaded = percentage >= 100;
            };

            // sound_obj.audio.addEventListener("error", () => { // TODO : handle error
            //     this.__progress++;
            //     this.onLoad(sound_map_key, (this.__progress / total_files) * 100);
            // });


        });
        return this;
    }

    play(sound_name) {
        let sound_obj = this.__sound_map[sound_name];
        if (!sound_obj) return;
        if (sound_obj.audio == null) return;
        if (!sound_obj.audio.paused) return;
        sound_obj.audio.play();
        sound_obj.audio.volume = sound_obj.vol;
        return sound_obj.audio;
    }
}