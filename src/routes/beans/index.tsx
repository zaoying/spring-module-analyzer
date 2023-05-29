import { $, component$, useContext, useStore, useStyles$ } from "@builder.io/qwik";
import type { Bean } from "~/components/spring/bean";
import Chart from "~/components/charts/common";
import styles from './index.css?inline';
import { filterBeans } from "~/components/spring/bean";
import { FileContent } from "~/root";

export default component$(() => {
    useStyles$(styles)
    const beans = useStore<{ value: {} }>({ value: {} })
    const fields = useStore<Bean>({})
    const option = useStore<{ value: any }>({ value: {} })

    const fileContent = useContext(FileContent)
    if (fileContent.value) {
        const obj: {contexts: any} = JSON.parse(fileContent.value);
        if (obj.contexts) {
            beans.value = obj.contexts
            option.value = filterBeans(obj.contexts, fields)
        }
    }
    return <div>
        <h2 class="title">依赖分析</h2>
        <div class="form">
            <div class="three row">
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
            <div>
                {fileContent.value}
            </div>
        </div>
        <Chart option={option.value}></Chart>
    </div>
})