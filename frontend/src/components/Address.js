import React, {useState, useEffect} from 'react'
import { createTheme, ThemeProvider, Typography, Box, Grid, CssBaseline, Button, TextField, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import {useSelector} from 'react-redux'
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import Header from './Header'
import Footer from './Footer'
import { addAddressData, getUserData, updateAddressData, deleteAddressData, setDefaultAddress } from '../config/UserNodeService';
import { RegForPincode } from '../config/Controller';
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

function Address() {

    // Redux State Variables
    const token = useSelector(state => state.user.token) || ''

    // State Variables
    const [state,setState] = useState({email:'', name:'', address:'', pincode:'', city:'', state:'', country:'', aid:'', profileImgPreview:"https://freesvg.org/storage/img/thumb/abstract-user-flat-3.png", addressData:[]})
    const [error,setError] = useState({pincode:''})
    const [effectState,setEffectState] = useState(false)
    const [changer, setChanger] = useState('ShowAddress')


    // function to navigate to diffrent components
    const navigate = useNavigate()

    useEffect(()=>{
        const decode = jwt_decode(token)
        getUserData(decode.email,token)
        .then(res=>{ 
            const data = res.data.info
            if(data.profileImg!=='http://localhost:9000/profile/') setState({...state,email:data.email, addressData:data.address, profileImgPreview:data.profileImg})
            else setState({...state,email:data.email,addressData:data.address})
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[effectState])

    // Function to handle AlertBox
    const [alert,setAlert] = useState({state:false, status:0, success:false, message:''})
    const alertClose = () => {
        setAlert({state:false, status:0, success:false, message:''})
    }

    // handler function
    const handler = e => {
        let name = e.target.name
        switch(name){
            case 'name':
                setState({...state,name:e.target.value})
                break

            case 'address':
                setState({...state,address:e.target.value})
                break

            case 'pincode':
                setError({...error,pincode:RegForPincode.test(e.target.value)?'':'Pincode must be six digits.'})
                setState({...state,pincode:e.target.value})
                break

            case 'city':
                setState({...state,city:e.target.value})
                break

            case 'state':
                setState({...state,state:e.target.value})
                break
            
            case 'country':
                setState({...state,country:e.target.value})
                break

            default: 
        }
    }


    const showAddress = (
        <>
            <Typography sx={{fontStyle:'bold', my:5, ml:5}} variant='h4' >Addresses <Button onClick={()=> setChanger('AddAddress')} sx={{height:30}} variant='contained'><AddIcon/></Button></Typography>
            {state.addressData.map((data,id)=>(
                <Accordion key={id} sx={{width:'90%', alignSelf:'center', my:1}}>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}><Typography color={data.isDeliveryAddress?'green':''} variant='h6'>{data.isDeliveryAddress?'Default : ':''}{data.name}</Typography></AccordionSummary>
                <AccordionDetails sx={{display:'flex', flexDirection:'column', ml:10}}>
                    <Typography variant='h6'>Address: {data.address}</Typography>
                    <Typography variant='h6'>Pincode: {data.pincode} </Typography>
                    <Typography variant='h6'>City: {data.city}</Typography>
                    <Typography variant='h6'>State: {data.state}</Typography>
                    <Typography variant='h6'>Country: {data.country}</Typography>
                    
                    <Box sx={{alignSelf:'end'}}>
                        <Button variant='contained' onClick={()=>defaultAddress(data._id)} sx={{mr:3, backgroundColor:'green'}}>Default</Button>
                        <Button onClick={()=> {setState({...state, name:data.name, aid:data._id, address:data.address, pincode:data.pincode, city:data.city, state:data.state, country:data.country}); setChanger('EditAddress')}} sx={{alignSelf:'end'}} variant="contained">Edit</Button>
                        <Button onClick={()=>deleteAddress(data._id)} sx={{ml:3, backgroundColor:'#9e2e2e'}} variant="contained">Delete</Button>
                    </Box>
                    
                </AccordionDetails>
            </Accordion>
            ))}
        </>
    )

    const AddAddress = (
        <>
            <Typography sx={{fontStyle:'bold', mt:5, ml:5}} variant='h4' >New Address </Typography>
            <TextField variant='outlined' sx={{mb:1, width:'90%', ml:5, mt:2}} label='Address Name' name='name' onChange={e=>handler(e)} />
            <TextField variant='outlined' sx={{mb:1, width:'90%', ml:5, mt:3}} label='Address' name='address' onChange={e=>handler(e)} />
            <TextField variant='outlined' sx={{mb:1, width:'90%', ml:5, mt:2}} label='Pincode' name='pincode' onChange={e=>handler(e)} error={error.pincode!==''?true:false} helperText={error.pincode} />
            <TextField variant='outlined' sx={{mb:1, width:'90%', ml:5, mt:2}} label='City' name='city' onChange={e=>handler(e)} />
            <TextField variant='outlined' sx={{mb:1, width:'90%', ml:5, mt:2}} label='State' name='state' onChange={e=>handler(e)} />
            <TextField variant='outlined' sx={{mb:3, width:'90%', ml:5, mt:2}} label='Country' name='country' onChange={e=>handler(e)} />
            <Box sx={{alignSelf:'end'}}>
                <Button onClick={e=> addAddress(e)} sx={{mr:5}} variant="contained">Add</Button>
                <Button onClick={()=>setChanger('ShowAddress')}  sx={{mr:{lg:6, md:4, sm:4}}} variant="contained">Cancel</Button>
            </Box>
        </>
    )

    const EditAddress = (
        <>
            <Typography sx={{fontStyle:'bold', mt:5, ml:5}} variant='h4' >Edit Address </Typography>
            <TextField variant='outlined' sx={{mb:1, width:'90%', ml:5, mt:2}} label='Address Name' name='name' onChange={e=>handler(e)} value={state.name} />
            <TextField variant='outlined' sx={{mb:1, width:'90%', ml:5, mt:3}} label='Address' name='address' onChange={e=>handler(e)} value={state.address}/>
            <TextField variant='outlined' sx={{mb:1, width:'90%', ml:5, mt:2}} label='Pincode' name='pincode' onChange={e=>handler(e)} error={error.pincode!==''?true:false} helperText={error.pincode} value={state.pincode}/>
            <TextField variant='outlined' sx={{mb:1, width:'90%', ml:5, mt:2}} label='City' name='city' onChange={e=>handler(e)} value={state.city}/>
            <TextField variant='outlined' sx={{mb:1, width:'90%', ml:5, mt:2}} label='State' name='state' onChange={e=>handler(e)} value={state.state}/>
            <TextField variant='outlined' sx={{mb:3, width:'90%', ml:5, mt:2}} label='Country' name='country' onChange={e=>handler(e)} value={state.country}/>
            <Box sx={{alignSelf:'end'}}>
                <Button onClick={e=> updateAddress(e)} sx={{mr:5}} variant="contained">Update</Button>
                <Button onClick={()=>setChanger('ShowAddress')}  sx={{mr:{lg:6, md:4, sm:4}}} variant="contained">Cancel</Button>
            </Box>
        </>
    )

    const defaultAddress = (id) => {
        setDefaultAddress(id).then(res=>{
            setEffectState(prev=>!prev)
        })
    }

    const addAddress = e => {
        e.preventDefault()
        if(state.email!=='' && state.address!=='' && state.pincode!=='' && state.city!=='' && state.state!=='' && state.country!==''){
            if(error.pincode===''){
                let bool = true
                if(state.addressData!==0){
                    state.addressData.forEach(ele=>{
                        if(ele.address.toLowerCase().includes(state.address.toLowerCase()) ) bool = false
                    })
                }
                if(bool){
                    addAddressData({email:state.email, name:state.name, address:state.address, pincode:state.pincode, city:state.city, state:state.state, country:state.country})
                    .then(res => {
                        setAlert({state:true, status:res.data.status_code, success:res.data.success, message:res.data.message})
                        setChanger('ShowAddress')
                        setEffectState(prev=>!prev)
                    })
                } else setAlert({state:true, status:404, success:false, message:'Address must not be Same'}) 
            }else setAlert({state:true, status:404, success:false, message:'Pincode Validation Error'}) 
        } else setAlert({state:true, status:404, success:false, message:'Input Field must not be empty'})
    }

    const updateAddress = e => {
        e.preventDefault()
        if(state.address!=='' && state.pincode!=='' && state.city!=='' && state.state!=='' && state.country!=='' && state.aid!==''){
            if(error.pincode===''){
                let bool = true
                if(state.addressData!==0){
                    state.addressData.forEach(ele=>{
                        if(ele.address.toLowerCase().includes(state.address.toLowerCase()) ) bool = false
                    })
                }
                if(bool){
                    updateAddressData({id:state.aid, name:state.name, address:state.address, pincode:state.pincode, city:state.city, state:state.state, country:state.country})
                    .then(res => {
                        setAlert({state:true, status:res.data.status_code, success:res.data.success, message:res.data.message})
                        setChanger('ShowAddress')
                        setEffectState(prev=>!prev)
                    })
                } else setAlert({state:true, status:404, success:false, message:'Address must not be Same'}) 
            }else setAlert({state:true, status:404, success:false, message:'Pincode Validation Error'}) 
        } else setAlert({state:true, status:404, success:false, message:'Input Field must not be empty'})
    }

    const deleteAddress = (id) => {
        deleteAddressData(id)
        .then(res =>{
            setAlert({state:true, status:res.data.status_code, success:res.data.success, message:res.data.message})
            setChanger('ShowAddress')
            setEffectState(prev=>!prev)
        })
    }


    return (
        <div>
            <Header/>
            <ThemeProvider theme={theme}>
                <Typography sx={{fontStyle:'bold', mt:5, ml:5}} variant='h3' >My Account</Typography>
                <Grid container sx={{mb:20}}>
                    <CssBaseline/>
                    <Grid item lg={6} md={4} sm={12}>
                        <Box sx={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                            <img src={state.profileImgPreview} alt='profile-img' style={{width:'200px', height:'200px', borderRadius:'100%'}} />     
                            <Button onClick={()=>navigate('/order')} sx={{my:3, width:{lg:'30%', md:'50%', sm:'60%'}, mt:10}} variant="outlined"><Typography sx={{fontSize:20}} variant='body2'>Order</Typography></Button>
                            <Button onClick={()=>navigate('/profile')} sx={{my:3, width:{lg:'30%', md:'50%', sm:'60%'}}} variant="outlined"><Typography sx={{fontSize:20}} variant='body2'>Profile</Typography></Button>
                            <Button onClick={()=>navigate('/address')} sx={{my:3, width:{lg:'30%', md:'50%', sm:'60%'}}} variant="outlined"><Typography sx={{fontSize:20}} variant='body2'>Address</Typography></Button>
                        </Box>
                    </Grid>
                    <Grid sx={{mt:5}} item lg={6} md={8} sm={12}>
                        <Paper elevation={20} sx={{display:'flex', flexDirection:'column', mx:5, py:2}}>
                            {changer==='ShowAddress'? showAddress : null }
                            {changer==='AddAddress'? AddAddress : null }
                            {changer==='EditAddress'? EditAddress : null}
                            
                        </Paper>
                    </Grid>
                </Grid>
                <AlertBox open={alert} onClose={alertClose}/>
            </ThemeProvider>
            <Footer/>
            
        </div>
    )
}

export default Address
