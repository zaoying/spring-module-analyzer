import { component$, useStore } from "@builder.io/qwik";
import Chart from "../../components/charts/common";

export default component$(() => {
    const option = useStore<{ value: any }>({ value: {} })
    return <div>
        <h2 class="title">聚类分析</h2>
        <div class="form">
            <div class="three row">
                <div class="field">
                    <label for="file">CSV文件</label>
                    <input type="file" id="file" placeholder="选择CSV文件" accept="application/csv"/>
                </div>
                <div class="field">
                    <label for="alias">别名</label>
                    <input type="text" id="alias" name="alias"/>
                </div>
                <div class="field">
                    <label for="type">类名</label>
                    <input type="text" id="type" name="type"/>
                </div>
                <div class="field">
                    <label for="resource">源文件</label>
                    <input type="text" id="resource" name="resource"/>
                </div>
                <div class="field">
                    <input type="button" value="过滤"/>
                </div>
            </div>
        </div>
        <Chart option={option.value}></Chart>
    </div>
})