import jstat from "jstat";

const { jStat } = jstat;

const formatPct = (x) => (x * 100).toFixed(4) + "%";
const alpha = 0.99;
export function CalculateVarAndEsMonteCarlo(portfolioDailyreturns, sigma, mu) {
  const simulations = 10000;
  const days = 1;
  const scenarioReturns = [];

  for (let i = 0; i < simulations; i++) {
    let totalReturn = 0;

    for (let d = 0; d < days; d++) {
      totalReturn += jStat.normal.sample(mu, sigma);
    }

    scenarioReturns.push(totalReturn);
  }

  // sort ascending
  scenarioReturns.sort((a, b) => a - b);

  // VaR index
  const varIndex = Math.floor((1 - alpha) * simulations);

  const VaR_MC = -scenarioReturns[varIndex];

  // ES (average of worst tail)
  const tail = scenarioReturns.slice(0, varIndex + 1);
  const ES_MC = -tail.reduce((sum, r) => sum + r, 0) / tail.length;

  return {
    Var: formatPct(VaR_MC),
    Es: formatPct(ES_MC),
  };
}

export function CalculateVarAndEsHistorical(portfolioDailyreturns) {
  const sorted = [...portfolioDailyreturns].sort((a, b) => a - b);
  const p = 1 - alpha;
  const index = Math.floor(p * sorted.length);
  const varThreshold = sorted[index];
  const VaR_return = -varThreshold;
  const tailLosses = sorted.slice(0, index + 1);
  const meanTail =
    tailLosses.reduce((sum, val) => sum + val, 0) / tailLosses.length;
  const ES_return = -meanTail;

  return {
    VaR: formatPct(VaR_return),
    Es: formatPct(ES_return),
  };
}

export function CalculateVarAndEsAnalytic(portfolioDailyreturns, sigma, mu) {
  const z_alpha = jStat.normal.inv(alpha, 0, 1);

  const VaR_analytic = z_alpha * sigma - mu;
  console.log(z_alpha, sigma, mu, VaR_analytic);
  // ES
  const ES_analytic =
    (jStat.normal.pdf(z_alpha, 0, 1) / (1 - alpha)) * sigma - mu;

  const formatPct = (x) => (x * 100).toFixed(4) + "%";

  return { VaR: formatPct(VaR_analytic), Es: formatPct(ES_analytic) };
}
export function CalculateVarAndEs(portfolioDailyreturns, sigma, mu) {
  // Clone & sort ascending

  return {
    historical: CalculateVarAndEsHistorical(portfolioDailyreturns),
    analytical: CalculateVarAndEsAnalytic(portfolioDailyreturns, sigma, mu),
    "Monte Carlo": CalculateVarAndEsMonteCarlo(
      portfolioDailyreturns,
      sigma,
      mu,
    ),
  };
}

export function calculateBetas(returnsMatrix, marketReturns, tickers) {
  const betas = {};

  const meanMarket =
    marketReturns.reduce((a, b) => a + b, 0) / marketReturns.length;
  console.log("market returns", meanMarket);
  for (let j = 0; j < tickers.length; j++) {
    const assetReturns = returnsMatrix.map((r) => r[j]);

    const meanAsset =
      assetReturns.reduce((a, b) => a + b, 0) / assetReturns.length;

    let cov = 0;
    let varMarket = 0;

    for (let i = 0; i < marketReturns.length; i++) {
      cov += (assetReturns[i] - meanAsset) * (marketReturns[i] - meanMarket);

      varMarket += Math.pow(marketReturns[i] - meanMarket, 2);
    }

    cov = cov / (marketReturns.length - 1);
    varMarket = varMarket / (marketReturns.length - 1);

    betas[tickers[j]] = cov / varMarket;
  }

  return betas;
}
