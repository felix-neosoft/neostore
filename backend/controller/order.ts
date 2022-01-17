import { Request, Response } from 'express'
import { findAndUpdateOrder, findOrder } from './service/order.service'
import { findUser } from './service/user.service'



const placeOrder = async(req:Request, res:Response) => {
    const { email, cart, total, address, id, date } = req.body.data
    const myarray = {id:id, address:address, cart:cart, total:total, date:date}
    await findAndUpdateOrder({email:email},{$push:{order:myarray}},{new:true})
}

const getOrder = async(req:Request, res:Response) => {
    const email = req.query.email
    const order = await findOrder({email:email})
    if(order!==null){
        const user = await findUser({email:order?.email})
        const url = req.protocol + '://' + req.get('host') + '/profile/' + user?.profileImg
        res.json({"success":true, "status_code":200, "info":{user:{email:user?.email, fname:user?.fname, lname:user?.lname, mobile:user?.mobile, profileImg:url}, order:order } })

    }else res.json({"success":false, "status_code":404, "message":"User has not placed any order yet."})
}

const cancelOrder = async(req:Request, res:Response) => {
    const id = req.body.id
    await findAndUpdateOrder({'order.id':id},{$pull:{order:{id:id}}},{new:true})
    res.json({"success":true, "status_code":200, "message":"Order is Canceled" })
}

export{
    placeOrder,
    getOrder,
    cancelOrder
}