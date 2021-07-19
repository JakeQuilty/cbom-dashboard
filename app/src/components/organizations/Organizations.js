import React from 'react'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CNavLink,
  CNav,
  CNavItem,
  CAlert
} from '@coreui/react'

import usersData from '../../views/users/UsersData'

const getBadge = status => {
  switch (status) {
    case 'Active': return 'success'
    case 'Inactive': return 'secondary'
    case 'Pending': return 'warning'
    case 'Banned': return 'danger'
    default: return 'primary'
  }
}
const fields = ['name','registered', 'role', 'status'];

// function test() {
//   return (
//   <div className="mt-2">
//     <CAlert color="info" closButton>testing</CAlert>
//   </div>
//   )
// }
// https://coreui.io/react/docs/3.3/components/CDataTable
const Tables = () => {
  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              Organizations
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={usersData}
              fields={fields}
              hover
              striped
              bordered
              size="lg"
              itemsPerPage={25}
              pagination
              scopedSlots = {{
                'status':
                  (item)=>(
                    <td>
                      <CNav variant="pills" >
                        <CNavItem>
                          <CNavLink active>{item.status}</CNavLink>
                        </CNavItem>
                      </CNav>
                      {/* <CBadge color={getBadge(item.status)}>
                        {item.status}
                      </CBadge> */}
                    </td>
                  )
              }}
            />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Tables
