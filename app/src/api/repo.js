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
            });
        return {data: await response.json(), status: response.status};
    } catch (error) {
        return {data: {error: "No response from server"}, status: 500}
    }
}

export async function apiFetchRepos(data) {
    let response =  await postReq('/api/repo/list', data);
    return response
}

export async function apiFetchRepoDeps(data) {
    let response = await postReq('/api/repo/list/deps', data);
    return response
}