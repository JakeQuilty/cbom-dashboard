import React, { useState } from 'react';
import { add } from '../../../api/org';
import { useSelector, useDispatch } from 'react-redux'
import { addToOrgList } from '../../../features/orgsSlice';

export function addOrg(data) {
    add(data).then( res => {
        updateOrgList(res);
        notification(res);
    })
}

const notification = (response) => {
    let message = ""
    if (response.status === 200) {
        message = response.name + " added succesfully!";
    } else {
        message = "Error: " + response.error;
    }
    alert(message);
}

const updateOrgList = (response) => {
    const orgs = useSelector((state) => state.orgs.value)
    if (response.status === 200) {
        dispatch()
    }
}