import { jsPDF } from 'jspdf'
import { getCart } from "./ProductNodeService"


// TextField Validation  
export const RegForName = RegExp('^[A-Z]+[a-z]{2,15}$')
export const RegForEmail = RegExp('^[a-zA-Z0-9._]{3,30}@[a-z]{3,10}.[a-z]{2,3}$')
export const RegForPassword = RegExp('^(?=.*[@#$%&*!(){}?"])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$')
export const RegForMobile = RegExp('^[0-9]{10,10}$')
export const RegForOTP = RegExp('^[0-9]{6,6}$')
export const RegForPincode = RegExp('^[0-9]{6,6}$')
export const RegForCardNumber = RegExp('^[0-9]{16,16}$')
export const RegForCvv = RegExp('^[0-9]{3,3}$')


// Sort Array
export const sortArray = (condition,arr) => {
    switch(condition){
        case 'increase':
            return arr.sort((a,b)=> a.cost>b.cost? 1 : -1 )
            
        case 'decrease':
            return arr.sort((a,b)=> a.cost<b.cost? 1 : -1 )

        case 'rating':
            return arr.sort((a,b)=> a.rating<b.rating? 1: -1)
        
        default: return arr
    }

}

//Redux + Database Cart on Login Successfully
export const CartLoad = (email) => {
    getCart(email).then(res => {
        return res.data
    })
}

//Generate unique invoice id
export const generateCode = () =>{
    let min = 10000000
    let max = 99999999
    return Math.floor(Math.random()*(max-min+1)) + min
}

export const generatePdf = (cart, total, address, user, id, date) =>{
    console.log({cart:cart, total:total, address:address, user:user, id:id})
    const doc = new jsPDF()
    //Header
    doc.setFontSize(30)
    doc.text('Neo',10,20)
    doc.setTextColor(255, 0, 0)
    doc.text('STORE',30,20)
    doc.text('Invoice',160,40)
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    doc.text(`No.${id}`,160,50)
    doc.text(`Date: ${date}`,160,55)

    // Biller Info
    doc.setFontSize(15)
    doc.text('BILL TO',10,70)
    doc.text(`${user.fname+' '+user.lname}`,10,80)
    doc.text(`${user.email}`,10,87)
    doc.text(`${address.address}`,10,94)
    doc.text(`${address.city+' - '+address.pincode}`,10,101)
    doc.text(`${address.state}`,10,108)
    doc.text(`${address.country}`,10,115)
    doc.text(`Mob No.${user.mobile}`,10,122)

    //cart Info
    doc.setFontSize(13)
    doc.text('#',10,140)
    doc.text('Name',25,140)
    doc.text('Quantity',120,140)
    doc.text('Price',155,140)
    doc.text('Total',180,140)

    let spacing = 130
    cart.forEach((item,id)=>{
        spacing += 20
        doc.text((id+1).toString(),10,spacing+3)
        doc.text(item.producer,25,spacing)
        doc.text(item.name,25,spacing+5)
        doc.text('Color: '+item.color,25,spacing+10)
        doc.text(item.numofitems.toString(),120,spacing+7)
        doc.text(item.cost.toString(),155,spacing+7)
        doc.text((item.numofitems*item.cost).toString(),180,spacing+7)

    })

    doc.setLineWidth(0.5)
    doc.line(100, spacing +20 , 200, spacing +20)

    doc.text('Total:',140,spacing + 30)
    doc.text((total).toString(),180,spacing + 30)
    doc.text('GST(18%):',140,spacing + 37)
    doc.text(Math.round(total*(18/100)).toString(),180,spacing + 37)
    doc.text('SubTotal:',140,spacing + 44)
    doc.text(Math.round(total + (total*(18/100))).toString(),180,spacing + 44)

    doc.save(`neostore-${id}.pdf`)


}