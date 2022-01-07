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


// Achievement Validation
export const validateAchievements = (values, newBadges, setNew) => {
    const badges = values[0]
    const activities = values[1]
    const achievements = values[2]

    const copy = newBadges
    let firstUnlocked = first(badges, activities)
    let cyclistUnlocked = cyclist(badges, activities, achievements)
    let runnerUnlocked = runner(badges, activities, achievements)
    let swimmerUnlocked = swimmer(badges, activities, achievements)
    let hundredUnlocked = oneHundred(badges, activities, achievements)
    const checkedAchievements = [cyclistUnlocked, runnerUnlocked, swimmerUnlocked, firstUnlocked, hundredUnlocked]
    for (const checked of checkedAchievements) {
        if (checked) {
            copy.push(checked)
        }
    }
    setNew(copy)
}

const first = (badges, activities, achievements) => {
    const foundBadge = achievements?.find(a => {
        return a?.badge?.name === "First"
    })
    if (foundBadge) {
        return
    }
    else {
        if (activities.length > 0) {
            return badges.find(badge => badge.name === "First")
        }
    }
}

const cyclist = (badges, activities, achievements) => {
    const foundBadge = achievements?.find(a => {
        return a?.badge?.name === "Cyclist"
    })
    if (foundBadge) {
        return
    } else {
        const foundActivity = activities?.find(a => {
            return a.activity_sports.some(aS => {
                return aS.sport.name === "Cycling"
            })
        })
        if (foundActivity) { return badges.find(badge => badge.name === "Cyclist") }
    }
}

const runner = (badges, activities, achievements) => {
    const foundBadge = achievements?.find(a => {
        return a?.badge?.name === "Runner"
    })
    if (foundBadge) {
        return
    } else {
        const foundActivity = activities?.find(a => {
            return a.activity_sports.some(aS => {
                return aS.sport.name === "Running"
            })
        })
        if (foundActivity) { return badges.find(badge => badge.name === "Runner") }
    }
}

const swimmer = (badges, activities, achievements) => {
    const foundBadge = achievements?.find(a => {
        return a?.badge?.name === "Swimmer"
    })
    if (foundBadge) {
        return
    } else {
        const foundActivity = activities?.find(a => {
            return a.activity_sports.some(aS => {
                return aS.sport.name === "Swimming"
            })
        })
        if (foundActivity) { return badges.find(badge => badge.name === "Swimmer") }
    }
}

const oneHundred = (badges, activities, achievements) => {
    const foundBadge = achievements?.find(a => {
        return a?.badge?.name === "100 Miles"
    })
    if (foundBadge) { return }
    else {
        const totalMi = activities.reduce((accumulator, a) => { return accumulator + a.total_distance }, 0)
        if (totalMi >= 100) {
            return badges.find(badge => badge.name === "100 Miles")
        }
    }
}