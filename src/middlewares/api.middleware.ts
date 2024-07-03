import { Request, Response, NextFunction } from 'express';
import { default as crypto } from 'crypto';
import { validate, Joi } from 'express-validation';
import ApiError from '@src/libs/apiError.lib';

export const validateWebhook = validate(
  {
    body: Joi.array().items(
      Joi.object({
        event: Joi.string().required(),
        data: Joi.object().required(),
      })
    ),
  },
  {},
  {}
);

export const validateWebhookSignature = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const sharedKey = process.env.WEBHOOK_SHARED_KEY || '';

  const requestSignature = req.query.signature;

  const signature = await crypto
    .createHmac('sha256', sharedKey)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (requestSignature !== signature) {
    next(new ApiError('Invalid signature', 403));
    return;
  }

  next();
};
