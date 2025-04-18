import { EnvsVars } from "../EnvsVars.ts";

export const stripeKey = () => {
  return require("stripe")(EnvsVars.STRIPE_SECRET_KEY);
};

const globalPaymentKey = stripeKey();

export default globalPaymentKey;
