import './Graph.css'
import React                 from 'react'
import { Graph, Node, Port } from './Data'

// ------------------------------------------------------------------
// Port Elements | Input | Output
// ------------------------------------------------------------------

export interface InputPortElementProperties {
    onInputMouseUp: (port: Port, event: React.MouseEvent) => void
    port: Port
}
export function InputPortElement(props: InputPortElementProperties) {
    return <div className='port'>
        <div className='port-left'>
            <div className='port-connector'
                onMouseUp={e => props.onInputMouseUp(props.port, e)}
            ></div>
        </div>
        <div className='port-middle noselect'>{props.port.name}</div>
        <div className='port-right'></div>
    </div>
}

export interface OutputPortElementProperties {
    onOutputMouseDown: (port: Port, event: React.MouseEvent) => void
    port: Port
}
export function OutputPortElement(props: OutputPortElementProperties) {
    return <div className='port'>
        <div className='port-left'></div>
        <div className='port-middle noselect'>{props.port.name}</div>
        <div className='port-right'>
            <div className='port-connector'
                onMouseDown={e => props.onOutputMouseDown(props.port, e)}
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
    graph: Graph,
    node:  Node
}
export function NodeElement(props: NodeElementProperties) {

    const ports = props.node.ports.map(port => {
        switch(port.type) {
            case 'input':  return <InputPortElement  key={port.name} port={port} onInputMouseUp   ={(port, event) => props.onInputMouseUp(props.node, port, event)} />
            case 'output': return <OutputPortElement key={port.name} port={port} onOutputMouseDown={(port, event) => props.onOutputMouseDown(props.node, port, event)} />
            default: return null
        }
    })

    return <div className='node' style={{
        transform: `translate(${props.node.layout.x}px, ${props.node.layout.y}px)`,
        width:     props.node.layout.width,
        zIndex:    props.node.layout.zIndex,
    }}>
        <div className='node-header noselect' onMouseDown= {e => props.onNodeHeaderMouseDown(props.node, e)}>
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

export interface GraphElementState {
    graph: Graph
    draggable: {
        target: Node | Graph | null
    },
    connector: {
        active: boolean
        from: { x: number, y: number }
        to:   { x: number, y: number }
    }
}
export interface GraphElementProperties {
    onGraphChange: (graph: Graph) => void
    graph: Graph
}
export function GraphElement(props: GraphElementProperties) {
    const [state, _setState] = React.useState<GraphElementState>({
        graph: { ...props.graph },
        draggable: {
            target: null
        },
        connector: {
            active: false,
            from: { x: 0, y: 0 },
            to:   { x: 0, y: 0 }
        }
    })

    // Intercept all state changes and emit updated state.
    function setState(state: GraphElementState) {
        props.onGraphChange({...state.graph})
        _setState(state)
    }

    function onMouseMove (e: React.MouseEvent) {
        if(state.draggable.target !== null) {
            // note: calculate the actual delta from the device pixel ratio and 
            // the current scale of the graph layout. We shift the target by the
            // given deltas. (Better than tracking via clientXY positions.)
            const deltaX = e.movementX / (window.devicePixelRatio * state.graph.layout.scale)
            const deltaY = e.movementY / (window.devicePixelRatio * state.graph.layout.scale)
            state.draggable.target.layout.x += deltaX
            state.draggable.target.layout.y += deltaY
            setState({ ...state })
        }

        if(state.connector.active) {
            const deltaX = e.movementX / (window.devicePixelRatio * state.graph.layout.scale)
            const deltaY = e.movementY / (window.devicePixelRatio * state.graph.layout.scale)
            state.connector.to.x += deltaX
            state.connector.to.y += deltaY
            setState({ ...state })
        }
    }

    function onMouseDown (e: React.MouseEvent) {
        e.stopPropagation()
        state.draggable.target = state.graph
        setState({ ...state })   
    }

    function onMouseUp (e: React.MouseEvent) {
        state.draggable.target = null
        state.connector.active = false
        setState({ ...state })
    }
    
    function onNodeHeaderMouseDown (node: Node, e: React.MouseEvent) {
        e.stopPropagation()
        const top = state.graph.nodes.reduce((acc, node) => node.layout.zIndex > acc ? node.layout.zIndex : acc, 0)
        node.layout.zIndex = (top + 1)
        state.draggable.target = node
        setState({ ...state })
    }

    function onNodeInputMouseUp(node: Node, port: Port, e: React.MouseEvent) {
        console.log('input: mouseup')
        console.log(node, port)
    }

    function onNodeOutputMouseDown(node: Node, port: Port, e: React.MouseEvent) {
        e.stopPropagation()        
        state.connector.from.x = e.clientX
        state.connector.from.y = e.clientY
        state.connector.to.x   = e.clientX
        state.connector.to.y   = e.clientY
        state.connector.active = true
        setState({...state})
    }

    function onWheel(e: React.WheelEvent) {
        const current = state.graph.layout.scale
        const delta   = e.deltaY > 1 ? -0.25 : 0.25
        state.graph.layout.scale = (current + delta <= 0) ? current : current + delta
        setState({ ...state})
    }

    const connector = state.connector.active ? (
        <svg style={{width: '100%', height: '100%', position: 'fixed'}} xmlns="http://www.w3.org/2000/svg">
            <line x1={state.connector.from.x} y1={state.connector.from.y} x2={state.connector.to.x} y2={state.connector.to.y} style={{stroke:'#333', strokeWidth:2 }} />
        </svg>
    ) : null;

    const nodes = state.graph.nodes.map(node => (
        <NodeElement key={node.id} graph={state.graph} node={node}
            onNodeHeaderMouseDown={onNodeHeaderMouseDown}    
            onInputMouseUp={onNodeInputMouseUp}
            onOutputMouseDown={onNodeOutputMouseDown}
        />
    ))
    return <div className='graph'
        onMouseMove={onMouseMove}    
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onWheel={onWheel}>
        <div className='graph-scale' style={{transform: `scale(${state.graph.layout.scale})`}}>
            <div className='graph-translate' style={{transform: `translate(${state.graph.layout.x}px, ${state.graph.layout.y}px)`}}>
                {connector}
                {nodes}
            </div>
        </div>
    </div>
}

