import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';
import compression from 'compression';
import bodyParser from 'body-parser';
import { router } from './routes';
import { logger } from './logger';
import { DATABASE_URL, PORT } from './config';

const app = express();
mongoose.Promise = global.Promise;
let server;

// Middleware
app.use(compression({ level: 9, threshold: 0 }));
app.use(morgan('common', { stream: logger.stream }));
app.use(bodyParser.json());
app.use(cors({
  origin: ['http://localhost:3000', 'https://gilmoreg.github.io'],
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: 'Accept, Origin, Content-Type, Referer',
  credentials: true,
}));

// Log all requests
app.use((req, res, next) => {
  console.info(`${req.method} ${req.url} ${req.body ? JSON.stringify(req.body) : 'No body'}`);
  next();
});

app.use(router);

function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    /* eslint-disable consistent-return */
    mongoose.connect(databaseUrl, (err) => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        logger.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', () => {
        mongoose.disconnect();
        reject();
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() =>
    new Promise((resolve, reject) => {
      console.log('Closing server');
      logger.log('Closing server');
      server.close((err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    }),
  );
}

if (require.main === module) {
  runServer().catch(err => logger.error(err));
}

module.exports = { app, runServer, closeServer };
