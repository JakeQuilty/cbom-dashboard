import { connect, useDispatch, useSelector } from 'react-redux'
import RepoDepTabs from './RepoDepTabs'
import ScanningPlaceholder from './ScanningPlaceholder'
import { apiScanOrg } from '../api/org'
import { isScanningToggle } from '../actions'
import {
    CCol,
    CRow,
    CContainer,
    CButton,
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
    const org = findOrg(match.params.id, orgs) || {}

    // if org === undefined, kick back to orgs list to avoid errors??

    const dispatch = useDispatch()
    const isScanning = useSelector(state => org.isScanning)

    const scanOrg = async (org) => {
        dispatch(isScanningToggle({id: org.id, isScanning: true}))
        await apiScanOrg({
            name: org.name
        })
        dispatch(isScanningToggle({id: org.id, isScanning: false}))
    }

    return (
        <CContainer>
            <CRow alignHorizontal="left">
                <CCol xs="1" sm="1" md="1" lg="1">
                    <div className="c-avatar-lg">
                        <img src={org.avatar} className="c-avatar-img" alt="Unavailable" />
                    </div>
                </CCol>
                <CCol width="12" xs="2" sm="4" md="8" lg="8">
                    <h1>{org.name}</h1>
                </CCol>
                <CCol width="2" xs="2" sm="2" md="2" lg="2">
                    {!isScanning && <CButton color= "info" size="lg" className="h3" onClick={()=> scanOrg(org)}>Scan</CButton>}
                </CCol>
            </CRow>
            <CRow alignHorizontal="center">{isScanning && <CAlert color="info" closeButton>Scanning {org.name}! This might take a bit...</CAlert>}</CRow>
            <CRow alignHorizontal="center">
                <CCol lg='12'>
                    {isScanning ? <ScanningPlaceholder /> : <RepoDepTabs org={org} />}
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