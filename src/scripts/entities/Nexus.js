

'use strict';

var PIXI = require('pixi'),
    M = require('../modules/Math'),
    Vec = require('../modules/Vec'),
    Utils = require('../modules/Utils');

module.exports = (function() {

    var
        assets = {
            mid: [{ name: 'nexus-mid', url: '/assets/img/nexus.png' }]
        };

    var Nexus = function(opts) {

        var _ = this;
        this.type = 'nexus';
        this.pos = new Vec(opts.position.x, opts.position.y);
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
            width: 100,
            height: 100
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

    Nexus.prototype = {
        integrate: function() {
        }
    };

    return {
        spawn: Nexus,
        assets: assets
    };

})();
