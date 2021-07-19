import React, { useState } from 'react';
import { list } from '../../../api/org';
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

import usersData from '../../../views/users/UsersData'

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


// https://coreui.io/react/docs/3.3/components/CDataTable
const Tables = () => {
    const [data, setData] = useState([]);

    const loadData = () => {
        list()
            .then((json) => {
                console.log(json);
                setData(json);
            })
    }
    loadData();
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
