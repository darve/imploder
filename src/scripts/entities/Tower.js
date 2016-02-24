
'use strict';

var PIXI = require('pixi'),
    M = require('../modules/Math'),
    Vec = require('../modules/Vec'),
    Utils = require('../modules/Utils');

module.exports = (function() {

    var
        assets = {
            mid: [{ name: 'tower-mid', url: '/assets/img/tower.png' }]
        },
        barrels = [
            new Vec(6, 0),
            new Vec(26, 0)
        ];

    var Tower = function(opts) {

        var _ = this;
        this.type = 'tower';
        this.pos = new Vec( opts.position.x, opts.position.y );
        this.range = 200;
        this.vision = 0.3;
        this.vector = new Vec(0, -1);
        this.turnspeed = 0.06;
        this.attackspeed = 30;
        this.lastattack = 0;
        this.firing = false;
        this.barrels = [];
        this.lastbarrel = 0;

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
            width: 32,
            height: 32,
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

        barrels.forEach(function(b, i) {
            var temp = new PIXI.Sprite( new PIXI.Texture.fromImage('/assets/img/transparent.png'))
            temp.anchor.x = 0.5;
            temp.anchor.y = 0.5;
            temp.width = 1;
            temp.height = 1;
            temp.position.x = barrels[i].x;
            temp.position.y = barrels[i].y;

            _.barrels.push(temp);
            Utils.last(_.meathead).addChild(_.barrels[i]);
        });
    };

    Tower.prototype = {
        integrate: function(closest) {
            this.firing = false;

            if ( this.lastattack > 0 ) {
                this.lastattack--;
            }

            if ( closest ) {
                this.target = closest.winner.pos.clone();
                if ( closest.distance <= this.range ){
                    this.turn();

                    if ( this.lastattack === 0 ) {
                        this.lastattack = this.attackspeed;
                        this.firing = {
                            barrel: this.barrels[this.lastbarrel],
                            vector: this.vector.clone(),
                            target: this.target
                        }
                    }
                }
            }

            // console.log(this.lastattack, this.firing);
        },
        turn: function() {
            var _ = this;

            this.vecnorm = this.vector.normaliseNew();
            this.diffnorm = this.target.minusNew( this.pos ).normaliseNew();
            this.dot = M.diff(this.vecnorm.dot( this.diffnorm ), 1);
            this.dotTest = M.diff(this.vecnorm.rotate(this.turnspeed, true).dot( this.diffnorm ), 1);

            if ( this.dot <= this.dotTest ) {
                this.vector.rotate(-this.turnspeed, true);
            } else {
                this.vector.rotate(this.turnspeed, true);
            }

            this.meathead.forEach(function(v, i) {
                v.rotation = _.vector.angle(true)+Math.PI/2;
            });
        }
    };

    return {
        spawn: Tower,
        assets: assets
    };

})();
