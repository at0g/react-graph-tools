/** Top level schema for the graph: Can change this to whatever. */
export interface Layout {
    x: number
    y: number
    width: number
    height: number
    zIndex: number
}
export type GraphLayout = {
    scale: number
} & Layout

export interface Port {
    type: 'input' | 'output' | 'none'
    name: string
}
export interface Node {
    id: string
    name: string
    ports: Port[]
    layout: Layout
}
export interface Edge {
    from: [string, string]
    to: [string, string]
}
export interface Graph {
    layout: GraphLayout
    nodes: Node[]
    edges: Edge[]
}

/** Generates a Basic Starter Graph */
export const createGraphData = (): Graph => ({
    layout: {
        x: 0,
        y: 0,
        width: 216,
        height: 100,
        zIndex: 0,
        scale: 1
    },
    nodes: [
        {
            id: 'Foo',
            name: 'Foo',
            ports: [
                { type: 'input', name: 'input_a' },
                { type: 'output', name: 'output_b' },
            ],
            layout: {
                "x": 31,
                "y": 444,
                "width": 216,
                "height": 100,
                "zIndex": 61
            },
        },
        {
            id: 'Bar',
            name: 'Bar',
            ports: [
                { type: 'input', name: 'input_a' },
                { type: 'input', name: 'input_b' },
                { type: 'input', name: 'input_c' },
                { type: 'output', name: 'output_d' },
                { type: 'output', name: 'output_e' },
                { type: 'output', name: 'output_f' },
            ],
            layout: {
                "x": 700,
                "y": 133,
                "width": 256,
                "height": 100,
                "zIndex": 57
            },
        },
        {
            id: 'Baz',
            name: 'Baz',
            ports: [
                { type: 'input', name: 'input_a' },
                { type: 'output', name: 'output_b' },
            ],
            layout: {
                "width": 256,
                "height": 100,
                "x": 348,
                "y": 30,
                "zIndex": 60
            },
        },
        {
            id: 'Qux',
            name: 'Qux',
            ports: [
                { type: 'input', name: 'input_a' },
                { type: 'output', name: 'output_b' },
            ],
            layout: {
                "width": 256,
                "height": 100,
                "x": 344,
                "y": -261,
                "zIndex": 63
            },
        }
    ],
    edges: [
        { from: ['Foo', 'output_b'], to: ['Baz', 'input_a'] },
        { from: ['Baz', 'output_b'], to: ['Bar', 'input_c'] },
        { from: ['Qux', 'output_b'], to: ['Bar', 'input_b'] },
    ]
})
