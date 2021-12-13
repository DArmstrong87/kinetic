export const getEvents = () => {
    return fetch("https://kinetic--server.herokuapp.com/events", {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        }
    })
        .then(res => res.json())
}

export const getEvent = (id) => {
    return fetch(`https://kinetic--server.herokuapp.com/events/${id}`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        }
    })
        .then(res => res.json())
}

export const getAthleteEvent = (id) => {
    return fetch(`https://kinetic--server.herokuapp.com/athleteevents/${id}`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        }
    })
        .then(res => res.json())
}

export const signUp = (id) => {
    return fetch(`https://kinetic--server.herokuapp.com/events/${id}/signup`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        },
        method: "POST"
    })
}

export const leaveEvent = (id) => {
    return fetch(`https://kinetic--server.herokuapp.com/events/${id}/signup`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        },
        method: "DELETE"
    })
}

export const getSports = () => {
    return fetch(`https://kinetic--server.herokuapp.com/sports`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        }
    })
        .then(res => res.json())

}

export const createEvent = (event) => {
    return fetch(`https://kinetic--server.herokuapp.com/events`, {
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
    return fetch(`https://kinetic--server.herokuapp.com/eventsports`, {
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

export const updateEvent = (event) => {
    return fetch(`https://kinetic--server.herokuapp.com/events/${event.id}`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        method: "PUT",
        body: JSON.stringify(event)
    })
}

export const updateEventSport = (es) => {
    return fetch(`https://kinetic--server.herokuapp.com/eventsports/${es.id}`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        method: "PUT",
        body: JSON.stringify(es)
    })
        .then(res => res.json())
}

export const deleteEventSport = (id) => {
    return fetch(`https://kinetic--server.herokuapp.com/eventsports/${id}`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        },
        method: "DELETE"
    })
}

export const statesList = () => {
    return ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'];
}

export const monthsList = () => {
    return [
        { num: 1, name: 'January' },
        { num: 2, name: 'February' },
        { num: 3, name: 'March' },
        { num: 4, name: 'April' },
        { num: 5, name: 'May' },
        { num: 6, name: 'June' },
        { num: 7, name: 'July' },
        { num: 8, name: 'August' },
        { num: 9, name: 'September' },
        { num: 10, name: 'October' },
        { num: 11, name: 'November' },
        { num: 12, name: 'December' }
    ]
}

export const searchEvents = (q, term) => {
    return fetch(`https://kinetic--server.herokuapp.com/events?${q}=${term}`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        }
    })
        .then(res => res.json())
}

