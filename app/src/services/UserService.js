export async function getAllUsers() {

    const response = await fetch('/api/users');
    return await response.json();
}

export async function scanOrg(data) {
    const response = await fetch(`/api/scan`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({org: data})
      })
    return await response.json();
}