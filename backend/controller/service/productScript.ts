import { createProduct, findAndUpdateProduct } from './products.service'


async function productScript() {
    const body = {
        name:'NODELAND Bed, Double',
        images:[],
        category:'bed',
        color:[],
        desc:'17 layer-glued slats adjust to your body weight and increase the suppleness of the mattress. Adjustable bed sides allow you to use mattresses of different thicknesses.',
        rating:0,
        producer:'NODELAND',
        cost:25999,
        stock:19,
        dimensions:'205cm x 140cm',
        material:'Particleboard, Melamine foil and ABS plastic'
    }
    const data = await createProduct(body)
    await findAndUpdateProduct({_id:data?._id},{$push:{images:{location:'http://localhost:9000/products/bed5-1.jpg'}, color:{name:'Black', code:'#000000'}}},{new:true})
    await findAndUpdateProduct({_id:data?._id},{$push:{images:{location:'http://localhost:9000/products/bed5-2.jpg'}, color:{name:'Brown', code:'#964B00'}  }},{new:true})
    await findAndUpdateProduct({_id:data?._id},{$push:{images:{location:'http://localhost:9000/products/bed5-3.jpg'} }},{new:true})
    await findAndUpdateProduct({_id:data?._id},{$push:{images:{location:'http://localhost:9000/products/bed5-4.jpg'} }},{new:true})

    console.log(data)
}

// await findAndUpdate({email:email},{$push:{address: {name:name, address:address, pincode:pincode, city:city, state:state, country:country, isDeliveryAddress:false }}}, {new:true})//

export {productScript}