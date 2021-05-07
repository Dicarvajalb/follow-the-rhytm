// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        audio:{
            type: cc.AudioClip
        }
       
    },
    start () {
        this.node.on(cc.Node.EventType.TOUCH_START, function(event){
        this.current = cc.audioEngine.playEffect(this.audio,false, 1)
        }, this)
    },

    update (dt) {
        
    },

    playAudio: function(){  
        this.current = cc.audioEngine.play(this.audio,false, 1)
    }
});
