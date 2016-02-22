
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
        this.turnspeed = 0.02;
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
            width: 20,
            height: 33
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

    };

    Mob.prototype = {
        integrate: function() {

            var _ = this;

            this.turn();
            this.move();
            this.meathead.forEach(function(v, i){
                v.position.x = _.pos.x;
                v.position.y = _.pos.y;
                v.rotation = _.vector.angle(true)+Math.PI/2;
            });
        },

        turn: function() {

            this.vecnorm = this.vector.normaliseNew();
            this.diffnorm = this.target.minusNew( this.pos ).normaliseNew();
            this.dot = M.diff(this.vecnorm.dot( this.diffnorm ), 1);
            this.dotTest = M.diff(this.vecnorm.rotate(this.turnspeed, true).dot( this.diffnorm ), 1);

            if ( this.dot <= this.dotTest ) {
                this.vector.rotate(-this.turnspeed, true);
            } else {
                this.vector.rotate(this.turnspeed, true);
            }
        },

        move: function() {
            if ( !this.pos.isCloseTo(this.target, 10) ) {
                this.pos.plusEq( this.vector );
            } else {
                this.health = 0;
            }
        }
    };

    return {
        spawn: Mob,
        assets: assets
    };

})();

