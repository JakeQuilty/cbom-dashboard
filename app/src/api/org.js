import user from '../auth/CurrentUser';

// bad
async function addUserToReq(data) {
    data.userID = user.id
    return data
}

async function postReq(path, data) {
    data = await addUserToReq(data);
    const response = await fetch(path, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
        });
    return {data: await response.json(), status: response.status};
}

export async function add(data) {
    let response =  await postReq('/api/org/new', data);
    return response
}

export async function list() {
    return await postReq('/api/org/list', {});
}