
'use strict';

var $ = require('jquery');

module.exports = (function(win, doc) {

    var api = {};

    api.touchdown = function(sel, cancel, fn) {
        $(doc).on('click', sel, function(e) {
            if ( cancel === true ) {
                e.preventDefault();
            }
            fn(e);
        });
    };

    api.touchdownmove = function(sel) {

    };

    api.down = function(sel) {

    };

    api.up = function(sel) {

    };

})(window, document);
