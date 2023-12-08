import * as serviceWorker from './serviceWorker'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import 'react-circular-progressbar/dist/styles.css'
import App from './App'
import { BrowserRouter as Router } from 'react-router-dom'
import React from 'react'
import ReactDOM from 'react-dom'
import './assets/App.scss'
import './assets/Auth.css'
import './assets/Store.css'
import './index.scss'

const app = (
    <Router>
        <App />
    </Router>
)

ReactDOM.render(app, document.getElementById('root'))

serviceWorker.unregister()
