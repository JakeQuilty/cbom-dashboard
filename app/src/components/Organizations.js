import { useState } from 'react';
import AddOrg from './AddOrg'
import OrgList from './OrgList'
import {
  CContainer,
  CCol,
  CRow,
  CButton,
} from '@coreui/react'

const Organizations = () => {
  const [showAdd, setShowAdd] = useState(false)

return (
  <div>
    <CContainer>
      <CRow>
        <CCol width="12" xs="2" sm="4" md="8" lg="8">
          <h1>Organizations</h1>
        </CCol>
        <CCol></CCol>
        <CCol></CCol>
        <CCol width="2" xs="2" sm="2" md="2" lg="2">
          <CButton color={showAdd ? "danger ": "info"} size="lg" className="h3" onClick={() => setShowAdd(!showAdd)}>{showAdd ? "X": "+"}</CButton>
        </CCol>
          {showAdd && <AddOrg />}
      </CRow>
      <CRow>
        <CCol lg="12">
          <OrgList perPage={20} />
        </CCol>
      </CRow>
    </CContainer>
  </div>
  )
}

export default Organizations
