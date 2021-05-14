// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var time = 0
var Tonada = require("Tonada");

const STATE_WAITING = -1
const STATE_RECORDING = 0
const STATE_LISTENING = 1
const STATE_PLAY = 2
const STATE_LOSS = 3
const STATE_WIN = 4
var CURRENT_STATE = STATE_WAITING
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
//Variables for listening mechanic
var timeLstarted = 0 //Tiempo donde empezó a escuchar
var maxTimeInitList = 2 //miliseconds


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
        //this.seucencia = JSON.parse(cc.sys.localStorage.getItem(this.node.name))
        this.node.on("start", function(event){
            this.normalStart()
        },this)

        this.updateState()
        this.linkListening()
        this.linkAudios()
    },
    
    start () {
    },

    normalStart: function(){
        if(CURRENT_STATE == STATE_RECORDING){
            cc.log("La secuencua está vacía, vamos a grabar")
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
        else{
            
            this.Secuencia = Global.secuencia
        }
        
    },

    linkListening:function(){
        for(var i=0; i<this.Buttons.length;i++){
            this.Buttons[i].node.on(cc.Node.EventType.TOUCH_START, function(event){
                this.listeningSequence(event)
                }, this)

        }
    },
    listeningSequence: function(event){
        
        if(CURRENT_STATE == STATE_LISTENING){
            if(sequenceIterator<this.Secuencia.length){
                var currentTime = (Date.now())/1000
                var RtimePressed = (currentTime - timeLstarted) 
                var RtimeSeq = this.Secuencia[sequenceIterator].tRelativeStart

                if(this.Secuencia[sequenceIterator].numButton == event.target.getComponent("button").number){
                    
                    if(sequenceIterator == 0){
                        if(RtimePressed <= RtimeSeq+maxTimeInitList){
                            timeLstarted = (Date.now())/1000
                            if(sequenceIterator==this.Secuencia.length-1){
                                cc.log("Ganaste!!!!")
                                this.changeState(STATE_WIN)
                            }
                            else{
                                cc.log("Buen primer paso!")
                                
                            }
                        }
                        else{
                            cc.log("iniciaste muy tarde U_U")
                            cc.log("RelativePress: "+ RtimePressed)
                            cc.log("RelativeSeq: "+ RtimeSeq)
                            this.changeState(STATE_LOSS)
                        }
                    }
                    else{
                        if((RtimePressed >= RtimeSeq-0.4 && RtimePressed <= RtimeSeq+0.4)){
                            if(sequenceIterator==this.Secuencia.length-1){
                                cc.log("Ganaste!!!!")
                                this.changeState(STATE_WIN)
                            }
                            else{
                                cc.log("Vamos exelente ^-^")
                                
                            }
                        }
                        else{
                            cc.log("Perdiste, te pasaste del tiempo!")
                            cc.log("RelativePress: "+ RtimePressed)
                            cc.log("RelativeSeq: "+ RtimeSeq)
                            this.changeState(STATE_LOSS)
                        }
                    }
                }
                else{
                    cc.log("Perdiste, Botón equivocado!")
                    this.changeState(STATE_LOSS)
                }
                
                sequenceIterator++
            }
            else{
                
            }
        }
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
                    tRelativeStart = 0
                    
                    timeRstarted = (Date.now())/1000
                    
                    firstButton = false   
                }
                else{
                    tRelativeStart = (Date.now())/1000 - timeRstarted
                }
            }
            else{
                timeLastTouchend = (Date.now())/1000
                cc.log("Terminé de grabar")
                Global.secuencia = this.Secuencia
                tRelativEnd = timeLastTouchend - timeLastTouchstart         
                this.Secuencia.push(new Tonada(event.target.getComponent("button").number,tRelativeStart,  tRelativEnd))
                cc.log(this.Secuencia)
            }
            
        } 
    },
    playSequence: function(){   
        //cc.log("Estamos reproduciendo la seq")     
        if(sequenceIterator < this.Secuencia.length){
            var currentTime = (Date.now())/1000
            var diffTime = (currentTime - timePstarted) 
            if(diffTime >= this.Secuencia[sequenceIterator].tRelativeStart){
                var numBu = this.Secuencia[sequenceIterator].numButton
                cc.log("Tocando la tecla "+numBu+ "en el tiempo "+ diffTime)
                this.Buttons[numBu].node.dispatchEvent(new cc.Event.EventCustom(cc.Node.EventType.TOUCH_START, true))
                this.scheduleOnce(function() {
                    // Here `this` is referring to the component
                    this.touchend(numBu)
                    
                },this.Secuencia[sequenceIterator].tRelativeEnd);
                
                sequenceIterator ++
            }
        }
        else{
            //timePstarted = (Date.now())/1000 + 0.4
            cc.log("Acabo de procucir played true")
            timePstarted = 0
            sequenceIterator = 0
            Global.sequencePlayed = true
        }
    },
    touchend: function(numBu){
        this.Buttons[numBu].node.dispatchEvent(new cc.Event.EventCustom(cc.Node.EventType.TOUCH_END, true))
    },
    update (dt) {
        CURRENT_STATE = Global.levelState
        switch(CURRENT_STATE){
            case STATE_WAITING:
                break;
            case STATE_RECORDING:
                var currentTime = (Date.now())/1000
                if(timeLastTouchend+3 <= currentTime && timeLastTouchstart+5 <= currentTime && !firstButton){
                    cc.log("Secuencia:")
                    Global.secuencia = this.Secuencia  //Global variable
                    readyToPlay = true
                    this.changeState(STATE_PLAY)
                    timePstarted = (Date.now())/1000
                    cc.log("Cambiamos a: " +CURRENT_STATE)
                }
                break;
            case STATE_PLAY:
                if(timePstarted == 0) timePstarted = (Date.now())/1000;
                buttonIterator = 0
                this.playSequence()
                break;
            case STATE_LISTENING:
                if(timeLstarted == 0){
                    timeLstarted = (Date.now())/1000;
                    cc.log("Empecemos a escuchar, chaval")
                }
                break;
            default:
                //cc.log("Cannot recognize this state: " + CURRENT_STATE)
                break;
                
        }
        
    },
    changeState: function(newState){
        CURRENT_STATE = newState
        Global.levelState = newState
    },

    updateState: function(){
        CURRENT_STATE = Global.levelState
    }
});
