export const getAchievements = () => {
    return fetch(`https://kinetic--server.herokuapp.com/achievements`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        }
    })
        .then(res => res.json())
}
export const achievementUnlocked = (badge) => {
    return fetch(`https://kinetic--server.herokuapp.com/achievements`, {
        method: "POST",
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`, "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(badge)
    })
        .then(res => res.json())
}

export const getBadges = () => {
    return fetch(`https://kinetic--server.herokuapp.com/badges`, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("kinetic_token")}`
        }
    })
        .then(res => res.json())
}

