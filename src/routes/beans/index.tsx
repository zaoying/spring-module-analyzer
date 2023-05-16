import { $, component$, useStore, useStyles$ } from "@builder.io/qwik";
import type { Bean } from "../../components/spring/bean";
import Chart from "../../components/charts/common";
import styles from './index.css?inline';
import parseFile, { filterBeans } from "~/components/spring/bean";

export default component$(() => {
    useStyles$(styles)
    const beans = useStore<{ value: {} }>({ value: {} })
    const fields = useStore<Bean>({})
    const option = useStore<{ value: any }>({ value: {} })
    return <div>
        <h2 class="title">依赖分析</h2>
        <div class="form">
            <div class="three row">
                <div class="field">
                    <label for="file">JSON文件</label>
                    <input type="file" id="file" placeholder="选择JSON文件" accept="application/json"
                        onChange$={$((event: any) => {parseFile(event, beans, option, fields)})} />
                </div>
                <div class="field">
                    <label for="alias">别名</label>
                    <input type="text" id="alias" name="alias" onInput$={$((e: any) => fields.alias = e.target.value)}/>
                </div>
                <div class="field">
                    <label for="type">类名</label>
                    <input type="text" id="type" name="type"  onInput$={$((e: any) => fields.type = e.target.value)}/>
                </div>
                <div class="field">
                    <label for="resource">源文件</label>
                    <input type="text" id="resource" name="resource"  onInput$={$((e: any) => fields.resource = e.target.value)}/>
                </div>
                <div class="field">
                    <input type="button" value="过滤" onClick$={$(() => {option.value = filterBeans(beans.value, fields)})}/>
                </div>
            </div>
        </div>
        <Chart option={option.value}></Chart>
    </div>
})