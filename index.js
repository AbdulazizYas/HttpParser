const HttpServer = require("./lib/http-server")

const server = new HttpServer();


server.onRequest((req, res) => {
    console.log(`${req.method} ${req.url}`);

    if (req.url === '/') {
        res.writeHead(200, 'OK', { 'Content-Type': 'text/plain' });
        res.end('Hello, World!');
    } else if (req.url === "/api/test") {
        res.writeHead(200, 'OK', { 'Content-Type': 'application/json' });
        res.end('{"Hello": "World"}');
    } else {
        res.writeHead(404, 'Not Found', { 'Content-Type': 'text/plain' });
        res.end('Page not found');
    }
})

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
})