export interface Trace {
    from: string,
    to: string,
    duration: number
}

export interface Filter {
    from?: string
    to?: string
    method: "count" | "average" | "max" | "min" | "sum"
    range: {min: number, max: number}
}

export function filterRecord(records: Trace[], fields: Filter) {
    const legends: string[] = ["trace"]
    const categories = new Array<{ name: string, keyword: {} }>();
    categories.push({name: "trace", keyword: ""})

    const entities = new Map<string, { id: number, val: number }>();
    const durations = new Map<{from: number, to: number}, number[]>();
    let edges = new Array<{ source: number, target: number }>();

    records.forEach(record => {
        if (fields.from && !record.from.startsWith(fields.from)) {
            return
        }
        if (fields.to && !record.to.startsWith(fields.to)) {
            return
        }

        let from = entities.get(record.from) ?? {id: entities.size, val: 1}
        entities.set(record.from, from)
        
        let to = entities.get(record.to) ?? {id: entities.size, val: 1}
        entities.set(record.to, to)

        edges.push({source: from.id, target: to.id})

        const key = {from: from.id, to: to.id}
        const duration = durations.get(key) ?? [];
        durations.set(key, [...duration, record.duration])
    })
    const data = new Array<{ id: string, name: string, value: number, symbolSize: number, category: number }>();
    for (const key of entities.keys()) {
        const { id, val } = entities.get(key) || { id: 0, val: 1 }
        data.push({ id: `${id}`, name: key, value: val, symbolSize: val * 10, category: categories.length - 1 })
    }

    edges = edges.filter(({source, target}) => {
        const duration = durations.get({from: source, to: target}) ?? []
        let result
        switch (fields.method) {
            case 'count':
                result = duration.length
                break
            case 'sum': 
                result = duration.reduce((pre, next) => pre + next)
                break
            case 'average':
                result = duration.reduce((pre, next) => pre + next) / duration.length
                break
            case 'max':
                result = duration.reduce((pre, next) => pre > next ? pre : next)
                break
            case 'min':
                result = duration.reduce((pre, next) => pre < next ? pre : next)
                break
            default:
                return true
        }
        return fields.range.min <= result && result <= fields.range.max
    })
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
              show: true,
              position: 'right',
              formatter: '{b}'
            },
            scaleLimit: {
              min: 0.4,
              max: 2
            },
            force: { "edgeLength": 50, "repulsion": 400, "gravity": 0.1 },
            roam: true,
            draggable: true,
            nodes: data,
            categories: categories,
            edges: edges
        }]
    };
}