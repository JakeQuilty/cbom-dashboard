import React from 'react'
import RepoList from './RepoList'
import DepList from './DepList'
import { useSelector } from 'react-redux'
import {
    CTabs,
    CNav,
    CNavItem,
    CTabContent,
    CTabPane,
    CNavLink,
} from '@coreui/react'

const RepoDepTabs = ({ org }) => {
    const numRepos = useSelector(state => org.numRepos)
    const numDeps = useSelector(state => org.numDeps)

    return (
        <CTabs activeTab="repos">
            <CNav variant="tabs">
                <CNavItem>
                    <CNavLink data-tab="repos">
                        Repos ({numRepos})
                    </CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink data-tab="dependencies">
                        Dependencies ({numDeps})
                    </CNavLink>
                </CNavItem>
            </CNav>
            <CTabContent>
                <CTabPane data-tab="repos">
                    <RepoList org={org} perPage={50}/>
                </CTabPane>
                <CTabPane data-tab="dependencies">
                    <DepList org={org} perPage={50}/>
                </CTabPane>
            </CTabContent>
        </CTabs>
    )
}

export default RepoDepTabs
