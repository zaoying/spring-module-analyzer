import * as echarts from 'echarts';
import { component$, useVisibleTask$, useSignal } from "@builder.io/qwik";

export default component$<{ option: echarts.EChartsOption }>((props) => {
    const outputRef = useSignal<HTMLElement>();
    const status = useSignal<boolean>(false);
    if (status.value && outputRef.value) {
        echarts.dispose(outputRef.value)
        // 基于准备好的dom，初始化echarts实例
        const myChart = echarts.init(outputRef.value);
        if (props.option.series) {
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(props.option);
        }
    }
    useVisibleTask$(() => {
        if (outputRef.value) {
            status.value = true
        }
    })
    return <div ref={outputRef} style={{ height: "640px" }}></div>;
});
