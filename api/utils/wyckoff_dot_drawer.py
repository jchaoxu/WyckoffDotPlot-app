import math
from enum import Enum


class Trend(Enum):
    Unknown = 0
    increasing = 1
    decreasing = 2


class Movement:
    def __init__(self, moves: list[float], trend: Trend):
        self._moves = moves
        self._trend = trend

    def get_moves(self):
        return self._moves

    def get_size(self):
        return len(self._moves)

    def get_trend(self):
        return self._trend;

    def is_increasing(self):
        return self._trend == Trend.increasing

    def is_decreasing(self):
        return self._trend == Trend.decreasing

    def compress(self, moves: list[float]):
        self._moves.extend(moves)
        self._moves = list(set(self._moves))
        self._moves.sort()

    def get_length(self):
        return len(self._moves)


def get_single_day_movement(open_p: float, close_p: float, high_p: float, low_p: float, precision: float):
    coefficient = 100
    scaled_precision = int(precision * coefficient)
    rst = []
    for i in range(int(open_p * coefficient), int(high_p * coefficient + scaled_precision), scaled_precision):
        rst.append(float(float(i) / float(coefficient)))

    for i in range(int(high_p * coefficient) - scaled_precision, int(low_p * coefficient - scaled_precision), -scaled_precision):
        rst.append(float(float(i) / float(coefficient)))

    for i in range(int(low_p * coefficient) + scaled_precision, int(close_p * coefficient + scaled_precision), scaled_precision):
        rst.append(float(float(i) / float(coefficient)))

    return rst


def concat_single_day_movement(movements: list[list[float]], precision) -> list[float]:
    result = []

    tmp = []
    for i in range(0, len(movements)):
        if i == 0:
            tmp.extend(movements[i])
        else:
            transition = concat_day_end_start(movements[i - 1][len(movements[i - 1]) - 1], movements[i][0], precision)
            tmp.extend(transition)
            tmp.extend(movements[i])

    for i in range(len(tmp)):
        if i > 0:
            if tmp[i] == tmp[i - 1]:
                continue
        result.append(tmp[i])

    return result


def concat_day_end_start(end, start, precision) -> list[float]:
    rst = []
    coefficient = 100

    step = int(precision * coefficient)
    if end == start:
        return rst

    if end > start:
        step = -step

    for i in range(int(end * coefficient + step), int(start * coefficient), step):
        rst.append(float(float(i) / float(coefficient)))

    return rst


def separate_trend(movements: list[float]) -> list[Movement]:
    tmp = []
    result = []
    current_trend: Trend = Trend.Unknown
    for i in range(0, len(movements)):
        if i == 1:
            if movements[i] > movements[i - 1]:
                current_trend = Trend.increasing
            else:
                current_trend = Trend.decreasing
        elif i > 1:
            if is_inverted_trend(movements[i - 1], movements[i], current_trend):
                result.append(Movement(tmp, current_trend))
                tmp = []
                if current_trend == Trend.increasing:
                    current_trend = Trend.decreasing
                else:
                    current_trend = Trend.increasing
        tmp.append(movements[i])

    if len(tmp) > 0:
        result.append(Movement(tmp, current_trend))

    return result


def is_inverted_trend(prev: float, curr: float, trend: Trend) -> bool:
    if curr > prev and trend == Trend.decreasing:
        return True

    if curr < prev and trend == Trend.increasing:
        return True

    return False


def get_result(movements: list[Movement]):
    result: list = []
    for i in range(len(movements)):
        result.append({"moves": movements[i].get_moves(), "trend": movements[i].get_trend()})

    return result


class Drawer:
    def __init__(self, open_p, close_p, high_p, low_p, precision, compression_threshold):
        self._open_p = open_p
        self._close_p = close_p
        self._high_p = high_p
        self._low_p = low_p
        self._size = len(self._open_p)
        self._precision = precision
        self._compression_threshold = compression_threshold

    def get_dot_data(self) -> list[Movement]:
        movements = []
        for i in range(0, self._size):
            movements.append(
                get_single_day_movement(
                    self._open_p.get(i),
                    self._close_p.get(i),
                    self._high_p.get(i),
                    self._low_p.get(i),
                    self._precision
                )
            )

        # Concat days data
        concat_movement = concat_single_day_movement(movements, self._precision)

        # Separate data by trend (increasing / decreasing)
        trend_separated_movement = separate_trend(concat_movement)

        # Compress
        compressed_moment = self._compress(trend_separated_movement)

        return get_result(compressed_moment)
        # return compressed_moment

    def _compress(self, movements: list[Movement]):
        threshold = self._compression_threshold

        # Avoid single dot condition
        if self._compression_threshold == 1:
            threshold = 2

        result: list[Movement] = []

        i = 0
        while i < len(movements):
            if i == 0:
                result.append(movements[i])
                i = i + 1
            elif movements[i].get_length() >= threshold:
                result.append(movements[i])
                i = i + 1
            else:
                if i < len(movements) - 1:
                    result[-1].compress(movements[i + 1].get_moves())
                i = i + 2

        return result
