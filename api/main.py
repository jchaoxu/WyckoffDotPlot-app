import datetime
from enum import Enum

from humps.camel import case
from fastapi import FastAPI
from pydantic import BaseModel, Field

import utils.history_loader as hl
from utils.wyckoff_dot_drawer import Drawer

app = FastAPI()


def to_camel(string):
    return case(string)


class Trend(Enum):
    Unknown = 0
    increasing = 1
    decreasing = 2


class MovementModel(BaseModel):
    moves: list[float] = []
    trend: Trend = Trend.Unknown

    class Config:
        alias_generator = to_camel
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
