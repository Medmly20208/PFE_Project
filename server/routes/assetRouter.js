const express = require("express");
const router = express.Router();
const assetController = require("../controllers/assetController");

router.post("/", assetController.createAsset);
router.get("/:userId", assetController.getUserAssets);
router.put("/:assetId", assetController.updateAsset);
router.delete("/:assetId", assetController.deleteAsset);
router.post("/prices", assetController.getAssetPrices);
router.post("/history", assetController.getPortfolioHistory);
module.exports = router;
