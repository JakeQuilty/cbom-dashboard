import React, { useState } from 'react'
import { connect } from 'react-redux'
import DepRepoList from './DepRepoList'
import {
    CCol,
    CRow,
    CContainer,
} from '@coreui/react'

const findOrg = (matchID, orgs) => {
    for (const currOrg of orgs) {
        if (Number(currOrg.id) === Number(matchID))
            return currOrg
    }
    return undefined
}

const findDep = (depID, org) => {
    for (const dep of org.deps) {
        if (Number(dep.id) === Number(depID))
            return dep
    }
    return undefined
}

const Dependency = ({match, orgs}) => {
    const org = findOrg(match.params.orgid, orgs)
    const dep = findDep(match.params.depid, org)

    return (
        <CContainer>
            <CRow alignHorizontal="left">
                <CCol xs="1" sm="1" md="1" lg="1">
                    <div className="c-avatar-lg">
                        <img src={org.avatar} className="c-avatar-img" alt="Unavailable" />
                    </div>
                </CCol>
                <CCol width="12" xs="2" sm="4" md="8" lg="8">
                    <h2>{org.name}/{dep.name}</h2>
                </CCol>
            </CRow>
            <CRow alignHorizontal="center">
                <CCol lg='12'>
                    {<DepRepoList org={org} dep={dep} perPage={50}/>}
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
    )(Dependency)
