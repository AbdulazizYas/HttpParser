class HttpResponse {
    constructor(socket) { 
        this.socket = socket
        this.headers = {}
        this.statusCode = 200;
        this.statusMessage = 'OK'
        this.body = ''
        this.bodyBuffer = [] // for buffering the data before sending it
    }

    setHeader(name, value) {
        this.headers[name] = value
    }

    // Write the Head and then send it before ending connection
    writeHead(statusCode, statusMessage, headers) {
        this.statusCode = statusCode
        this.statusMessage = statusMessage
        Object.assign(this.headers, headers) // to merge them not overwrite them
    }

    write(data) {
        this.bodyBuffer.push(data)
    }

    end(data) {
        if (data) {
            this.write(data)
        }

        this.sendResponse()

        this.socket.end()
    }

    sendResponse() {
        this.body = this.bodyBuffer.join('')

        this.setHeader('Content-Length', this.body? Buffer.byteLength(this.body) : 0)

        const responseLines = [`HTTP/1.1 ${this.statusCode} ${this.statusMessage}`]

        for (const [key, val] of Object.entries(this.headers)) {
            responseLines.push(`${key}: ${val}`)
        }
        
        // Because there are two \r\n between the Head and Body
        responseLines.push("\r\n")

        this.socket.write(responseLines.join("\r\n"))

        this.socket.write(this.body)
    }
}

module.exports = HttpResponse
