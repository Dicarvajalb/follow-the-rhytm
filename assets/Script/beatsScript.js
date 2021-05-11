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
//Variables for play sequence
var timePstarted = 0
var sequenceIterator = 0
//Variables for buttons control
var timeRstarted = 0 // Donde empezó a grabar.
var firstButton = false
var buttonIterator = 0
var timeLastTouchend = 0
var timeLastTouchstart = 0
var tRelativeStart = 0 // tiempo relativo donde se presionó la tecla.
var tRelativEnd = 0 //tiempo relativo donde se soltó la tecla.

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
        
        if(this.Secuencia.length == 0){
            cc.log("La secuencua está vacía, vamos a grabar")
            CURRENT_STATE = STATE_RECORDING
            firstButton = true;
            //Link event with my own listening function
            for(var i=0; i<this.Buttons.length;i++){
                this.Buttons[i].node.on(cc.Node.EventType.TOUCH_START, function(event){
                    this.recordSequence(event)
                    }, this)

                this.Buttons[i].node.on(cc.Node.EventType.TOUCH_END, function(event){
                    this.recordSequence(event)
                    }, this)
            }
        }
        this.linkAudios()
    },
    
    start () {
    },


    linkAudios: function(){
        for(var i=0; i<this.Buttons.length;i++){
            this.Buttons[i].getComponent("button").audio = (this.Sonidos[i])
            this.Buttons[i].getComponent("button").number = i
        }

    },

    recordSequence: function(event){
        if(CURRENT_STATE == STATE_RECORDING){
            if(event.type === cc.Node.EventType.TOUCH_START){
                timeLastTouchstart = (Date.now())/1000
                if(firstButton){
                    tRelativeStart = 0.4
                    timeRstarted = (Date.now())/1000 - 0.4
                    
                    firstButton = false   
                }
                else{
                    tRelativeStart = (Date.now())/1000 - timeRstarted
                }
            }
            else{
                timeLastTouchend = (Date.now())/1000
                cc.log("Terminé de grabar")    
                tRelativEnd = timeLastTouchend - timeLastTouchstart         
                this.Secuencia.push(new Tonada(event.target.getComponent("button").number,tRelativeStart,  tRelativEnd))
                cc.log(this.Secuencia)
            }
            
        } 
    },
    playSequence: function(){        
        if(sequenceIterator < this.Secuencia.length){
            var currentTime = (Date.now())/1000
            var diffTime = (currentTime - timePstarted) 
            if(diffTime >= this.Secuencia[sequenceIterator].tRelativeStart){
                var numBu = this.Secuencia[sequenceIterator].numButton
                cc.log("Tocando la tecla "+numBu+ "en el tiempo "+ diffTime)
                this.Buttons[numBu].node.dispatchEvent(new cc.Event.EventCustom(cc.Node.EventType.TOUCH_START, true))
                this.Buttons[numBu].node.dispatchEvent(new cc.Event.EventCustom(cc.Node.EventType.TOUCH_END, true))
                sequenceIterator ++
            }
        }
        else{
            timePstarted = (Date.now())/1000
            sequenceIterator = 0
        }
    },
    update (dt) {
        
        switch(CURRENT_STATE){
            case STATE_RECORDING:
                var currentTime = (Date.now())/1000
                if(timeLastTouchend+3 <= currentTime && timeLastTouchstart+5 <= currentTime && !firstButton){
                    CURRENT_STATE = STATE_PLAY
                    timePstarted = (Date.now())/1000
                    cc.log("Cambiamos a: " +CURRENT_STATE)
                }
                break;
            case STATE_PLAY:
                buttonIterator = 0
                this.playSequence()
                //CURRENT_STATE = STATE_LISTENING
                break;
            case STATE_LISTENING:
                break;
                
        }
        
    },
    playAudio: function(){
    },
});
