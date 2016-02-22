
'use strict';

module.exports = (function() {

    var Vec = function(x,y) {
        this.x = x;
        this.y = y;
    },
    VecConst;

    Vec.prototype = {

        reset: function ( x, y ) {
            this.x = x;
            this.y = y;
            return this;
        },

        projectNew : function( vec, distance ) {

            var newvec = new Vec( this.x, this.y );
            vec.clone();

            newvec.plusEq( vec.normaliseNew().multiplyEq( distance ) );
            return newvec;
        },

        directionNew : function( vec ) {
            return new Vec( this.x, this.y).minusNew( vec ).normalise();
        },

        toString : function (decPlaces) {
            decPlaces = decPlaces || 3;
            var scalar = Math.pow(10,decPlaces);
            return '[' + Math.round (this.x * scalar) / scalar + ', ' + Math.round (this.y * scalar) / scalar + ']';
        },

        clone : function () {
            return new Vec(this.x, this.y);
        },

        copyTo : function (v) {
            v.x = this.x;
            v.y = this.y;
        },

        copyFrom : function (v) {
            this.x = v.x;
            this.y = v.y;
        },

        magnitude : function () {
            return Math.sqrt((this.x*this.x)+(this.y*this.y));
        },

        magnitudeSquared : function () {
            return (this.x*this.x)+(this.y*this.y);
        },

        normalise : function () {

            var m = this.magnitude();

            this.x = this.x/m;
            this.y = this.y/m;

            return this;
        },

        normaliseNew : function() {
            return new Vec( this.x, this.y ).normalise();
        },

        reverse : function () {
            this.x = -this.x;
            this.y = -this.y;

            return this;
        },

        plusEq : function (v) {
            this.x+=v.x;
            this.y+=v.y;

            return this;
        },

        plusNew : function (v) {
             return new Vec(this.x+v.x, this.y+v.y);
        },

        minusEq : function (v) {
            this.x-=v.x;
            this.y-=v.y;

            return this;
        },

        minusNew : function (v) {
            return new Vec(this.x-v.x, this.y-v.y);
        },

        multiplyEq : function (scalar) {
            this.x*=scalar;
            this.y*=scalar;

            return this;
        },

        multiplyNew : function (scalar) {
            var returnvec = this.clone();
            return returnvec.multiplyEq(scalar);
        },

        divideEq : function (scalar) {
            this.x/=scalar;
            this.y/=scalar;
            return this;
        },

        divideNew : function (scalar) {
            var returnvec = this.clone();
            return returnvec.divideEq(scalar);
        },

        dot : function (v) {
            return (this.x * v.x) + (this.y * v.y) ;
        },

        angle : function (useRadians) {
            return Math.atan2(this.y,this.x) * (useRadians ? 1 : VecConst.TO_DEGREES);
        },

        rotate : function (angle, useRadians) {

            var cosRY = Math.cos(angle * (useRadians ? 1 : VecConst.TO_RADIANS));
            var sinRY = Math.sin(angle * (useRadians ? 1 : VecConst.TO_RADIANS));

            VecConst.temp.copyFrom(this);

            this.x= (VecConst.temp.x*cosRY)-(VecConst.temp.y*sinRY);
            this.y= (VecConst.temp.x*sinRY)+(VecConst.temp.y*cosRY);

            return this;
        },

        rotateTowards : function( target, amount ) {
            var a = this.normaliseNew(),
                b = target.normaliseNew(),
                angle = Math.atan2(b.y, b.x) - Math.atan2(a.y, a.x);

                console.log(angle);
                debugger;
        },

        equals : function (v) {
            return((this.x===v.x)&&(this.y===v.x));
        },

        isCloseTo : function (v, tolerance) {
            if(this.equals(v)) return true;

            VecConst.temp.copyFrom(this);
            VecConst.temp.minusEq(v);

            return(VecConst.temp.magnitudeSquared() < tolerance*tolerance);
        },

        rotateAroundPoint : function (point, angle, useRadians) {
            VecConst.temp.copyFrom(this);
            VecConst.temp.minusEq(point);
            VecConst.temp.rotate(angle, useRadians);
            VecConst.temp.plusEq(point);
            this.copyFrom(VecConst.temp);
        },

        isMagLessThan : function (distance) {
            return(this.magnitudeSquared()<distance*distance);
        },

        isMagGreaterThan : function (distance) {
            return(this.magnitudeSquared()>distance*distance);
        }
    };

    VecConst = {
        TO_DEGREES : 180 / Math.PI,
        TO_RADIANS : Math.PI / 180,
        temp : new Vec()
    };

    return Vec;

})();
