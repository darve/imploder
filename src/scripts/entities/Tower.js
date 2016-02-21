
'use strict';

var PIXI = require('pixi'),
    M = require('../modules/Math'),
    Utils = require('../modules/Utils');

module.exports = (function() {

    var t,
        assets = {
            mid: [{ name: 'tower-mid', url: '/assets/img/tower.png' }]
        };

    var Tower = function(opts) {

        var _ = this;
        this.type = 'tower';
        this.range = 120;
        this.vision = 0.3;
        this.sprites = {
            bg: [],
            mid: [],
            fg: []
        };
        this.meathead = [];

        opts = Utils.override(opts, {
            anchor: {
                x: 0.5,
                y: 0.5
            },
            width: 50,
            height: 50,
            rotation: M.rand(0, Math.PI*2)
        });

        for ( var sprite in assets ) {
            assets[sprite].forEach(function(v, i) {
                _.sprites[sprite].push(new PIXI.Sprite(new PIXI.Texture.fromImage(v.url)));
                for ( var prop in opts ) {
                    Utils.last(_.sprites[sprite])[prop] = opts[prop];
                    _.meathead.push(Utils.last(_.sprites[sprite]));
                }
            });
        }
    };

    Tower.prototype = {
        integrate: function() {
            this.meathead.forEach(function(v, i) {
                v.rotation += 0.01;
            });
        }
    };

    return {
        spawn: Tower,
        assets: assets
    };

})();
