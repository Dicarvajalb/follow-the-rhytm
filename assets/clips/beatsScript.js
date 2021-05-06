// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var time = 0
cc.Class({
    extends: cc.Component,
    Tonada: require("Tonada"),
    properties: {
        buttons: [cc.Button],
        Sonidos: [cc.AudioClip]
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.log("Hola, estoy presente en load")

        var button = this.node.getComponent(cc.Button);
        
        button.node.on(cc.Node.EventType.TOUCH_START, this.playAudio, this);
        sonido = new this.Tonada(50, 3.3)
        cc.log("Sonidos: "+ sonido.numButton)
        this.linkAudios()
        

    },
    
    start () {
    },

    playAudio: function(Audio){
        this.current = cc.audioEngine.play(Audio, false, 1);
    },
   
    linkAudios: function(){
        cc.log(this.buttons[0])
        for(var i=0; i<this.buttons.length;i++){
            this.buttons[i].node.on(cc.Node.EventType.TOUCH_START, this.playAudio(Sonidos[i]), this)
        }

    },
    update (dt) {
        
        /*if(time + 1 <= (new Date()).getTime()/1000 || time == 0){
            time = (new Date()).getTime()/1000
            cc.log(time)
            this.node.emit(cc.Node.EventType.TOUCH_START)
            
        }*/
        
    },
});
