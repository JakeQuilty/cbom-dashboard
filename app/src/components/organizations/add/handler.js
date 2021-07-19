import { add } from '../../../api/org';
import OrganizationsData from '../OrganizationsData';

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
    if (response.status === 200) {
        OrganizationsData.push({id: response.id, name: response.name})
    }
}