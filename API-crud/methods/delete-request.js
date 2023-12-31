const writeToFile = require('../util/write-to-file')
module.exports= (req,res) => {
    let baseUrl = req.url.substring(0, req.url.lastIndexOf("/") + 1);
    let id = req.url.split("/")[3];
    const regexV4 = new RegExp(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/i);

    if (!regexV4.test(id)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
            JSON.stringify({
                title: "Validation failed",
                message: "UUID is not valid"
            })
        );
    } 
    else if(regexV4.test(id) && baseUrl==="/app/movie/"){
        const index = req.movies.findIndex((movie)=>{
            return movie.id === id;
        });
        if(index === -1){
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.write(JSON.stringify({ title: "Not found", message: "Movie not found" }));
        }
        else{

            req.movies.splice(index,1);
            writeToFile(req.movies);
            res.writeHead(200,{"Content-Type":"application/json"});
            res.end(JSON.stringify(req.movies));
        }
    }
    else {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify({ title: "Not found", message: "Movie not found" }));
    }
}