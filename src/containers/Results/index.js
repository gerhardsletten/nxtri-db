import React, {Component} from 'react'
import {connect} from 'react-redux'
import {asyncConnect} from 'redux-connect'
import equal from 'deep-equal'
import {Link} from 'react-router'
import {push} from 'react-router-redux'
import styled from 'styled-components'
import {Select, Toolbar, NavLink, Arrow, Container, Fixed, Drawer, Divider, Button} from 'rebass'
import BarLoader from '@gerhardsletten/react-css-loaders/dist/bar/BarLoader'

import {CenterWrapper, Title, Box, TextOverflow, ScrollOverflow, FadeIn, Table, TBody, THead, Td, Th, TextCenter} from 'components'
import {isLoaded, load} from 'redux/modules/results'

const raceName = ({year, competition, edition}) => `${year} ${competition} ${edition !== 'Normal' ? ` (${edition})` : ''}`

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
    push
  }
)
export default class Results extends Component {
  state = {
    showMenu: false
  }
  componentWillReceiveProps (nextProps) {
    if (!equal(this.props.location.query && nextProps.location.query)) {
      this.setState({showMenu: false})
    }
  }
  onChangeRace = (event) => {
    const {push, location: {pathname, query}} = this.props
    push({pathname, query: {...query, raceId: event.target.value}})
  }
  onChangeClass = (event) => {
    const {push, location: {pathname, query}} = this.props
    push({pathname, query: {...query, genderClass: event.target.value}})
  }
  onChangeCrewToggle = (event) => {
    const {push, location: {pathname, query}} = this.props
    push({pathname, query: {...query, showCrew: query.showCrew && query.showCrew === '1' ? null : '1'}})
  }
  render () {
    const {results: {results}, loading, location: {query}} = this.props
    if (loading) {
      return this.renderLoading()
    }
    if (results && query.raceId) {
      return this.renderResults()
    }
    return this.renderPickRace()
  }
  renderPickRace () {
    const {results: {races}} = this.props
    return (
      <CenterWrapper>
        <FadeIn>
          <Title>Choose a race</Title>
          <Box>
            <MySelect onChange={this.onChangeRace}>
              <option value='0'>Select a race</option>
              {races && races.map(({id, ...race}, i) => <option key={i} value={id}>{raceName(race)}</option>)}
            </MySelect>
          </Box>
        </FadeIn>
      </CenterWrapper>
    )
  }
  renderLoading () {
    return (
      <CenterWrapper>
        <FadeIn>
          <BarLoader color='#fff' />
          <p>Loading</p>
        </FadeIn>
      </CenterWrapper>
    )
  }

  toggleMenu = () => {
    const {showMenu} = this.state
    this.setState({
      showMenu: !showMenu
    })
  }

  renderResults () {
    const {showMenu} = this.state
    const {results: {results, classes, races}, location: {pathname, query}} = this.props
    const selectedClassesId = query.genderClass || null
    const hasResults = results && !!results.length
    const selectedRace = races ? races.find(({id}) => id === query.raceId) : null
    return (
      <div>
        <Toolbar mb={2} pl={1} pr={1} bg='#263238'>
          <NavLink mr='auto'><span>{selectedRace && raceName(selectedRace)} ({results.length} athletes found)</span></NavLink>
          <NavLink ml='auto' onClick={this.toggleMenu}><span>Menu <Arrow direction='down' color='#fff' /></span></NavLink>
        </Toolbar>
        {showMenu && <Fixed top right bottom left onClick={this.toggleMenu} />}
        <Drawer open={showMenu} position='right' color='#424242' bg='#F5F5F5'>
          <Container p={3}>
            <TextCenter>
              <div>
                <Title>Filters</Title>
                <Select onChange={this.onChangeClass} value={selectedClassesId || ''}>
                  {classes.map(({id, name}, i) => <option key={i} value={id || ''}>{name}</option>)}
                </Select>
                <Divider w={1} color='#EEEEEE' mt={3} mb={3} />
                <Link to={pathname}><Button is='div' bg='#E65100'>Choose another race</Button></Link>
              </div>
            </TextCenter>
          </Container>
        </Drawer>
        {!hasResults && <Container><p>No results found</p></Container>}
        {hasResults && (
          <ScrollOverflow>
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
                      <Td><TextOverflow>{athlete.first_name} {athlete.last_name} ({athlete.gender_code})</TextOverflow></Td>
                      {athlete.segments.map(({time}, j) => {
                        return (
                          <Td key={j}>{time}</Td>
                        )
                      })}
                      <Td><TextOverflow>{athlete.reward}</TextOverflow></Td>
                      <Td>{athlete.finishtime}</Td>
                    </tr>
                  )
                })}
              </TBody>
            </Table>
          </ScrollOverflow>
        )}
      </div>
    )
  }
}

const MySelect = styled(Select)`
  border: none;
  > select {
    border: none;
    box-shadow: none !important;
    outline: none;
  }
`
