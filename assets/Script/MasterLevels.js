// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
const STATE_WAITING = -1
const STATE_RECORDING = 0
const STATE_LISTENING = 1
const STATE_PLAY = 2
const STATE_LOSS = 3
const STATE_WIN = 4
//Estados de animación
const STATE_YOURTURN = 5
var CURRENT_STATE = STATE_WAITING
var isNecesarySaveSeq = true
var nameLevel = ""
var TentativeState = -10
cc.Class({
    extends: cc.Component,

    properties: {
        Your_Turn_Event_Handler:{ //Maneja la animación
            default:null,
            type:cc.Component.EventHandler,
        },
       levels:{
           
           default:[],
           type: [cc.Node]
       }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        window.Global = {
            levelState: null,
            secuencia: null,
            sequencePlayed : false
        };
        nameLevel = this.node.children[0].name
        //Insert format of levels 
        
    },

    start () {
        //cc.sys.localStorage.setItem(nameLevel, undefined)
        this.scheduleOnce(function() {
            // Here `this` is referring to the component
            this.normalStart()
        },2);
        
    },
    normalStart: function(){
        cc.log("Es: "+cc.sys.localStorage.getItem(nameLevel))
        if(cc.sys.localStorage.getItem(nameLevel) == "null" || cc.sys.localStorage.getItem(nameLevel) == "undefined" || !cc.sys.localStorage.getItem(nameLevel)) {
            Global.secuencia = null
            cc.log("Entonces grabemos")
            this.changeState(STATE_RECORDING);
            
        }
        else{
            
            Global.secuencia = JSON.parse(cc.sys.localStorage.getItem(nameLevel))
            isNecesarySaveSeq = false
            this.changeState(STATE_PLAY);
        }
        cc.log("iniciamos con el stado: "+ CURRENT_STATE)
        this.node.children[0].emit("start")
    },
    update (dt) {
        switch(Global.levelState){
            case STATE_RECORDING:
                break;
            case STATE_PLAY:
                if(isNecesarySaveSeq){
                    cc.sys.localStorage.setItem(nameLevel, JSON.stringify(Global.secuencia))
                    isNecesarySaveSeq = false
                    cc.log("Se guardó la secuencia")
                }
                if(Global.sequencePlayed){                                            
                    cc.log("Se terminó de tocar la secuencia")
                    this.Your_Turn_Event_Handler.emit()
                    this.changeState(STATE_WAITING)
                }
                //cc.log("En estado play")
            case STATE_LISTENING:
                break;
            case STATE_WAITING:
                break;
            default:
                break;
        }
    },

    changeState: function(newState){
        CURRENT_STATE = newState
        Global.levelState = newState
    },

    finish_yourTurnAnim(){
        this.changeState(STATE_LISTENING)
    }
});
