import CIcon from '@coreui/icons-react'
import { connect, useDispatch } from 'react-redux'
import RepoList from './RepoList'
import {
    CCol,
    CRow,
    CContainer,
    CTabs,
    CNav,
    CNavItem,
    CTabContent,
    CTabPane,
    CNavLink
} from '@coreui/react'

const findOrg = (matchID, orgs) => {
    for (const currOrg of orgs) {
        if (Number(currOrg.id) === Number(matchID))
            return currOrg
    }
    return undefined
}

const Organization = ({match, orgs}) => {
    const org = findOrg(match.params.id, orgs)
    const repos = org ? Object.entries(org.repos) : 
      [['id', (<span><CIcon className="text-muted" name="cui-icon-ban" /> Not found</span>)]]

    const dispatch = useDispatch()
  
    // need a RepoList and a DependencyList components
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
            </CRow>
            <CRow alignHorizontal="center">
                <CCol lg={12} xl={6}>
                    <CTabs activeTab="repos">
                        <CNav variant="tabs">
                            <CNavItem>
                                <CNavLink data-tab="repos">
                                    Repos
                                </CNavLink>
                            </CNavItem>
                            <CNavItem>
                                <CNavLink data-tab="dependencies">
                                    Dependencies
                                </CNavLink>
                            </CNavItem>
                        </CNav>
                        <CTabContent>
                            <CTabPane data-tab="repos">
                                <RepoList org={org} repos={repos} perPage={50}/>
                            </CTabPane>
                            <CTabPane data-tab="dependencies">
                                <RepoList org={org} repos={repos} perPage={50}/>
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