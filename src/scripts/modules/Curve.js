
'use strict';

module.exports = (function() {

    function control(x0,y0,x1,y1,x2,y2,t){
        var d01 = Math.sqrt(Math.pow(x1-x0,2)+Math.pow(y1-y0,2)),
            d12 = Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2)),
            fa = t*d01/(d01+d12),
            fb = t-fa,
            p1x = x1+fa*(x0-x2),
            p1y = y1+fa*(y0-y2),
            p2x = x1-fb*(x0-x2),
            p2y = y1-fb*(y0-y2);

        return [p1x,p1y,p2x,p2y];
    }

    function draw( gfx, pts, t, colour){

        var i,
            cp = [],
            n;

        if ( typeof pts[0] === 'object' ) {
            var _pts = [];

            for ( i = 0; i < pts.length; i++ ) {
                _pts.push( pts[i].pos.x );
                _pts.push( pts[i].pos.y );
            }

            pts = _pts;
        }

        cp = [];   // array of control points, as x0,y0,x1,y1,...
        n = pts.length;

        for ( i = 0; i < n-4; i+=2 ) {
            cp = cp.concat(control( pts[i], pts[i+1], pts[i+2], pts[i+3], pts[i+4], pts[i+5], t ));
        }

        for( i = 2; i < pts.length - 5; i += 2){
            gfx.lineStyle( 5, colour, 1);
            gfx.moveTo(pts[i],pts[i+1]);
            gfx.beginFill( colour, 0);
            gfx.bezierCurveTo(cp[2*i-2], cp[2*i-1], cp[2*i], cp[2*i+1], pts[i+2], pts[i+3]);
            gfx.endFill();
        }

        //  For open curves the first and last arcs are simple quadratics.
        gfx.lineStyle( 5, colour, 1);
        gfx.moveTo(pts[0],pts[1]);
        gfx.beginFill( colour, 0);
        gfx.quadraticCurveTo(cp[0],cp[1],pts[2],pts[3]);
        gfx.endFill();

        gfx.lineStyle( 5, colour, 1);
        gfx.moveTo(pts[n-2],pts[n-1]);
        gfx.beginFill( colour, 0);
        gfx.quadraticCurveTo(cp[2*n-10],cp[2*n-9],pts[n-4],pts[n-3]);
        gfx.endFill();

        gfx.lineStyle( 0, colour, 1);
        gfx.beginFill(colour, 1);
        gfx.drawCircle(pts[0], pts[1], 2.5);
        gfx.drawCircle(pts[pts.length-2], pts[pts.length-1], 2.5);
    }

    return {
        control: control,
        draw: draw
    };

})();
