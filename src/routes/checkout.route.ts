import { Router } from "express";
import { checkoutInstance } from "../instances/checkout.instance.ts";

const checkoutRoute = Router();

checkoutRoute.post("/checkout-session", checkoutInstance.handleCheckout);

export default checkoutRoute;
