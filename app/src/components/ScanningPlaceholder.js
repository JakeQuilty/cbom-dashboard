import React from 'react'
import {
    CCol,
    CRow,
    CContainer,
    CButton,
    CSpinner,
    CAlert
} from '@coreui/react'

// theres gotta be a less gross way to make that vertical spacing happen
const ScanningPlaceholder = () => {
    return (
        <CContainer>
            <CRow><h1> </h1></CRow>
            <CRow><h1> </h1></CRow>
            <CRow><h1> </h1></CRow>
            <CRow><h1> </h1></CRow>
            <CRow><h1> </h1></CRow>
            <CRow><h1> </h1></CRow>
            <CRow><h1> </h1></CRow>
            <CRow><h1> </h1></CRow>
            <CRow alignHorizontal="center" alignVertical="center">
                <h1>Scanning...</h1>
            </CRow>
            <CRow alignHorizontal="center" alignVertical="center">
                <CSpinner color="info" size="lg"/>
            </CRow>
        </CContainer>
        
    )
}

export default ScanningPlaceholder
