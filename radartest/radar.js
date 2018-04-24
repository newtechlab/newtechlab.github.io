var radar = function (container, data) {
    let w, h;
    let aX, aY, aS;

    let sr = 250;
    let radius = 350;

    let init = () => {
        w = window.innerWidth;
        h = window.innerHeight;
        container.innerHtml = ""
        data.map((uni, i) => cUni(uni, i))

        aX = animate(0, (x) => container.style.transform = "translateX("+x+"px) scale("+(1+x/1000)+")")
        
        zoom(0) // show the starting point

        // Set up the animation we will be using
    }, cUni = (uni, i) => {
        let n = document.createElement("div")
        n.className = "universe"
        uni.map(art => cPlan(n, art))
        let a = 180*i;
        n.style.transform = "translateY(-"+radius+"px) rotate("+a+"deg) translateY("+radius+"px)"
        container.appendChild(n)
    }, cPlan = (p, planet) => {
        let n = document.createElement("div")
        n.className = "planet"        
        planet.articles.map(art => cArt(n, art))
        p.appendChild(n)
    }, cArt = (p, art) => {
        let n = document.createElement("div")
        n.className = "article"        
        n.innerHTML = art + ""
        let nn = document.createElement("img")
        nn.src = "https://upload.wikimedia.org/wikipedia/commons/d/d2/Firefox_Logo%2C_2017.png"
        nn.width = 25
        nn.height = 25
        n.appendChild(nn)
        p.appendChild(n)
    }, zoom = (universe, planet, category) => {
        if(planet == undefined) {
            // movign between universes, figure out the target center position for this one.
            let r = Math.random()*w
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