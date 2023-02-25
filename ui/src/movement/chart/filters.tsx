import React, { useCallback, useMemo, useState } from "react";
import { Button, Col, InputGroup, Row } from "react-bootstrap";
import { DatePicker, InputControl, SelectControl } from "../../controls";
import { SearchMovementRequest } from "../../models";
import format from "date-fns/format";

interface FiltersProps {
  onSearch: (request: SearchMovementRequest) => void;
}

export const Filters: React.FC<FiltersProps> = ({ onSearch }) => {
  const [stockPartyCode, setStockPartyCode] = useState("sh.");
  const [stockCode, setStockCode] = useState("");
  const [startDate, setStartDate] = useState(
    format(
      new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      "yyyy-MM-dd"
    )
  );
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [stepPrecision, setStepPrecision] = useState(0);
  const [minStep, setMinStep] = useState(1);
  const [frequency, setFrequency] = useState("d");

  const HandleSubmit = useCallback(() => {
    const request: SearchMovementRequest = {
      startDate: startDate,
      endDate: endDate,
      stockCode: stockPartyCode + stockCode,
      frequency: frequency,
      stepPrecision: stepPrecision,
      minStep: minStep,
    };
    onSearch(request);
  }, [
    endDate,
    frequency,
    minStep,
    onSearch,
    startDate,
    stepPrecision,
    stockCode,
    stockPartyCode,
  ]);

  const canSearch = useMemo(() => {
    return !!stockCode && !!startDate && !!endDate;
  }, [endDate, startDate, stockCode]);

  return (
    <div className="filter-container">
      <Row className="section-row">
        <Col md={6}>
          <InputGroup>
            <SelectControl
              value={stockPartyCode}
              onChangeCallback={setStockPartyCode}
            >
              <option value="sh.">沪市</option>
              <option value="sz.">深市</option>
            </SelectControl>
            <InputControl
              value={stockCode}
              onChangeCallback={setStockCode}
              placeholder="代码"
            />
          </InputGroup>
        </Col>
        <Col md={6}>
          <Row>
            <Col md={6}>
              <DatePicker
                selected={startDate}
                onChangeCallback={setStartDate}
                placeholder="起始日"
              ></DatePicker>
            </Col>
            <Col md={6}>
              <DatePicker
                selected={endDate}
                onChangeCallback={setEndDate}
                placeholder="目标日"
              ></DatePicker>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="section-row">
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>格值</InputGroup.Text>
            <InputControl
              value={stepPrecision}
              onChangeCallback={setStepPrecision}
              placeholder="格值"
              type={"number"}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>点数</InputGroup.Text>
            <SelectControl value={minStep} onChangeCallback={setMinStep}>
              <option value="1">1</option>
              <option value="3">3</option>
              <option value="5">5</option>
            </SelectControl>
          </InputGroup>
        </Col>
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>周期</InputGroup.Text>
            <SelectControl value={frequency} onChangeCallback={setFrequency}>
              <option value="d">日线</option>
              <option value="5">5分钟</option>
              <option value="15">15分钟</option>
              <option value="30">30分钟</option>
              <option value="60">60分钟</option>
            </SelectControl>
          </InputGroup>
        </Col>
      </Row>
      <Button
        variant="primary"
        type="button"
        style={{ float: "right", marginRight: "20px" }}
        onClick={HandleSubmit}
        disabled={!canSearch}
      >
        Submit
      </Button>
    </div>
  );
};
