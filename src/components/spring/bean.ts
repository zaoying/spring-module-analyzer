export interface Bean {
    alias?: string,
    scope?: string,
    type?: string,
    resource?: string,
    dependencies?: []
}

function buildOption(legends: string[], data: any[], categories: any[], edges: any[]): echarts.EChartsOption{
    return {
        legend: {
            data: legends
        },
        series: [{
            type: "graph",
            layout: "force",
            animation: true,
            label: {
              show: true,
              position: 'right',
              formatter: '{b}'
            },
            force: { "edgeLength": 10, "repulsion": 80, "gravity": 0.1 },
            roam: true,
            draggable: true,
            data: data,
            categories: categories,
            edges: edges
        }]
    };
}

export function filterBeans(contexts: Object, fields: Bean) {
    const legends: string[] = []
    const categories = new Array<{ name: string, keyword: {} }>();
    const entities = new Map<string, { id: number, val: number }>();
    const edges = new Array<{ source: number, target: number }>();
    Object.entries(contexts).forEach(([svc, ctx]) => {
        legends.push(svc)
        categories.push({ name: svc, keyword: {} })
        const beans: Object = ctx.beans
        Object.entries(beans).forEach(([source, bean]) => {
            if (fields.alias && bean.aliases) {
                const keyword = fields.alias
                const matched = bean.aliases.filter((item: string) => item.startsWith(keyword))
                if (!matched) {
                    return
                }
            }
            if (fields.type && bean.type) {
                const keyword = fields.type
                if (!bean.type.startsWith(keyword)) {
                    return
                }
            }
            if (fields.resource && bean.resource) {
                const keyword = fields.resource
                if (!bean.resource.startsWith(keyword)) {
                    return
                }
            }
            entities.set(source, { id: entities.get(source)?.id ?? entities.size, val: 1 + (entities.get(source)?.val || 0), })
            bean.dependencies.forEach((target: string) => {
                entities.set(target, { id: entities.get(target)?.id ?? entities.size, val: 1 + (entities.get(target)?.val || 0) })
                edges.push({ source: entities.get(source)?.id ?? -1, target: entities.get(target)?.id ?? -1 })
            })
        })
    })
    const data = new Array<{ id: string, name: string, value: number, category: number }>();
    for (const key of entities.keys()) {
        const { id, val } = entities.get(key) || { id: 0, val: 1 }
        data.push({ id: `${id}`, name: key, value: val, category: categories.length - 1 })
    }
    return buildOption(legends, data, categories, edges)
}

export default function readFile(event: any, callback: (result: string) => void) {
    const [file] = event.target.files;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
        if (reader.result == null || reader.result instanceof ArrayBuffer) {
            console.info(reader.result)
        } else {
            callback.call({}, reader.result)
        }

    });
    reader.readAsText(file);
}