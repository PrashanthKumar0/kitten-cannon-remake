const key_pressed=[];
const event_callback_map={};
export const KEYS={
    "arrowup":"arrowup",
    "arrowdown":"arrowdown",
    "w":"w",
    "s":"s",
    "space":" ",
}; 
// Object.freeze(KEYS);
export function registerKeyEventCallback(key_name,callback){
    let callback_el=event_callback_map[key_name];
    if(!callback_el){
        event_callback_map[key_name]=[callback];
    }else{
        event_callback_map[key_name].push(callback);
    }
}
export function handleKeyboardCallbacks(){
    let keys=Object.keys(event_callback_map);
    keys.forEach(key=>{
        if(key_pressed.includes(key)){
            let callback_array=event_callback_map[key];
            callback_array.forEach(callback=>{callback();});
        }
    });
}
window.addEventListener("keydown",function(e){
    let key=e.key.toLocaleLowerCase();
    if(!key_pressed.includes(key)){
        key_pressed.push(key);
    }
    
    // console.log("down",key_pressed);
});
window.addEventListener("keyup",function(e){
    let key=e.key.toLocaleLowerCase();
    let idx=key_pressed.indexOf(key);
    if(idx!=-1){
        key_pressed.splice(idx,1);
    }
    // console.log("up",key_pressed);
});
window.addEventListener("blur",function(){
    key_pressed.splice(0,key_pressed.length);
});