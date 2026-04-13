const Asset = require("../models/asset.model");
const YahooFinance = require("yahoo-finance2").default;
const yahooFinance = new YahooFinance();

const getPortfolioReturns = async (req, res) => {
  try {
    const { tickers, start = "2019-10-15", end = "2025-11-22" } = req.body;

    // Fetch data for all tickers
    const results = await Promise.all(
      tickers.map(async (ticker) => {
        const data = await yahooFinance.historical(ticker, {
          period1: start,
          period2: end,
        });

        return { ticker, data };
      }),
    );

    // Extract close prices
    const prices = {};

    results.forEach(({ ticker, data }) => {
      prices[ticker] = data.map((d) => ({
        date: d.date,
        close: d.close,
      }));
    });

    // Compute returns (pct_change)
    const returns = {};

    Object.keys(prices).forEach((ticker) => {
      const series = prices[ticker];

      const tickerReturns = [];

      for (let i = 1; i < series.length; i++) {
        const prev = series[i - 1].close;
        const curr = series[i].close;

        if (prev && curr) {
          const pctChange = (curr - prev) / prev;
          tickerReturns.push({
            date: series[i].date,
            return: pctChange,
          });
        }
      }

      returns[ticker] = tickerReturns;
    });

    return res.json({
      tickers,
      returns,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching data" });
  }
};

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

const getPortfolioMetrics = async (req, res) => {
  try {
    const { shares, start = "2019-10-15", end = "2025-11-22" } = req.body;

    // 🔒 Validation
    if (!shares || typeof shares !== "object") {
      return res.status(400).json({ error: "Shares object is required" });
    }

    if (!start || !end) {
      return res.status(400).json({ error: "Start and end required" });
    }

    const tickers = Object.keys(shares);
    const quantities = Object.values(shares);
    const n = tickers.length;

    if (n === 0) {
      return res.status(400).json({ error: "No tickers provided" });
    }
    const results = await Promise.all(
      tickers.map(async (ticker) => {
        const data = await yahooFinance.historical(ticker, {
          period1: start,
          period2: end,
        });

        return {
          ticker,
          prices: data.map((d) => d.close).filter((v) => v != null),
        };
      }),
    );
    const minLength = Math.min(...results.map((r) => r.prices.length));

    const priceMatrix = results.map((r) => r.prices.slice(-minLength));
    const latestPrices = priceMatrix.map((p) => p[p.length - 1]);

    const values = latestPrices.map((price, i) => price * quantities[i]);
    const totalQuantities = quantities.reduce((a, b) => a + b, 0);
    const totalValue = values.reduce((a, b) => a + b, 0);

    const weights = quantities.map((v) => v / totalQuantities);
    console.log("weights", weights);
    const returnsMatrix = [];

    for (let i = 1; i < minLength; i++) {
      const row = [];

      for (let j = 0; j < n; j++) {
        const prev = priceMatrix[j][i - 1];
        const curr = priceMatrix[j][i];

        row.push((curr - prev) / prev);
      }

      returnsMatrix.push(row);
    }

    const mu_daily = [];

    for (let j = 0; j < n; j++) {
      const vals = returnsMatrix.map((r) => r[j]);
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
      mu_daily.push(mean);
    }

    const mu = mu_daily.map((m) => m * 252);

    const covarianceMatrix = Array.from({ length: n }, () => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        let cov = 0;

        for (let k = 0; k < returnsMatrix.length; k++) {
          cov +=
            (returnsMatrix[k][i] - mu_daily[i]) *
            (returnsMatrix[k][j] - mu_daily[j]);
        }

        covarianceMatrix[i][j] = (cov / (returnsMatrix.length - 1)) * 252;
      }
    }

    // 7️⃣ Portfolio return
    const portfolioReturn = mu.reduce((sum, m, i) => sum + m * weights[i], 0);

    // 8️⃣ Portfolio volatility
    let variance = 0;

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        variance += weights[i] * covarianceMatrix[i][j] * weights[j];
      }
    }

    const portfolioVolatility = Math.sqrt(variance);
    //console.log("cov ", totalValue, weights);

    console.log(
      "final results",
      Object.fromEntries(tickers.map((t, i) => [t, mu[i]])),
      "return",
      portfolioReturn,
      "volatility",
      portfolioVolatility,
    );

    return res.json({
      tickers,
      shares,
      latestPrices,
      weights,
      annualReturns: Object.fromEntries(tickers.map((t, i) => [t, mu[i]])),
      portfolio: {
        return: portfolioReturn,
        volatility: portfolioVolatility,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error computing portfolio metrics" });
  }
};

module.exports = {
  createAsset,
  getAssetPrices,
  getUserAssets,
  updateAsset,
  getPortfolioHistory,
  getPortfolioReturns,
  deleteAsset,
  getPortfolioMetrics,
};
