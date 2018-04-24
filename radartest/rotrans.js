

// A small animation library we use to make the tran
var animate = function(start, render, m, d) {
    if(!Array.isArray(start))
        start = [start]
    render(start)
    if(m==undefined)
        m = 0.06
    if(d==undefined)
        d = 7
    var x = [...start], v = start.map(d => 0.0), tx = [...start];
    var draw
    var ct = Date.now()
    var drawing = false
    draw = function() {
        drawing = true
        var now = Date.now() 
        var dt = (now - ct)/1000.0
        ct = now
        var acc = tx.map((it, i) => (it - x[i])/m)
        let ok = true
        for(let i = 0; i < v.length; i++) {
            v[i] += acc[i]*dt - d*v[i]*dt
            x[i] += v[i]*dt
            if(Math.abs(acc[i])<0.001 && Math.abs(v[i]) < 0.001) {
               // mdx = Math.abs(v[i]*dt)
            } else {
                ok = false
            }
        }
        render(x)
        if(ok) {
            drawing = false
            console.log("stopped animation", x, tx)
            return
        }
        window.requestAnimationFrame(draw)
    }
    draw()

    return {
        update: function(target) {
            tx = target
            if(!drawing) {
                ct = Date.now()-10*0
                window.requestAnimationFrame(draw)
            }
        }
    }
}