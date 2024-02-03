import http from 'http';
import { handleaddForm, handleadduser, handledeleteuser, handleimageForm, handleshowUser, handleupdateForm, handleupdateUser,handleimage } from './src/route/UserRoute.mjs';



let server = http.createServer(async (req, res) => {

    // show the user add form
    if (req.url === '/add' && req.method === 'GET') {
        await handleaddForm(req,res);
    } 

    // post to mongodb from form 
    else if (req.url === '/adduser' && req.method === 'POST') {
        await handleadduser(req,res);
    }

    // show the users list to ejs from mongodb
    else if(req.url ==='/showuser' && req.method ==='GET'){
        await handleshowUser(req,res);
    }

    // delete user
    else if (req.url.startsWith('/deleteuser/') && req.method === "GET") {
        await handledeleteuser(req,res);
    }

    // show to update form
    else if( req.url.startsWith('/update/') && req.method==="GET"){
        await handleupdateForm(req,res);
    }

    // update the given data
    else if( req.url.startsWith('/updateuser/') && req.method==="POST"){
        await handleupdateUser(req,res);
            
    }

    else if(req.url==='/imageform' && req.method==='GET'){
        await handleimageForm(req,res);
    }
    // image upload 
    else if( req.url==='/image' && req.method==="POST"){
        await handleimage(req,res);       
    }

    // if url is not match this is provide
    else{
    res.writeHead(404,{"Content-Type":"text/plain"});
    res.write('Not Found');
    res.end();
    }

});

server.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
