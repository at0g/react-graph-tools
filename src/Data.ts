/** Top level schema for the graph: Can change this to whatever. */
export interface Layout {
    x:      number
    y:      number
    width:  number
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
    id:     string
    name:   string
    ports:  Port[]
    layout: Layout
}
export interface Edge {
    from: [string, string]
    to:   [string, string]
}
export interface Graph {
    layout: GraphLayout
    nodes: Node[]
    edges: Edge[]
}

/** Generates a Basic Starter Graph */
export const createGraphData = (): Graph => ({
    layout: {
        x:      0, 
        y:      0, 
        width:  216, 
        height: 100, 
        zIndex: 0,
        scale: 1
    },
    nodes: [
        {
            id:   'A',
            name: 'Foo',
            ports:  [
                { type: 'input',  name: 'input_a'}, 
                { type: 'output',  name: 'output_b'}, 
            ],
            layout: { 
                x:      10, 
                y:      10, 
                width:  216, 
                height: 100, 
                zIndex: 0 
            },
        },
        {
            id:   'B',
            name: 'Bar',
            ports:  [
                { type: 'input',  name: 'input_a'}, 
                { type: 'input',  name: 'input_b'}, 
                { type: 'input',  name: 'input_c'}, 
                { type: 'output',  name: 'output_d'}, 
                { type: 'output',  name: 'output_e'}, 
                { type: 'output',  name: 'output_f'}, 
            ],
            layout: { 
                x:      250, 
                y:      10, 
                width:  256, 
                height: 100, 
                zIndex: 1
            },
        },
        {
            id:   'C',
            name: 'Baz',
            ports:  [
                { type: 'input',  name: 'input_a'}, 
                { type: 'output',  name: 'output_b'}, 
            ],
            layout: { 
                width:  256,
                height: 100,
                x:      210, 
                y:      210, 
                zIndex: 2 
            },
        }
    ],
    edges: [
        { from: ['A', 'a'], to: ['B', 'a'] },
        { from: ['A', 'a'], to: ['B', 'b'] },
        { from: ['A', 'a'], to: ['B', 'c'] },
        { from: ['A', 'b'], to: ['C', 'a'] },
        { from: ['A', 'b'], to: ['C', 'b'] },
        { from: ['A', 'b'], to: ['C', 'c'] },
    ]
})
