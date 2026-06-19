import { toNodeHandler } from "better-auth/node";
import express from "express";
import { auth } from "./lib/auth";
import cors from "cors";
import { productRouter } from "./module/product/product.router";
import { providerRouter } from "./module/provider/provider.router";
import { orderRouter } from "./module/order/order.router";
import { addonRouter } from "./module/addon/addon.router";
import { createItemRouter } from "./module/createItem/createItem.router";
import { reviewRouter } from "./module/review/review.router";
import { userRouter } from "./module/user/user.router";
import path from "path";

const app = express();

app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true,
  }),
);

app.all("/api/auth/{*split}", toNodeHandler(auth));

app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.send("Food Hub");
});

app.use("/product", productRouter);
app.use("/addon", addonRouter);
app.use("/cartItem", createItemRouter);
app.use("/order", orderRouter);
app.use("/review", reviewRouter);
app.use("/provider", providerRouter);

app.use("/uploads", userRouter);
app.use("/profile", userRouter);

export default app;
