import { EnvsVars } from "../EnvsVars.ts";

const stripeKey = () => {
  return require("stripe")(EnvsVars.STRIPE_SECRET_KEY);
};

const stripeWebhookKey = () => {
  return EnvsVars.STRIPE_WEBHOOK_KEY;
};

export const globalPaymentKey = stripeKey();
export const webhookPaymentKey = stripeWebhookKey();
