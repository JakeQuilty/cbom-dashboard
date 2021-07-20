import React, { useState } from 'react'
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
} from '@coreui/react'

const AddOrg = ({ onAdd }) => {
    const [orgName, setOrg] = useState('')
    const [oauthToken, setToken] = useState('')

    async function onSubmit(e) {
        e.preventDefault()

        if (!orgName || !oauthToken) {
            alert('Organization or OAuth Token is empty')
            return
        }

        let res = await add({name: orgName, authToken: oauthToken})
            console.log('RESPONSE')
            console.log(res)//////////
            console.log(res.status)
            console.log(res.data.name)
            notification(res)
            if (res.status === 200) {
                onAdd({
                    id: res.data.id,
                    name: res.data.name,
                    numRepos: res.data.numRepos,
                    numDeps: res.data.numDeps,
                    avatar: res.data.avatar
                })
            }

        setOrg('')
        setToken('')
    }

    const notification = (response) => {
        console.log('RESPONSE')
        console.log(response)//////////
        let message = ""
        if (response.status === 200) {
            message = response.name + " added succesfully!";
        } else {
            message = "Error: " + response.error
        }
        // alert(message)
        alert(response)
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
                                            <CButton type="submit" color="info" size="lg" className="m-2">Add</CButton>
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