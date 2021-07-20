import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom'
import AddOrg from './AddOrg'
import {
  CContainer,
  CCol,
  CRow,
  CForm,
  CFormGroup,
  CLabel,
  CInput,
  CButton,
  CCard,
  CCardBody,
  CBadge,
  CCardHeader,
  CDataTable,
  CPagination,
  CAlert
} from '@coreui/react'
import orgsSlice from '../features/orgsSlice';

const PER_PAGE = 25

const getBadge = status => {
  switch (status) {
    case 'Active': return 'success'
    case 'Inactive': return 'secondary'
    case 'Pending': return 'warning'
    case 'Banned': return 'danger'
    default: return 'primary'
  }
}

// https://coreui.io/react/docs/3.3/components/CDataTable
const Organizations = () => {
  const history = useHistory()
  const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  const [page, setPage] = useState(currentPage)
  const [showAdd, setShowAdd] = useState(false)
  const [orgList, setOrgList] = useState([
    {
        id: 5,
        name: 'Protonmail',
        numRepos: 154,
        numDeps: 81354,
        avatar: 'https://avatars.githubusercontent.com/u/6953970?s=200&v=4'
    },
    {
        id: 2,
        name: 'SignalApp',
        numRepos: 93,
        numDeps: 21354,
        avatar: 'https://avatars.githubusercontent.com/u/702459?s=200&v=4'
    },
    {
        id: 3,
        name: 'DuckDuckGo',
        numRepos: 89,
        numDeps: 3541,
        avatar: 'https://avatars.githubusercontent.com/u/342708?s=200&v=4'
    },
    {
      id: 4,
      name: 'TorProject',
      numRepos: '-',
      numDeps: '-',
      avatar: 'https://avatars.githubusercontent.com/u/4099049?s=200&v=4'
  }
  ])

  const addOrg = (org) => {
    if (org.numRepos === undefined) org.numRepos = '-';
    if (org.numDeps === undefined) org.numDeps = '-'
    // base64 decode
    org.avatar = atob(org.avatar)
    // check for id in orgList
    console.log('addOrg: ', org)
    setOrgList([...orgList, org])
  }

  const pageChange = newPage => {
    currentPage !== newPage && history.push(`/orgs/list?page=${newPage}`)
  }

  useEffect(() => {
    currentPage !== page && setPage(currentPage)
  }, [currentPage, page])

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
          {showAdd && <AddOrg onAdd={addOrg}/>}
      </CRow>
      <CRow>
        <CCol xl={6}>
          <CCard>
            <CCardBody>
            <CDataTable
              items={orgList}
              fields={[
                { key: 'avatar', label: '', sorter: false, filter: false, _style: { width: '1%' }},
                { key: 'name', _style: { width: '40%' }, _classes: 'text-left'},
                { key: 'numRepos', label: 'Repos', _style: { width: '25%' }},
                { key: 'numDeps', label: 'Dependencies', _style: { width: '25%' }}
              ]}
              hover
              striped
              itemsPerPage={PER_PAGE}
              activePage={page}
              clickableRows
              onRowClick={(item) => history.push(`/users/${item.id}`)}
              sorter
              tableFilter
              scopedSlots = {{
                'avatar':
                  (item)=> (
                    <td className="text-center">
                      <div className="c-avatar">
                        <img src={item.avatar} className="c-avatar-img" alt="Unavailable" />
                      </div>
                    </td>
                  )
              }}
            />
            <CPagination
              activePage={page}
              onActivePageChange={pageChange}
              pages={Math.floor(orgList.length/PER_PAGE)+1}
              doubleArrows={false} 
              align="center"
            />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
  )
}
export default Organizations
