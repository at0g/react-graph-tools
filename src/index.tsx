
import React    from 'react'
import ReactDOM from 'react-dom'
import { GraphElement } from './Graph'
import { createGraphData } from './Data'
import './index.css'

const graph = createGraphData()

ReactDOM.render(<GraphElement graph={graph} />, document.getElementById('root'));


