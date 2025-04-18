import { CheckoutController } from "../controllers/checkout.controller.ts";
import { CheckoutService } from "../services/checkout.service.ts";

export const checkoutInstance = new CheckoutController();
export const checkoutServiceInstance = new CheckoutService();
