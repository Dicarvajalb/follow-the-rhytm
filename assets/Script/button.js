// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var time = 0
cc.Class({
    extends: cc.Component,

    properties: {
        audio:{
            default: null,
            type: cc.AudioClip
        },
        number:{
            default: null,
            type: cc.Integer
        }
       
    },
    start () {
        this.node.on(cc.Node.EventType.TOUCH_START, function(event){
            this.current = cc.audioEngine.play(this.audio,false, 1)
        }, this)
        time = (Date.now())/1000 
    },

    update (dt) {
    },

    playAudio: function(){  
        
    }
});
