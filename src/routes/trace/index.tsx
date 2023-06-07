import { component$, useContext, useStore, $, useStyles$, useVisibleTask$ } from "@builder.io/qwik";
import Chart from "~/components/charts/common";
import { FileContent } from "~/root";
import { Filter, Trace, filterRecord } from "./trace";
import styles from './index.css?inline';

export default component$(() => {
    useStyles$(styles)
    const fields = useStore<Filter>({method: "count", range: {min: 0, max: 1000}})
    const option = useStore<{ value: any }>({ value: {} })
    const records = useStore<{value: Trace[]}>({value: []})
    const fileContent = useContext(FileContent)
    useVisibleTask$(()=>{
        if (fileContent.value) {
            const lines = fileContent.value.split('\n')
            records.value = lines.filter(line=>line != "").map((line: string) => {
                const segments = line.split(',')
                return segments.length == 3 ? {
                    from: segments[0],
                    to: segments[1],
                    duration: Number.parseInt(segments[2])
                } : {from: "", to: "", duration: 0}
            })
            option.value = filterRecord(records.value, fields)
        }
    })

    return <div>
        <h2 class="title">聚类分析</h2>
        <div class="form">
            <div class="three row">
                <div class="field">
                    <label for="from">起点</label>
                    <input type="text" id="from" name="from" onInput$={$((e: any) => fields.from = e.target.value)}/>
                </div>
                <div class="field">
                    <label for="to">终点</label>
                    <input type="text" id="to" name="to" onInput$={$((e: any) => fields.to = e.target.value)}/>
                </div>
                <div class="field">
                    <label for="method">求值</label>
                    <select name="method" id="method" onChange$={$((e: any) => fields.method = e.target.value)}>
                        <option value="count">计数</option>
                        <option value="average">平均值</option>
                        <option value="min">最小值</option>
                        <option value="max">最大值</option>
                        <option value="sum">求和</option>
                    </select>
                </div>
                <div class="field">
                    <label for="range">范围</label>
                    <input type="number" name="min" min="0" value={fields.range.min} onInput$={$((e: any) => fields.range.min = e.target.value)}/>
                    <input type="number" name="max" min="0" value={fields.range.max} onInput$={$((e: any) => fields.range.max = e.target.value)}/>
                </div>
                <div class="field">
                    <input type="button" value="过滤" onClick$={$(() => {option.value = filterRecord(records.value, fields)})}/>
                </div>
            </div>
        </div>
        <Chart option={option.value}></Chart>
    </div>
})