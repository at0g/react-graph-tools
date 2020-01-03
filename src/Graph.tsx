import './Graph.css'
import React           from 'react'
import { Graph, Node } from './Data'

// ------------------------------------------------------------------
// Node Element
// ------------------------------------------------------------------

export interface NodeElementProperties {
    onNodeHeaderMouseDown: (node: Node, event: React.MouseEvent) => void
    onNodeHeaderMouseUp:   (node: Node, event: React.MouseEvent) => void
    graph: Graph,
    node:  Node
}
export function NodeElement(props: NodeElementProperties) {
    return <div className='node' style={{
        width:  props.node.layout.width,
        height: props.node.layout.height,
        left:   props.node.layout.x + props.graph.layout.x,
        top:    props.node.layout.y + props.graph.layout.y,
        zIndex: props.node.layout.zIndex
    }}>
        <div className='node-header'
            onMouseDown= {e => props.onNodeHeaderMouseDown(props.node, e)}
            onMouseUp  = {e => props.onNodeHeaderMouseUp(props.node, e)}
        >{props.node.name}</div>
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
        delta: { x: number, y: number } // mouse pos - target pos
        target: Node | Graph | null
    }
}
export interface GraphElementProperties {
    graph: Graph
}
export function GraphElement(props: GraphElementProperties) {
    const [state, setState] = React.useState<GraphElementState>({
        graph: {...props.graph},
        draggable: {
            delta: { x: 0, y: 0 },
            target:   null,
        }
    })

    function onMouseMove (e: React.MouseEvent) {
        if(state.draggable.target !== null) {
            state.draggable.target.layout.x = e.clientX - state.draggable.delta.x
            state.draggable.target.layout.y = e.clientY - state.draggable.delta.y

            // todo: There is a problem here in that, just blindly setting the
            // state in this fashion results in 'all' nodes being redrawn, even
            // tho only one node is being mutated. Is there a better way to
            // partition the 'state' so that only nodes that update get
            // re-drawn? For a mousemove, that may be prohibitively expensive.
            setState({...state})
        }
    }

    function onMouseDown (e: React.MouseEvent) {
        state.draggable = {
            target: state.graph,
            delta: {
                x: e.clientX - state.graph.layout.x ,
                y: e.clientY - state.graph.layout.y
            }
        }
    }

    function onMouseUp (e: React.MouseEvent) {
        state.draggable = {
            target: null,
            delta: {
                x: 0,
                y: 0
            }
        }
    }
    
    function onNodeHeaderMouseDown (node: Node, e: React.MouseEvent) {
        // Compute the top most z-index of 'all' the nodes. Note, that
        // the node passed on this event is one of the nodes in this
        // graphs state. We set (top+1) which is mutating a reference
        // to the node in the current state.
        const top = state.graph.nodes.reduce((acc, node) => node.layout.zIndex > acc ? node.layout.zIndex : acc, 0)
        node.layout.zIndex = (top + 1)
        state.draggable = {
            target: node,
            delta: {
                x: e.clientX - node.layout.x,
                y: e.clientY - node.layout.y
            }
        }
        setState({ ...state })        
    }
    
    function onNodeHeaderMouseUp (node: Node, e: React.MouseEvent) {
        // Note: Same as Graph.onMouseUp()
        //
        // state.draggable = {
        //     target: null,
        //     delta: {
        //         x: 0,
        //         y: 0
        //     }
        // }
        // setState({ ...state })    
    }

    const nodes = state.graph.nodes.map(node => (
        <NodeElement key={node.id} graph={state.graph} node={node} 
            onNodeHeaderMouseDown={onNodeHeaderMouseDown}
            onNodeHeaderMouseUp={onNodeHeaderMouseUp} />
    ))
    return <div className='graph'
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
    >
        {nodes}
    </div>
}

