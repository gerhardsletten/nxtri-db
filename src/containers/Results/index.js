import React, {Component} from 'react'
import {connect} from 'react-redux'
import {asyncConnect} from 'redux-connect'
import {Link} from 'react-router'
import Helmet from 'react-helmet'
import styled from 'styled-components'

import {isLoaded, load} from 'redux/modules/results'

const NavLink = styled(Link)`
  display: inline-block;
  color: ${props => props.selected ? 'black' : props.theme.link};
  text-decoration: ${props => props.selected ? 'none' : 'underline'};
  margin-right: 0.5rem;
`

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  border: 1px solid #ccc;
`

const Td = styled.td`
  padding: 0.5rem;
  border: 1px solid #ccc;
  text-align: left;
`
const Th = styled(Td)`
  font-weight: bold;
  background: #f2f2f2;
`

@asyncConnect([{
  promise: ({store: {dispatch, getState}, location: {query}}) => {
    const promises = []
    if (!isLoaded(getState(), query)) {
      promises.push(dispatch(load(query)))
    }
    return Promise.all(promises)
  }
}])
@connect(
  (state) => ({
    results: state.results.data,
    error: state.results.error
  })
)
export default class Results extends Component {
  render () {
    const {results: {races, classes, results, params = {}}, error, location: {pathname, query}} = this.props
    const selectedRaceId = params.raceId || null
    const selectedClassesId = params.genderClass || null
    const selectedRace = selectedRaceId && races ? races.find(({id}) => id === query.raceId) : null
    return (
      <div>
        <Helmet title={`Results ${selectedRace ? `for ${selectedRace.name}` : ''}`} />
        {error && <p>Error: {error}</p>}
        {races && (
          <p>
            <strong>Races:</strong> {races.map(({id, name}, i) => <NavLink key={i} to={{pathname, query: {...query, raceId: id}}} selected={selectedRaceId === id}>{name}</NavLink>)}
          </p>
        )}
        {classes && (
          <p>
            <strong>Klasses:</strong> {classes.map(({id, name}, i) => <NavLink key={i} to={{pathname, query: {...query, genderClass: id}}} selected={selectedClassesId === id}>{name}</NavLink>)}
          </p>
        )}
        {results && !!results.length && (
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                {results[0].segments.map(({name}, j) => {
                  return (
                    <Th key={j}>{name}</Th>
                  )
                })}
                <Th>Reward</Th>
                <Th>FinishTime</Th>
              </tr>
            </thead>
            <tbody>
              {results.map((athlete, i) => {
                return (
                  <tr key={i}>
                    <Td>{athlete.first_name} {athlete.last_name} ({athlete.gender_code}</Td>
                    {athlete.segments.map(({time}, j) => {
                      return (
                        <Td key={j}>{time}</Td>
                      )
                    })}
                    <Td>{athlete.reward}</Td>
                    <Td>{athlete.finishtime}</Td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        )}
        {results && !results.length && (
          <p>No results found</p>
        )}
      </div>
    )
  }
}
