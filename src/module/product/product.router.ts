import express from "express";
import { productController } from "./product.controller";

const router = express.Router();

router.post("/", productController.createProduct);
router.post("/price", productController.createProductPrice);

export const productRouter = router;
