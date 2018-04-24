var radar = function (container, data) {
    var w, h;
    var aX, aY, aS;

    var sr = 250;
    var radius = 350;

    var init = function() {
        w = window.innerWidth;
        h = window.innerHeight;
        container.innerHtml = ""
        data.map(function(uni, i) { cUni(uni, i)})

        aX = animate(500, function(x) { container.style.transform = "translateX("+x*0.1+"px) scale("+(1+x/100)+")"})
        
        //aX.update(100)
        //zoom(0) // show the starting point

        // Set up the animation we will be using
    }, cUni = function(uni, i) {
        var n = document.createElement("div")
        n.className = "universe"
        uni.map(function(art){ cPlan(n, art)})
        var a = 180*i;
        n.style.transform = "translateY(-"+radius+"px) rotate("+a+"deg) translateY("+radius+"px)"
        container.appendChild(n)
    }, cPlan = function(p, planet) {
        var n = document.createElement("div")
        n.className = "planet"        
        planet.articles.map(function(art){ cArt(n, art)})
        p.appendChild(n)
    }, cArt = function(p, art) {
        var n = document.createElement("div")
        n.className = "article"        
        n.innerHTML = art + ""
        var nn = document.createElement("img")
        nn.src = "https://upload.wikimedia.org/wikipedia/commons/d/d2/Firefox_Logo%2C_2017.png"
        nn.width = 25
        nn.height = 25
        n.appendChild(nn)
        p.appendChild(n)
    }, zoom = function(universe, planet, category){
        if(planet == undefined) {
            // movign between universes, figure out the target center position for this one.
            var r = Math.random()*w
            aX.update(r)

        } else {
            // TODO:
        }
    }

    init()
    return {
        goto: zoom,
    }
}