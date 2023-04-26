import * as echarts from "echarts/core";
import type { BarSeriesOption, LineSeriesOption, GraphSeriesOption } from "echarts/charts";
import { BarChart, LineChart, GraphChart } from "echarts/charts";
import { LegendComponent } from 'echarts/components';
import type {
    TitleComponentOption,
    TooltipComponentOption,
    GridComponentOption,
    DatasetComponentOption
} from "echarts/components";
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
} from "echarts/components";
import { LabelLayout, UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { component$, useBrowserVisibleTask$, useSignal } from "@builder.io/qwik";

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
export type ECOption = echarts.ComposeOption<
    | BarSeriesOption
    | LineSeriesOption
    | GraphSeriesOption
    | TitleComponentOption
    | TooltipComponentOption
    | GridComponentOption
    | DatasetComponentOption
>;

function init() {
    // 注册必须的组件
    echarts.use([
        TitleComponent,
        TooltipComponent,
        GridComponent,
        DatasetComponent,
        TransformComponent,
        LegendComponent,
        BarChart,
        LineChart,
        GraphChart,
        LabelLayout,
        UniversalTransition,
        CanvasRenderer
    ]);
}

export default component$<{ option: ECOption }>((props) => {
    const outputRef = useSignal<HTMLElement>();
    const status = useSignal<boolean>(false);
    if (status.value && outputRef.value) {
        echarts.dispose(outputRef.value)
        init()
        // 基于准备好的dom，初始化echarts实例
        const myChart = echarts.init(outputRef.value);
        if (props.option.series) {
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(props.option);
        }
    }
    useBrowserVisibleTask$(() => {
        if (outputRef.value) {
            status.value = true
        }
    })
    return <div ref={outputRef} style={{ height: "450px" }}></div>;
});
