import './Graph.css'
import React           from 'react'
import { Graph, Node } from './Data'

// ------------------------------------------------------------------
// Node Element
// ------------------------------------------------------------------

export interface NodeElementProperties {
    onNodeHeaderMouseDown: (node: Node, event: React.MouseEvent) => void
    graph: Graph,
    node:  Node
}
export function NodeElement(props: NodeElementProperties) {
    return <div className='node' style={{
        transform: `translate(${props.node.layout.x}px, ${props.node.layout.y}px)`,
        width:  props.node.layout.width,
        height: props.node.layout.height,
        zIndex: props.node.layout.zIndex,
    }}>
        <div className='node-header' onMouseDown= {e => props.onNodeHeaderMouseDown(props.node, e)}>
            {props.node.name}
        </div>
        <div className='node-body'>
            Todo: Draggable Ports
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
        const delta   = e.deltaY * 0.001
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

