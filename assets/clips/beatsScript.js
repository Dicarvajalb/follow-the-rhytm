// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var time = 0
var Tonada = require("Tonada");
cc.Class({
    extends: cc.Component,
    
    properties: {
        height: 20,
        Buttons: {
            default: [],
            type: [cc.Button]
        },
        Sonidos: {
            default: [],
            url: [cc.AudioClip]
        },
        audio: {
            default: null,
            type: cc.AudioClip
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //var button = this.node.getComponent(cc.Button);
        
        //button.node.on(cc.Node.EventType.TOUCH_START, this.playAudio, this);
        sonido = new Tonada(50, 3.3)
        this.linkAudios()
    },
    
    start () {
    },


    linkAudios: function(){
        cc.log(this.Buttons)
        cc.log((this.Sonidos))
        cc.log((this.audio))
        for(var i=0; i<this.Buttons.length;i++){
            this.Buttons[i].getComponent("button").audio = (this.Sonidos[i])
            cc.log(this.Buttons[i].getComponent("button"))
        }

    },
    update (dt) {
        
        /*if(time + 1 <= (new Date()).getTime()/1000 || time == 0){
            time = (new Date()).getTime()/1000
            cc.log(time)
            this.node.emit(cc.Node.EventType.TOUCH_START)
            
        }*/
        
    },
    playAudio: function(){
        cc.log("HMM")
    },
});
