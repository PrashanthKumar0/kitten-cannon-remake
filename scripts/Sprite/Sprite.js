export default class Sprite {
    constructor(sprite_url, image_extension = '.png') {
        // ! PUBLIC

        this.name = sprite_url;
        this.url = sprite_url;
        this.img_src = sprite_url + image_extension;
        this.json_src = sprite_url + '.json';

        // ! Private
        this.__image = null;
        this.__json = null;
        this.__loaded = false;
    }


    async load() {
        // load json file
        await fetch(this.json_src)
            .then(res => res.json())
            .then(
                ((json) => {
                    this.__json = json;
                }).bind(this)
            )
            .catch(err => { throw new Error(err); });

        // load the image file
        await new Promise(function (resolve, reject) {
            this.__image = new Image();
            this.__image.src = this.img_src;
            this.__image.onload = resolve;
            this.__image.onerror = reject;
        }.bind(this))
            .then(res => { })
            .catch(err => { throw new Error(err); })


        this.__loaded = true;
        return this;
    }

}