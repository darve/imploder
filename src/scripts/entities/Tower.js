
'use strict';

var PIXI = require('pixi'),
    M = require('../modules/Math'),
    Vec = require('../modules/Vec'),
    Utils = require('../modules/Utils');

module.exports = (function() {

    var
        assets = {
            mid: [{ name: 'tower-mid', url: '/assets/img/tower.png' }]
        };

    var Tower = function(opts) {

        var _ = this;
        this.type = 'tower';
        this.pos = new Vec( opts.position.x, opts.position.y);
        this.range = 400;
        this.vision = 0.3;
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
            width: 50,
            height: 50,
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

    Tower.prototype = {
        integrate: function(mob) {
            var _ = this;
            if ( mob ) {
                this.diff = mob.pos.minusNew( this.pos );
                this.meathead.forEach(function(v, i) {
                    v.rotation = _.diff.angle(true)+Math.PI/2;
                });
            }
        }
    };

    return {
        spawn: Tower,
        assets: assets
    };

})();
