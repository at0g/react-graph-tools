import './Graph.css'
import React from 'react'
import { Graph, Node, Port } from './Data'
import { rootCertificates } from 'tls'

// ------------------------------------------------------------------
// Port Elements | Input | Output
// ------------------------------------------------------------------

export interface InputPortElementProperties {
    onConnectorLayout: (node: Node, port: Port, rect: DOMRect) => void
    onInputMouseUp: (node: Node, port: Port, event: React.MouseEvent) => void
    node: Node
    port: Port
}
export function InputPortElement(props: InputPortElementProperties) {
    const connector = React.useRef<HTMLDivElement>(null)

    React.useLayoutEffect(() => {
        const rect = connector.current!.getBoundingClientRect()!
        props.onConnectorLayout(props.node, props.port, rect)
    })

    return <div className='port'>
        <div className='port-left'>
            <div className='port-connector' ref={connector}
                onMouseUp={e => props.onInputMouseUp(props.node, props.port, e)}
            ></div>
        </div>
        <div className='port-middle noselect'>{props.port.name}</div>
        <div className='port-right'></div>
    </div>
}

export interface OutputPortElementProperties {
    onOutputMouseDown: (node: Node, port: Port, event: React.MouseEvent) => void
    onConnectorLayout: (node: Node, port: Port, rect: DOMRect) => void
    node: Node
    port: Port
}
export function OutputPortElement(props: OutputPortElementProperties) {
    const connector = React.useRef<HTMLDivElement>(null)

    React.useLayoutEffect(() => {
        const rect = connector.current!.getBoundingClientRect()!
        props.onConnectorLayout(props.node, props.port, rect)
    })

    return <div className='port'>
        <div className='port-left'></div>
        <div className='port-middle noselect'>{props.port.name}</div>
        <div className='port-right'>
            <div className='port-connector' ref={connector}
                onMouseDown={e => props.onOutputMouseDown(props.node, props.port, e)}
            ></div>
        </div>
    </div>
}

// ------------------------------------------------------------------
// Node Element
// ------------------------------------------------------------------

export interface NodeElementProperties {
    onNodeHeaderMouseDown: (node: Node, event: React.MouseEvent) => void,
    onInputMouseUp:        (node: Node, port: Port, event: React.MouseEvent) => void
    onOutputMouseDown:     (node: Node, port: Port, event: React.MouseEvent) => void
    onConnectorLayout:     (node: Node, port: Port, rect:  DOMRect) => void
    graph: Graph,
    node: Node
}
export function NodeElement(props: NodeElementProperties) {
    const ports = props.node.ports.map(port => {
        switch (port.type) {
            case 'input': return (
                <InputPortElement
                    key={port.name}
                    onConnectorLayout={props.onConnectorLayout}
                    onInputMouseUp={props.onInputMouseUp}
                    node={props.node}
                    port={port}
                />
            )
            case 'output': return (
                <OutputPortElement
                    key={port.name}
                    onConnectorLayout={props.onConnectorLayout}
                    onOutputMouseDown={props.onOutputMouseDown}
                    node={props.node}
                    port={port}
                />
            )
            default: return null
        }
    })
    return <div className='node' style={{
        transform: `translate(${props.node.layout.x}px, ${props.node.layout.y}px)`,
        width: props.node.layout.width,
        zIndex: props.node.layout.zIndex,
    }}>
        <div className='node-header noselect' onMouseDown={e => props.onNodeHeaderMouseDown(props.node, e)}>
            {props.node.name}
        </div>
        <div className='node-body'>
            {ports}
        </div>
        <div className='node-footer' />
    </div>
}

// ------------------------------------------------------------------
// Graph Element
// ------------------------------------------------------------------

export interface Line {
    from: { x: number, y: number }
    to:   { x: number, y: number }
}

