import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import {
    CCard,
    CCardBody,
    CDataTable,
    CPagination
} from '@coreui/react'

const OrgList = ({list, perPage}) => {
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
              onRowClick={(item) => history.push(`/orgs/${item.id}`)}
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
