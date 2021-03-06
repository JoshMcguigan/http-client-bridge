# http-client-bridge
HTTP client bridge is an HTTP server that allows one-way communication of arbitraty data between two groups of HTTP clients. The server listens for GET requests for data and static files from the front-end clients, and POST requests from the back-end clients. The server is configured to use a different port for the front-end and back-end clients to limit access to each function. For example, HTTP client bridge could be configured to listen to GET requests from the front-end clients on port 80, and listen to POST requests from the back-end clients on port 3000.

Back-end clients can POST to any url path, and front end clients can GET the data by prepending /api/ to the path used by the back-end client. Static files are served at the root url.

## Installation

```
>git clone https://github.com/JoshMcguigan/http-client-bridge.git
>cd http-client-bridge
>npm install
>npm link
```

## Usage

```
// Start the server with the default settings
>http-client-bridge
```
```
// Start the server listening for GETs on port 8000, POSTs on port 3000, and serving static files from '/Users/Josh/Public'
>http-client-bridge --getPort 8000 --postPort 3000 --staticDir '/Users/Josh/Public'
```

## Testing

```
// To run the automated integration tests
>npm test
```
