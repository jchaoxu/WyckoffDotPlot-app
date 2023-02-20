import datetime
from enum import Enum

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import utils.history_loader as hl
from utils.wyckoff_dot_drawer import Drawer

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Trend(Enum):
    Unknown = 0
    increasing = 1
    decreasing = 2


class MovementModel(BaseModel):
    moves: list[float] = []
    trend: Trend = Trend.Unknown

    class Config:
        allow_population_by_field_name = True


class MovementsResponse(BaseModel):
    data: list[MovementModel]


class MovementRequest(BaseModel):
    startDate: datetime.date
    endDate: datetime.date
    stockCode: str
    frequency: str
    decimalPlaces: int
    minStep: int


@app.post("/movement/search")
async def search_movement(request: MovementRequest):
    data = hl.load_day_history(request.stockCode, str(request.startDate), str(request.endDate), request.decimalPlaces,
                               request.frequency)
    drawer = Drawer(
        data.get("open"),
        data.get("close"),
        data.get("high"),
        data.get("low"),
        request.decimalPlaces,
        request.minStep
    )
    rst = drawer.get_dot_data()
    return {"data": rst}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
