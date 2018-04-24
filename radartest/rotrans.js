

// A small animation library we use to make the tran
var animate = function(start, render, m, d) {
    render(start)
    if(m==undefined)
        m = 0.06
    if(d==undefined)
        d = 4
    var x = start, v = 0.0, tx = start;
    var draw
    var ct = (new Date()).getTime()
    var drawing = false
    draw = function() {
        drawing = true
        var now = (new Date()).getTime() 
        var dt = (now - ct)/1000.0
        ct = now
        var f = tx - x
        var acc = f / m
        v += acc*dt - d*v*dt
        x += v*dt
        render(x)
        if(Math.abs(acc) < 0.001 && Math.abs(v*dt) < 0.001) {
            drawing = false
            return
        }
        window.requestAnimationFrame(draw)
    }
    draw()

    return {
        update: function(target) {
            tx = target
            if(!drawing) {
                ct = (new Date()).getTime()
                draw()
            }
        }
    }
}