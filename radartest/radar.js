var radar = function (container, data) {
    var w, h, ps;
    var anim;
    var curUni, curPlan, curArt;
    var scale = 2.5; // zoom in scaling factor, to big uses loads of GPU memory...
    var positions = {}
    var garticles = {};
    var sun;

    // fields for moon animations
    let moons = []
    let planets = []
    let moon
    
    var sr
    var radius;
    var init = function() {
        w = window.innerWidth;
        h = window.innerHeight;
        sr = 300;
        radius = sr + 100;
        ps = 75;
        ff = 0.1

        

        container.innerHtml = ""
        // Create the sun we want to see
        sun = document.createElement("div")
        sun.className = "sun"
        sun.style.width = sr*2+"px"
        sun.style.height = sr*2+"px"
        container.appendChild(sun)

        // Create the two titles we will be using
        let tit = document.createElement("div")
        tit.className = "tit1"
        let img = document.createElement("img")
        img.src = "/static/dnb.png"
        tit.appendChild(img)
        img = document.createElement("div")
        img.innerHTML = "STRATEGY"
        tit.appendChild(img)
        sun.appendChild(tit)
        tit = document.createElement("div")
        tit.className = "tit2"
        img = document.createElement("img")
        img.src = "/static/ntl.png"
        tit.appendChild(img)
        img = document.createElement("div")
        img.innerHTML = "EXPLORING"
        tit.appendChild(img)
        sun.appendChild(tit)


        // Create some radar tract
        for(var i = 1; i < 3; i++) { // TODO: This eats ram! D
            let circle = document.createElement("div")
            circle.className = "circles"
            circle.style.width = sr*2*(i+1)+"px"
            circle.style.height = sr*2*(i+1)+"px"
            container.appendChild(circle)
        }


        data.map(function(uni, i) { cUni(uni, i)})

        let render = function(pos) {
            container.style.transform = "scale("+pos[2]+") rotate("+pos[3]+"deg) translateX("+pos[0]+"px) translateY("+pos[1]+"px) "
            // shade between the colors of the sun
            let c1 = [243, 174, 37],
                c2 = [47, 72, 88]
            sun.style["background-color"] = colorMixer(c1, c2, pos[3]/180)
            moons.map(it => {
                if(it.p == moon) {
                    it.dom.style.opacity = 0.001 + (1-0.001)*pos[4]
                    it.div.style.opacity = 1.0
                } else {
                    it.dom.style.opacity = 0.001
                    it.div.style.opacity = 1 - (1-0.001)*pos[4]
                }    
            })
        }
        render([0,0,scale/scale, 0, 0])
        anim = animate([0,0,scale/scale, 0, 0], render)
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
            y = -(planet.row*ps*1.5)-fy-h/scale+50,
            s = scale;
        if(r != 0) {
            x = -x
            y = -y
        }

        // add the planet itself
        let img = document.createElement("img")
        img.src = api.host + "/api/icon/" + planet.id
        img.className = "plan"
        img.id = planet.id
        img.width = ps*(planet.impact*0.6+0.7)
        img.height = ps*(planet.impact*0.6+0.7)
        img.addEventListener("click", click)

        positions[planet.id] = {pos:[x, y, s, r, 1.0], dom:img}
        let txt = document.createElement("span")
        txt.innerHTML = planet.name
        txt.className = "name"
        txt.style.bottom = "" + ps*(planet.impact*0.6+0.7) + "px"
        n.appendChild(img)
        n.appendChild(txt)

        let childs = document.createElement("div")
        childs.className = "children"

        moons.push({
            p: planet.id,
            dom: childs,
            div: n,
        })
        layout(planet.articles)
        planet.articles.map(function(art){ cArt(childs, art, r, x, y)})
        n.appendChild(childs)
        p.appendChild(n)
    }, cArt = function(p, art, r, xx, yy) {
        // Built very similar to how we build the planet itself...
        var n = document.createElement("div")
        garticles[art.id] = art;

        let fx = w*ff*0.5 - w*ff*art.fuzz[0]
        let fy = w*ff*0.5 - w*ff*art.fuzz[1]
        n.style.left = (art.col-1)*0.3*w/scale+fx/scale+"px"
        n.style.top = 40+(art.row*ps*1.5/scale)+fy/scale+"px"
        n.className = "article"      
        

        let x = -0.3*w*(art.col-1)-fx,
            y = -(art.row*ps*1.5)-fy-h/scale,
            s = scale;
        if(r != 0) {
            x = -x
            y = -y
        }

        let img = document.createElement("img")
        img.src = api.host + "/api/icon/" + art.id
        img.className = "moon"
        img.id = art.id
        img.width = ps/scale
        img.height = ps/scale
        img.addEventListener("click", click)
        positions[art.id] = {pos:[xx+x/scale, yy+y/scale, scale*2, r, 1.0], dom: img}
        
        let txt = document.createElement("span")
        txt.innerHTML = art.name
        txt.className = "name"
        txt.style["font-size"] = 100/scale + "%"
        txt.style.bottom = 8 + ps/scale + "px"
        n.appendChild(img)
        n.appendChild(txt)

        p.appendChild(n)
    }, zoom = function(universe, planet, mmoon){
        if(universe != undefined) {
            console.log("zoom universe", planet, positions[planet])
            // movign between universes, figure out the target center position for this one.
            let y = -150*(Math.pow(-1, universe%2))
            curUni = universe
            curPlan = undefined
            if(curArt)
                curArt.dom.classList.remove("imgzoom")
            curArt = undefined
            anim.update([0,y, 1, (180*universe)%360, 0])
            return
        }
        if(planet != undefined) {
            console.log("zoom planet", planet, positions[planet])
            moon = planet
            curPlan = planet
            if(curArt)
                curArt.dom.classList.remove("imgzoom")
                
            curArt = undefined
            anim.update(positions[planet].pos)
            return            
        }
        if(mmoon != undefined) {
            console.log("zoom moon", mmoon, positions[mmoon])
            //moon = planet
            //curPlan = planet
            curArt = positions[mmoon]
            console.log(positions[mmoon].dom)
            curArt.dom.classList.add("imgzoom")

            // Create the element that we will be using for the markdown and make it all look nice
            let adom = document.createElement("div")
            adom.className = "articlediv"
            document.body.appendChild(adom)
            adom.addEventListener("click", e => e.stopPropagation())

            let view = moon
            createArticle(adom, garticles[mmoon], () => {
                console.log("should go back", view);
                adom.classList.add("articledivOUT")
                adom.addEventListener("transitionend", e => adom.remove())
                zoom(undefined, view)
            })
            window.setTimeout(() => adom.classList.add("articledivIN"), 100)
            anim.update(positions[mmoon].pos)
            return            
        }
    }, click = event => {
        // the clicking is simply some sort of state machine, transfering
        // us to the correct location depending on which state we are currently
        // in (viewing universe, planet or article...)
        let t = event.target
        console.log("in click", t)
        if(!t) { return }
        if(t.className == "plan") {            
            console.log("clicked planet", t.id)
            event.stopPropagation();
            return zoom(undefined, t.id)
        } else if (t.className == "moon") {
            console.log("clicked moon", t.id)
            event.stopPropagation();
            return zoom(undefined, undefined, t.id)
        }
    }


    window.addEventListener("click", e => {console.log("clicked bg", e); zoom(curUni) } )
    window.addEventListener("keydown", e => {if(e.keyCode==37||e.keyCode==39){curUni++; zoom(curUni)}})
    window.addEventListener("wheel", e => {
        console.log(e)
    })
    init()
    zoom(0)
    return {
        goto: zoom,
    }
}


function colorChannelMixer(colorChannelA, colorChannelB, amountToMix){
    var channelA = colorChannelA*amountToMix;
    var channelB = colorChannelB*(1-amountToMix);
    return parseInt(channelA+channelB);
}
//rgbA and rgbB are arrays, amountToMix ranges from 0.0 to 1.0
//example (red): rgbA = [255,0,0]
function colorMixer(rgbA, rgbB, amountToMix){
    var r = colorChannelMixer(rgbA[0],rgbB[0],amountToMix);
    var g = colorChannelMixer(rgbA[1],rgbB[1],amountToMix);
    var b = colorChannelMixer(rgbA[2],rgbB[2],amountToMix);
    return "rgb("+r+","+g+","+b+")";
}