const { httpVersionNotSupported } = require("./constants");

class HttpRequest {
  constructor(socket) {
    this.socket = socket;
    this.headers = {};
    this.method = "";
    this.url = "";
    this.body = "";
    this.version = "";
    this.parseRequest();
  }

  parseRequest() {
    // for buffering the request before parsing it
    let dataBuffer = "";

    // upon receiving data, parse the request
    this.socket.on("data", (data) => {
      // Append new data to buffer
      dataBuffer += data.toString();

      // Means that the headers are ready with the body
      if (dataBuffer.includes("\r\n\r\n")) {
        // make sure to convert the buffer to string
        const requestString = data.toString();

        // separate all headers from the body section
        const [headerSection, bodySection] = requestString.split("\r\n\r\n");

        // separate the headers from the first request line
        const [requestLine, ...headers] = headerSection.split("\r\n");

        [this.method, this.url, this.version] = requestLine.split(" ");

        // if it is not HTTP/1.1, send 505 error
        if (!this.version.endsWith("1.1")) {
          this.socket.end(httpVersionNotSupported);
        }

        // Assign the Headers
        headers.forEach((header) => {
          const [key, val] = header.split(": ");
          if (key) {
            this.headers[key] = val;
          }
        });

        // Assign the body
        this.body = bodySection;
      }
    });
  }
}

module.exports = HttpRequest;
