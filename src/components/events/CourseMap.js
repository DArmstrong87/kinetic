import React from "react";

export const CourseMap = ({ event }) => {
    // const url = event.course_url
    const url = event.course_url

    const handleCourseUrl = () => {
        const [, path] = url.split("//")
        const [domain,] = path.split("/")
        if (domain === "ridewithgps.com") {
            const style = {
                height: '30em',
                width: '50%',
                borderWidth: '0px'
            }
            return <iframe src={url} style={style}></iframe>
        }
        else if (domain === "www.strava.com") {
            const style = {
                height: '30em',
                width: '30em',
                borderWidth: '0px',
                allowtransparency: "true",
                scrolling: "no"
            }
            return <iframe src={url} style={style}></iframe>
        }
    }

    const courseWidget = handleCourseUrl()

    return (
        <>
            {courseWidget}
        </>
    )
}