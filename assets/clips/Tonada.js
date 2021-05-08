cc.Class({
    properties:{
        numButton:{
            default: 0,
            type: cc.Integer
        },
        tRelative:{
            default: 0,
            type: cc.Float
        }
    },
    ctor: function (numButton, tRelative) {
        this.numButton = numButton;
        this.tRelative = tRelative;
    }
});