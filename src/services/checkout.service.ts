import {
  globalPaymentKey,
  webhookPaymentKey,
} from "../helpers/stripe.helper.ts";
import { Request } from "express";
import Stripe from "stripe";
import { db } from "../database.ts";

export class CheckoutService {
  async CreateCheckoutSession(userEmail: string, svReq: Request) {
    return await globalPaymentKey.checkout.sessions.create({
      billing_address_collection: "auto",
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: "brl",
            recurring: {
              interval: "month",
            },
            product_data: {
              name: "Assinatura Pro",
            },
            unit_amount: 1500,
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:5173/configuracoes/plan",
      cancel_url: "http://localhost:5173/configuracoes/plan",
    });
  }

  async UpdateWebHookEvent(rawBody: Buffer, sign: string) {
    const eventStripe = globalPaymentKey.webhooks.constructEvent(
      rawBody,
      sign,
      webhookPaymentKey,
    );

    if (eventStripe.type === "checkout.session.completed") {
      const session = eventStripe.data.object as Stripe.Checkout.Session;
      const allDataConsumer = session.customer_details;

      if (
        !allDataConsumer ||
        session.payment_status !== "paid" ||
        !allDataConsumer.email
      )
        return;

      try {
        const changeRole = await db("TODO_USER")
          .where("email", allDataConsumer.email)
          .update({
            role: "plan",
          });

        console.log(session);
        console.log(changeRole);
        if (!changeRole) return;
      } catch (err: any) {
        console.error(err);
        return;
      }
    }
  }
}
