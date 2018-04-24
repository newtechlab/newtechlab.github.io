var radar = function (container, data) {
    var w, h;
    var anim;

    var sr
    var radius;
    var init = function() {
        w = window.innerWidth;
        h = window.innerHeight;
        sr = 300;
        radius = sr + 100;

        container.innerHtml = ""
        // Create the sun we want to see
        let sun = document.createElement("div")
        sun.className = "sun"
        sun.style.width = sr*2+"px"
        sun.style.height = sr*2+"px"
        container.appendChild(sun)
        data.map(function(uni, i) { cUni(uni, i)})

        anim = animate([0,0,2.5, 0], function(pos) {
            container.style.transform = "rotate("+pos[3]+"deg) translateX("+pos[0]+"px) translateY("+pos[1]+"px) scale("+pos[2]+") "})
        zoom(0)
    }, cUni = function(uni, i) {
        var n = document.createElement("div")
        n.className = "universe"
        uni.map(function(art){ cPlan(n, art)})
        var a = 180*i;
        n.style.transform = "translateX(-50%) rotate("+a+"deg) translateY("+radius+"px) "
        container.appendChild(n)
    }, cPlan = function(p, planet) {
        var n = document.createElement("div")
        n.className = "planet"
        // add the planet itself
        let img = document.createElement("img")
        img.src = api.host + "/api/icon/" + planet.id
        img.className = "plan"
        let txt = document.createElement("span")
        txt.innerHTML = planet.name
        txt.className = "name"
        n.appendChild(img)
        n.appendChild(txt)

        planet.articles.map(function(art){ cArt(n, art)})
        p.appendChild(n)
    }, cArt = function(p, art) {
        var n = document.createElement("div")
        n.className = "article"        
        n.innerHTML = art.name + ""
        var nn = document.createElement("img")
        nn.src = api.host + "/api/icon/" + art.id
        nn.width = 25
        nn.height = 25
        n.appendChild(nn)
        p.appendChild(n)
    }, zoom = function(universe, planet, category){
        if(planet == undefined) {
            // movign between universes, figure out the target center position for this one.
            let y = -150*(Math.pow(-1, universe%2))
            console.log(y)
            anim.update([0,y, 1, 180*universe])

        } else {
            // TODO:
        }
    }

    init()
    return {
        goto: zoom,
    }
}