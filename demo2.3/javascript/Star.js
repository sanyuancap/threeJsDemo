(function (window, undefined){
    function Star(obj) {
        this.isMainStar = obj.isMainStar || false;
        this.imgSrc = obj.imgSrc;
        this.selfRotateSpeed = obj.selfRotateSpeed || 0.05;
        this.publicRotateSpeed = obj.publicRotateSpeed || 0.01;
        this.distance = obj.distance || 0;
        this.name = obj.name || '';
        this.radius = obj.radius;
    }
    Star.prototype = {
        setDistance: function(distance){
            this.distance = distance;
        }
    }

    window.Star = Star;
    
})(window)
