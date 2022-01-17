import React, {useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { createTheme, Paper, Step, StepLabel, Stepper, ThemeProvider, Box, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Grid, Button, IconButton } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import jwt_decode from 'jwt-decode'
import { toast } from 'react-toastify'
import Footer from './Footer'
import Header from './Header'
import { deleteItemDispatch, updateCartDispatch } from '../redux/CartReducer'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { closeCheckout, redirectCheckout } from '../redux/userReducer'
import AlertBox from './AlertBox';

// material ui theme
const theme = createTheme({
    palette:{
        mode:'dark',
        white:{
          main:'#FFFFFF'
        }
    }
  })

export const StepperModel = (value) => {
    return(
        <>
        <Stepper activeStep={value}>
            <Step><StepLabel>Cart</StepLabel></Step>
            <Step><StepLabel>Delivery Address</StepLabel></Step>
            <Step><StepLabel>Place Order</StepLabel></Step>
        </Stepper>
        </>
    )
}

function Cart() {
    // Redux variables and functions
    const cart = useSelector(state => state.cart.cart)
    const token = useSelector(state => state.user.token)
    const checkout = useSelector(state => state.user.checkout)

    // Function to navigate to diffrent components
    const navigate = useNavigate()

    //state variables
    const [state,setState] = useState({data:[], total:0})
    const [effect,setEffect] = useState(false)

    const dispatch = useDispatch()
    useEffect(()=>{
        if(token==='' && checkout){
            dispatch(closeCheckout())
        }
        let sum = 0
        cart.forEach(ele => {
            sum += ele.numofitems * ele.cost
        })
        setState({...state,data:cart,total:sum})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[effect])

    let total = 0

    const [alert,setAlert] = useState({state:false, status:0, success:false, message:''})
    const alertClose = () => {
        const bool = alert.success
        setAlert({state:false, status:0, success:false, message:''})
        if(bool) navigate('/')
    }

    const updateCart = (condition,id) => {
        dispatch(updateCartDispatch(id,condition))
        setEffect(prev => !prev)
    }

    const deleteItem = (id) => {
        if(token!==''){
            const decode = jwt_decode(token)
            dispatch(deleteItemDispatch(id,decode.email))
        }
        else dispatch(deleteItemDispatch(id,''))
        setEffect(prev => !prev)
        toast.warn('Product Deleted',{position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined})
    }

    const proceedCheckout = () => {
        if(cart.length!==0){
            if(token!==''){
                navigate('/checkout')
            }
            else{
                navigate('/login')
                toast.warn('User is not logged in',{position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined})
            } 
            dispatch(redirectCheckout());
        }else setAlert({state:true, status:404, success:false, message:'Cart is Empty'}) 
    }

    return (
        <div>
            <Header/>
            <ThemeProvider theme={theme}>
                <Box sx={{mt:5, mb:'200px' , pt:5, display:'flex', flexDirection:'column', width:'97%', mx:'auto', px:2}} component={Paper}>
                    {StepperModel(0)}
                    <Grid container>
                        <Grid item lg={8}>
                            <TableContainer sx={{ mt:3, pb:3}}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Product</TableCell>
                                            <TableCell>Quantity</TableCell>
                                            <TableCell>Price</TableCell>
                                            <TableCell>Total</TableCell>
                                            <TableCell>Remove</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody >
                                        {state.data.map((ele,id)=>{
                                            total += ele.cost * ele.numofitems
                                            return(
                                            <TableRow key={id} sx={{border:1}}>
                                                <TableCell sx={{display:'inline-flex', border:'none'}}>
                                                    <img src={ele.img} alt='product' width='100' height='100' />
                                                    <Box sx={{ml:2}}>
                                                        <Typography variant='h6'>{ele.name}</Typography>
                                                        <Typography variant='h6'>by {ele.producer}</Typography>
                                                        <Typography variant='h6'>Color: {ele.color}</Typography>
                                                        <Typography variant='h6'>Status in Stock</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{border:'none'}}>
                                                    <IconButton onClick={()=>updateCart('ADD',ele.id)}><AddOutlinedIcon/></IconButton>
                                                    {ele.numofitems}
                                                    <IconButton onClick={()=>updateCart('SUB',ele.id)}><RemoveOutlinedIcon/></IconButton>
                                                </TableCell>
                                                <TableCell sx={{border:'none'}}><Typography variant='h6'>{ele.cost}</Typography></TableCell>
                                                <TableCell sx={{border:'none'}}><Typography variant='h6'>{ele.cost * ele.numofitems}</Typography></TableCell>
                                                <TableCell><Button onClick={()=>deleteItem(ele.id)} variant='contained' sx={{backgroundColor:'red'}}><ClearOutlinedIcon/></Button></TableCell>
                                            </TableRow>
                                        )})}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item lg={4}>
                            <Box sx={{my:'10%', ml:10, width:'80%'}}>
                                <Typography  sx={{my:2}} variant='h4'>Review Order</Typography>
                                <Typography sx={{my:2}} variant='h5'>Subtotal: {total}</Typography>
                                <Typography sx={{my:2}} variant='h5'>GST(18%): {Math.round((total*18)/100)}</Typography>
                                <Typography sx={{my:2}} variant='h5'>Order Total: {total + Math.round((total*18)/100)}  </Typography>
                                <Button onClick={()=>proceedCheckout()} fullWidth variant='contained'>Proceed to Buy</Button>
                            </Box>
                        </Grid>
                    </Grid>                     
                </Box>
                <AlertBox open={alert} onClose={alertClose}/>
            </ThemeProvider>
            <Footer/>
        </div>
    )
}

export default Cart
