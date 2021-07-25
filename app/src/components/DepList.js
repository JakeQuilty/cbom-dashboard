import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { apiFetchDeps } from '../api/dep'
import { updateDeps, updateNumDeps } from '../actions'
import {
    CCard,
    CCardBody,
    CDataTable,
    CPagination,
} from '@coreui/react'

const DepList = ({org, perPage}) => {
    const deps = useSelector(state => org.deps) || []
    const history = useHistory()
    const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
    const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
    const [page, setPage] = useState(currentPage)
    const [isFetching, setIsFetching] = useState(false)
    const pageChange = newPage => {
        currentPage !== newPage && history.push(`/org/${org.id}?page=${newPage}`)
    }
    const dispatch = useDispatch()

    const updateDepList = async (res) => {
        if (res.status !== 200) {
            return
        }
        dispatch(updateDeps({
            id: org.id,
            deps: res.data.deps
        }))
        dispatch(updateNumDeps({
            id: org.id,
            numDeps: res.data.numDeps
        }))
    }
    
    useEffect(() => {
        currentPage !== page && setPage(currentPage)
    }, [currentPage, page])

    useEffect(() => {
        async function fetchRepos() {
            setIsFetching(true)
            let res = await apiFetchDeps({orgID: org.id})
            setIsFetching(false)

            updateDepList(res)
        }
        fetchRepos()
    }, [])

    return (
        <CCard>
            {isFetching ? <CCardBody><h1>Loading...</h1></CCardBody> : 
            <CCardBody>
                <CDataTable
                    items={deps}
                    fields={[
                        { key: 'name', _style: { width: '40%' }, _classes: 'text-left'},
                        { key: 'numRepos', label: 'Repositories', _style: { width: '25%' }}
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
                    pages={Math.floor(deps.length/perPage)+1}
                    doubleArrows={false} 
                    align="center"
                    />
                </CCardBody>
            }
        </CCard>
    )
}

export default DepList
