import './Graph.css'
import React                 from 'react'
import { Graph, Node, Port } from './Data'

// ------------------------------------------------------------------
// Port Elements | Input | Output
// ------------------------------------------------------------------

export interface InputPortElementProperties {
    port: Port
}
export function InputPortElement(props: InputPortElementProperties) {
    return <div className='port'>
        <div className='port-left'>
            <div className='port-connector'></div>
        </div>
        <div className='port-middle'>{props.port.name}</div>
        <div className='port-right'></div>
    </div>
}

export interface OutputPortElementProperties {
    port: Port
}
export function OutputPortElement(props: InputPortElementProperties) {
    return <div className='port'>
        <div className='port-left'></div>
        <div className='port-middle'>{props.port.name}</div>
        <div className='port-right'>
            <div className='port-connector'></div>
        </div>
    </div>
}

// ------------------------------------------------------------------
// Node Element
// ------------------------------------------------------------------

export interface NodeElementProperties {
    onNodeHeaderMouseDown: (node: Node, event: React.MouseEvent) => void
    graph: Graph,
    node:  Node
}
export function NodeElement(props: NodeElementProperties) {

    const ports = props.node.ports.map(port => {
        switch(port.type) {
            case 'input': return <InputPortElement key={port.name} port={port} />
            case 'output': return <OutputPortElement key={port.name} port={port} />
            default: return null
        }
    })

    return <div className='node' style={{
        transform: `translate(${props.node.layout.x}px, ${props.node.layout.y}px)`,
        width:  props.node.layout.width,
        // note: The explicit height interferes with the default 'auto'
        // layout of arbituary numbers of ports. Have commented for the
        // time being. I think it would be cool to be able to resize
        // the nodes, but not sure how to approach that with the 
        // current setup. For consideration.

        // height: props.node.layout.height,
        zIndex: props.node.layout.zIndex,
    }}>
        <div className='node-header' onMouseDown= {e => props.onNodeHeaderMouseDown(props.node, e)}>
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
    }

    function onMouseDown (e: React.MouseEvent) {
        e.stopPropagation()
        state.draggable = {
            target: state.graph
        }
        setState({ ...state })   
    }

    function onMouseUp (e: React.MouseEvent) {
        state.draggable = {
            target: null
        }
    }
    
    function onNodeHeaderMouseDown (node: Node, e: React.MouseEvent) {
        e.stopPropagation()
        const top = state.graph.nodes.reduce((acc, node) => node.layout.zIndex > acc ? node.layout.zIndex : acc, 0)
        node.layout.zIndex = (top + 1)
        state.draggable = {
            target: node
        }
        setState({ ...state })
    }

    function onWheel(e: React.WheelEvent) {
        const current = state.graph.layout.scale
        const delta   = e.deltaY > 1 ? -0.25 : 0.25
        state.graph.layout.scale = (current + delta <= 0) ? current : current + delta
        setState({ ...state})
    }

    const nodes = state.graph.nodes.map(node => (
        <NodeElement key={node.id} graph={state.graph} node={node} 
            onNodeHeaderMouseDown={onNodeHeaderMouseDown} />
    ))
    return <div className='graph'
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onWheel={onWheel}
    >
        <div className='graph-scale' style={{transform: `scale(${state.graph.layout.scale})`}}>
            <div className='graph-translate' style={{transform: `translate(${state.graph.layout.x}px, ${state.graph.layout.y}px)`}}>
                {nodes}
            </div>
        </div>
    </div>
}

