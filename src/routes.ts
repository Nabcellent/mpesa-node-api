import { Router } from 'express';
import RouteGroup from 'express-route-grouping';
import { validate } from './http/middleware/validate.middleware';
import { MpesaController } from './http/controllers/mpesa.controller';
import { MpesaRequest } from './http/requests/mpesa.request';

const router = new RouteGroup('/', Router());

router.group('/mpesa', router => {
    router.get('/requests', MpesaController.index);

    router.post('/initiate-stk', validate(MpesaRequest.initiateStk), MpesaController.initiateStk);
    router.post('/stk-callback', MpesaController.stkCallback);
    router.post('/query-request', validate(MpesaRequest.queryStatus), MpesaController.queryRequest);

    router.get('/query-statuses', MpesaController.queryStkStatus);
});

export default router.export();
