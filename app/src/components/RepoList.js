import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import {
    CCard,
    CCardHeader,
    CCardBody,
    CDataTable,
    CPagination
} from '@coreui/react'

const getReposFromProp = (repos) => {
    let fixedRepos = []
    for (const repo of repos) {
        fixedRepos.push(repo[1])
    }
    return fixedRepos
}

const RepoList = ({org, repos, perPage}) => {
    // need to take of preappened index in array
    repos = getReposFromProp(repos)

    const history = useHistory()
    const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
    const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
    const [page, setPage] = useState(currentPage)

    const pageChange = newPage => {
        currentPage !== newPage && history.push(`/orgs/list?page=${newPage}`)
    }
    
    useEffect(() => {
        currentPage !== page && setPage(currentPage)
    }, [currentPage, page])

    return (
        <CCard>
            <CCardBody>
                <CDataTable
                    items={repos}
                    fields={[
                        { key: 'name', _style: { width: '40%' }, _classes: 'text-left'},
                        { key: 'numDeps', label: 'Dependencies', _style: { width: '25%' }}
                    ]}
                    hover
                    striped
                    itemsPerPage={perPage}
                    activePage={page}
                    clickableRows
                    onRowClick={(item) => history.push(`/orgs/${item.id}`)}
                    sorter
                    tableFilter
                    />
                    <CPagination
                    activePage={page}
                    onActivePageChange={pageChange}
                    pages={Math.floor(repos.length/perPage)+1}
                    doubleArrows={false} 
                    align="center"
                    />
                </CCardBody>
        </CCard>
    )
}

export default RepoList
