import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Movement, Trend } from "../../models";
import useComponentSize from "@rehooks/component-size";
import * as echarts from "echarts";

const getSeriesName = (trend: Trend) => {
  if (trend === Trend.Increasing) return "Increasing";
  return "Decreasing";
};

const getSeriesColor = (trend: Trend) => {
  if (trend === Trend.Increasing) return "#ff4d4d";
  return "#009933";
};

export interface DotPlotProps {
  data: Movement[];
}

export const DotPlot: React.FC<DotPlotProps> = ({ data }) => {
  const chart = useRef(null);
  const size = useComponentSize(chart);
  const [chartInstance, setChartInstance] = useState<any>();

  const options: any = useMemo(() => {
    const series = data.flatMap((v, i) => ({
      name: getSeriesName(v.trend),
      type: "scatter",
      data: v.moves.map((m) => [i, m]),
      itemStyle: {
        color: getSeriesColor(v.trend),
      },
      coordinateSystem: "cartesian2d",
    }));

    return {
      xAxis: {},
      yAxis: {
        type: "value",
        name: "Price",
        scale: true,
        maxInterval: 1,
        minInterval: 0.01,
        splitNumber: 10,
      },
      series: series,
    };
  }, [data]);

  useEffect(() => {
    console.log(options);
  }, [options]);

  const renderChart = useCallback(() => {
    const renderInstance = echarts.getInstanceByDom(chart.current!);

    if (renderInstance) {
      setChartInstance(renderInstance);
    } else {
      setChartInstance(echarts.init(chart.current!));
    }
  }, []);

  useEffect(() => {
    chartInstance && chartInstance.setOption(options);
  }, [chartInstance, options]);

  useEffect(() => {
    renderChart();
    if (chartInstance != null) {
      chartInstance.resize({
        height: size.height,
      });
      console.log("Doing work", size.height);
    }
  }, [chartInstance, renderChart, size]);

  return (
    <div
      className="plot-container"
      ref={chart}
      style={{
        width: "100%",
        height: "100%",
        background: "white",
      }}
    >
      {/* <ReactEcharts
        option={options}
        opts={{renderer: 'svg', height: size?.height || "auto"}}
      ></ReactEcharts> */}
    </div>
  );
};
