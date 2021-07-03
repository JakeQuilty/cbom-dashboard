import { Router } from 'express';
import org from './routes/org';

export default () => {
    const app = Router();
    org(app);

    return app;
}