export interface GraphElementState {
    revision: number, 
    graph: Graph
    draggable: {
        target: Node | Graph | null
    },
    connector: {
        active: boolean
        from: { x: number, y: number }
        to: { x: number, y: number }
    },
    lines: Line[]
}
export interface GraphElementProperties {
    onGraphChange: (graph: Graph) => void
    graph: Graph
}
export function GraphElement(props: GraphElementProperties) {
    const [state, _setState] = React.useState<GraphElementState>({
        revision: 0,
        graph: { ...props.graph },
        lines: [],
        draggable: {
            target: null
        },
        connector: {
            active: false,
            from: { x: 0, y: 0 },
            to:   { x: 0, y: 0 }
        },
    })

    const accumulator: Array<{node: Node, port: Port, rect: DOMRect}> = []
    function onConnectorLayout(node: Node, port: Port, rect: DOMRect) {
        accumulator.push({node, port, rect})
    }

    React.useLayoutEffect(() => {
        const lines: Line[] = []
        for(const edge of state.graph.edges) {
            const from = accumulator.find(({node, port}) => node.id === edge.from[0] && port.name === edge.from[1])!
            const to   = accumulator.find(({node, port}) => node.id === edge.to[0]   && port.name === edge.to[1])!
            const _scale = (window.devicePixelRatio * state.graph.layout.scale)
            // need to transform the SVG lines by the current translate and scale.
            // scale is utterly broken in the given setup.
            //
            // Using CSS transforms, we transform from the 'top left' which makes 
            // computing the scale extremely awkward, consider centering origin 
            // at element midpoint (w/2, h/2) and transforming from there.
            lines.push({
                from: { 
                    x: ((from.rect.x + from.rect.width / 2) - state.graph.layout.x), 
                    y: ((from.rect.y + from.rect.height / 2) - state.graph.layout.y), 
                }, 
                to: { 
                    x: ((to.rect.x + to.rect.width  / 2) - state.graph.layout.x), 
                    y: ((to.rect.y + to.rect.height / 2) - state.graph.layout.y), 
                }, 
            })
        }
        setState({ ...state, lines })
    }, [state.revision])

    // Intercept all state changes and emit updated state.
    function setState(state: GraphElementState) {
        props.onGraphChange({ ...state.graph })
        _setState(state)
    }

    function onMouseMove(e: React.MouseEvent) {
        if (state.draggable.target !== null) {
            // note: calculate the actual delta from the device pixel ratio and 
            // the current scale of the graph layout. We shift the target by the
            // given deltas. (Better than tracking via clientXY positions.)
            const deltaX = e.movementX / (window.devicePixelRatio * state.graph.layout.scale)
            const deltaY = e.movementY / (window.devicePixelRatio * state.graph.layout.scale)
            state.draggable.target.layout.x += deltaX
            state.draggable.target.layout.y += deltaY
            state.revision += 1
            setState({ ...state })
        }

        if (state.connector.active) {
            const deltaX = e.movementX / (window.devicePixelRatio * state.graph.layout.scale)
            const deltaY = e.movementY / (window.devicePixelRatio * state.graph.layout.scale)
            state.connector.to.x += deltaX
            state.connector.to.y += deltaY
            state.revision += 1
            setState({ ...state })
        }
    }

    function onMouseDown(e: React.MouseEvent) {
        e.stopPropagation()
        state.draggable.target = state.graph
        setState({ ...state })
    }

    function onMouseUp(e: React.MouseEvent) {
        state.draggable.target = null
        state.connector.active = false
        setState({ ...state })
    }

    function onNodeHeaderMouseDown(node: Node, e: React.MouseEvent) {
        e.stopPropagation()
        const top = state.graph.nodes.reduce((acc, node) => node.layout.zIndex > acc ? node.layout.zIndex : acc, 0)
        node.layout.zIndex = (top + 1)
        state.draggable.target = node
        setState({ ...state })
    }

    function onNodeInputMouseUp(node: Node, port: Port, e: React.MouseEvent) {
    }

    function onNodeOutputMouseDown(node: Node, port: Port, e: React.MouseEvent) {
        e.stopPropagation()
        state.connector.from.x = e.clientX
        state.connector.from.y = e.clientY
        state.connector.to.x = e.clientX
        state.connector.to.y = e.clientY
        state.connector.active = true
        setState({ ...state })
    }

    function onWheel(e: React.WheelEvent) {
        const current = state.graph.layout.scale
        const delta = e.deltaY > 1 ? -0.25 : 0.25
        state.graph.layout.scale = (current + delta <= 0) ? current : current + delta
        setState({ ...state })
    }

    const connector = state.connector.active ? (
        <svg style={{ width: '100%', height: '100%', position: 'fixed' }} xmlns="http://www.w3.org/2000/svg">
            <line x1={state.connector.from.x} y1={state.connector.from.y} x2={state.connector.to.x} y2={state.connector.to.y} style={{ stroke: '#333', strokeWidth: 2 }} />
        </svg>
    ) : null;

    const nodes = state.graph.nodes.map(node => (
        <NodeElement key={node.id} graph={state.graph} node={node}
            onConnectorLayout={onConnectorLayout}
            onNodeHeaderMouseDown={onNodeHeaderMouseDown}
            onInputMouseUp={onNodeInputMouseUp}
            onOutputMouseDown={onNodeOutputMouseDown}
        />
    ))

    const edges = state.lines.map(line => (
        <line x1={line.from.x} 
              y1={line.from.y} 
              x2={line.to.x} 
              y2={line.to.y} 
              style={{ stroke: '#333', strokeWidth: 2 }} />)
    )
    
    return <div className='graph'
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onWheel={onWheel}>
        <div className='graph-transform' style={{ transform: `translate(${state.graph.layout.x}px, ${state.graph.layout.y}px) scale(${state.graph.layout.scale})` }}>
            <svg style={{ width: '100%', height: '100%', position: 'fixed' }} xmlns="http://www.w3.org/2000/svg">
                {edges}
            </svg>
            {connector}
            {nodes}
        </div>
    </div>
}

