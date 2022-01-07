import React from 'react'
import ReactDOM from 'react-dom'

import Example from './example.mdx'

function App() {
  return (
    <div>
      <h1>
        Hello, world rendered by <code>React</code>!
      </h1>
      <Example />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
