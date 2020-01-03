
import React from 'react'
import ReactDOM from 'react-dom'
import { GraphElement } from './Graph'
import { createGraphData, Graph } from './Data'
import './index.css'

// Very very rough page layout thing with left and right
// containers. Graph updates written to the right as 
// JSON. 
function App() {
    const [state, setState] = React.useState<any>(null)
    function onGraphChange(graph: Graph) {
        setState(graph)
    }
    return <div style={{ 
            width:  '100%', 
            height: '100%',
            overflow: 'hidden' 
            }}>
        <div style={{
            width:  '60%', 
            height: '100%', 
            float:  'left' 
            }}>
            <GraphElement graph={createGraphData()} onGraphChange={onGraphChange} />
        </div>
        <div style={{ 
            width:  '40%', 
            height: '100%', 
            float:  'left' 
            }}>
            <pre style={{ 
                width:       'calc(100% - 16px)',
                height:      '100%', 
                paddingLeft: '16px',
                overflow:    'scroll' 
                }}>{JSON.stringify(state, null, 2)}</pre>
        </div>
    </div>
}

ReactDOM.render(<App />, document.getElementById('root'));


