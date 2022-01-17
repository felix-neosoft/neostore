import React, { useState } from 'react'
import {useSelector, useDispatch} from 'react-redux'
import jwt_decode from 'jwt-decode'
import { toast } from 'react-toastify'
import Magnifier from "react-magnifier";
import { Box, Button, Typography, Grid, Paper, Rating, IconButton, Tabs, Tab, FormControl, FormLabel, FormControlLabel, RadioGroup, Radio, Dialog, DialogTitle, DialogContent } from '@mui/material'
import ShareIcon from '@mui/icons-material/Share';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { addCartDispatch } from '../redux/CartReducer'
import { FacebookShareButton, FacebookIcon, PinterestShareButton, TwitterShareButton, WhatsappShareButton, PinterestIcon, TwitterIcon, WhatsappIcon } from 'react-share'
import AlertBox from './AlertBox';
import { rateProduct } from '../config/ProductNodeService';

const url = 'http://localhost:8888/url' //fake url


function ProductsInfo(props) {
    // Props
    const {info, change} = props

    // State Variables
    const [state,setState] = useState({tabpanel:'description',mainImg:info.images[0].location, color:info.color[0].name})
    const [dialog, setDialog] = useState({open:false,rate:4})

    // Redux Dispatch Funtion and Variables
    const dispatch = useDispatch()
    const token = useSelector(state => state.user.token)

    const handler = e =>{
        setState({...state,color:e.target.value})
    }

    const addCartFunc = (data) => {
        if(token!==''){
            const decode = jwt_decode(token)
            dispatch(addCartDispatch(data,decode.email))
        }
        else{
            dispatch(addCartDispatch(data,''))
        }
        toast('A Product is Added',{position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined})
    }

    const rateProductFunc = () =>{
        if(token!==''){
            const decode = jwt_decode(token)
            rateProduct({email:decode.email, id:info._id, rate:dialog.rate}).then(res => {
                setAlert({state:true, status:res.data.status_code, success:res.data.success, message:res.data.message}) 
                setDialog({...dialog,open:false})
            })

        }
        else{
            setAlert({state:true, status:404, success:false, message:'User is not logged in'}) 
            setDialog({...dialog,open:false})
        }
    }

    // Function to handle AlertBox
    const [alert,setAlert] = useState({state:false, status:0, success:false, message:''})
    const alertClose = () => {
        setAlert({state:false, status:0, success:false, message:''})
    }

    return (
        <>
        <Box sx={{m:3}} component={Paper}>
            <IconButton onClick={()=>change()}> <ArrowBackIcon/> Return</IconButton>
            <Grid container>
                <Grid item lg={6} sx={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                <Box sx={{mt:5}}>
                    <Magnifier className='zoom' src={state.mainImg} width={400} />;
                    </Box>
                <Box sx={{my:5}}>
                    {info.images.map(ele=>(
                        <img key={ele._id} onClick={()=>setState({...state,mainImg:ele.location})} style={{margin:'0px 20px'}} src={ele.location}  alt='product' width='100' height='100' />
                    ))}
                </Box>
                </Grid>
                <Grid item lg={6}>
                    <Typography sx={{mt:5}} variant='h4'>{info.name}</Typography>
                    <Typography variant='h5'><Rating value={info.rating} readOnly /></Typography>
                    <Typography sx={{mt:5}} variant='h5'>Price : {info.cost}</Typography>
                    <FormControl>
                        <FormLabel sx={{mt:3, fontSize:25}} component="legend">Color</FormLabel>
                        <RadioGroup row defaultValue={info.color[0].name}>
                            {info.color.map((ele,id) => (
                                <FormControlLabel key={id} sx={{ml:3}} onChange={e=>handler(e)} value={ele.name} control={<Radio />} label={<span style={{padding:'10px 20px',backgroundColor:ele.code, borderRadius:'10px'}}></span>} />
                            ))}
                        </RadioGroup>
                    </FormControl>
                    <Box sx={{display:'flex'}}><Typography sx={{mt:5, mb:2}} variant='h4'>Share </Typography><ShareIcon  sx={{fontSize:40, mt:5}}/></Box>
                    <Box>
                        <FacebookShareButton url={url}><FacebookIcon style={{marginLeft:'50px'}} round={true}/></FacebookShareButton>
                        <PinterestShareButton url={url}><PinterestIcon style={{marginLeft:'50px'}} round={true}/></PinterestShareButton>
                        <WhatsappShareButton url={url}><WhatsappIcon style={{marginLeft:'50px'}} round={true}/></WhatsappShareButton>
                        <TwitterShareButton url={url}><TwitterIcon style={{marginLeft:'50px'}} round={true}/></TwitterShareButton>
                    </Box>
                    <Box sx={{mt:5}}>
                        <Button onClick={()=>addCartFunc({id:info._id, name:info.name, producer: info.producer, color:state.color, img:info.images[0].location,numofitems:1, stock:info.stock, cost:info.cost})} variant='contained'>Add To Cart</Button>
                        <Button sx={{ml:10}} variant='contained' color='secondary' onClick={()=>setDialog({...dialog,open:true})}>Rate Product</Button>
                    </Box>
                </Grid>
                <Grid item lg={12}>
                    <Box sx={{mx:5}}>
                        <Tabs onChange={(e,v)=>setState({...state,tabpanel:v})} value={state.tabpanel} textColor='secondary' indicatorColor='secondary'>
                            <Tab value='description' label='Description' />
                            <Tab value='features' label='Features' />
                        </Tabs>
                        <Box sx={{mx:5, my:5}}>
                            {state.tabpanel==='description'?
                            <Typography variant='h6'>{info.desc}</Typography> :<>
                            <Typography variant='h6'>Category : {info.category.toUpperCase()}</Typography>
                            <Typography variant='h6'>Company : {info.producer}</Typography>
                            <Typography variant='h6'>Dimensions : {info.dimensions}</Typography>
                            <Typography variant='h6'>Material : {info.material}</Typography>
                            <Typography variant='h6'>Stock Availiabilty : {info.stock}</Typography>
                            </> }
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
        <Dialog onClose={()=>setDialog({...dialog,open:false})} open={dialog.open}>
            <DialogTitle >Rate the Product</DialogTitle>
            <DialogContent sx={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <Rating onChange={e=>setDialog({...dialog,rate:e.target.value})}  />
            <Button onClick={()=>rateProductFunc()} sx={{mt:3}} variant='outlined'>Rate</Button>
            </DialogContent>
        </Dialog>
        <AlertBox open={alert} onClose={alertClose}/>
        </>
        
    )
}

export default ProductsInfo
