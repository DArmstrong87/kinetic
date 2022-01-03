import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { deleteActivity, getActivity } from "./ActivityProvider";
import loading from "../../Infinity.gif"

export const Activity = () => {
    const [activity, setActivity] = useState({})
    const { activityId } = useParams()
    const savingModal = useRef()
    const history = useHistory()
    const date = new Date(activity.created_on).toDateString()
    const actSp = activity.activity_sports?.sort((a, b) => {
        let first = a.sport.name
        let second = b.sport.name
        return first - second
    })


    useEffect(
        () => {
            getActivity(activityId).then(a => setActivity(a))
        }, [activityId]
    )

    const delAct = (id) => {
        savingModal.current.showModal()
        deleteActivity(id).then(
            setTimeout(() => history.push(`/activities`), 1000)
        )
    }

    return (
        <>
            <dialog ref={savingModal} className="fs-modal">
                <div className="loading-icon">
                    <img src={loading} alt="loading"/><br />
                    <span>Deleting</span>
                </div>
            </dialog>

            <article className="act">
                <div className="act-details">
                    <h1 className="act-title">{activity.name}</h1>
                    <div className="act-date">{date}</div>
                    <div className="act-dist-gain">
                        <span>Total distance: {activity.total_distance}mi</span>
                        <span>Total elevation gain: {activity.total_elev_gain}ft</span>
                    </div>
                    {activity.activity_sports?.length > 1 ?
                        <div className="sports-table-div">

                            {actSp.map(as => {
                                return <>
                                    <table className="sports-table">
                                        <tr>
                                            <td className="td-sport" rowSpan={2}>{as.sport.name}</td>
                                            <td>Distance</td>
                                            <td>Elevation gain</td>
                                        </tr>
                                        <tr>
                                            <td>{as.distance}mi</td>
                                            <td>{as.elev_gain}ft</td>
                                        </tr>
                                    </table>
                                </>
                            })}
                        </div>
                        : ""}
                    <div className="act-buttons">
                        <button onClick={() => history.push(`/editactivity/${activity.id}`)}>⚙️</button>
                        <button onClick={() => delAct(activity.id)}>🗑️</button>
                    </div>
                </div>
            </article>
        </>
    )
}