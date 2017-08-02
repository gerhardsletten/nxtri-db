import React from 'react'
import styled, {keyframes} from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  flex-direction: column;
`

export const Main = styled.main`
  flex: 1;
`

export const CenterWrapper = styled(Wrapper)`
  align-items: center;
  text-align: center;
  justify-content: center;
`

export const TextCenter = styled.div`
  text-align: center;
`

const fadeIn = keyframes`
  from {
    transform: scale(.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`

export const Title = styled.h1`
  font-size: 3.4rem;
  margin-bottom: 1rem;
`

export const Box = styled.div`
  background: #fff;
  border-radius: .2rem;
  padding: 1rem;
  max-width: ${props => `${props.width || 40}rem`};
  color: #000;
  box-shadow: 0 0 1rem #fff;
`

export const TextOverflow = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const ScrollOverflow = styled.div`
  max-width: 100%;
  overflow: auto;
`

export const FadeIn = styled.div`
  animation: ${fadeIn} .3s linear 1;
`

export const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  max-width: 100%;
  font-size: 1.6rem;
`

export const TBody = styled.tbody`
  width: 100%;
`
export const THead = styled.thead`
  width: 100%;
`

export const Td = styled.td`
  padding: 0.5rem;
  border-bottom: 1px solid rgba(100%,100%,100%,.2);
  text-align: left;
  &:first-child {
    padding-left: 1rem;
  }
  &:last-child {
    padding-right: 1rem;
  }
`
export const Th = styled(Td)`
  font-weight: bold;
`
