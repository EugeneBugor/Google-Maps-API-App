export default {
    update(username, markers) {

        return fetch('http://localhost:8090/map', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                markers: markers,
                username: username
            })

        })
            .then(res => res.json())
            .then(response => {
                return Promise.resolve(response)
            })
    }
}
