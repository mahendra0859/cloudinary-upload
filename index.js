const http = require('http');
const util = require('util');
const Formidable = require('formidable');
const cloudinary = require('cloudinary');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

http
  .createServer((req, res) => {
    if (req.url === '/upload' && req.method.toLowerCase() === 'post') {
      // parse a file upload
      const form = new Formidable();

      form.parse(req, (err, fields, files) => {
        //https://cloudinary.com/documentation/upload_images
        console.log('files', files);
        cloudinary.uploader.upload(
          files.upload.path,
          (result) => {
            //   console.log(result);
            if (result.public_id) {
              res.writeHead(200, { 'content-type': 'text/plain' });
              res.write('received upload:\n\n');
              res.end(util.inspect({ fields: fields, files: files }));
            }
          },
          {
            folder: 'images',
          }
        );
      });
      return;
    }

    // show a file upload form
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(`
    <div style="display:flex;justify-content:center;align-items:center;width:100%;height:100vh">
        <form action="/upload" enctype="multipart/form-data" method="post">        
        <input type="file" name="upload" multiple="multiple" /><br/><br/>
        <input type="submit" value="Upload" />
        </form>
    </div>
  `);
  })
  .listen(8080, () => console.info('Server is listening on port number 8080'));
