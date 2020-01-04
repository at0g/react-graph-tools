
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { GraphElement } from './Graph'
import { createGraphData, Graph } from './Data'
import './index.css'
import Layout from './components/Layout';
import Json from './components/Json';

function App() {
    const [state, setState] = useState<any>(null)
    function onGraphChange(graph: Graph) {
        setState(graph)
    }

    return (
        <Layout aside={<Json {...state} />}>
            <GraphElement graph={createGraphData()} onGraphChange={onGraphChange} />
        </Layout>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));


