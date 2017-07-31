import React from 'react'
import styled from 'styled-components'

const Title = styled.h1`
  border: 1px solid red;
  color: ${props => props.theme.primary}
`

const Secret = (props) => {
  return (
    <Title>Secret</Title>
  )
}

export default Secret
