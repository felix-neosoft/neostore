import React, { useState, useEffect} from 'react'
import { useSelector, useDispatch} from 'react-redux'
import jwtDecode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'
import { getUserData } from '../config/UserNodeService'
import { createTheme, ThemeProvider, Grid, Box, Paper, Typography, TableRow, Accordion, AccordionSummary, AccordionDetails, Button, TextField, TableContainer, Table, TableHead, TableCell, TableBody } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { StepperModel } from './Cart'
import { closeCheckout } from '../redux/userReducer'
import { RegForCardNumber, RegForCvv } from '../config/Controller'
import { orderPlaced } from '../config/ProductNodeService'
import { generatePdf, generateCode } from '../config/Controller'
import { toast } from 'react-toastify'
import { checkoutClearDispatch } from '../redux/CartReducer'


const theme = createTheme({
    palette:{
        mode:'dark',
        white:{
          main:'#FFFFFF',
          backgroundColor:'#FFFFFF'
        }
    }
  })


function Checkout() {
    // Redux state variables and functions
    const token = useSelector(state =>state.user.token)
    const checkout = useSelector(state => state.user.checkout)
    const cart = useSelector(state => state.cart.cart)
    const dispatch = useDispatch()


    // Function to navigate to diffrent components
    const navigate = useNavigate()

    // State Variables
    const [state, setState] = useState({cart:[],user:{},address:[], changer:'DeliveryAddress', total:0, cardno:'', cvv:'',eCardno:'',eCvv:'',expiry:'',invoiceid:0, date:''})
    const [delivery,setDelivery] = useState({name:'',address:'',pincode:'',city:'',state:'',country:''})

    

    useEffect(()=>{
        if(token==='' && checkout){
            navigate('/login')
        }

        const decode = jwtDecode(token)
        getUserData(decode.email,token).then(res => {
            const data = res.data.info
            let total = 0
            cart.forEach(ele => {
                total = total + (ele.numofitems * ele.cost)
            })
            setState({...state,cart:cart,user:{fname:data.fname, lname:data.lname, email:data.email, mobile:data.mobile},address:data.address,total:total})
            if(data.address.length===0){
                navigate('/address')
                toast.warn('Please add a address',{position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined})
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const handler = e => {
        let name = e.target.name
        switch(name){
            case 'cardno':
                setState({...state,eCardno:RegForCardNumber.test(e.target.value)?'':'Card Number must be 16 digits',cardno:e.target.value})
                break

            case 'cvv':
                setState({...state,eCvv:RegForCvv.test(e.target.value)?'':'CVV must be 3 digits',cvv:e.target.value})
                break

            case 'expiry':
                setState({...state,expiry:e.target.value})
                break

            default:
        }
    }


    const ShowDeliveryAddress = (
        <>
            {StepperModel(1)}
            <Typography sx={{mb:3, ml:3, mt:5}} variant='h4'>Select Delivery Address</Typography>
            <Box sx={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                {state.address.map(ele => (
                    <Accordion key={ele._id} component={Paper} elevation={20} sx={{width:'50%', my:2}}>
                        <AccordionSummary  expandIcon={<ExpandMoreIcon/> }>
                            <Typography color={ele.isDeliveryAddress?'green':''} variant='h6'>{ele.isDeliveryAddress?'Default: ':''}{ele.name}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant='h6'>{ele.address}</Typography>
                            <Typography variant='h6'>{ele.pincode}</Typography>
                            <Typography variant='h6'>{ele.city}</Typography>
                            <Typography variant='h6'>{ele.state}</Typography>
                            <Typography variant='h6'>{ele.country}</Typography>
                            <Box sx={{display:'flex', flexDirection:'column', alignItems:'flex-end'}}>
                                <Button onClick={()=>setDeliveryAddress(ele)} variant='contained'>Deliver to this Address</Button>
                            </Box>

                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        </>
    )

    const showCheckout = (
        <>
            {StepperModel(2)}
            <Grid container sx={{mt:3}}>
                <Grid item lg={3}>
                    <Box>
                        <Typography variant='h5'>{state.user.fname}  {state.user.lname}</Typography>
                        <Box sx={{ml:5}}>
                            <Typography variant='h6'>{state.user.email}</Typography>
                            <Typography variant='h6'>{state.user.mobile}</Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item lg={3}>
                    <Typography variant='h5'>Delivery Address</Typography>
                    <Box sx={{ml:5}}>
                        <Typography variant='h6'>Address: {delivery.address}</Typography>
                        <Typography variant='h6'>Pincode: {delivery.pincode}</Typography>
                        <Typography variant='h6'>City: {delivery.city}</Typography>
                        <Typography variant='h6'>State:{delivery.state}</Typography>
                        <Typography variant='h6'>Country: {delivery.country}</Typography>
                    </Box>
                </Grid>    
                <Grid component={Paper} elevation={20} sx={{p:3}} item lg={6}>
                    <Typography variant='h5'>Card Details</Typography>
                    <TextField sx={{my:2, width:'80%'}} variant='outlined' label='Card Number' name='cardno' onChange={e=>handler(e)} error={state.eCardno!==''?true:false} helperText={state.eCardno}  />
                    <TextField type='date' sx={{my:2, width:'30%'}} variant='outlined' name='expiry'  onChange={e=>handler(e)}  />
                    <TextField sx={{my:2, width:'30%', ml:3}} variant='outlined' label='cvv' name='cvv' onChange={e=>handler(e)} error={state.eCvv!==''?true:false} helperText={state.eCvv} />
                    <Box sx={{display:'flex', flexDirection:'row', mt:3}}>
                    <Typography variant='h5'>Amount: {Math.round(state.total + (state.total * (18/100)))}</Typography>
                    <Button onClick={()=>placeOrder()} sx={{ml:'50%'}} variant='contained'>Pay</Button>
                    </Box>
                </Grid>    
            </Grid>    
        </>
    )

    const showOrder = (
        <>
            {StepperModel(3)}
            <Typography sx={{mt:5}} variant='h3'>Thank You! Order Placed</Typography>
            <Grid container sx={{mt:5}}>
                <Grid item lg={6} sx={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                    <Box>
                        <Typography variant='h5'>{state.user.fname}  {state.user.lname}</Typography>
                        <Box sx={{ml:5}}>
                            <Typography variant='h6'>{state.user.email}</Typography>
                            <Typography variant='h6'>{state.user.mobile}</Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item lg={6} sx={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                    <Typography variant='h5'>Delivery Address</Typography>
                    <Box sx={{ml:5}}>
                        <Typography variant='h6'>Address: {delivery.address}</Typography>
                        <Typography variant='h6'>Pincode: {delivery.pincode}</Typography>
                        <Typography variant='h6'>City: {delivery.city}</Typography>
                        <Typography variant='h6'>State:{delivery.state}</Typography>
                        <Typography variant='h6'>Country: {delivery.country}</Typography>
                    </Box>
                </Grid>
                <Grid item lg={12} sx={{border:1, mt:5}}>
                    <Typography variant='h5' sx={{textAlign:'center', mt:3}}>Order Details</Typography>
                    <TableContainer sx={{width:'70%', mx:'auto', mt:1}}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {state.cart.map((ele,id)=>(
                                    <TableRow key={id}>
                                        <TableCell sx={{display:'inline-flex', border:'none'}}>
                                            <img src={ele.img} alt='product' width='100' height='100' />
                                            <Box sx={{ml:2}}>
                                                <Typography variant='h6'>{ele.name}</Typography>
                                                <Typography variant='h6'>by {ele.producer}</Typography>
                                                <Typography variant='h6'>Color: {ele.color}</Typography>
                                                <Typography variant='h6'>Status in Stock</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{border:'none'}}>{ele.numofitems}</TableCell>
                                        <TableCell sx={{border:'none'}}>{ele.cost}</TableCell>
                                        <TableCell sx={{border:'none'}}>{ele.numofitems * ele.cost}</TableCell>
                                    </TableRow>
                                    ))}    
                                </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item lg={12} sx={{display:'flex', flexDirection:'column', alignItems:'end', mr:10, mt:5}}>
                    <Button onClick={()=>downloadPdf()} variant='contained'>Generate PDF</Button>
                </Grid>
            </Grid>
        </>
    )
    const setDeliveryAddress = (data) => {
        setDelivery({...delivery,name:data.name, address:data.address, pincode:data.pincode, city:data.city, state:data.state, country:data.country })
        setState({...state,changer:'CheckoutDisplay'})
    }


    const placeOrder = () => {
        if(state.cardno!=='' && state.cvv!=='' && state.expiry!=='' && state.eCardno==='' && state.eCvv===''){
            const code = generateCode()
            const date = new Date()
            const setdate  = date.getDate() + '-' + (date.getMonth()+1) + '-' + date.getFullYear()
            setState({...state,changer:'CurrentOrder',invoiceid:code, date:setdate})
            dispatch(closeCheckout())
            const decode = jwtDecode(token)
            orderPlaced({email:decode.email, cart:cart, total:state.total, address:delivery, id:code, date:setdate })
            dispatch(checkoutClearDispatch(decode.email))
        } else toast.warn('Card Details Error',{position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined})
    }

    const downloadPdf = () => {
        generatePdf(state.cart, state.total, delivery, state.user, state.invoiceid, state.date)
        toast('Invoice Downloaded',{position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined})
    }

    return (
        <div>
            <Header/>
            <ThemeProvider theme={theme}>
                <Box component={Paper} sx={{my:5,pb:10,pt:5,px:2,mx:2}}>
                    {state.changer === 'DeliveryAddress'? ShowDeliveryAddress : null}
                    {state.changer === 'CheckoutDisplay'? showCheckout : null}
                    {state.changer === 'CurrentOrder'? showOrder : null}
                    
                
                </Box>
            </ThemeProvider>
            <Footer/>
            
        </div>
    )
}

export default Checkout
