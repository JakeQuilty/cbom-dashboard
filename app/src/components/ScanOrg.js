
import React from 'react'


const ScanOrg = ({onChangeForm, scanOrg }) => {


    return(
        <div class="container">
            <form class="form-horizontal" align="center">
                <div class="form-group" align="center">
                    <label for="inputOrg" class="form-label">GitHub Organization</label>
                    <div class="col-sm-10">
                        <input type="text" onChange={(e) => onChangeForm(e)} class="form-control" id="inputOrg"/>
                    </div>
                </div>
                <div class="form-group" align="center">
                    <label for="inputToken" class="form-label">OAuth Token</label>
                    <div class="col-sm-10">
                        <input type="password" class="form-control" id="inputToken"/>
                    </div>
                </div>
                <p class="text-start">Leaving OAuth Token blank will skip scanning private repositories</p>
                <button type="button" onClick= {(e) => scanOrg()} className="btn btn-primary">Scan</button>
            </form>
        </div>
    )
}

export default ScanOrg