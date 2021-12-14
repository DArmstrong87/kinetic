import React, { useState, useEffect } from "react";
import { getAthlete } from "../AthleteProvider";
import "./RaceSim.css"

export const RaceSimulator = () => {
    const [results, setResults] = useState([])
    const [athlete, setAthlete] = useState({})
    const [losses, setLosses] = useState({})
    const [seeResults, toggleResults] = useState(false)
    const [input, setInput] = useState({})

    useEffect(() => {
        getAthlete()
            .then(athlete => {
                setAthlete(athlete)
                if (athlete.fluid_loss > 0 && athlete.sodium_loss > 0) {
                    setLosses({
                        h20Loss: athlete.fluid_loss,
                        naLoss: athlete.sodium_loss
                    })
                }
            })
    }, []
    )



    /* 
    Calculations
        ECF Volume = weight(kg)
        Na Loss mM= Na in mg / 23
        Na Concentration = 140mM (normal Na levels)
        Na Content = Na Concentration * ECF Volume
        New ECF Volume:
            ECF Volume - (Sweat Rate + Fluid lost in Respiration (0.065) + Fluid gained from glycogen(-0.144)) + Fluid consumed
        % Dehydration:
            (ECF Volume - New ECF Volume) / weight(kg)
        New Na Content:
            Na Content - Na Loss + Na Consumed
        New Serum Na:
            New Na Content/NewECF Volume

    Ranges:
        Na Concentration:
            Dangerous > 170 or < 128
            Caution 146 - 169 or 128-135
            Good 135-145
        % Dehydration:
            Dangerous > 0.05
            Caution 0.03-0.05
            Good < 0.03
    */

    /* 
        Steps:
            User input: fluidLoss, naLoss, fluidIntake, naIntake, hrs
            Number of calculations is based on number of hours input by user.
            The new NA content, serumNa, dehydration, newECF volume is stored as its own object with an hour property.
            {
                hour: 1,
                ecfVol: 15.9,
                perDehydration: 0.01,
                naContent: 2315,
                serumNa: 140
            }
    */

    const handleInput = (e) => {
        const copy = { ...input }
        copy[e.target.name] = parseFloat(e.target.value)
        setInput(copy)
    }

    const calcResults = (e) => {
        e.preventDefault()
        let startECFVol = ((athlete.weight / 2.2) * 0.2)
        let startNaContent = (startECFVol * 140)
        let ecfVol = 0
        let naContent = (ecfVol * 140)
        const naIntake = input.naIntake / 23
        const naLoss = losses.naLoss / 23
        const respLoss = 0.065
        const glycogenGain = 0.144
        let array = []
        for (let i = 1; i <= input.hours; i++) {
            const index = i - 2
            if (i > 1) {
                ecfVol = array[index].ecfVol
                naContent = array[index].naContent
            } else {
                ecfVol = startECFVol
                naContent = startNaContent
            }
            ecfVol = ((ecfVol - losses.h20Loss - respLoss) + (glycogenGain + input.h20Intake))//
            const perDehydration = ((startECFVol - ecfVol) / (athlete.weight / 2.2))
            naContent = (naContent - naLoss + naIntake) //
            const serumNa = (naContent / ecfVol)
            const result = {
                hour: i,
                ecfVol: ecfVol,
                naContent: naContent,
                perDehydration: perDehydration,
                serumNa: serumNa
            }
            array.push(result)
        }
        setResults(array)
        toggleResults(true)
    }

    const reset = () => {
        setResults([])
        setInput({})
        toggleResults(false)
    }

    return (
        <>
            <h1 className="race-sim-title">Race Simulator</h1>
            <p className="race-sim-desc">
                The Race Simulator is designed to give you a theoretical state of your hydration and sodium levels given rate of fluid and sodium loss, fluid and sodium intake and number of hours of a race. It is not 100% accurate and is based on known rates of fluid and sodium loss only for the environmental variables that were present during those tests. Things that can change these variables are health status, temperature and humidity. Use common sense when racing and listen to your body.
            </p>
            <div className="pre-req">
                <h3>Pre-requisites: The Race Simulator requires input of known lab values based on a sweat test. The calculations require an updated weight measurement in the athlete profile.</h3>
                <p className="levelen">Kinetic recommends<br />
                    <a href="https://www.levelen.com/shop/sweat-test/" target="_blank"><img src="https://images.squarespace-cdn.com/content/v1/525235ade4b0b9b7feb0b069/1545854133403-D9BOSFI6WVLZZVWH3P6H/levelen.png" alt="Levelen" /></a>
                </p>
            </div>


            <form className="hydration-form" onSubmit={calcResults} onReset={reset}>
                <div className="form-data">
                    <div className="form-row">
                        <fieldset>
                            <label htmlFor="fluidLoss">Fluid loss - L/hr</label>
                            <input name="fluidLoss" type="number" placeholder={losses.h20Loss} onChange={handleInput} step={0.1} />
                        </fieldset>
                        <fieldset>
                            <label htmlFor="naLoss">Sodium loss - mg/hr</label>
                            <input name="naLoss" type="number" placeholder={losses.naLoss} onChange={handleInput} step={0.1} />
                        </fieldset>
                    </div>
                    <div className="form-row">
                        <fieldset>
                            <label htmlFor="h20Intake">Fluid intake - L/hr</label>
                            <input name="h20Intake" type="number" required onChange={handleInput} step={0.1} />
                        </fieldset>
                        <fieldset>
                            <label htmlFor="naIntake">Sodium intake - mg/hr</label>
                            <input name="naIntake" type="number" required onChange={handleInput} step={0.1} />
                        </fieldset>
                    </div>
                    <div className="form-row">
                        <fieldset>
                            <label htmlFor="hours">Hours of race</label>
                            <input name="hours" type="number" required onChange={handleInput} step={0.1} />
                        </fieldset>
                        <div className="submit-reset">
                            <button type="submit">Submit</button>
                            <button type="reset">Reset</button>
                        </div>
                    </div>
                </div>
                <div className="form-title">
                    Hourly Fluid and Sodium Losses and Intakes
                </div>
            </form>


            {seeResults ?
                <>
                    <h2 className="results-h2">Results</h2>
                    <section className="results-container">
                        <div className="results">
                            {results.map(r => {
                                return <>
                                    <div className="result">
                                        <div className="hour">
                                            Hour<br />{r.hour}
                                        </div>
                                        <div className="values">
                                            <div className={
                                                r.perDehydration < 0.03 ? "good" :
                                                    r.perDehydration >= 0.03 && r.perDehydration <= 0.05 ? "caution" :
                                                        r.perDehydration > 0.05 ? "danger" : ""
                                            }>
                                                Dehydration: {(r.perDehydration * 100).toFixed(2)}%
                                            </div>
                                            <div className={
                                                r.serumNa >= 135 && r.serumNa <= 145 ? "good" :
                                                    (r.serumNa > 145 && r.serumNa <= 170) || (r.serumNa >= 128 && r.serumNa < 135) ? "caution" :
                                                        r.serumNa > 170 || r.serumNa < 128 ? "danger" : ""
                                            }>
                                                Serum sodium: {r.serumNa.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            })}
                        </div>
                        <div className="Ranges">
                            <table className="ref-ranges">
                                <thead>
                                    <tr>
                                        <th colSpan={4}>Reference Ranges</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td></td>
                                        <td className="tdg">Good</td>
                                        <td className="tdc">Caution</td>
                                        <td className="tdd">Danger</td>
                                    </tr>
                                    <tr>
                                        <td>Dehydration</td>
                                        <td className="tdg">{`< 3%`}</td>
                                        <td className="tdc">3 - 5%</td>
                                        <td className="tdd">{`> 5%`}</td>
                                    </tr>
                                    <tr>
                                        <td>Serum Sodium</td>
                                        <td className="tdg">135-145mM</td>
                                        <td className="tdc">128-135mM<br />146-169mM</td>
                                        <td className="tdd">{`> 170mM`}<br />{`< 128mM`}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </>
                : ""}

            <h2 className="results-h2">Acknowledgements</h2>
            <section className="acknowledgements">
                <p>Calculations created by Johnathan Toker, Founder of <a href="https://saltstick.com/" target="_blank">SaltStick</a></p>
                <div className="saltStick">
                    <a href="https://saltstick.com/" target="_blank">
                        <img src="https://cdn.shopify.com/s/files/1/0510/6660/1644/files/SALT6234_Logo_Primary.png?height=628&pad_color=ffffff&v=1607410346&width=1200" alt="SaltStick" />
                    </a>
                </div>
            </section>

        </>
    )
}