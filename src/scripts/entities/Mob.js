
'use strict';

var PIXI = require('pixi'),
    M = require('../modules/Math'),
    Vec = require('../modules/Vec'),
    Utils = require('../modules/Utils');

module.exports = (function() {

    var
        assets = {
            mid: [{ name: 'mob-mid', url: '/assets/img/mob.png' }]
        };

    var Mob = function(opts) {

        var _ = this;
        this.type = 'mob';

        this.pos = new Vec(opts.position.x, opts.position.y);
        this.target = new Vec(opts.target.x, opts.target.y);
        this.diff = this.target.minusNew( this.pos );
        this.vector = new Vec( 0, -2);
        this.health = 100;

        this.sprites = {
            bg: [],
            mid: [],
            fg: []
        };

        // meathead is a straight up array of the sprites that make up this entity. We don't give no fucks about layers here son.
        this.meathead = [];

        opts = Utils.override(opts, {
            anchor: {
                x: 0.5,
                y: 0.5
            },
            width: 24,
            height: 41
        });

        for ( var sprite in assets ) {
            assets[sprite].forEach(function(v, i) {
                _.sprites[sprite].push(new PIXI.Sprite(new PIXI.Texture.fromImage(v.url)));
                _.meathead.push(Utils.last(_.sprites[sprite]));
                for ( var prop in opts ) {
                    Utils.last(_.sprites[sprite])[prop] = opts[prop];
                }
            });
        }

        console.log(_.meathead);
    };

    Mob.prototype = {
        integrate: function() {
            var _ = this;
            this.diff = this.target.minusNew( this.pos );
            this.dotDiff = M.diff(this.vector.normaliseNew().dot( this.diff.normaliseNew() ), 1);
            this.dotTest = M.diff(this.vector.normaliseNew().rotate(0.02, true).dot( this.diff.normaliseNew() ), 1);
            // console.log(this.vector.normaliseNew().dot(this.diff.normaliseNew() ));
            // debugger;
            if ( this.dotDiff <= this.dotTest ) {
                this.vector.rotate(-0.02, true);
            } else {
                this.vector.rotate(0.02, true);
            }

            if ( !this.pos.isCloseTo(this.target, 10) ) {
                this.pos.plusEq( this.vector );
            } else {
                this.health = 0;
            }

            this.meathead.forEach(function(v, i){
                v.position.x = _.pos.x;
                v.position.y = _.pos.y;
                v.rotation = _.vector.angle(true)+Math.PI/2;
            });
        }
    };

    return {
        spawn: Mob,
        assets: assets
    };

})();

