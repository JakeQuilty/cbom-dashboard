
import React from 'react'


const AddOrg = ({onChangeForm, addOrg }) => {


    return(
        <div className="container">
            <form className="form-horizontal" align="center">
                <div className="form-group" align="center">
                    <label htmlFor="inputOrg" className="form-label">GitHub Organization</label>
                    <div className="col-sm-10">
                        <input type="text" onChange={(e) => onChangeForm(e)} className="form-control" name="inputOrg" id="inputOrg"/>
                    </div>
                </div>
                <div className="form-group" align="center">
                    <label htmlFor="inputToken" className="form-label">OAuth Token</label>
                    <div className="col-sm-10">
                        <input type="password" onChange={(e) => onChangeForm(e)} className="form-control" name="inputToken" id="inputToken"/>
                    </div>
                </div>
                <button type="button" onClick= {(e) => addOrg()} className="btn btn-primary">Add</button>
            </form>
        </div>
    )
}

export default AddOrg