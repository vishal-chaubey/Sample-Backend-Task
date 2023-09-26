import { Express, Request, Response } from 'express'
import swaggerUi from 'swagger-ui-express';
const swaggerDocument = require('../../swagger.json');
import * as TaskRoute from './task.routes';

const swaggerCSS = {
  customCss: 'swagger-ui .topbar { display: none }',
  customSiteTitle: "Task APIs List",
};

export const initRoutes = (app: Express) => {
  // Swagger
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerCSS));

  app.get('/api', (req: Request, res: Response) => res.status(200).send({
    message: 'server is listening!'
  }))

  TaskRoute.routes(app);

  app.all('*', (req: Request, res: Response) => res.status(404).send())
}