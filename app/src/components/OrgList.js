import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addOrgToList } from '../actions'
import { apiFetchOrgs } from '../api/org'
import { connect } from 'react-redux'
import {
    CCard,
    CCardBody,
    CDataTable,
    CPagination,
} from '@coreui/react'

const OrgList = ({list, perPage}) => {
    const history = useHistory()
    const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
    const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
    const [page, setPage] = useState(currentPage)
    const [isFetching, setIsFetching] = useState(false)
    const dispatch = useDispatch()

    const pageChange = newPage => {
        currentPage !== newPage && history.push(`/orgs/list?page=${newPage}`)
    }

    const UpdateOrgList = (res) => {
        if (res.status !== 200) {
            return
        }
        
        for (const org of res.data) {
            if (org.numRepos === null) org.numRepos = '-';
            if (org.numDeps === null) org.numDeps = '-'
            // base64 decode
            org.avatar = atob(org.avatar)
            // check for id in orgList
            console.log('addOrg: ', org)
            dispatch(addOrgToList({
                id: org.id,
                name: org.name,
                numRepos: org.numRepos,
                numDeps: org.numDeps,
                avatar: org.avatar,
                repos: []
            }))
        }
    }
    
    useEffect(() => {
        currentPage !== page && setPage(currentPage)
    }, [currentPage, page])

    useEffect(() => {
        async function loadData() {
            setIsFetching(true)
            let res = await apiFetchOrgs()
            setIsFetching(false)

            UpdateOrgList(res)
        }
        loadData()
    }, [])


    return (
        <CCard>
            {isFetching ? <h1>Loading...</h1> : 
            <CCardBody>
            <CDataTable
                items={list}
                fields={[
                    { key: 'avatar', label: '', sorter: false, filter: false, _style: { width: '1%' }},
                    { key: 'name', _style: { width: '40%' }, _classes: 'text-left'},
                    { key: 'numRepos', label: 'Repos', _style: { width: '25%' }},
                    { key: 'numDeps', label: 'Dependencies', _style: { width: '25%' }}
                ]}
                hover
                striped
                itemsPerPage={perPage}
                activePage={page}
                clickableRows
                onRowClick={(item) => history.push(`/org/${item.id}`)}
                sorter
                tableFilter
                scopedSlots = {
                    {
                        'avatar':
                        (item)=> (
                            <td className="text-center">
                            <div className="c-avatar">
                                <img src={item.avatar} className="c-avatar-img" alt="Unavailable" />
                            </div>
                            </td>
                        )
                    }
                    }
                />
                <CPagination
                activePage={page}
                onActivePageChange={pageChange}
                pages={Math.floor(list.length/perPage)+1}
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
        list: state.orgList
    }
}

// function mapDispatchToProps(dispatch) {
//     return dispatch
// }

export default connect(
                mapStateToProps,
                // mapDispatchToProps
                )(OrgList)
