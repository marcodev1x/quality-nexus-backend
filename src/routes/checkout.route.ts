import express, { Router } from "express";
import { checkoutInstance } from "../instances/checkout.instance.ts";

const checkoutRoute = Router();

checkoutRoute.post("/checkout-session", checkoutInstance.handleCheckout);
checkoutRoute.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  checkoutInstance.webhook,
);
checkoutRoute.post("/cancel-subscription", checkoutInstance.cancelPlan);

export default checkoutRoute;
