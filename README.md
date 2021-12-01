# React-HLS-Video-Streaming

A HLS video streaming application usin React,Express,FFmpeg & MongoDB

## Installation

Go to /server & run the following command

```bash
npm install && npm start
```

Then go to /client & run the following command

```bash
npm install && npm start
```

## Node media server

Node media server exposes an API to list all connected clients. You can access it in your browser at http://127.0.0.1:8888/api/streams

## CRACO

If you get the error: "craco is not recognized as an internal or external command",
delete the line "@craco/craco": "^5.9.0" from package.json in 'client/' folder, and run "npm install @craco/craco@5.9.0"

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update the tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
