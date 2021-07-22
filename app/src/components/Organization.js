import React, { useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import RepoList from './RepoList'
import { apiScanOrg } from '../api/org'
import {
    CCol,
    CRow,
    CContainer,
    CTabs,
    CNav,
    CNavItem,
    CTabContent,
    CTabPane,
    CNavLink,
    CButton,
    CSpinner,
    CAlert
} from '@coreui/react'

const findOrg = (matchID, orgs) => {
    for (const currOrg of orgs) {
        if (Number(currOrg.id) === Number(matchID))
            return currOrg
    }
    return undefined
}

const Organization = ({match, orgs}) => {
    const [isScanning, setIsScanning] = useState(false)
    const org = findOrg(match.params.id, orgs)

    const scanOrg = async (org) => {
        setIsScanning(true)
        await apiScanOrg({
            name: org.name
        })
        setIsScanning(false)
    }

    return (
        <CContainer>
            <CRow alignHorizontal="left">
                <CCol xs="1" sm="1" md="1" lg="1">
                    <td className="text-center">
                        <div className="c-avatar">
                            <img src={org.avatar} className="c-avatar-img" alt="Unavailable" />
                        </div>
                    </td>
                </CCol>
                <CCol width="12" xs="2" sm="4" md="8" lg="8">
                    <h1>{org.name}</h1>
                </CCol>
                <CCol width="2" xs="2" sm="2" md="2" lg="2">
                    {isScanning ? <CSpinner color="info" size="lg"/> : <CButton color= "info" size="lg" className="h3" onClick={()=> scanOrg(org)}>Scan</CButton>}
                </CCol>
            </CRow>
            <CRow alignHorizontal="center">{isScanning && <CAlert color="info" closeButton>Scanning {org.name}! This might take a bit...</CAlert>}</CRow>
            <CRow alignHorizontal="center">
                <CCol lg={12} xl={6}>
                    <CTabs activeTab="repos">
                        <CNav variant="tabs">
                            <CNavItem>
                                <CNavLink data-tab="repos">
                                    Repos ({org.numRepos})
                                </CNavLink>
                            </CNavItem>
                            <CNavItem>
                                <CNavLink data-tab="dependencies">
                                    Dependencies ({org.numDeps})
                                </CNavLink>
                            </CNavItem>
                        </CNav>
                        <CTabContent>
                            <CTabPane data-tab="repos">
                                <RepoList org={org} isScanning={isScanning} perPage={50}/>
                            </CTabPane>
                            <CTabPane data-tab="dependencies">
                                <RepoList org={org} perPage={50}/>
                            </CTabPane>
                        </CTabContent>
                    </CTabs>
                </CCol>
            </CRow>
        </CContainer>
    )
}

function mapStateToProps(state) {
    return {
        orgs: state.orgList
    }
}

export default connect(
    mapStateToProps,
    )(Organization)