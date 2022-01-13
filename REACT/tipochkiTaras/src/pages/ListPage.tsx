import React from 'react'
import { Link } from 'react-router-dom'
import ListContainer from '../containers/ListContainer'

export default () => {
  return (
    <div>
      <h2>Users - List</h2>
      <hr />
      <div className="Container">
        <div>
          <Link to="/create">New</Link>
        </div>
        <ListContainer />
      </div>
    </div>
  )
}