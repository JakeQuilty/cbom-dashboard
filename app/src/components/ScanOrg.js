
import React from 'react'


const ScanOrg = ({onChangeForm, scanOrg }) => {


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
                <p className="text-start">Leaving OAuth Token blank will skip scanning private repositories</p>
                <button type="button" onClick= {(e) => scanOrg()} className="btn btn-primary">Scan</button>
            </form>
        </div>
    )
}

export default ScanOrg