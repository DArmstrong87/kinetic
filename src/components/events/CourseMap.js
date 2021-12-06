import React from "react";

export const CourseMap = ({ event }) => {
    // const url = event.course_url
    const url = event.course_url

    const handleCourseUrl = () => {
        const isValidHttpUrl = (url) => {
            let newurl;

            try { newurl = new URL(url) }
            catch (_) { return false }

            return newurl.protocol === "http:" || newurl.protocol === "https:";
        }
        if (isValidHttpUrl()) {
            const [, path] = url.split("//")
            const [domain,] = path.split("/")
            if (domain === "ridewithgps.com") {
                const style = {
                    height: '30em',
                    width: '50%',
                    borderWidth: '0px'
                }
                return <iframe src={url} style={style} title="RideWithGPS"></iframe>
            }
            else if (domain === "www.strava.com") {
                const style = {
                    height: '30em',
                    width: '30em',
                    borderWidth: '0px',
                    allowtransparency: "true",
                    scrolling: "no"
                }
                return <iframe src={url} style={style} title="Strava"></iframe>
            }
        }
        else {
            return `'${url}'' is not a valid url. Please update and ensure it is in this format: 'http://www.strava.com/...'`
        }
    }

    const courseWidget = handleCourseUrl()

    return (
        <>
            {courseWidget}
        </>
    )
}