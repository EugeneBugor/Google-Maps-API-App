export default {
    __isLoggedIn: false,

    __userData: {
        username: '',
        markers: []
    },

    authorize(username, password) {
        return fetch('http://localhost:8090/auth', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    window.localStorage.token = response.token

                    this.__isLoggedIn = true
                    this.__userData.username = response.userData.username
                    this.__userData.markers = response.userData.markers

                    return Promise.resolve() //eslint-disable-line no-undef
                } else if (!response.success) {
                    this.__isLoggedIn = false
                    return Promise.reject(response)//eslint-disable-line no-undef
                }
            })
    },

    isLoggedIn(callback) {
        fetch('http://localhost:8090/user', {
            method: 'GET',
            headers: {'x-access-token': window.localStorage.token}
        })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    this.__isLoggedIn = true
                    this.__userData.username = response.userData.username
                    this.__userData.markers = response.userData.markers

                    return response
                } else if (!response.success) {
                    this.__isLoggedIn = false
                    return response
                }
            })
            .then(() => {
                if (callback) callback()
            })
    },
}
