// Simple library for positioning two divs and allowing to in a nice way to slide between
// them, assuming to thet them in as an array. If you do not want any strange moving around
// to start with simply display:none them before and show after.
var rotrans = function (divs, radius) {
    if(radius == undefined) {
        radius = "250px"
    }
    divs.forEach(it => it.className  = ("rotranselement"))
    let anims = divs.map((it, i) => animate((360/divs.length*i), a => {
        it.style.transform = "translateY(-"+radius+") rotate("+a+"deg) translateY("+radius+")"
    }));

    let showing = 0
    let left = () => {showing--; update()},
        right = () => {showing++; update()};
    let update = () => {
        anims.forEach((it, i) => {
            let deg = (360/divs.length*i) + (360/divs.length*showing)
            it.update(deg)
        })
    }
    update()
    return {
        left: left,
        right: right,
    };
};

// A small animation library we use to make the tran
var animate = (start, render, m, d) => {
    render(start)
    if(m==undefined)
        m = 0.06
    if(d==undefined)
        d = 4
    let x = start, v = 0.0, tx = start;
    var draw
    let ct = (new Date()).getTime()
    let drawing = false
    draw = () => {
        drawing = true
        let now = (new Date()).getTime() 
        let dt = (now - ct)/1000.0
        ct = now
        let f = tx - x
        let acc = f / m
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
        update: (target) => {
            tx = target
            if(!drawing) {
                ct = (new Date()).getTime()
                draw()
            }
        }
    }
}