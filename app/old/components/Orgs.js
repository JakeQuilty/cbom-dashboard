import React from 'react'

export const Orgs = ({orgs}) => {

    console.log('orgs length:::', orgs.length)
    if (orgs.length === 0) return null

    const UserRow = (user,index) => {

        return(
              <tr key = {index} className={index%2 === 0?'odd':'even'}>
                  <td>{index + 1}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
              </tr>
          )
    }

    const userTable = orgs.map((user,index) => UserRow(user,index))

    return(
        <div className="container">
            <h2>Orgs</h2>
            <table className="table table-bordered">
                <thead>
                <tr>
                    <th>User Id</th>
                    <th>Firstname</th>
                    <th>Lastname</th>
                    <th>Email</th>
                </tr>
                </thead>
                <tbody>
                    {userTable}
                </tbody>
            </table>
        </div>
    )
}