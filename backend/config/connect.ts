import {connect} from 'mongoose'

async function DBConnect() {
    const db = 'mongodb://localhost:27017/neostore'
    return connect(db) 
    .then(()=>{
        console.log('Database Connected')
    })
    .catch((err)=>{
        console.log(`Database Error: ${err}`)
    })
}

export default DBConnect