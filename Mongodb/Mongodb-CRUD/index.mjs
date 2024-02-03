import http from 'http';
import { handleaddForm, handleadduser, handledeleteuser, handleimageForm, handleshowUser, handleupdateForm, handleupdateUser, handleimage } from './src/route/UserRoute.mjs';
import staticfile from 'node-static';

let filepath = new staticfile.Server('./public');

let server = http.createServer(async (req, res) => {
    // Serve static files
    filepath.serve(req, res, async (err, result) => {
        if (err) {
            // Handle static file serving errors
            if (err.status === 404) {
                // Continue with route handling logic if the file is not found
                await handleRoutes(req, res);
            } else {
                // Handle other errors as needed
                res.writeHead(err.status, err.headers);
                res.end();
            }
        } else {
            return;
        }
    });
});

async function handleRoutes(req, res) {
    if (req.url === '/add' && req.method === 'GET') {
        await handleaddForm(req, res);
    } else if (req.url === '/adduser' && req.method === 'POST') {
        await handleadduser(req, res);
    } else if (req.url === '/showuser' && req.method === 'GET') {
        await handleshowUser(req, res);
    } else if (req.url.startsWith('/deleteuser/') && req.method === 'GET') {
        await handledeleteuser(req, res);
    } else if (req.url.startsWith('/update/') && req.method === 'GET') {
        await handleupdateForm(req, res);
    } else if (req.url.startsWith('/updateuser/') && req.method === 'POST') {
        await handleupdateUser(req, res);
    } else if (req.url === '/imageform' && req.method === 'GET') {
        await handleimageForm(req, res);
    } else if (req.url === '/image' && req.method === 'POST') {
        await handleimage(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('Not Found');
        res.end();
    }
}

server.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});
