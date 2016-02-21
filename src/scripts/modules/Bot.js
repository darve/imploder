
'use strict';

var Vec = require('./Vec'),
    curve = require('./Curve'),
    M = require('./Math');

window.M = M;
module.exports = (function() {

    var Bot = function( posx, posy, speed, targetx, targety, gfx ) {

        var _ = this;

        _.pos = new Vec(posx, posy);
        _.target = new Vec(targetx, targety);

        _.diff = _.target.minusNew( _.pos );
        _.distance = _.diff.magnitude();
        // _.vector = _.pos.minusNew(_.target).normaliseNew().multiplyEq(3);
        _.vector = new Vec( (Math.random() * 2)-1, (Math.random() * 2)-1 ).normalise().multiplyEq(6);
        _.speed = speed;

        _.history = [];
        _.alive = true;
        _.gfx = gfx;
        _.framecount = 0;
    };

    Bot.prototype = {

        draw: function() {
            this.gfx.clear();
            // this.gfx.beginFill(0xFFFFFF, 1);
            // this.gfx.lineStyle(1, 0xFFFFFF, 1);
            // this.gfx.drawCircle(this.pos.x, this.pos.y, 5);
            curve.draw(this.gfx, this.history, 0.38888, 0xFFFFFF);
        },

        calculate: function() {

        },

        integrate: function(power) {

            this.diff = this.target.minusNew( this.pos );
            this.dotDiff = M.diff(this.vector.normaliseNew().dot( this.diff.normaliseNew() ), 1);
            this.dotTest = M.diff(this.vector.normaliseNew().rotate(0.02, true).dot( this.diff.normaliseNew() ), 1);

            if ( this.dotDiff <= this.dotTest ) {
                this.vector.rotate(-0.02, true);
            } else {
                this.vector.rotate(0.02, true);
            }

            if ( !this.pos.isCloseTo(this.target, 10) ) {
                this.pos.plusEq( this.vector );
                this.history.push(this.pos.x);
                this.history.push(this.pos.y);
            }

            if ( this.history.length > 40 || this.pos.isCloseTo(this.target, 10) ) {
                this.history.shift();
                this.history.shift();
            }

            if ( this.history.length < 1 ) {
                this.alive = false;
            }

            this.draw();
        }
    };

    return Bot;
})();
