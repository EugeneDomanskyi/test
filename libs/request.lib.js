const DEFAULT_HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
}

// const URL = 'http://localhost:8080/v2'
const URL = 'https://api.testnet.tegro.com/v2'

const queryBuilder = (data) => {
    const params = new URLSearchParams()
    for (const key in data) {
        if (data[key] != null) {
            if (typeof data[key] == 'object') {
                for (const value of data[key]) {
                    params.append(key, value)
                }
            } else {
                params.append(key, data[key])
            }
        }
    }

    for (const key of params.keys()) {
        if (params.has(key)) {
            return `?${params}`
        }
    }

    return ''
}

const request = {
    POST: async (url, data) => {
        const res = await fetch(
            `${URL}/${url}`,
            {
                headers: DEFAULT_HEADERS,
                method: 'POST',
                body: JSON.stringify(data),
            }
        )
        if (res.ok) {
            return await res.json()
        }
        return {error: "Something went wrong"}
    },
    GET: async (url, data) => {
        const res = await fetch(
            `${URL}/${url}${queryBuilder(data)}`,
            {
                headers: DEFAULT_HEADERS,
                method: 'GET',
            }
        )
        if (res.ok) {
            return await res.json()
        }
        return {error: "Something went wrong"}
    }
}

export default request
