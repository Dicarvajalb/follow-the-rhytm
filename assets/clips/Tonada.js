cc.Class({
    properties:{
        numButton:{
            default: 0,
            type: cc.Integer
        },
        tRelativeStart:{
            default: 0,
            type: cc.Float
        },
        tRelativeEnd:{
            default: 0,
            type: cc.Float
        }
    },
    ctor: function (numButton, tRelativeStart, tRelativeEnd) {
        this.numButton = numButton;
        this.tRelativeStart = tRelativeStart;
        this.tRelativeEnd = tRelativeEnd
    }
});