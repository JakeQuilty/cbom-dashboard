import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { connect, useDispatch, useSelector } from 'react-redux'
import { apiFetchRepos } from '../api/repo'
import { updateRepos, updateNumRepos } from '../actions'
import {
    CCard,
    CCardBody,
    CDataTable,
    CPagination,
} from '@coreui/react'

const RepoList = ({org, perPage}) => {
    const repos = useSelector(state => org.repos) || []
    const history = useHistory()
    const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
    const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
    const [page, setPage] = useState(currentPage)
    const [isFetching, setIsFetching] = useState(false)
    const pageChange = newPage => {
        currentPage !== newPage && history.push(`/org/${org.id}?page=${newPage}`)
    }
    const dispatch = useDispatch()

    const updateRepoList = async (res) => {
        if (res.status !== 200) {
            return
        }
        dispatch(updateRepos({
            id: org.id,
            repos: res.data.repos
        }))
        dispatch(updateNumRepos({
            id: org.id,
            numRepos: res.data.numRepos
        }))
    }
    
    useEffect(() => {
        currentPage !== page && setPage(currentPage)
    }, [currentPage, page])

    useEffect(() => {
        async function fetchRepos() {
            setIsFetching(true)
            let res = await apiFetchRepos({orgID: org.id})
            setIsFetching(false)

            updateRepoList(res)
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
                        { key: 'name', _style: { width: '40%' }, _classes: 'text-left'},
                        { key: 'numDeps', label: 'Dependencies', _style: { width: '25%' }}
                    ]}
                    hover
                    striped
                    itemsPerPageSelect={{values: [25,50,100]}}
                    itemsPerPage={perPage}
                    activePage={page}
                    clickableRows
                    onRowClick={(item) => history.push(`/org/${org.id}/repo/${item.id}`)}
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

function mapStateToProps(state) {
    return {
        repos: state.orgList
    }
}


export default connect(mapStateToProps)(RepoList)
