// Simple wrapper library for accessing the api
let api = function(host) {
    let getall = () => {
        return Promise.all([
            fetch(host+"/api/articles", { method: 'GET', mode: 'cors'}).then(r => r.json()),
            fetch(host+"/api/categories", { method: 'GET', mode: 'cors'}).then(r => r.json()),
            ]).then(values => {
                let u1 = [], u2 = [];
                values[1].map(c => {
                    // TODO: Filter the articles in the views as well, using byNTL and forceShowInDNB
                    if(c.showInDnb) {
                        u1.push({...c, articles: values[0].filter(it => it.category == c.id)})
                    } else if(c.showInNtl) {
                        u2.push({...c, articles: values[0].filter(it => it.category == c.id)})
                    }
                })
                return [u1, u2]
            });
    }
    return {
        getall: getall,
        host: host
    }
}("http://localhost:8080")