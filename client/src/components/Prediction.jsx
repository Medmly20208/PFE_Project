import { useState } from "react";

const modelMetrics = [
  {
    model: "Extra Trees",
    apiName: "extra_trees",
    mae: 1.55088,
    rmse: 2.181408,
    r2: 0.999808,
  },
  {
    model: "Linear Regression",
    apiName: "linear_regression",
    mae: 1.82134,
    rmse: 2.553301,
    r2: 0.999737,
  },
  {
    model: "Random Forest",
    apiName: "random_forest",
    mae: 1.818379,
    rmse: 2.63334,
    r2: 0.99972,
  },
];

export default function PredictionComponent() {
  const [formData, setFormData] = useState({
    model_name: "extra_trees",
    High: "",
    Close: "",
    Open: "",
    Low: "",
    Adj_Close: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPrediction(null);

    const payload = {
      model_name: formData.model_name,
      High: Number(formData.High),
      Close: Number(formData.Close),
      Open: Number(formData.Open),
      Low: Number(formData.Low),
      Adj_Close: Number(formData.Adj_Close),
    };

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Prediction failed");
      }

      setPrediction(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedModel = modelMetrics.find(
    (item) => item.apiName === formData.model_name,
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">
          Stock Price Prediction
        </h1>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Enter Features
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Model
                </label>
                <select
                  name="model_name"
                  value={formData.model_name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 p-3"
                >
                  {modelMetrics.map((item) => (
                    <option key={item.apiName} value={item.apiName}>
                      {item.model}
                    </option>
                  ))}
                </select>
              </div>

              {["High", "Close", "Open", "Low", "Adj_Close"].map((field) => (
                <div key={field}>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {field.replace("_", " ")}
                  </label>
                  <input
                    type="number"
                    step="any"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 p-3"
                    placeholder={`Enter ${field.replace("_", " ")}`}
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gray-900 p-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
              >
                {loading ? "Predicting..." : "Predict"}
              </button>
            </form>

            {error && (
              <div className="mt-4 rounded-lg bg-red-100 p-3 text-red-700">
                {error}
              </div>
            )}

            {prediction && (
              <div className="mt-6 rounded-xl bg-gray-100 p-4">
                <p className="text-sm text-gray-600">Model used</p>
                <p className="mb-3 text-lg font-semibold text-gray-900">
                  {selectedModel?.model}
                </p>

                <p className="text-sm text-gray-600">Prediction</p>
                <p className="text-2xl font-bold text-gray-900">
                  {prediction.prediction.toFixed(4)}
                </p>
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Model Performance
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b bg-gray-100">
                    <th className="p-3">Model</th>
                    <th className="p-3">MAE</th>
                    <th className="p-3">RMSE</th>
                    <th className="p-3">R²</th>
                  </tr>
                </thead>
                <tbody>
                  {modelMetrics.map((item) => (
                    <tr
                      key={item.model}
                      className={
                        formData.model_name === item.apiName
                          ? "border-b bg-gray-100 font-semibold"
                          : "border-b"
                      }
                    >
                      <td className="p-3">{item.model}</td>
                      <td className="p-3">{item.mae.toFixed(6)}</td>
                      <td className="p-3">{item.rmse.toFixed(6)}</td>
                      <td className="p-3">{item.r2.toFixed(6)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 rounded-xl bg-gray-100 p-4">
              <h3 className="mb-2 font-semibold text-gray-800">Best Model</h3>
              <p className="text-gray-700">
                Extra Trees gives the best performance because it has the lowest
                MAE and RMSE and the highest R² score.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
