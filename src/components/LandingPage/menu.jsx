import React from 'react'
import './index.scss'
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <div className={'custom-nav'}>
            <a href="https://evolvfit.in/" target="_blank" rel="noreferrer">
                <h2 className="nav-element">Home</h2>
            </a>
            <a
                href="https://store.evolvfit.in/"
                target="_blank"
                rel="noreferrer"
            >
                <h2 className="nav-element">Store</h2>
            </a>
            {/* <a href="https://evolvfit.in/blogs" target="_blank" rel="noreferrer">
        <h2 className='nav-element'>Blogs</h2>
      </a> */}
            <Link to="/support">
                <h2 className="nav-element">Support</h2>
            </Link>
        </div>
    )
}

export default Navbar
