import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addOrgToList } from '../actions'
import { add } from '../api/org'
import {
    CContainer,
    CCol,
    CRow,
    CForm,
    CFormGroup,
    CLabel,
    CInput,
    CButton,
    CCard,
    CCardBody,
    CSpinner
} from '@coreui/react'

const AddOrg = () => {
    const [orgName, setOrg] = useState('')
    const [oauthToken, setToken] = useState('')
    const [waiting, setWaiting] = useState(false)
    const dispatch = useDispatch()

    const notification = (response) => {
        let message = ""
        if (response.status === 200) {
            message = response.data.name + " added succesfully!";
        } else {
            message = "Error: " + response.data.error
        }
        alert(message)
    }

    const updateOrgList = (res) => {
        if (res.status === 200) {
            if (res.data.numRepos === null) res.data.numRepos = '-';
            if (res.data.numDeps === null) res.data.numDeps = '-'
            // base64 decode
            res.data.avatar = atob(res.data.avatar)
            dispatch(addOrgToList({
                id: res.data.id,
                name: res.data.name,
                numRepos: res.data.numRepos,
                numDeps: res.data.numDeps,
                avatar: res.data.avatar,
                repos: []
            }))
        }
    }

    async function onSubmit(e) {
        e.preventDefault()

        if (!orgName || !oauthToken) {
            alert('Organization or OAuth Token is empty')
            return
        }

        setWaiting(true)
        let res = await add({name: orgName, authToken: oauthToken})
        setWaiting(false)

        notification(res)
        updateOrgList(res)

        setOrg('')
        setToken('')
    }

    return (
        <>
            <CContainer>
                <CRow alignHorizontal="center">
                    <CCol sm="8">
                        <CCard>
                            <CCardBody>
                                    <CForm onSubmit={onSubmit} action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                        <CFormGroup>
                                        <CLabel htmlFor="text-input">Organization</CLabel>
                                        <CInput
                                            id="text-input"
                                            name="organization-input"
                                            placeholder="GitHub Organization"
                                            value={orgName}
                                            onChange={(e) => {
                                                setOrg(e.target.value);
                                            }}
                                        />
                                        <CLabel htmlFor="password-input">OAuth Token</CLabel>
                                        <CInput
                                            type="password"
                                            id="password-input"
                                            name="oauthtoken-input"
                                            placeholder="GitHub OAuth Token"
                                            value={oauthToken}
                                            onChange={(e) => {
                                                setToken(e.target.value);
                                            }}
                                        />
                                        </CFormGroup>
                                        <CRow alignHorizontal="center">
                                            {waiting ? <CSpinner color="info" size="sm" /> : <CButton type="submit" color="info" size="lg" className="m-2">Add</CButton>}
                                        </CRow>
                                    </CForm>
                                </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CContainer>
        </>
    )
}

export default AddOrg;