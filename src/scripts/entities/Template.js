
'use strict';

var PIXI = require('pixi');

module.exports = (function() {

    var Tower = function() {

        // How close to this tower do the mobs have to be for it to kick right off
        this.range = 120;

        // When can it start firing when it is rotating to shoot at a mob
        this.vision = 0.3;

        // Towers can be levelled up and that, yeah?
        // this.level = 1;

        this.assets = [{ name: 'tower', url: '/assets/img/tower.png' }];

        // The positions of the barrel end-points on the sprite.
        // this.barrels = [];
    };

    Tower.prototype = {

        integrate: function() {

        }
    };

    return {
        new: function(opts) {
            return {
                type: 'tower',
                entity: new Tower(opts),
                assets: {
                    mid: { name: 'tower-mid', url: '/assets/img/tower.png' }
                }
            };
        }
    };

});
