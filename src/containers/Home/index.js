import React from 'react'
import {Link} from 'react-router'
import {routes} from 'routes'

const Home = (props) => {
  return (
    <div>
      <h1>Nxtri-db</h1>
      <Link to={routes.results}>Results</Link>
    </div>
  )
}

export default Home
