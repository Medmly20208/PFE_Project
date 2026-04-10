const Asset = require("../models/asset.model");
const YahooFinance = require("yahoo-finance2").default;
const yahooFinance = new YahooFinance();
// Get prices for tickers

const getPortfolioHistory = async (req, res) => {
  try {
    // You can pass these via query params later

    const {
      startDate = "2023-01-01",
      endDate = "2024-01-01",
      tickers,
    } = req.body;
    const data = [];

    for (let i = 0; i < tickers?.length; i++) {
      const result = await yahooFinance.chart(tickers[i], {
        period1: startDate,
        period2: endDate,
        interval: "1d",
      });

      data.push(result);
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching portfolio history:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch portfolio history",
    });
  }
};

const getAssetPrices = async (req, res) => {
  try {
    const { tickers } = req.body;

    if (!tickers || !Array.isArray(tickers) || tickers.length === 0) {
      return res.status(400).json({ error: "Tickers array is required" });
    }

    // Fetch each ticker one by one
    const quotes = await Promise.all(
      tickers.map((ticker) => yahooFinance.quote(ticker)),
    );

    const priceMap = {};
    quotes.forEach((q) => {
      priceMap[q.symbol] = q.regularMarketPrice ?? null;
    });

    res.json(priceMap);
  } catch (err) {
    console.error("Yahoo Finance error:", err);
    res.status(500).json({ error: "Failed to fetch prices" });
  }
};

module.exports = { getAssetPrices };

// Create a new asset
const createAsset = async (req, res) => {
  try {
    const { userId, ticker, quantity } = req.body;

    // Validate required fields
    if (!userId || !ticker || quantity === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Optional: validate type

    const asset = await Asset.create({ userId, ticker, quantity });

    res.status(201).json(asset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all assets for a specific user
const getUserAssets = async (req, res) => {
  try {
    const { userId } = req.params;
    const assets = await Asset.find({ userId });
    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an asset (quantity or ticker/type)
const updateAsset = async (req, res) => {
  try {
    const { assetId } = req.params;
    const updateData = req.body;

    const updatedAsset = await Asset.findByIdAndUpdate(assetId, updateData, {
      new: true,
    });

    if (!updatedAsset) {
      return res.status(404).json({ error: "Asset not found" });
    }

    res.json(updatedAsset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an asset
const deleteAsset = async (req, res) => {
  try {
    const { assetId } = req.params;

    const deleted = await Asset.findByIdAndDelete(assetId);

    if (!deleted) {
      return res.status(404).json({ error: "Asset not found" });
    }

    res.json({ message: "Asset deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createAsset,
  getAssetPrices,
  getUserAssets,
  updateAsset,
  getPortfolioHistory,
  deleteAsset,
};
