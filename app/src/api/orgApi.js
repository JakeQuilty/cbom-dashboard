export async function getAllOrgs() {

    const response = await fetch('/api/org/list');
    return await response.json();
}

export async function addOrg(data) {
    console.log("DATA: ", data); //////////////
    const response = await fetch(`/api/org/new`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })
    return await response.json();
}

export async function scanOrg(data) {
    console.log("DATA: ", data); //////////////
    const response = await fetch(`/api/org/scan`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })
    return await response.json();
}



// ADD AN IF BAD RESPONSE alert('ERROR');