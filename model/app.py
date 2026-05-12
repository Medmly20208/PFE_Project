import pickle
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models = {
    "extra_trees": pickle.load(open("extra_trees.pkl", "rb")),
    "linear_regression": pickle.load(open("linear_regression.pkl", "rb")),
    "random_forest": pickle.load(open("random_forest.pkl", "rb")),
}

class PredictionInput(BaseModel):
    model_name: str
    High: float
    Close: float
    Open: float
    Low: float
    Adj_Close: float

@app.get("/")
def home():
    return {"message": "ML API is running"}

@app.post("/predict")
def predict(data: PredictionInput):
    if data.model_name not in models:
        return {
            "error": "Invalid model name",
            "available_models": list(models.keys())
        }

    input_data = pd.DataFrame([{
        "High": data.High,
        "Close": data.Close,
        "Open": data.Open,
        "Low": data.Low,
        "Adj Close": data.Adj_Close
    }])

    prediction = models[data.model_name].predict(input_data)

    return {
        "model_used": data.model_name,
        "prediction": float(prediction[0])
    }