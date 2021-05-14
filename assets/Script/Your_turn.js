// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        finish_Anim:{ //Maneja la animación
            default:null,
            type:cc.Component.EventHandler,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    update (dt) {
        
    },
    
    Appear_Disapear(){
        cc.log("Estoy apareciendo, bruh")
        this.node.active = true;
        this.node.opacity = 0;
        this.node.scale = 0.2;
        cc.tween(this.node)
        .to(0.5,{ scale:1, opacity:255 },{ easing: "quartInOut" })
        .call(() => { this.Hide_Window(); })
        .start();
    },

    Hide_Window(){
        cc.tween(this.node)
        .to(0.5,{ scale:0.2, opacity:0 },{ easing: "quartInOut" })
        .call(() => {
             this.node.active = false; 
             this.finish_Anim.emit()
            })
        .start();
    },
});
