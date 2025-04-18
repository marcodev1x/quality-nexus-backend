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

  async webhook(req: Request, res: Response) {
    const stripeSign = req.headers["stripe-signature"];

    try {
      const ifa = await checkoutServiceInstance.UpdateWebHookEvent(
        req.body,
        stripeSign as string,
      );
      res.sendStatus(200).json(ifa);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        status: "error",
        message: "Error creating checkout service",
      });
    }
  }
}
