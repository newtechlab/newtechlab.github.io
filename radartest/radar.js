var radar = function (container, data) {
    var w, h, ps;
    var anim;
    var curUni, curPlan, curArt;
    var scale = 2.5; // zoom in scaling factor, to big uses loads of GPU memory...
    var positions = {}

    // fields for moon animations
    let moons = []
    let moon
    
    var sr
    var radius;
    var init = function() {
        w = window.innerWidth;
        h = window.innerHeight;
        sr = 300;
        radius = sr + 100;
        ps = 75;
        ff = 0.15

        

        container.innerHtml = ""
        // Create the sun we want to see
        let sun = document.createElement("div")
        sun.className = "sun"
        sun.style.width = sr*2+"px"
        sun.style.height = sr*2+"px"
        container.appendChild(sun)

        // Create some radar tract
        for(var i = 1; i < 3; i++) { // TODO: This eats ram! D
            let circle = document.createElement("div")
            circle.className = "circles"
            circle.style.width = sr*2*(i+1)+"px"
            circle.style.height = sr*2*(i+1)+"px"
            container.appendChild(circle)
        }


        data.map(function(uni, i) { cUni(uni, i)})

        anim = animate([0,0,scale, 0, 0], function(pos) {
            container.style.transform = "scale("+pos[2]+") rotate("+pos[3]+"deg) translateX("+pos[0]+"px) translateY("+pos[1]+"px) "
            // also update all the moons - TODO: put them 
            moons.map(it => {
                it = it.dom
                if(moon == undefined) {
                    it.style.opacity = 0.0
                } else {
                    if(it.p == moon) {
                        it.style.opacity = 1-pos[4]
                    } else {
                        it.style.opacity = pos[4]
                    }    
                }
            })
        })
        zoom(0)
    }, cUni = function(uni, i) {
        var n = document.createElement("div")
        n.className = "universe"
        layout(uni)
        console.log("uni", uni)
        var a = 180*i;
        uni.map(function(art){ cPlan(n, art, a)})
        n.style.transform = "translateX(-50%) rotate("+a+"deg) translateY("+radius+"px) "
        container.appendChild(n)
    }, cPlan = function(p, planet, r) {
        var n = document.createElement("div")
        let fx = w*ff*0.5 - w*ff*planet.fuzz[0]
        let fy = w*ff*0.5 - w*ff*planet.fuzz[1]
        n.style.left = (planet.col-1)*0.3*w+fx+"px"
        n.style.top = (planet.row*ps*1.5)+fy+"px"
        n.className = "planet"

        // Store the position we should move to to look at
        // this planet
        let x = -0.3*w*(planet.col-1)-fx,
            y = -(planet.row*ps*1.5)-fy-h/scale,
            s = scale;
        if(r != 0) {
            x = -x
            y = -y
        }
        positions[planet.id] = [x, y, s, r, 1.0]

        // add the planet itself
        let img = document.createElement("img")
        img.src = api.host + "/api/icon/" + planet.id
        img.className = "plan"
        img.id = planet.id
        img.width = ps
        img.height = ps
        let txt = document.createElement("span")
        txt.innerHTML = planet.name
        txt.className = "name"
        n.appendChild(img)
        n.appendChild(txt)

        let childs = document.createElement("div")
        childs.className = "children"

        moons.push({
            p: planet.id,
            dom: childs,
        })
        layout(planet.articles)
        planet.articles.map(function(art){ cArt(childs, art)})
        n.appendChild(childs)
        p.appendChild(n)
    }, cArt = function(p, art) {
        // Built very similar to how we build the planet itself...
        var n = document.createElement("div")

        let fx = w*ff*0.5 - w*ff*art.fuzz[0]
        let fy = w*ff*0.5 - w*ff*art.fuzz[1]
        n.style.left = (art.col-1)*0.1*w/scale+fx/scale+"px"
        n.style.top = (art.row*ps*1.5/scale)+fy/scale+"px"
        n.className = "article"        
        n.innerHTML = art.name + ""
        var nn = document.createElement("img")
        nn.src = api.host + "/api/icon/" + art.id
        nn.width = ps/scale
        nn.height = ps/scale
        n.appendChild(nn)
        p.appendChild(n)
    }, zoom = function(universe, planet){
        if(universe != undefined) {
            // movign between universes, figure out the target center position for this one.
            moon = undefined
            let y = -150*(Math.pow(-1, universe%2))
            curUni = universe
            curPlan = undefined
            curArt = undefined
            anim.update([0,y, 1, (180*universe)%360, 0])
            return
        }
        if(planet != undefined) {
            console.log("zoom planet", planet, positions[planet])
            moon = planet
            curPlan = planet
            curArt = undefined
            anim.update(positions[planet])            
        }
    }, click = event => {
        event.stopPropagation();
        event.preventDefault();
        // the clicking is simply some sort of state machine, transfering
        // us to the correct location depending on which state we are currently
        // in (viewing universe, planet or article...)
        let t = event.target
        if(!t) {
            return
        }
        if(t.className == "plan") {
            // clicked on a planet, always goto that planet
            return zoom(undefined, t.id)
        } else if (t.className == "sd") {
        } else {
            // Clicked on the outside, if in planet zoom out, else change
           if(curPlan!= undefined)
               return zoom(curUni)
           if(curUni!=undefined)
               return zoom(curUni+1)
        }
    }


    window.addEventListener("click", click)
    init()
    return {
        goto: zoom,
    }
}