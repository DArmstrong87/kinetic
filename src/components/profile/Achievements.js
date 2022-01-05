import React, { useEffect, useState } from "react"
import "./Achievements.css"
import { achievementUnlocked, getAchievements, getBadges } from "./AchievementsProvider"

export const Achievements = () => {
    const [badges, setBadges] = useState([])
    const [achievements, setAchievements] = useState([])

    useEffect(
        () => {
            getBadges().then(badges => setBadges(badges))
            getAchievements().then(ach => setAchievements(ach))
        }, []
    )

    const validateActivities = () => {

    }

    return (<>
        <article className="achievements-container">
            <h1 className="achievements-title">Achievements</h1>
            <div className="badges">
                {achievements.map(a => {
                    return <div className="badge-unlocked"><img src={a.badge.complete_url} />
                    </div>
                })}
                {badges.map(badge => {
                    return <div className="badge"><img src={badge.incomplete_url} />
                    </div>
                })}
            </div>
            View All Achievements
        </article>
    </>)
}