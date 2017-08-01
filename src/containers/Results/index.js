import React, {Component} from 'react'
import {connect} from 'react-redux'
import {asyncConnect} from 'redux-connect'
import {replace} from 'react-router-redux'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import {Select, Label, Switch} from 'rebass'

import {isLoaded, load} from 'redux/modules/results'

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  border: 1px solid #ccc;
`

const TBody = styled.tbody`
  width: 100%;
`
const THead = styled.thead`
  width: 100%;
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

const NavWrapper = styled.div`
  margin: 0 1rem .5rem 0;
  display: inline-flex;
  align-items: center;
`

const Inline = styled(NavWrapper)`
  margin-right: .5rem;
`

const CustomLabel = styled(Label)`
  margin-right: .5rem;
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
    error: state.results.error,
    loading: !state.reduxAsyncConnect.loaded
  }), {
    replace
  }
)
export default class Results extends Component {
  onChangeRace = (event) => {
    const {replace, location: {pathname, query}} = this.props
    replace({pathname, query: {...query, raceId: event.target.value}})
  }
  onChangeClass = (event) => {
    const {replace, location: {pathname, query}} = this.props
    replace({pathname, query: {...query, genderClass: event.target.value}})
  }
  onChangeCrewToggle = (event) => {
    const {replace, location: {pathname, query}} = this.props
    replace({pathname, query: {...query, showCrew: query.showCrew && query.showCrew === '1' ? null : '1'}})
  }
  render () {
    const {results: {races, classes, results, params = {}}, error, location: {query}, loading} = this.props
    const selectedRaceId = params.raceId || null
    const selectedClassesId = params.genderClass || null
    const showCrew = query.showCrew ? query.showCrew === '1' : null
    const selectedRace = selectedRaceId && races ? races.find(({id}) => id === selectedRaceId) : null
    return (
      <div>
        <Helmet title={`Results ${selectedRace ? `for ${selectedRace.name}` : ''}`} />
        <div>
          {races && (
            <NavWrapper>
              <Inline>
                <Label>Races</Label>
              </Inline>
              <Inline>
                <Select onChange={this.onChangeRace} value={selectedRaceId || ''}>
                  {races.filter(({isCrew}) => showCrew ? true : !isCrew).map(({id, name, isCrew}, i) => <option key={i} value={id}>{`${name} ${isCrew ? 'Crew-race' : ''}   `}</option>)}
                </Select>
              </Inline>
            </NavWrapper>
          )}
          {classes && (
            <NavWrapper>
              <Inline>
                <Label>Classes</Label>
              </Inline>
              <Inline>
                <Select onChange={this.onChangeClass} value={selectedClassesId || ''}>
                  {classes.map(({id, name}, i) => <option key={i} value={id}>{name}</option>)}
                </Select>
              </Inline>
            </NavWrapper>
          )}
          {races && (
            <NavWrapper>
              <Inline>
                <CustomLabel>Include crew-race</CustomLabel>
                <Switch
                  checked={showCrew}
                  onClick={this.onChangeCrewToggle}
                />
              </Inline>
            </NavWrapper>
          )}
          {results && !!results.length && <Inline><Label>({results.length} athletes)</Label></Inline>}
        </div>
        {loading && <p>Loading</p>}
        {error && <p>Error: {error}</p>}
        {!loading && results && !!results.length && (
          <Table>
            <THead>
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
            </THead>
            <TBody>
              {results.map((athlete, i) => {
                return (
                  <tr key={i}>
                    <Td>{athlete.first_name} {athlete.last_name} ({athlete.gender_code})</Td>
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
            </TBody>
          </Table>
        )}
        {results && !results.length && (
          <p>No results found</p>
        )}
      </div>
    )
  }
}
