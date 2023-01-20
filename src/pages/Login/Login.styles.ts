import styled from 'styled-components'
import { Checkbox as AntCheckbox, Form as AntForm } from 'antd-mobile'

export const Checkbox = styled(AntCheckbox)`
  --font-size: var(--adm-font-size-6);
`

export const Form = styled(AntForm)`
  --border-bottom: solid 0px;
  --border-inner: solid 0px;
  --border-top: solid 0px;
`

export const WrapperLinks = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
  font-size: var(--adm-font-size-6);
`

export const Title = styled.h1`
  color: var(--adm-color-white);
  font-size: var(--adm-font-size-15);
  font-weight: bold;
`

export const Paragraph = styled.p`
  color: var(--adm-color-white);
  font-size: var(--adm-font-size-6);
  text-align: center;
`
