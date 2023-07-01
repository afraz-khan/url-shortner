import "reflect-metadata";
import http from "http";
import express from "express";
import bodyParser from 'body-parser';
import {useExpressServer} from 'routing-controllers';
import { UrlShortnerController } from "./controllers/UrlShortnerController";

const [HOST_NAME, PORT]= ['0.0.0.0', 3000];

export class App {
	public static server: http.Server;
	private readonly express: express.Application;

  constructor() {
    this.express = express();
  }

	public start() {
    this.express.use(
      bodyParser.json({
        verify: (req: any, _res, buf) => {
          req.rawBuffer = buf.toString();
        },
      })
    );

    this.initControllers();
    this.listen();
  }

	private initControllers() {

    useExpressServer(this.express, {
      defaultErrorHandler: false,
      cors: {
        origin: '*',
        exposedHeaders: ['Session', 'Authorization', 'Location', 'Refresh-Token', 'sentry-trace'],
      },
      routePrefix: '/api',
      controllers: [UrlShortnerController],
    });
  }

  private listen() {
    App.server = this.express.listen(PORT, HOST_NAME, () => {
			console.log('server running')
    });
    App.server.keepAliveTimeout = 65000;
    App.server.headersTimeout = 66000;
  }
}