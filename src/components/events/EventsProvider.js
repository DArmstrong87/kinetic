export const getEvents = () => {
    return fetch("http://localhost:8000/events", {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        }
    })
        .then(res => res.json())
}

export const getEvent = (id) => {
    return fetch(`http://localhost:8000/events/${id}`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        }
    })
        .then(res => res.json())
}

export const getAthleteEvent = (id) => {
    return fetch(`http://localhost:8000/athleteevents/${id}`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        }
    })
        .then(res => res.json())
}

export const signUp = (id) => {
    return fetch(`http://localhost:8000/events/${id}/signup`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        },
        method: "POST"
    })
        .then(res => res.json())
}

export const leaveEvent = (id) => {
    return fetch(`http://localhost:8000/events/${id}/signup`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        },
        method: "DELETE"
    })
        .then(res => res.json())
}

export const getSports = () => {
    return fetch(`http://localhost:8000/sports`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        }
    })
        .then(res => res.json())

}

export const createEvent = (event) => {
    return fetch(`http://localhost:8000/events`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        method: "POST",
        body: JSON.stringify(event)
    })
}

export const createEventSport = (es) => {
    return fetch(`http://localhost:8000/eventsports`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        method: "POST",
        body: JSON.stringify(es)
    })
        .then(res => res.json())
}

export const statesList = () => {
    return ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'];
}

export const monthsList = () => {
    return [
        {num: 1, name:'January'},
        {num: 2, name:'February'},
        {num: 3, name:'March'},
        {num: 4, name:'April'},
        {num: 5, name:'May'},
        {num: 6, name:'June'},
        {num: 7, name:'July'},
        {num: 8, name:'August'},
        {num: 9, name:'September'},
        {num: 10, name:'October'},
        {num: 11, name:'November'},
        {num: 12, name:'December'}
]
}

export const searchEvents = (q, term) => {
    return fetch(`http://localhost:8000/events?${q}=${term}`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        }
    })
        .then(res => res.json())
}

