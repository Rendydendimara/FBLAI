const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const http = require('http');
const https = require('https');
const { Request, Response, NextFunction } = require('express');
const Debug = require('debug');
const fs = require('fs');
const debug = Debug('findbooklai:server');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { mainRouter } = require('./routes');

const folders = [
  'uploads/result',
  'uploads/csv',
];
for (const folder of folders) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
}


dotenv.config();

// init express app
const app = express();

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Public Folder
app.use('/uploads/result', express.static('uploads/result'));
app.use('/results', express.static('results'));

// Logger
app.use(
  morgan(function (tokens, req, res) {
    const responseCode = tokens?.status(req, res) ?? '500';
    if (responseCode.charAt(0) === '4' || responseCode.charAt(0) === '5') {
      if (req.body.files) {
        req.body.files = undefined; // except files
      }
      console.log('request.body', req.body);
      console.log('request.query', req.query);
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        responseCode,
        tokens['response-time'](req, res),
        'ms',
      ].join(' ');
    }
  })
);

// Cors enable (include before routes)
app.use(cors());

// Protection http using helmet
app.use(helmet());

// Mount routes
app.use('/api', mainRouter);

// 404
app.use(express.static(path.join(__dirname, '/client/build')));

// 404
app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/client/build/index.html`));
});

// error handler
app.use(
  async (err, req, res, next) => {
    const isDev =
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'staging';
    // set locals, only providing error in development
    // res.locals.message = err.message;
    // res.locals.error = isDev ? err : {};
    console.log('err', err)
    // render the error page
    res.status(err.status || 500);
    res.send({
      success: false,
      data: null,
      message: err.message ? err.message : err //isDev ? err.message : 'Ooops ada kesalahan pada sistem.',
    });
  }
);

// Listen
const port = normalizePort(process.env.PORT || '8080');
app.set('port', port);

if (process.env.NODE_ENV === 'development') {
  // const httpsServer = https.createServer(app);
  const httpsServer = http.createServer(app);

  httpsServer.listen(port, () => {
    const addr = httpsServer.address();
    const bind =
      typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug(`Listening on ${bind}`);
    console.log(
      [
        `🚀 Server start on port ${port}`,
        `Running with ${process.env.NODE_ENV} environment...`,
      ],
      'app-startup'
    );
  });
  console.log('\nserver running on port ', port);
  httpsServer.on('error', onError);
} else {
  const server = http.createServer(app);
  server.listen(port);
  console.log('Running on', server.address());
  server.on('error', onError);
}

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
