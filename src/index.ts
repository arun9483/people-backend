import express from 'express';
import bodyParser from 'body-parser';
import { RegisterRoutes } from './routes/routes';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../swagger-output/swagger.json';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Register TSOA generated routes
RegisterRoutes(app);

// Serve Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error handler for tsoa generated routes
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err instanceof Error) {
      res.status(500).send(err.message);
    } else {
      next();
    }
  }
);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
