import React, { Component } from 'react'
import { Link } from 'react-router'

export default class NotFound extends Component {
    render() {
        return (
            <div className='NotFound'>
                <center>
                    <h1>404</h1>
                    The page is not found. <br/>
                    Would you like back to the <Link to='/'><b>home page</b></Link>?
                </center>
            </div>
        )
    }
}
