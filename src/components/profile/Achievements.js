import { Tooltip } from "@mui/material"
import React, { useEffect, useRef, useState } from "react"
import { getActivities } from "../activities/ActivityProvider"
import "./Achievements.css"
import { achievementUnlocked, getAchievements, getBadges, validateAchievements } from "./AchievementsProvider"


export const Achievements = () => {
    const [badges, setBadges] = useState([])
    const [achievements, setAchievements] = useState([])
    const [newBadges, setNew] = useState([])
    const [badgesSet, setBadgesSet] = useState(false)
    const showAchievement = useRef()

    useEffect(
        () => {
            const getThings = [
                getBadges(),
                getActivities(),
                getAchievements()
            ]
            Promise.all(getThings)
                .then(values => {
                    setBadges(values[0])
                    setAchievements(values[2])
                    validateAchievements(values, newBadges, setNew)
                }).then(
                    () => {
                        if (newBadges.length > 0) { setBadgesSet(true) }
                        for (const badge of newBadges) {
                            achievementUnlocked({ badgeId: badge.id })
                        }
                    }
                )
                .then(() => {
                    if (newBadges.length > 0) {
                        showAchievement.current.showModal()
                    }
                })
        }, []
    )

    return (<>
        <dialog className="achievementModal" ref={showAchievement}>
            <h2 style={{ textAlign: "center", color: "white" }}>Achievements Unlocked!</h2>
            <div className="newAchievements">
                {newBadges?.map(badge => {
                    return <div className="achievement-unlocked">
                        {badge?.name} Unlocked!
                        <div className="ach-img">
                            <img src={badge?.complete_url} />
                        </div>
                        <p>{badge?.description}</p>
                    </div>
                })}
            </div>
            <div className="ach-button">
                <button onClick={() => {
                    showAchievement.current.close();
                    getBadges().then(badges => setBadges(badges))
                    getAchievements().then(a => setAchievements(a))
                }}>
                    Let's Go!
                </button>
            </div>
        </dialog>

        <article className="achievements-container">
            <h1 className="achievements-title">Achievements</h1>
            <div className="badges">
                {achievements.map(a => {
                    return <>
                        <Tooltip title={<h2>{a.badge.description}</h2>} placement="top">
                            <div className="badge-unlocked">
                                <div>{a.badge.name}</div>
                                <div className="badge-img-container"><img src={a.badge.complete_url} /></div>
                            </div>
                        </Tooltip>
                    </>
                })}
                {badges.map(badge => {
                    return <>
                        <Tooltip title={<h2>{badge.description}</h2>} placement="top">
                            <div className="badge">
                                <img src={badge.incomplete_url} />
                            </div>
                        </Tooltip>
                    </>
                })}
            </div>
            View All Achievements
        </article>
    </>)
}