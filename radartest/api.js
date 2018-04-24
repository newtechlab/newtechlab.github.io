let api = function(server) {

    let getall = () => {
        var apiRequest1 = fetch(server+"/api/articles",{
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            headers: {
                "Authorization": "Bearer boller"
            }
          }).then(function(response){ 
            return response.json()});
        var apiRequest2 = fetch(server+"/api/categories",{
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors' // no-cors, cors, *same-origin
          }).then(function(response){
                    return response.json()
        });
        var combinedData = {"apiRequest1":{},"apiRequest2":{}};
        let res = Promise.all([apiRequest1,apiRequest2]).then(function(values){
            let data = []
            let u1 = []
            let u2 = []
            values[1].map(c => {
                if(c.showInDnb) {
                    u1.push({...c, articles: values[0].filter(it => it.category == c.id)})
                } else if(c.showInNtl) {
                    u2.push({...c, articles: values[0].filter(it => it.category == c.id)})
                }
            })
            return [u1, u2]
        });
        return res
    }

    return {
        getall: getall,
        host: server
    }
}("http://localhost:8080")