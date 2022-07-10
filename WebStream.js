import { createServer } from 'node:http';
const port = 1337;

export function webServer() {
  const server = createServer((req, res) => {
    let body = '{"test": "test"}';
    // Get the data as utf8 strings.
    // If an encoding is not set, Buffer objects will be received.
    req.setEncoding('utf8');

    // Readable streams emit 'data' events once a listener is added.
    req.on('data', (chunk) => {
      body += chunk;
    });

    // The 'end' event indicates that the entire body has been received.
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        // Write back something interesting to the user:
        res.write(typeof data);
        res.end();
      } catch (er) {
        // uh oh! bad json!
        res.statusCode = 400;
        return res.end(`error: ${er.message}`);
      }
    });
  });

  server.listen(port);
  console.log(`Web server started! Port: ${port}`);
}
