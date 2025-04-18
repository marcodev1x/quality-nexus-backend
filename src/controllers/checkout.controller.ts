import { Request, Response } from "express";
import { checkoutServiceInstance } from "../instances/checkout.instance.ts";

export class CheckoutController {
  async handleCheckout(req: Request, res: Response) {
    const { email } = req.body;

    const session = await checkoutServiceInstance.CreateCheckoutSession(
      email,
      req,
    );

    res.json({ url: session.url });
  }
}
