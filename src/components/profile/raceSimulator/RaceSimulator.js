import React, { useState, useEffect } from "react";
import { getAthlete } from "../AthleteProvider";

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
        Convert weight to metric.
        ECF Volume = weight(kg) * 0.2
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
        let ecfVol = (athlete.weight * 0.2)
        let naContent = ecfVol * 140
        const respLoss = 0.065
        const glycogenGain = 0.144
        for (let i = 1; i <= input.hours; i++) {
            const index = i - 2
            if (i > 1) {
                ecfVol = results[index]?.newECFVol
                naContent = results[index]?.newNAContent
                debugger
            }
            const newECFVol = ecfVol - (losses.h20Loss - respLoss + glycogenGain + input.h20Intake)
            const perDehydration = (ecfVol - newECFVol) / athlete.weight
            const newNAContent = naContent - losses.naLoss + input.naIntake
            const newSerumNa = newNAContent / newECFVol
            const result = {
                hour: i,
                newEcfVol: newECFVol,
                newNaContent: newNAContent,
                perDehydration: perDehydration,
                serumNa: newSerumNa
            }
            results.push(result)
            if (results[i - 1]?.ecfVol) {
                continue
            }
        }
        toggleResults(true)
    }

    const reset = (e) => {
        e.preventDefault()
        setResults([])
        toggleResults(false)
    }

    return (
        <>
            <h2>Race Simulator</h2>
            <p>
                The Race Simulator is designed to give you a theoretical state of your hydration and sodium levels given rate of fluid and sodium loss, fluid and sodium intake and number of hours of a race. It is not 100% accurate and is based on known rates of fluid and sodium loss only for the environmental variables that were present during those tests. Things that can change these variables are health status, temperature and humidity. Use common sense when racing and listen to your body.
            </p>

            <form onSubmit={calcResults} onReset={reset}>
                <fieldset>
                    <label htmlFor="fluidLoss">Hourly fluid loss - liters</label>
                    <input name="fluidLoss" type="number" placeholder={losses.h20Loss} onChange={handleInput} step={0.1} />
                </fieldset>
                <fieldset>
                    <label htmlFor="naLoss">Hourly sodium loss - mg</label>
                    <input name="naLoss" type="number" placeholder={losses.naLoss} onChange={handleInput} step={0.1} />
                </fieldset>
                <fieldset>
                    <label htmlFor="h20Intake">Hourly fluid intake - liters</label>
                    <input name="h20Intake" type="number" onChange={handleInput} step={0.1} />
                </fieldset>
                <fieldset>
                    <label htmlFor="naIntake">Hourly sodium intake - mg</label>
                    <input name="naIntake" type="number" onChange={handleInput} step={0.1} />
                </fieldset>
                <fieldset>
                    <label htmlFor="hours">Hours of race</label>
                    <input name="hours" type="number" onChange={handleInput} step={0.1} />
                </fieldset>
                <button type="submit">Submit</button>
                <button type="reset">Reset</button>
            </form>

            <section>
                {seeResults ?
                    <>
                        Results
                        {results.map(r => {
                            return <>
                                <div>
                                    Hour: {r.hour}
                                    % Dehydration: {r.perDehydration}
                                    Serum sodium: {r.serumNa}
                                </div>
                            </>
                        })}
                    </>
                    : ""
                }
            </section>

        </>
    )
}