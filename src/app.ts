import express from "express";
import helmet from "helmet";
import { EnvsVars } from "./EnvsVars";
import index from "./routes";
import cors from "cors";
import checkoutRoute from "./routes/checkout.route.ts";

const app = express();

app.use(helmet());

app.use(checkoutRoute);

app.use(express.json());
app.listen(EnvsVars.PORT, () => {
  console.log(`Running on port ${EnvsVars.PORT}`);
});

app.use(
  cors({
    origin: "*",
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(index);

export default app;
