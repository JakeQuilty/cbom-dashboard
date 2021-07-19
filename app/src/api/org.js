import user from '../auth/CurrentUser';

// bad
async function addUserToReq(data) {
    data.userID = user.id
    return data
}

async function postReq(path, data) {
    data = await addUserToReq(data);
    try {
        const response = await fetch(path, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
            })
        return await response.json();
    } catch (error) {
        return {status: 500, error: error};
    } 
}

export async function add(data) {
    return await postReq('/api/org/new', data);
}

export async function list() {
    return await postReq('/api/org/list', {});
}