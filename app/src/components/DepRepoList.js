import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { apiFetchDepRepos } from '../api/dep'
import { updateDepRepos } from '../actions'
import {
    CCard,
    CCardBody,
    CDataTable,
    CPagination,
} from '@coreui/react'

const DepRepoList = ({org, dep, perPage}) => {
    const repos = useSelector(state => dep.repos) || []
    const history = useHistory()
    const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
    const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
    const [page, setPage] = useState(currentPage)
    const [isFetching, setIsFetching] = useState(false)
    const pageChange = newPage => {
        currentPage !== newPage && history.push(`/org/${org.id}/repo/${dep.id}?page=${newPage}`)
    }
    const dispatch = useDispatch()

    const updateDepReposState = (orgID, depID, repos) => {
        dispatch(updateDepRepos({
            orgID: orgID,
            depID: depID,
            repos: repos
        }))
    }
    
    useEffect(() => {
        currentPage !== page && setPage(currentPage)
    }, [currentPage, page])

    useEffect(() => {
        async function fetchRepos() {
            setIsFetching(true)
            let res = await apiFetchDepRepos({orgID: org.id, depName: dep.name})
            setIsFetching(false)

            console.log(res)
            // update  in repo
            updateDepReposState(org.id, dep.id, res.data)
        }
        fetchRepos()
    }, [])

    return (
        <CCard>
            {isFetching ? <CCardBody><h1>Loading...</h1></CCardBody> : 
            <CCardBody>
                <CDataTable
                    items={repos}
                    fields={[
                        { key: 'name', label: 'Repository', _style: { width: '30%' }, _classes: 'text-left' },
                        { key: 'version', _style: { width: '20%' }},
                    ]}
                    hover
                    striped
                    itemsPerPageSelect={{values: [25,50,100]}}
                    itemsPerPage={perPage}
                    activePage={page}
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
            }
        </CCard>
    )
}

export default DepRepoList
