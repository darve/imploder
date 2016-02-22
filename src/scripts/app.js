
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
        Tower: require('./entities/Tower'),
        Nexus: require('./entities/Nexus'),
        Mob: require('./entities/Mob')
    };

    window.M = M;
    window.entities = entities;
    window.Vec = Vec;

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
        framecounter = 0,

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

    window.layers = layers;
    window.sprites = sprites;

    function closest(unit, targets) {

        if ( !targets.length ) return false;

        var winner,
            distance,
            temp;

        targets.forEach(function(v, i) {
            temp = unit.pos.minusNew( v.pos );
            if ( distance === undefined || distance >= temp.magnitude() ) {
                distance = temp.magnitude();
                winner = v;
            }
        });

        return winner !== undefined ? winner : false;
    }

    function garbage() {
        sprites.mob.forEach(function(v, index) {
            if ( v.health <= 0 ) {
                for ( var layer in v.sprites ) {
                    v.sprites[layer].forEach(function(s) {
                        layers[layer].removeChild(s);
                    });
                }
                sprites.mob.splice(index, 1);
            }
        });
    }

    function render() {
        window.requestAnimationFrame(render);
        now = Date.now();
        delta = now - then;

        if (delta > interval) {
            then = now - (delta % interval);
            framecounter++;

            if ( sprites.mob ) {
                sprites.mob.forEach(function(v, i) {
                    v.integrate();
                });
            }

            if ( sprites.tower ) {
                sprites.tower.forEach(function(v, i){
                    v.integrate(closest(v, sprites.mob));
                });
            }

            if ( framecounter % 240 === 0 ) {
                spawn(entities.Mob, {
                    position: {
                        x: M.rand(0, w),
                        y: M.rand(0, h)
                    },
                    target: {
                        x: sprites.nexus[0].pos.x,
                        y: sprites.nexus[0].pos.y
                    }
                });
            }

            garbage();

            renderer.render(stage);
        }
    }

    function spawn(entity, opts) {
        var obj = new entity.spawn(opts);
        if ( !(obj.type in sprites) ) {
            sprites[obj.type] = [];
        }
        sprites[obj.type].push(obj);

        // Add the objects sprites to the relevant layer
        for ( var layer in obj.sprites ) {
            obj.sprites[layer].forEach(function(v) {
                layers[layer].addChild(v);
            });
        }
        return obj;
    }

    function listeners() {

        $(win).resize(function() {
            renderer.resize(window.innerWidth, window.innerHeight);
        });

        $(doc).on('click', function(e) {
            e.preventDefault();
            spawn(entities.Tower, {
                position: {
                    x: e.pageX,
                    y: e.pageY
                }
            });
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

        spawn(entities.Nexus, {
            position: {
                x: window.innerWidth/2,
                y: window.innerHeight/2
            }
        });

        loader.load();
    }

    $(init);

})(window,document,document.querySelectorAll('canvas')[0]);
