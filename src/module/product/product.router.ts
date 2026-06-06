import express from "express";
import { productController } from "./product.controller";

const router = express.Router();

router.post("/", productController.createProduct);
router.post("/price", productController.createProductPrice);
router.post("/mile", productController.createMileTime);

router.get("/", productController.getAllProduct);
router.get("/mile", productController.getMileTime);

router.delete("/:productId", productController.deleteProduct);
router.delete("/mile/:mileTimeId", productController.deleteMileTime);
router.delete("/prices/:productId", productController.deleteAllProductPrice);
router.delete("/price/:productId", productController.deleteProductPrice);

router.put("/:productId", productController.updateProduct);
router.put("/mile/:mileTimeId", productController.updateMileTime);
router.put("/price", productController.updatePrice);

export const productRouter = router;
