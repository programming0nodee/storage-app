const express = require('express');
const fs = require('fs');
const WebSocket = require('ws');
const path = require('path');
const sharp = require('sharp');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const { send } = require('process');

const app = express();
const PORT = 3000;

const error = (res, code, message) => {
  res.redirect(`/error?c=${code}&m=${encodeURIComponent(message)}`);  
};

const Codes = {
    100: "Continue",
    101: "Switching Protocols",
    102: "Processing",
    200: "OK",
    201: "Created",
    204: "No Content",
    301: "Moved Permanently",
    302: "Found",
    304: "Not Modified",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    429: "Too Many Requests",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout"
};


const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket Server A');

    ws.on('message', (message) => {
        console.log(`Received from client: ${message}`);
        
        ws.send('');
    });
});


app.use(compression());
app.use(cookieParser());

app.use((req, res, next) => {
    if (!req.cookies.session_token) {
        res.cookie('session_token', '123456789', { maxAge: 600000, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    }
    next();
});


app.get('/', (_, res) => {
    res.status(200).send(`<html><body><h1>Hello World!</h1></body></html>`);
});

app.get('/healthcheck', (req, res) => {
    let date = new Date().toUTCString();
    res.setHeader('Content-Type', 'text/txt;charset=utf-8')
       .setHeader('Date-Request', req.headers['date-request'])
       .setHeader('Date-Response', date)
       .setHeader('Cache-Control', 'no-cache')
       .status(200)
       .send('OK');
});

app.get('/gen:code', (req, res) => {
    let code = Number(req.params.code);
    if(isNaN(code) || ![200, 201, 204].includes(code)) return error(res, 400, "Error code");
    return res.setHeader('Content-Length', 0)
        .setHeader('Cache-Control', 'no-cache')
        .setHeader('Content-Type', 'text/txt;charset=utf-8')
        .status(code)
        .send('');
});

app.get('/icon/:format/:style/:size?', async (req, res) => {
    const iconDir = path.join(__dirname, 'icons');
    let { format, style, size } = req.params;
    // Format
    if(!['ico','png','jpg','webp','svg'].includes(format)) return error(res, 400, 'Niewłaściwy format');
    let formatFill = format;
    if(format == 'jpg') formatFill = 'jpeg';
    style = ({any: 'purpose', mask: 'maskable', mono: 'monochrome'}[style] || style);
    // Size
    if(!['purpose','maskable','monochrome'].includes(style)) return error(res, 400, 'Niewłaściwy styl');
    if(!size) size = '16x16';
    if(size && !size.includes('x')) size = `${size}x${size}`;
    if(size) size = size.split('x').map(Number);
    if(size[0] < 16 || size[1] < 16) res.redirect(`/icon/${req.params.format}/${req.params.style}/16`);
    if(size[0] > 1024 || size[1] > 1024) res.redirect(`/icon/${req.params.format}/${req.params.style}/1024`);
    if(size && (isNaN(size[0]) || isNaN(size[1]))) return error(res, 400, 'Niewłaściwy rozmiar');

    try{
        const iconPath = path.join(iconDir, `${style}.svg`);
        if(!fs.existsSync(iconPath)){
            error(res, 404);
            throw new Error(`Plik ${style}.svg nie istnieje`);
        }

        let img = sharp(iconPath);
        let buffer;
        if(format != 'svg'){
            img.resize(size[0], size[1]);
            buffer = await img[formatFill]().toBuffer();
        }else{
            const svgCon = fs.readFileSync(iconPath, 'utf-8');
            if(size){
                const svgMod = svgCon.replace(/<svg([^>]*)>/, `<svg$1 width="${size[0]}" height="${size[1]}">`);
                buffer = Buffer.from(svgMod);
            }else buffer = Buffer.from(svgCon);
        }

        res.setHeader('Content-Length', Buffer.byteLength(buffer));
        res.setHeader('Last-Modified', new Date().toUTCString());
        if(format == 'svg'){
            res.setHeader('Content-Type', 'image/svg+xml;charset=utf-8');
            res.send(buffer);
        }else{
            res.setHeader('Content-Type', `image/${format}`);
            res.end(buffer);
        }
    }catch(e){
        console.error(e);
        error(res, 500, 'Wystąpił błąd podczas przetwarzania obrazu');
    }
});

app.get('/error', (req, res) => {
    let code = Number(req.query.c);
    if(!code) code = 400;
    let message = decodeURIComponent(req.query.m || "");
    if(!message) message = "";
    let errCodes = [400,401,403,404,429,500,502,503,504];
    if(!errCodes.includes(code)) res.redirect('/error');

    res.status(code)
       .send(`<html><head><title>$Status | Storage app</title></head><body><h1>$Status</h1>$Message</body></html>`.replaceAll('$Status', code+' '+Codes[code]).replace('$Message', message));
});


app.get("/*", (_, res) => {
    error(res, 404);
});

app.use((err, _, res, __) => {
    console.error(err.stack);
    error(res, 500, 'Something went wrong!');
});

app.server = app.listen(PORT, () => {
    console.log(`HTTP server is running on port ${PORT}`);
});

app.server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});
