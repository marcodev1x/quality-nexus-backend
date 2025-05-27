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

  async cancelPlan(req: Request, res: Response) {
    const { subId } = req.body;

    console.log(subId)

    try {
      const cancel = await checkoutServiceInstance.cancelSubscription(subId);
      res.status(201).json({
        status: "success",
        message: "Subscription canceled successfully",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: "error at cancel subscription.",
      });
      return;
    }
  }
}
