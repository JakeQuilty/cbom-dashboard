import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { connect, useDispatch, useSelector } from 'react-redux'
import { apiFetchRepoDeps } from '../api/repo'
import { updateRepoDeps } from '../actions'
import {
    CCard,
    CCardBody,
    CDataTable,
    CPagination,
    CButton,
    CCollapse
} from '@coreui/react'

const RepoDepList = ({org, repo, perPage}) => {
    const deps = useSelector(state => repo.deps) || []
    const history = useHistory()
    const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
    const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
    const [page, setPage] = useState(currentPage)
    const [isFetching, setIsFetching] = useState(false)
    const pageChange = newPage => {
        currentPage !== newPage && history.push(`/org/${org.id}/repo/${repo.id}?page=${newPage}`)
    }
    const dispatch = useDispatch()
    const [details, setDetails] = useState([])

    const toggleDetails = (index) => {
        const position = details.indexOf(index)
        let newDetails = details.slice()
        if (position !== -1) {
          newDetails.splice(position, 1)
        } else {
          newDetails = [...details, index]
        }
        setDetails(newDetails)
      }

    const updateRepoDepState = (orgID, repoID, deps) => {
        // decode filepaths
        for (const dep of deps) {
            dep.path = atob(dep.path)
        }

        dispatch(updateRepoDeps({
            orgID: orgID,
            repoID: repoID,
            deps: deps
        }))
    }
    
    useEffect(() => {
        currentPage !== page && setPage(currentPage)
    }, [currentPage, page])

    useEffect(() => {
        async function fetchRepos() {
            setIsFetching(true)
            let res = await apiFetchRepoDeps({repoID: repo.id})
            setIsFetching(false)

            console.log(res);

            // update deps in repo
            updateRepoDepState(org.id, repo.id, res.data)
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
                        { key: 'name', _style: { width: '30%' }, _classes: 'text-left' },
                        { key: 'version', _style: { width: '20%' }},
                        {
                            key: 'show_details',
                            label: '',
                            _style: { width: '1%' },
                            sorter: false,
                            filter: false
                          }
                    ]}
                    scopedSlots={{
                        'show_details':
                            (item, index)=>{
                                return (
                                <td className="py-2">
                                    <CButton
                                    color="primary"
                                    variant="outline"
                                    shape="square"
                                    size="sm"
                                    onClick={()=>{toggleDetails(index)}}
                                    >
                                    {details.includes(index) ? 'Hide' : 'Show'}
                                    </CButton>
                                </td>
                                )
                            },
                        'details':
                            (item, index)=>{
                            return (
                            <CCollapse show={details.includes(index)}>
                                <CCardBody>
                                <h4>
                                    {item.name}
                                </h4>
                                <p className="text-muted">Dependency File: {item.path}</p>
                                </CCardBody>
                            </CCollapse>
                            )
                        }
                    }}
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
                    pages={Math.floor(deps.length/perPage)+1}
                    doubleArrows={false} 
                    align="center"
                    />
                </CCardBody>
            }
        </CCard>
    )
}

export default RepoDepList
