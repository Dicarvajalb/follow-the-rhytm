// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var time = 0
var Tonada = require("Tonada");
var STATE_RECORDING = 0
var STATE_LISTENING = 1
var STATE_PLAY = 2
var CURRENT_STATE = 1
var firstButton = false
var buttonIterator = 0
var timePress = 0 
cc.Class({
    extends: cc.Component,
    
    properties: {
        Buttons: {
            default: [],
            type: [cc.Button]
        },
        Sonidos: {
            default: [],
            type: [cc.AudioClip]
        },
        Secuencia: {
            default: [],
            type: [Tonada]
        }
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //this.node.on(cc.Node.EventType.TOUCH_START, function(event){cc.log("Sí reflejó")}, this)
        //var button = this.node.getComponent(cc.Button);
        
        //button.node.on(cc.Node.EventType.TOUCH_START, this.playAudio, this);
        sonido = new Tonada(50, 3.3)
        
        if(this.Secuencia.length == 0){
            CURRENT_STATE = STATE_RECORDING
            firstButton = true;
            time = (Date.now())/1000
            cc.log("Tiempo: "+this.time)
            //Link event with my own listening function
            /*for(var i=0; i<this.Buttons.length;i++){
                this.Buttons[i].node.on("Recording", function(event){
                    this.recordSequence(event)
                    }, this)
            }*/
        }
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
            this.Buttons[i].getComponent("button").number = i
            cc.log(this.Buttons[i].getComponent("button"))
        }

    },

    recordSequence: function(event){
        if(CURRENT_STATE == STATE_RECORDING){
        var rTime = 0
        if(firstButton){
            rTime = 0
            firstButton = false   
        }
        else{
            rTime = (Date.now())/1000 - time
        }
        this.Secuencia.push(new Tonada(event.target.getComponent("button").number,rTime))
        timePress = (Date.now())/1000
        cc.log(this.Secuencia)
        } 
    },
    update (dt) {
        
        switch(CURRENT_STATE){
            case STATE_RECORDING:
                if((Date.now())/1000 - timePress >= 3){
                    CURRENT_STATE = STATE_PLAY
                    cc.log(CURRENT_STATE)
                }
                break;
            case STATE_PLAY:
                CURRENT_STATE = STATE_LISTENING
                setTimeout(this.playSequence(), 10000);
                cc.log("Hola de tocar?")
                
                break;
            case STATE_LISTENING:
                break;
                
        }
        
    },
    playAudio: function(){
        cc.log("HMM")
    },

    playSequence: function(){
        //this.Buttons[0].node.emit(cc.Node.EventType.TOUCH_START)
        cc.log("Acabo de tocar")
    }
});
