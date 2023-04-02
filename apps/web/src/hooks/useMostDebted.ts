import { useEffect, useState } from "react"
import {client} from '~/trpc'


const useMostDebted = () => {

    const [mostDebted, setMostDebted] = useState<[string, number][]| null>(null)
    useEffect(() =>{
        client.leaderboard.getMostDebt.query().then(e=>{
            console.log(e);
            setMostDebted(e)
        })
    },[])
    return mostDebted;
}

export default useMostDebted;