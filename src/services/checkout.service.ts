import globalPaymentKey from "../helpers/stripe.helper.ts";
import { Request } from "express";

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
      success_url: "https://suaapp.com/sucesso",
      cancel_url: "https://suaapp.com/cancelado",
    });
  }
}
