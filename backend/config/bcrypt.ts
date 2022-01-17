import brcypt from 'bcrypt'
const saltRounds = 10


function encryptPassword(password:string) {
    return new Promise((resolve,reject)=>{
        brcypt.hash(password, saltRounds, function(err:any,hash:string){
            if(err) reject(err)
            else resolve(hash)
        })
    })
}

function decryptPassword(password:string,hash:any){
    return new Promise(async(resolve,reject)=>{
       const result =  await brcypt.compare(password,hash)
       resolve(result)
    })
}

export{
    encryptPassword,
    decryptPassword
}