const express = require("express");
const router = express.Router();
const assetController = require("../controllers/assetController");

router.post("/", assetController.createAsset);
router.get("/:userId", assetController.getUserAssets);
router.put("/:assetId", assetController.updateAsset);
router.delete("/:assetId", assetController.deleteAsset);
router.post("/prices", assetController.getAssetPrices);
router.post("/history", assetController.getPortfolioHistory);
router.post("/returns", assetController.getPortfolioReturns);
router.post("/metrics", assetController.getPortfolioMetrics);

router.post(
  "/blacklitterman",
  assetController.getBlackLitterManModelPortfolioAllocation,
);

module.exports = router;
