// A small vector enabled animation library we use to get "force like" behaviour
var animate = function(start, render, m, d) {
    start = Array.isArray(start) ? start : [start];
    m = m || 0.06;
    d = d || 7;
    var x = [...start], v = start.map(d => 0.0), tx = [...start];
    var draw, ct = Date.now(), drawing = false;
    draw = function(now) {
        drawing = true
        var now = Date.now(), 
            dt = (now - ct)/1000.0
        ct = now
        let ok = true
        for(let i = 0; i < v.length; i++) {
            let acc = (tx[i] - x[i])/m
            v[i] += acc*dt - d*v[i]*dt
            x[i] += v[i]*dt
            if(Math.abs(acc)<0.001 && Math.abs(v[i]) < 0.001) {} else {
                ok = false
            }
        }
        render(x)
        if(ok) {
            drawing = false
            return
        }
        window.requestAnimationFrame(draw)
    }
    render(start)
    draw()

    return {
        update: function(target) {
            tx = target
            if(!drawing) {
                ct = Date.now()
                window.requestAnimationFrame(draw)
            }
        }
    }
}