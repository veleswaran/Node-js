import ejs from 'ejs';
import querystring from 'querystring';
import { addUser, getUser, update, updateUser, deleteUser, addimage } from '../controller/UserController.mjs';
import fs from 'fs/promises';
import url from 'url';
import bcrypt from 'bcrypt';
import formidable from 'formidable-serverless';
import path from 'path';




// route to show users 
export async function handleshowUser(req, res) {
    try {
        const users = await getUser();
        console.log(users);
        const currentModuleUrl = new URL(import.meta.url);
        const moduleDir = path.dirname(currentModuleUrl.pathname);
        const templatePath = path.join(moduleDir, '../view', 'showuser.ejs');
        const template = await fs.readFile(templatePath, 'utf8');
        const renderedHtml = ejs.render(template, { users });

        // Send the rendered HTML as the response
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(renderedHtml);
        res.end();
    } catch (err) {
        console.error('Error:', err);

        // Handle errors appropriately
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}

// route to add-userform

export async function handleaddForm(req,res){
    try{
        const currurl = new URL(import.meta.url);
        const dir = path.dirname(currurl.pathname);
        const templatePath = path.join(dir, '../view', 'login.ejs');
        const template = await fs.readFile(templatePath, 'utf8');
        const renderedHtml = ejs.render(template);

        // Send the rendered HTML as the response
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(renderedHtml);
        res.end();
        
    }catch(err){
        console.error('Error:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
    
}

// route to the add user

export async function handleadduser(req, res) {
    try {
        let postData = '';
        req.on('data', chunk => {
            postData += chunk;
        });

        req.on('end', async () => {
            const contentType = req.headers['content-type'];

            if (contentType && contentType.includes('application/json')) {
                let user = JSON.parse(postData);

                // Hash the password before storing
                const hashedPassword = await bcrypt.hash(user.pswd, 10);
                user.password = hashedPassword;

                // TODO: Call your addUser function with the user object

                res.write(JSON.stringify(user));
                res.end();
            } else {
                let user = querystring.parse(postData);
                const hashpass = await bcrypt.hash(user.pswd,10);
                user.pswd = hashpass;
                await addUser(user);
                res.write("data added successfully");
                res.end();
            }
        });
    } catch (err) {
        console.error('Error:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}
  
// route to updateform

export async function handleupdateForm(req,res){
    try{
        let parseurl = url.parse(req.url,true);
        let id = parseurl.pathname.split('/').pop();
        let data = await update(id); 
        console.log(data);
        const currurl = new URL(import.meta.url);
        const dir = path.dirname(currurl.pathname);
        const templatePath = path.join(dir, '../view', 'login.ejs');
        const template = await fs.readFile(templatePath, 'utf8');
        const renderedHtml = ejs.render(template,{data});

        // Send the rendered HTML as the response
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(renderedHtml);
        res.end();
      
    }catch(err){
        console.error('Error:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }

    
}

// route to update the data

export async function handleupdateUser(req,res){
    try{
        let parseurl = url.parse(req.url,true);
        let id = parseurl.pathname.split('/').pop();
        let data ='';
        req.on('data',chunk=>{
            data+=chunk;
        })
        req.on('end',async()=>{
            let userdata = querystring.parse(data);
            await updateUser(userdata,id);
            res.writeHead(302,{"location":"/showuser"});
            res.end();
        })
    }catch(err){
        console.error('Error:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
    
}

// route to delete user data

export async function handledeleteuser(req,res){
    try{
        let parsedUrl = url.parse(req.url, true);
        let id = parsedUrl.pathname.split('/').pop(); 
        await deleteUser(id);
        res.writeHead(302,{"location":'/showuser'});
        res.end();
    }catch(err){
        console.error('Error:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
    
}

// route to add-imageform

export async function handleimageForm(req,res){
    try{
        fs.readFile('./src/view/image.ejs', (err, data) => {
            if (err) throw err;
            else {
                res.write(data);
                res.end();
            }
        });
    }catch(err){
        console.error('Error:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
    
}

// route to the add image
export function handleimage(req, res) {
    const form = new formidable.IncomingForm();

    form.uploadDir = 'public/images/';
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Error parsing form data:', err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
        }

        const uploadedFile = files.image;

        if (!uploadedFile) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('No file uploaded');
            return;
        }

        // Generate a unique filename
        const uniqueFilename = Date.now() + '-' + Math.round(Math.random() * 10000);
        const fileExtension = path.extname(uploadedFile.name);
        const newFilename = uniqueFilename + fileExtension;

        try {
            // Move the uploaded file to the uploads directory
            fs.renameSync(uploadedFile.path, path.join(form.uploadDir, newFilename));

            const hashpass = fields.pswd ? await bcrypt.hash(fields.pswd, 10) : null;
            fields.pswd = hashpass;
            fields.images = newFilename;
            await addUser(fields);

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Data added successfully');
        } catch (error) {
            console.error('Error processing file:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        }
    });
}