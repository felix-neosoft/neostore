

function generateOTP (){
    return Math.floor(Math.random() * 1000000) + 1
}


export default generateOTP