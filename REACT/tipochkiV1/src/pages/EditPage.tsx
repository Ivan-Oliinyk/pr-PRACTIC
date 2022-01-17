import React from 'react'
import { useParams, Navigate } from 'react-router-dom'
import EditContainer from '../containers/EditContainer'

export default () => {
  const {id} = useParams()

  if(!id) {
    return <Navigate to="/" />
  }

  return (
    <div>
      <h2>User {id} - Edit</h2>
      <hr />
      <div className="Container">
        <EditContainer id={id} />
      </div>
    </div>
  )
}