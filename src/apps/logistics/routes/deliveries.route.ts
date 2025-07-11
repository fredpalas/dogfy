import { Router, Request, Response } from 'express';
import container from '../dependency-injection';
import { body } from 'express-validator';
import { DeliveryPostController } from "../controllers/DeliveryPostController";
import { DeliveryStatusGetController } from "../controllers/DeliveryStatusGetController";
import { DeliveryStatusEnum } from "../../../Contexts/Logistics/Deliveries/domain/DeliveryStatus";
import { DeliveryWebhookController } from "../controllers/DeliveryWebhookController";
import { validateReqSchema } from "./index";

export const register = (router: Router) => {
  const reqSchema = [
    body('orderId').exists().isString(),
    body('provider').exists().isString().isIn([
      'DUMMY',
      'NRW',
      'TLS'
    ]),
    body("status").exists()
      .isString()
      .isIn(Object.values(DeliveryStatusEnum).map(value => value.toString())),
  ];
  const webhookSchema = [
    body('providerTrackingId').exists().isString(),
    body('status').exists().isString().isIn(Object.values(DeliveryStatusEnum).map(value => value.toString())),
    body('date').optional().isISO8601()
  ];

  const controller: DeliveryPostController = container.get('Apps.logistics.controllers.DeliveryPostController');
  router.post('/deliveries', reqSchema, validateReqSchema, (req: Request, res: Response) =>
    controller.run(req, res)
  );

  const statusController: DeliveryStatusGetController = container.get('Apps.logistics.controllers.DeliveryStatusGetController');
  router.get('/deliveries/:id/status', (req: Request, res: Response) =>
    statusController.run(req, res)
  );

  const webhookController = new DeliveryWebhookController();
  router.post('/deliveries/webhook', webhookSchema, validateReqSchema, async (req: Request, res: Response) => webhookController.run(req, res));
}; 
