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
  isLoading: boolean;
}

export const DotPlot: React.FC<DotPlotProps> = ({ data, isLoading }) => {
  const chart = useRef(null);
  const size = useComponentSize(chart);
  const [chartInstance, setChartInstance] = useState<any>();

  const dataSeries = useMemo(() => {
    const dataSet = data.flatMap((v, i) => ({
      trend: v.trend,
      data: v.moves.map((m) => [i, m]),
    }));
    const increasingDataset = dataSet.filter(x => x.trend === Trend.Increasing).flatMap(x => x.data);
    const decreasingDataset = dataSet.filter(x => x.trend === Trend.Decreasing).flatMap(x => x.data);

    const concatSeries = [
      {
        name: getSeriesName(Trend.Increasing),
        type: "scatter",
        data: increasingDataset,
        itemStyle: {
          color: getSeriesColor(Trend.Increasing),
        },
        coordinateSystem: "cartesian2d",
      },
      {
        name: getSeriesName(Trend.Decreasing),
        type: "scatter",
        data: decreasingDataset,
        itemStyle: {
          color: getSeriesColor(Trend.Decreasing),
        },
        coordinateSystem: "cartesian2d",
      }
    ];
    return concatSeries;
  }, [data]);

  const options: any = useMemo(() => {
    // const series = data.flatMap((v, i) => ({
    //   name: getSeriesName(v.trend),
    //   type: "scatter",
    //   data: v.moves.map((m) => [i, m]),
    //   itemStyle: {
    //     color: getSeriesColor(v.trend),
    //   },
    //   coordinateSystem: "cartesian2d",
    // }));

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
      series: dataSeries,
      dataZoom: [
        {
          type: "inside",
        },
        {
          type: "slider",
        },
      ],
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          brush: {
            type: ["rect", "clear"],
          },
          restore: {},
          saveAsImage: {}
        },
        left: "middle",
      },
      brush: {
        toolBox: ["rect"],
        brushType: "rect",
      },
      graphic: {
        elements: [
          {
            type: "line",
          },
        ],
      },
      tooltip: {
        show: true,
      },
    };
  }, [dataSeries]);

  const renderChart = useCallback(() => {
    const renderInstance = echarts.getInstanceByDom(chart.current!);

    if (renderInstance) {
      setChartInstance(renderInstance);
    } else {
      setChartInstance(echarts.init(chart.current!));
    }
  }, []);

  const buildSelectedDataSummary = useCallback((selectedSeries: any[]) => {
    const buildDataBySeriesAndIndex = (seriesIndex: any, dataIndices: any[]) => {
      return dataIndices.map(x => dataSeries[seriesIndex].data[x]);
    }

    const dataset = selectedSeries
      .flatMap(x => buildDataBySeriesAndIndex(x.seriesIndex, x.dataIndex))
      .filter(x => !!x && x.length === 2);

    const dataGroupByPrice: any[] = [];
    for (let i = 0; i < dataset.length; i++) {
      const price = dataset[i][1];
      const index = dataset[i][0];
      let keyIndex = dataGroupByPrice.findIndex(x => x[0] === dataset[i][1]);

      if (keyIndex !== -1) {
        dataGroupByPrice[keyIndex][1].push(index);
      } else {
        dataGroupByPrice.push([price, [index]]);
      }
    }

    for (let i = 0; i < dataGroupByPrice.length; i++) {
      dataGroupByPrice[i][1] = dataGroupByPrice[i][1].sort();
    }

    const messages = dataGroupByPrice.map(x => {
      return `价格 ${x[0]}: 总点数 ${x[1].length}个, 总区间 ${x[1][x[1].length - 1] - x[1][0] + 1}周期。`
    });

    return messages.join('\n');
  }, [dataSeries]);

  const brushedEventHook = useCallback(() => {
    if (!chartInstance) return;
    chartInstance.on('brushSelected', function (params: any) {
      const text = buildSelectedDataSummary(params.batch[0].selected);
      chartInstance.setOption({
        title: {
          show: !!text,
          backgroundColor: '#333',
          text: text || "",
          bottom: 0,
          right: '10%',
          width: 100,
          textStyle: {
            fontSize: 12,
            color: '#fff'
          }
        },
      });
    });
  }, [buildSelectedDataSummary, chartInstance]);

  useEffect(() => {
    renderChart();
  });

  useEffect(() => {
    brushedEventHook();
  }, [brushedEventHook]);

  useEffect(() => {
    if (!chartInstance) return;
    chartInstance.setOption(options, {
      notMerge: true,
    });
  }, [chartInstance, options]);

  useEffect(() => {
    if (chartInstance != null) {
      chartInstance.resize({
        height: size.height,
      });
    }
  }, [chartInstance, size]);

  useEffect(() => {
    if (!chartInstance) return;

    if (isLoading) {
      chartInstance.showLoading();
    } else {
      chartInstance.hideLoading();
    }
  }, [chartInstance, isLoading])

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
    </div>
  );
};
