import { component$, useContext, useStore, $, useStyles$, useVisibleTask$ } from "@builder.io/qwik";
import Chart from "~/components/charts/common";
import { FileContent } from "~/root";
import { Filter, Trace, filterRecord } from "./trace";
import styles from './index.css?inline';

export default component$(() => {
    useStyles$(styles)
    const fields = useStore<Filter>({})
    const option = useStore<{ value: any }>({ value: {} })
    const records = useStore<{value: Trace[]}>({value: []})
    const fileContent = useContext(FileContent)
    useVisibleTask$(()=>{
        if (fileContent.value) {
            const lines = fileContent.value.split('\n')
            records.value = lines.map((line: string) => {
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
                    <input type="button" value="过滤" onClick$={$(() => {option.value = filterRecord(records.value, fields)})}/>
                </div>
            </div>
        </div>
        <Chart option={option.value}></Chart>
    </div>
})