const Asset = require("../models/asset.model");
const {
  CalculateVarHistorical,
  CalculateVarAndEs,
  calculateBetas,
  computePerformanceRatios,
} = require("../utils/utils");
const YahooFinance = require("yahoo-finance2").default;
const yahooFinance = new YahooFinance();
const math = require("mathjs");

const getPortfolioReturns = async (req, res) => {
  try {
    const { tickers, start = "2019-10-15", end = "2025-11-22" } = req.body;

    // Fetch data for all tickers
    const results = await Promise.all(
      tickers.map(async (ticker) => {
        const data = await yahooFinance.chart(ticker, {
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
      startDate = "2019-10-15",
      endDate = "2025-11-22",
      tickers,
    } = req.body;
    const data = [];

    for (let i = 0; i < tickers?.length; i++) {
      const result = await yahooFinance.historical(tickers[i], {
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
    const marketData = await yahooFinance.historical("^GSPC", {
      period1: start,
      period2: end,
    });

    const marketPrices = marketData
      .map((d) => d.close)
      .filter((v) => v != null)
      .slice(-minLength);

    const marketReturns = [];
    for (let i = 1; i < marketPrices.length; i++) {
      const prev = marketPrices[i - 1];
      const curr = marketPrices[i];
      marketReturns.push((curr - prev) / prev);
    }
    const meanMarket =
      marketReturns.reduce((a, b) => a + b, 0) / marketReturns.length;

    const priceMatrix = results.map((r) => r.prices.slice(-minLength));
    const latestPrices = priceMatrix.map((p) => p[p.length - 1]);

    const values = latestPrices.map((price, i) => price * quantities[i]);
    const totalQuantities = quantities.reduce((a, b) => a + b, 0);
    const totalValue = values.reduce((a, b) => a + b, 0);

    const weights = quantities.map((v) => v / totalQuantities);
    const portfolioDailyReturns = [];
    const returnsMatrix = [];

    for (let i = 1; i < minLength; i++) {
      const row = [];

      for (let j = 0; j < n; j++) {
        const prev = priceMatrix[j][i - 1];
        const curr = priceMatrix[j][i];

        row.push((curr - prev) / prev);
      }

      returnsMatrix.push(row);
      portfolioDailyReturns.push(
        row.reduce((sum, item, index) => {
          return sum + weights[index] * item;
        }, 0),
      );
    }

    const betas = calculateBetas(returnsMatrix, marketReturns, tickers);
    const portfolioBeta = tickers.reduce((sum, ticker, i) => {
      return sum + weights[i] * betas[ticker];
    }, 0);
    const mu_daily = [];

    for (let j = 0; j < n; j++) {
      const vals = returnsMatrix.map((r) => r[j]);
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
      mu_daily.push(mean);
    }
    const mu = mu_daily.map((m) => m * 252);

    const covarianceMatrix = Array.from({ length: n }, () => Array(n).fill(0));
    const cov_daily = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        let cov = 0;

        for (let k = 0; k < returnsMatrix.length; k++) {
          cov +=
            (returnsMatrix[k][i] - mu_daily[i]) *
            (returnsMatrix[k][j] - mu_daily[j]);
        }

        covarianceMatrix[i][j] = (cov / (returnsMatrix.length - 1)) * 252;
        cov_daily[i][j] = cov / (returnsMatrix.length - 1);
      }
    }
    const data = await yahooFinance.historical("^TNX", {
      period1: "2019-10-15",
      period2: "2025-11-22",
    });

    const rfAnnualPercent = data[data.length - 1].close;

    const portfolioReturn = mu.reduce((sum, m, i) => sum + m * weights[i], 0);
    const portfolioReturnDaily = mu_daily.reduce(
      (sum, m, i) => sum + m * weights[i],
      0,
    );

    let variance = 0;
    let variance_daily = 0;

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        variance += weights[i] * covarianceMatrix[i][j] * weights[j];
        variance_daily += weights[i] * cov_daily[i][j] * weights[j];
      }
    }

    const portfolioVolatility = Math.sqrt(variance);

    const riskMetrics = CalculateVarAndEs(
      portfolioDailyReturns,
      Math.sqrt(variance_daily),
      portfolioReturnDaily,
    );

    const US_10_year_treasury = 0.04321;
    const rfDaily = US_10_year_treasury / 252;

    // Market annual return
    const meanDailyMarketReturn =
      marketReturns.reduce((sum, r) => sum + r, 0) / marketReturns.length;

    const marketReturn = meanDailyMarketReturn * 252;
    const GMVP = computeGMVP(
      covarianceMatrix,
      mu,
      portfolioBeta,
      US_10_year_treasury,
      marketReturn,
    );
    const VPTR = computeVPTR(
      covarianceMatrix,
      mu,
      portfolioBeta,
      US_10_year_treasury,
      marketReturn,
    );
    const VPTR_RF = computeVPTRWithRiskFree(
      covarianceMatrix,
      mu,
      rfAnnualPercent,
      0.12,
      portfolioBeta,
      US_10_year_treasury,
      marketReturn,
    );
    const MVM1 = computeMeanVarianceModel1(
      covarianceMatrix,
      mu,
      20,
      portfolioBeta,
      US_10_year_treasury,
      marketReturn,
    );
    // Sharpe
    const ratio_sharpe =
      (portfolioReturn - US_10_year_treasury) / portfolioVolatility;

    // Treynor
    const ratio_treynor =
      (portfolioReturn - US_10_year_treasury) / portfolioBeta;

    // Jensen Alpha
    const alpha_jensen =
      portfolioReturn -
      (US_10_year_treasury +
        portfolioBeta * (marketReturn - US_10_year_treasury));

    // Sortino
    const downsideReturns = portfolioDailyReturns.filter((r) => r < rfDaily);

    const downsideDeviation = Math.sqrt(
      downsideReturns.reduce((sum, r) => sum + Math.pow(r - rfDaily, 2), 0) /
        portfolioDailyReturns.length,
    );

    const meanDailyReturn =
      portfolioDailyReturns.reduce((sum, r) => sum + r, 0) /
      portfolioDailyReturns.length;

    const ratio_sortino =
      downsideDeviation === 0
        ? null
        : ((meanDailyReturn - rfDaily) / downsideDeviation) * Math.sqrt(252);

    // Information Ratio
    const activeReturns = portfolioDailyReturns.map(
      (r, i) => r - marketReturns[i],
    );

    const meanActiveReturn =
      activeReturns.reduce((sum, r) => sum + r, 0) / activeReturns.length;

    const trackingError = Math.sqrt(
      activeReturns.reduce(
        (sum, r) => sum + Math.pow(r - meanActiveReturn, 2),
        0,
      ) /
        (activeReturns.length - 1),
    );

    const information_ratio =
      trackingError === 0
        ? null
        : (meanActiveReturn / trackingError) * Math.sqrt(252);
    return res.json({
      tickers,
      GMVP,
      VPTR,
      VPTR_RF,
      MVM1,
      shares,
      latestPrices,
      weights,
      betas,
      annualReturns: Object.fromEntries(tickers.map((t, i) => [t, mu[i]])),
      riskMetrics,
      portfolio: {
        return: portfolioReturn,
        volatility: portfolioVolatility,
      },
      ratioSharpe: ratio_sharpe,
      ratioTreynor: ratio_treynor,
      alphaJensen: alpha_jensen,
      ratioSortino: ratio_sortino,
      informationRatio: information_ratio,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error computing portfolio metrics" });
  }
};

function computeGMVP(
  Sigma,
  muArray,
  portfolioBeta,
  riskFreeRate,
  marketReturn,
) {
  const n = Sigma.length;
  const mu = math.matrix(muArray.map((x) => [x]));

  const ones = math.ones(n, 1);

  const invSigma = math.inv(Sigma);

  const A = math.squeeze(math.multiply(math.transpose(ones), invSigma, mu));

  const B = math.squeeze(math.multiply(math.transpose(mu), invSigma, mu));

  const C = math.squeeze(math.multiply(math.transpose(ones), invSigma, ones));

  const D = B * C - A * A;

  // Global Minimum Variance Portfolio weights
  const weightsMatrix = math.divide(math.multiply(invSigma, ones), C);

  const weights = weightsMatrix.toArray().map((row) => row[0]);

  // Portfolio variance
  const variance = 1 / C;

  // Portfolio volatility
  const volatility = Math.sqrt(variance);

  // Expected return
  const expectedReturn = math.squeeze(
    math.multiply(math.transpose(weightsMatrix), mu),
  );
  const { ratioSharpe, ratioTreynor, alphaJensen } = computePerformanceRatios(
    expectedReturn,
    volatility,
    portfolioBeta,
    riskFreeRate,
    marketReturn,
  );
  return {
    A,
    B,
    C,
    D,
    weights,
    expectedReturn,
    variance,
    volatility,
    ratioSharpe,
    ratioTreynor,
    alphaJensen,
  };
}

function computeVPTR(
  Sigma,
  muArray,
  portfolioBeta,
  riskFreeRate,
  marketReturn,
) {
  //Minimum Variance Portfolio with a Target Return
  const n = Sigma.length;
  const mu = math.matrix(muArray.map((x) => [x]));

  const ones = math.ones(n, 1);

  const invSigma = math.inv(Sigma);

  const A = math.squeeze(math.multiply(math.transpose(ones), invSigma, mu));

  const B = math.squeeze(math.multiply(math.transpose(mu), invSigma, mu));

  const C = math.squeeze(math.multiply(math.transpose(ones), invSigma, ones));

  const D = B * C - A * A;

  const invSigmaMu = math.multiply(invSigma, mu);
  const invSigmaOnes = math.multiply(invSigma, ones);
  const R_target = 0.12;
  const term1 = math.multiply(
    R_target,
    math.subtract(math.multiply(C, invSigmaMu), math.multiply(A, invSigmaOnes)),
  );

  const term2 = math.subtract(
    math.multiply(B, invSigmaOnes),
    math.multiply(A, invSigmaMu),
  );

  const weightsTarget = math.multiply(1 / D, math.add(term1, term2));
  const weights = weightsTarget.toArray().map((row) => row[0]);

  // Portfolio variance
  const varTarget = math.multiply(
    math.transpose(weightsTarget),
    math.multiply(Sigma, weightsTarget),
  );

  // Expected return
  const expectedReturnTarget = math.multiply(math.transpose(weightsTarget), mu);
  const volatility = Math.sqrt(varTarget.toArray()[0][0]);
  const { ratioSharpe, ratioTreynor, alphaJensen } = computePerformanceRatios(
    expectedReturnTarget.toArray()[0][0],
    volatility,
    portfolioBeta,
    riskFreeRate,
    marketReturn,
  );
  console.log("expected", expectedReturnTarget.toArray()[0][0]);
  return {
    R_target,
    weights,
    volatility: volatility,
    expectedReturn: expectedReturnTarget.toArray()[0][0],
    ratioSharpe,
    ratioTreynor,
    alphaJensen,
  };
}
function computeVPTRWithRiskFree(
  Sigma,
  muArray,
  rfAnnualPercent,
  R_target = 0.12,
  portfolioBeta,
  riskFreeRate,
  marketReturn,
) {
  // Minimum Variance Portfolio with Target Return + Risk-Free Asset
  const n = Sigma.length;

  const mu = math.matrix(muArray.map((x) => [x]));
  const ones = math.ones(n, 1);
  const invSigma = math.inv(Sigma);

  // Convert annual % risk-free rate to daily decimal
  const rf = rfAnnualPercent / 100 / 252;

  const excessMu = math.subtract(mu, math.multiply(rf, ones));

  const A = math.squeeze(math.multiply(math.transpose(ones), invSigma, mu));

  const B = math.squeeze(math.multiply(math.transpose(mu), invSigma, mu));

  const denominator = rf ** 2 - 2 * rf * A + B;

  const scalar = (R_target - rf) / denominator;

  const weightsTargetNonRisk = math.multiply(
    scalar,
    math.multiply(invSigma, excessMu),
  );

  const weights = weightsTargetNonRisk.toArray().map((row) => row[0]);

  const varTargetNonRisk = math.multiply(
    math.transpose(weightsTargetNonRisk),
    math.multiply(Sigma, weightsTargetNonRisk),
  );

  const expectedReturnTargetNonRisk = math.add(
    rf,
    math.multiply(math.transpose(weightsTargetNonRisk), excessMu),
  );

  const variance = math.squeeze(varTargetNonRisk);
  const volatility = Math.sqrt(variance);
  const expectedReturn = math.squeeze(expectedReturnTargetNonRisk);

  const riskyWeightSum = weights.reduce((sum, w) => sum + w, 0);
  const riskFreeWeight = 1 - riskyWeightSum;
  const { ratioSharpe, ratioTreynor, alphaJensen } = computePerformanceRatios(
    expectedReturn,
    volatility,
    portfolioBeta,
    riskFreeRate,
    marketReturn,
  );
  console.log("err", expectedReturn);
  return {
    R_target,
    rf,
    rfAnnualPercent,
    weights,
    riskFreeWeight,
    volatility,
    expectedReturn,
    ratioSharpe,
    ratioTreynor,
    alphaJensen,
  };
}
function computeMeanVarianceModel1(
  Sigma,
  muArray,
  phi = 20,
  portfolioBeta,
  riskFreeRate,
  marketReturn,
) {
  const n = Sigma.length;
  const mu = math.matrix(muArray.map((x) => [x]));
  const ones = math.ones(n, 1);

  const invSigma = math.inv(Sigma);

  const A = math.squeeze(math.multiply(math.transpose(ones), invSigma, mu));
  const B = math.squeeze(math.multiply(math.transpose(mu), invSigma, mu));
  const C = math.squeeze(math.multiply(math.transpose(ones), invSigma, ones));
  const D = B * C - A * A;

  // ((mu * C + (phi - A) * ones) / C)
  const rightTerm = math.divide(
    math.add(math.multiply(C, mu), math.multiply(phi - A, ones)),
    C,
  );

  // weights = (invSigma / phi) @ rightTerm
  const weightsMatrix = math.multiply(math.divide(invSigma, phi), rightTerm);

  const weights = weightsMatrix.toArray().map((row) => row[0]);

  const varMatrix = math.multiply(
    math.transpose(weightsMatrix),
    math.multiply(Sigma, weightsMatrix),
  );

  const expectedReturnMatrix = math.multiply(math.transpose(weightsMatrix), mu);

  const variance = math.squeeze(varMatrix);
  const volatility = Math.sqrt(variance);
  const expectedReturn = math.squeeze(expectedReturnMatrix);
  const { ratioSharpe, ratioTreynor, alphaJensen } = computePerformanceRatios(
    expectedReturn,
    volatility,
    portfolioBeta,
    riskFreeRate,
    marketReturn,
  );
  return {
    phi,
    A,
    B,
    C,
    D,
    weights,
    expectedReturn,
    variance,
    volatility,
    ratioSharpe,
    ratioTreynor,
    alphaJensen,
  };
}

const getBlackLitterManModelPortfolioAllocation = async (req, res) => {
  try {
    const { shares, P, Q, start = "2019-10-15", end = "2025-11-22" } = req.body;

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
    marketCaps = [];
    for (const ticker of tickers) {
      try {
        const quote = await yahooFinance.quote(ticker);

        marketCaps.push(quote.marketCap);
      } catch (error) {
        console.error(`Error fetching ${ticker}`, error);
      }
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
    const marketData = await yahooFinance.historical("^GSPC", {
      period1: start,
      period2: end,
    });

    const marketPrices = marketData
      .map((d) => d.close)
      .filter((v) => v != null)
      .slice(-minLength);

    const marketReturns = [];
    for (let i = 1; i < marketPrices.length; i++) {
      const prev = marketPrices[i - 1];
      const curr = marketPrices[i];
      marketReturns.push((curr - prev) / prev);
    }
    const meanMarket =
      marketReturns.reduce((a, b) => a + b, 0) / marketReturns.length;

    const priceMatrix = results.map((r) => r.prices.slice(-minLength));
    const latestPrices = priceMatrix.map((p) => p[p.length - 1]);

    const values = latestPrices.map((price, i) => price * quantities[i]);
    const totalQuantities = quantities.reduce((a, b) => a + b, 0);
    const totalValue = values.reduce((a, b) => a + b, 0);

    const weights = quantities.map((v) => v / totalQuantities);
    const portfolioDailyReturns = [];
    const returnsMatrix = [];

    for (let i = 1; i < minLength; i++) {
      const row = [];

      for (let j = 0; j < n; j++) {
        const prev = priceMatrix[j][i - 1];
        const curr = priceMatrix[j][i];

        row.push((curr - prev) / prev);
      }

      returnsMatrix.push(row);
      portfolioDailyReturns.push(
        row.reduce((sum, item, index) => {
          return sum + weights[index] * item;
        }, 0),
      );
    }

    const betas = calculateBetas(returnsMatrix, marketReturns, tickers);
    const portfolioBeta = tickers.reduce((sum, ticker, i) => {
      return sum + weights[i] * betas[ticker];
    }, 0);
    const mu_daily = [];

    for (let j = 0; j < n; j++) {
      const vals = returnsMatrix.map((r) => r[j]);
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
      mu_daily.push(mean);
    }
    const mu = mu_daily.map((m) => m * 252);

    const covarianceMatrix = Array.from({ length: n }, () => Array(n).fill(0));
    const cov_daily = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        let cov = 0;

        for (let k = 0; k < returnsMatrix.length; k++) {
          cov +=
            (returnsMatrix[k][i] - mu_daily[i]) *
            (returnsMatrix[k][j] - mu_daily[j]);
        }

        covarianceMatrix[i][j] = (cov / (returnsMatrix.length - 1)) * 252;
        cov_daily[i][j] = cov / (returnsMatrix.length - 1);
      }
    }
    const data = await yahooFinance.historical("^TNX", {
      period1: "2019-10-15",
      period2: "2025-11-22",
    });

    const rfAnnualPercent = data[data.length - 1].close;
    const mu_bl = calculateExcessReturnWithBlackLitterMan(
      mu,
      covarianceMatrix,
      P,
      Q,
      marketCaps,
    );

    const US_10_year_treasury = 0.04321;
    // Market annual return
    const meanDailyMarketReturn =
      marketReturns.reduce((sum, r) => sum + r, 0) / marketReturns.length;

    const marketReturn = meanDailyMarketReturn * 252;
    const GMVP = computeGMVP(
      covarianceMatrix,
      mu_bl,
      portfolioBeta,
      US_10_year_treasury,
      marketReturn,
    );
    const VPTR = computeVPTR(
      covarianceMatrix,
      mu_bl,
      portfolioBeta,
      US_10_year_treasury,
      marketReturn,
    );
    const VPTR_RF = computeVPTRWithRiskFree(
      covarianceMatrix,
      mu_bl,
      rfAnnualPercent,
      0.12,
      portfolioBeta,
      US_10_year_treasury,
      marketReturn,
    );
    const MVM1 = computeMeanVarianceModel1(
      covarianceMatrix,
      mu_bl,
      20,
      portfolioBeta,
      US_10_year_treasury,
      marketReturn,
    );
    res.json({
      tickers,
      mu_bl,
      GMVP,
      VPTR,
      VPTR_RF,
      MVM1,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error computing portfolio metrics" });
  }
};

function calculateExcessReturnWithBlackLitterMan(
  mu,
  cov,
  p,
  q,
  marketCaps,
  lambda = 2,
) {
  console.log("p", p);
  console.log("q", q);
  const totalPortoflioMarketCap = marketCaps.reduce(
    (sum, weight) => sum + weight,
    0,
  );
  const weight_market = marketCaps.map(
    (item) => item / totalPortoflioMarketCap,
  );
  const Sigma = math.matrix(cov);
  const P = math.matrix(p);
  const Q = math.matrix(q);
  const wMarket = math.matrix(weight_market);
  const omega = math.multiply(
    0.25,
    math.multiply(P, math.multiply(Sigma, math.transpose(P))),
  );
  const pi = math.multiply(lambda, math.multiply(Sigma, wMarket));
  const invSigma = math.inv(Sigma);
  const invOmega = math.inv(omega);
  const term12 = math.multiply(math.transpose(P), math.multiply(invOmega, P));
  const term22 = math.multiply(math.transpose(P), math.multiply(invOmega, Q));
  const firstTerm = math.inv(math.add(invSigma, term12));
  const secondTerm = math.add(math.multiply(invSigma, pi), term22);
  const finalResult = math.multiply(firstTerm, secondTerm);
  return finalResult.toArray();
}
module.exports = {
  createAsset,
  getAssetPrices,
  getUserAssets,
  updateAsset,
  getPortfolioHistory,
  getPortfolioReturns,
  deleteAsset,
  getPortfolioMetrics,
  getBlackLitterManModelPortfolioAllocation,
};
