import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import jwtDecode from 'jwt-decode'
import Footer from './Footer'
import Header from './Header'
import { toast } from 'react-toastify'
import {Box, createTheme, ThemeProvider, Typography, Paper, Grid, CssBaseline, Button, Accordion, AccordionSummary, IconButton, AccordionDetails, } from '@mui/material'
import { getOrder } from '../config/ProductNodeService'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { generatePdf } from '../config/Controller'
import { deleteOrder } from '../config/ProductNodeService'
import AlertBox from './AlertBox';


const theme = createTheme({
    palette:{
        mode:'dark',
        white:{
          main:'#FFFFFF',
          backgroundColor:'#FFFFFF'
        }
    }
  })


function Order() {
    // State Variables
    const [state,setState] = useState({order:[],user:[], img:"https://freesvg.org/storage/img/thumb/abstract-user-flat-3.png"})
    const [effect, setEffect] = useState(false)
    
    // Redux state variables
    const token = useSelector(state => state.user.token) 

    //Function to navigate to different components
    const navigate = useNavigate()

    useEffect(()=>{
        const decode = jwtDecode(token)
        getOrder(decode.email,token).then(res=>{
            const data = res.data.info
            console.log(data.order)
            if(data.user.profileImg==='http://localhost:9000/profile/')setState({...state,order:data.order, user:data.user})
            else setState({...state,order:data.order, user:data.user, img:data.user.profileImg})
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[effect])

    // Function to handle AlertBox
    const [alert,setAlert] = useState({state:false, status:0, success:false, message:''})
    const alertClose = () => {
        const bool = alert.success
        setAlert({state:false, status:0, success:false, message:''})
        if(bool) navigate('/')
    }

    const deleteOrderFunc = (id) => {
        console.log(id)
        deleteOrder({id:id}).then(res => {
            if(res.data.status_code===200){
                toast.info(res.data.message,{position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined})
                setEffect(prev=>!prev)
            }else setAlert({state:true, status:404, success:false, message:'Failed to Cancel'}) 
        })
    }
    const noOrder = (
        <>
        <Box sx={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <Typography variant='h3'>Please place your first order.</Typography>
            <IconButton color='success' onClick={()=>navigate('/')}><ArrowRightAltIcon/>Dashboard</IconButton>
        </Box>  
        </>
    )


    return (
        <div>
            <Header/>
            <ThemeProvider theme={theme}>
                

                <Typography sx={{fontStyle:'bold', mt:5, ml:5}} variant='h3' >My Account</Typography>
                <Grid container sx={{mb:20}}>
                    <CssBaseline/>
                    <Grid item lg={6} md={4} sm={12}>
                        <Box sx={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                            <img src={ state.img } alt='profile-img' style={{width:'200px', height:'200px', borderRadius:'100%'}} />     
                            <Button onClick={()=>navigate('/order')} sx={{my:3, width:{lg:'30%', md:'50%', sm:'60%'}, mt:10}} variant="outlined"><Typography sx={{fontSize:20}} variant='body2'>Order</Typography></Button>
                            <Button onClick={()=>navigate('/profile')} sx={{my:3, width:{lg:'30%', md:'50%', sm:'60%'}}} variant="outlined"><Typography sx={{fontSize:20}} variant='body2'>Profile</Typography></Button>
                            <Button onClick={()=>navigate('/address')} sx={{my:3, width:{lg:'30%', md:'50%', sm:'60%'}}} variant="outlined"><Typography sx={{fontSize:20}} variant='body2'>Address</Typography></Button>
                        </Box>
                    </Grid>
                    <Grid sx={{mt:5}} item lg={6} md={8} sm={12}>
                        <Paper elevation={20} sx={{display:'flex', flexDirection:'column', mx:5, p:2}}>
                            { state.order.length!==0?
                                state.order.order.length!==0?
                                state.order.order.map((ord,oid)=>(
                                    <Accordion key={oid} sx={{my:2}} >
                                        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Order No.{ord.id}</AccordionSummary>
                                        <AccordionDetails>
                                            <Box>
                                                <Typography variant='body2'>Placed on. {ord.date}</Typography>
                                                <Box sx={{my:2}}>
                                                    {ord.cart.map((cart,cid)=>(
                                                        <img key={cid} style={{marginLeft:'30px'}} src={cart.img} alt='products' width='100' height='100' />
                                                    ))}
                                                </Box>
                                                <Box sx={{display:'flex', flexDirection:'row-reverse'}}>
                                                    <Button onClick={()=>deleteOrderFunc(ord.id)}  variant='contained' sx={{ml:5}} color='warning'>Cancel Order</Button>
                                                    <Button onClick={()=>generatePdf(ord.cart, ord.total, ord.address, state.user, ord.id, ord.date)}  variant='contained'>Generate Pdf</Button>
                                                </Box>
                                                
                                            </Box>
                                        </AccordionDetails>
                                    </Accordion>
                                ))
                        : noOrder    : null }
                        </Paper>
                    </Grid>
                </Grid>
                <AlertBox open={alert} onClose={alertClose}/>                                         
            </ThemeProvider>
            <Footer/>
            
        </div>
    )
}

export default Order
