export interface Trace {
    from: string,
    to: string,
    duration: number
}

export interface Filter {
    from?: string
    to?: string
}

export function filterRecord(records: Trace[], fields: Filter) {
    const legends: string[] = ["trace"]
    const categories = new Array<{ name: string, keyword: {} }>();
    categories.push({name: "trace", keyword: ""})

    const entities = new Map<string, { id: number, val: number }>();
    const edges = new Array<{ source: number, target: number }>();

    records.forEach(record => {
        if (fields.from && !record.from.startsWith(fields.from)) {
            return
        }
        if (fields.to && !record.to.startsWith(fields.to)) {
            return
        }
        let from = entities.get(record.from) ?? {id: entities.size, val: 0}
        from.val = from.val + 1
        entities.set(record.from, from)
        
        let to = entities.get(record.to) ?? {id: entities.size, val: 0}
        to.val = to.val + 1
        entities.set(record.to, to)

        edges.push({source: from.id, target: to.id})
    })
    const data = new Array<{ id: string, name: string, value: number, category: number }>();
    for (const key of entities.keys()) {
        const { id, val } = entities.get(key) || { id: 0, val: 1 }
        data.push({ id: `${id}`, name: key, value: val, category: categories.length - 1 })
    }
    
    const option = buildOption(legends, data, categories, edges)
    console.info(option)
    return option
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
                position: "right",
                formatter: "{b}"
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