import {
  globalPaymentKey,
  webhookPaymentKey,
} from "../helpers/stripe.helper.ts";
import { Request } from "express";
import Stripe from "stripe";
import { db } from "../database.ts";
import { EnvsVars } from "../EnvsVars.ts";

export class CheckoutService {
  async CreateCheckoutSession(userEmail: string, svReq: Request) {
    try {
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
        success_url: `${EnvsVars.FRONT_URL}/configuracoes/plan`,
        cancel_url: `${EnvsVars.FRONT_URL}/configuracoes/plan`,
      });
    } catch (err) {
      console.warn(err);
    }
  }

  async UpdateWebHookEvent(rawBody: Buffer, sign: string) {
    let eventStripe: Stripe.Event;

    try {
      eventStripe = globalPaymentKey.webhooks.constructEvent(
        rawBody,
        sign,
        webhookPaymentKey,
      );
    } catch (err) {
      console.error("Webhook signature verification failed.", err);
      return;
    }

    console.log({ eventStripe });

    switch (eventStripe.type) {
      case "checkout.session.completed":
        await this.handleCheckoutCompleted(
          eventStripe.data.object as Stripe.Checkout.Session,
        );
        break;

      case "invoice.payment_succeeded":
        await this.handlePaymentSucceeded(
          eventStripe.data.object as Stripe.Invoice,
        );
        break;

      case "invoice.payment_failed":
        await this.handlePaymentFailed(
          eventStripe.data.object as Stripe.Invoice,
        );
        break;

      case "customer.subscription.deleted":
        await this.handleSubscriptionDeleted(
          eventStripe.data.object as Stripe.Subscription,
        );
        break;

      default:
        console.log(`Unhandled event type: ${eventStripe.type}`);
    }
  }

  private async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const customerDetails = session.customer_details;

    if (
      !customerDetails ||
      session.payment_status !== "paid" ||
      !customerDetails.email
    )
      return;

    try {
      const changeRole = await db("TODO_USER")
        .where("email", customerDetails.email)
        .update({
          role: "plan",
          stripe_subscription_id: session.subscription,
        });

      console.log(`Plano ativado para: ${customerDetails.email}`);

      if (!changeRole) return;
    } catch (err: any) {
      console.error(err);
    }
  }

  private async handlePaymentSucceeded(invoice: Stripe.Invoice) {
    const customerEmail = invoice.customer_email;

    if (!customerEmail) return;

    try {
      console.log(`Renovação bem-sucedida para: ${customerEmail}`);
    } catch (err: any) {
      console.error(err);
    }
  }

  private async handlePaymentFailed(invoice: Stripe.Invoice) {
    const customerEmail = invoice.customer_email;

    if (!customerEmail) return;

    try {
      console.warn(`Falha na renovação para: ${customerEmail}`);
    } catch (err: any) {
      console.error(err);
    }
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const customerId = subscription.customer;

    try {
      const deleted = globalPaymentKey.subscriptions.delete(subscription.id);

      await db("TODO_USER")
        .where("stripe_subscription_id", subscription.id)
        .update({
          role: "free",
        });

      return deleted;
    } catch (err: any) {
      console.error(err);
    }
  }

  async cancelSubscription(subId: string) {
    try {
      const cancel = await globalPaymentKey.subscriptions.cancel(subId);



      await db("TODO_USER").where("stripe_subscription_id", subId).update({
        role: "free",
      });
      console.log(`Subscrição cancelada com sucesso: ${subId}`);
      return cancel;
    } catch (err) {
      console.warn(err);
    }
  }
}
