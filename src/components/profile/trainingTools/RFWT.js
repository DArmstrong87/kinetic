import React from "react"

export const RFWT = ({a, setVo2max, setResults, results}) => {

    const setResult = (e) => {
        const result = { ...results }
        result[e.target.name] = parseInt(e.target.value)
        setResults(result)
    }

    const getVO2 = () => {
        // VO2max 132.853 - (0.0769 * weight(lbs)) - (0.3877 * age) + (6.315 * gender factor) - (3.2649 * time to complete 1min walk) - (0.1565 * 10s hr)
        const sexFactor = () => {
            if (a.sex === "M") { return 1 }
            else { return 0 }
        }
        const time = results.min + (results.sec / 60)
        const vo2max = 132.853 - (0.0769 * a.weight) - (0.3877 * a.age) + (6.315 * sexFactor()) - (3.2649 * time) - (0.1565 * results.hr)
        setVo2max(Math.ceil(vo2max))
    }

    return (
        <>
            <h3>The Rockport Fitness Walking Test</h3>
            <div>
                Time to complete: 15-22 minutes
            </div>
            <div>
                Equipment: Stopwatch
            </div>
            <div>
                Validation: <a href="https://pubmed.ncbi.nlm.nih.gov/8047707/">Validation of the Rockport Fitness Walking Test in college males and females</a>
            </div>

            <h4>Directions</h4>
            <ol>
                <li>Start timer and walk 1 mile on a pre-measured course or treadmill.</li>
                <li>Stop and record time at exactly 1mi.</li>
                <li>Count heart rate for 10 seconds and record.</li>
            </ol>

            <fieldset>
                <label htmlFor="hr">Minutes </label>
                <input name="min" value={results.min} type="number" onChange={setResult} />
            </fieldset>
            <fieldset>
                <label htmlFor="hr">Seconds </label>
                <input name="sec" value={results.sec} type="number" onChange={setResult} />
            </fieldset>
            <fieldset>
                <label htmlFor="hr">10s Heart Rate </label>
                <input name="hr" value={results.hr} type="number" onChange={setResult} />
            </fieldset>

            <div>
                <button onClick={getVO2}>
                    Calculate
                </button>
                <button onClick={() => {
                    setResults({ hr: "", min: "", sec: "" });
                    setVo2max("")
                }}>
                    Reset</button>
            </div>

        </>
    )
}