const HttpRequest = require("./http-request")
const HttpResponse = require("./http-response")
const net = require("net")

class HttpServer {
    constructor() {
        this.server = net.createServer(this.handleConnection.bind(this))
        this.requestHandler = null
    }

    handleConnection(socket) {
        const req = new HttpRequest(socket)
        const res = new HttpResponse(socket)

        socket.on('data', () => {
            if (this.requestHandler) {
                this.requestHandler(req, res)
            } else {
                res.writeHead(500, 'Internal Server Error', { 'Content-Type': 'text/plain' })
                res.end('No request handler defined');
            }
        })

        socket.on("error", err => {
            console.error("Socket err: ", err)
        })
    }

    onRequest(handler) {
        this.requestHandler = handler
    }

    listen(port, callback) {
        this.server.listen(port, callback)
    }
}

module.exports = HttpServer
