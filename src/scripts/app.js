
'use strict';

var

    PIXI            = require('pixi'),
    $               = require('jquery'),

    Vec             = require('./modules/Vec'),
    M               = require('./modules/Math'),
    Utils           = require('./modules/Utils'),
    gfx             = require('./modules/Graphics'),
    input           = require('./modules/Input'),

    entities        = {
        Tower: require('./entities/Tower')
        // Mob: require('./entities/Mob')
    };

    window.entities = entities;

(function(win, doc, c) {

    var stage,
        renderer,
        w = win.innerWidth,
        h = win.innerHeight,

        // These are all used for the main rendering loop
        now,
        delta,
        then = Date.now(),
        interval = 1000/60,

        sprites = {
            tower: [],
            mob: []
        },

        layers = {
            bg: new PIXI.Graphics(),
            mid: new PIXI.Graphics(),
            fg: new PIXI.Graphics()
        },

        loader;


    function render() {
        window.requestAnimationFrame(render);
        now = Date.now();
        delta = now - then;

        if (delta > interval) {
            then = now - (delta % interval);

            for ( var sprite in sprites ) {
                if ( sprites[sprite].length ) {
                    sprites[sprite].forEach(function(v, i){
                        v.integrate();
                    });
                }
            }
            renderer.render(stage);
        }
    }

    function spawn(entity, opts) {

        var obj = new entity.spawn(opts);

        // // Add the object to its respective array
        sprites[obj.type].push(obj);

        // Add the actual sprite textures to the appropriate place.
        for ( var i in obj.assets ) {
            layers[i].addChild(obj.assets[i].url);
        }

        return obj;
    }

    function listeners() {

        $(win).resize(function() {
            renderer.resize(window.innerWidth, window.innerHeight);
        });

        $(doc).on('click', function(e) {
            e.preventDefault();
            var temp = spawn(entities.Tower, {
                position: {
                    x: e.pageX,
                    y: e.pageY
                }
            });

            for ( var layer in temp.sprites ) {
                temp.sprites[layer].forEach(function(v) {
                    layers[layer].addChild(v);
                });
            }

        });

        $(doc).on('touchend', function(e) {
            e.preventDefault();

            var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0]

            var temp = spawn(entities.Tower, {
                position: {
                    x: touch.pageX,
                    y: touch.pageY
                }
            });

            for ( var layer in temp.sprites ) {
                temp.sprites[layer].forEach(function(v) {
                    layers[layer].addChild(v);
                });
            }
        });
    }

    function init() {

        stage = new PIXI.Container();
        renderer = new PIXI.WebGLRenderer(w, h, {
            view: c,
            backgroundColor: 0x38092F,
            antialias: true
        });

        stage.addChild(layers.bg);
        stage.addChild(layers.mid);
        stage.addChild(layers.fg);

        listeners();
        loader = PIXI.loader;
        loader.once('complete', render);

        // Each entity exposes the graphical assets it requires. Iterate through them and pre-load them.
        // debugger;
        for ( var ent in entities ) {
            for ( var ass in entities[ent].assets ) {
                entities[ent].assets[ass].forEach(function(v) {
                    loader.add(v.name, v.url);
                });
            }
        }

        loader.load();
    }

    $(init);

})(window,document,document.querySelectorAll('canvas')[0]);
