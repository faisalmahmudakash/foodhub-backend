import express from "express";
import { productController } from "./product.controller";
import { Role } from "../../../prisma/generated/prisma/enums";
import authMiddleware from "../../middleware/authMiddleware";

const router = express.Router();

router.post(
  "/",
  authMiddleware(Role.ADMIM, Role.PROVIDER),
  productController.createProduct,
);
router.post(
  "/price",
  authMiddleware(Role.ADMIM, Role.PROVIDER),
  productController.createProductPrice,
);
router.post(
  "/mile",
  authMiddleware(Role.ADMIM, Role.PROVIDER),
  productController.createMileTime,
);

router.get("/", productController.getAllProduct);
router.get("/mile", productController.getMileTime);
// Must come before "/:productId" or Express would treat "search" as a productId.
router.get("/search", productController.searchProduct);
router.get(
  "/provider/mine",
  authMiddleware(Role.ADMIM, Role.PROVIDER),
  productController.getMyProducts,
);

router.delete(
  "/:productId",
  authMiddleware(Role.ADMIM, Role.PROVIDER),
  productController.deleteProduct,
);
router.delete(
  "/mile/:mileTimeId",
  authMiddleware(Role.ADMIM, Role.PROVIDER),
  productController.deleteMileTime,
);
router.delete(
  "/prices/:productId",
  authMiddleware(Role.ADMIM, Role.PROVIDER),
  productController.deleteAllProductPrice,
);
router.delete(
  "/price/:productId",
  authMiddleware(Role.ADMIM, Role.PROVIDER),
  productController.deleteProductPrice,
);

router.put(
  "/:productId",
  authMiddleware(Role.ADMIM, Role.PROVIDER),
  productController.updateProduct,
);
router.put(
  "/mile/:mileTimeId",
  authMiddleware(Role.ADMIM, Role.PROVIDER),
  productController.updateMileTime,
);
router.put(
  "/price",
  authMiddleware(Role.ADMIM, Role.PROVIDER),
  productController.updatePrice,
);

router.get("/:productId", productController.getProductById);

export const productRouter = router;
