import React, {useState, useEffect, useRef} from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode'
import { createTheme, ThemeProvider, Typography, Box, Grid, CssBaseline, Button, TextField, Paper, FormControl, FormLabel, RadioGroup, Radio, FormControlLabel } from '@mui/material'
import { RegForName, RegForEmail, RegForMobile, RegForPassword } from '../config/Controller';
import Header from './Header'
import Footer from './Footer'
import { getUserData, updateProfile, updateProfileImage, updateUserPassword } from '../config/UserNodeService';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
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

function Profile() {

    //redux state variables
    const token = useSelector(state => state.user.token) || ''

    // State Variables
    const [effectState,setEffectState] = useState(false)
    const [changer, setChanger] = useState('Profile')
    const [state,setState] = useState({fname:'',lname:'',email:'',gender:'',mobile:'', verify:'',profileImg:'',profileImgPreview:"https://freesvg.org/storage/img/thumb/abstract-user-flat-3.png", date:''})
    const [error,setError] = useState({fname:'',lname:'',email:'',mobile:''})
    const [colorState, setColorState] = useState(false)
    const [password,setPassword] = useState({oldpass:'',newpass:'',confirmpass:''})
    const [errPassword,setErrPassword] = useState({oldpass:'',newpass:'',confirmpass:''})

    // function to navigate to diffrent components
    const navigate = useNavigate()

    //useRef Assigning
    const fnameRef = useRef(null)
    const lnameRef = useRef(null)
    const mobileRef = useRef(null)
    const emailRef = useRef(null)

    // Function to get user Data from database
    useEffect(()=>{
        const decode = jwt_decode(token)
        getUserData(decode.email,token)
        .then(res=>{
            const data = res.data.info
            if(data.profileImg!=='http://localhost:9000/profile/')setState({...state,fname:data.fname,lname:data.lname,email:data.email, gender:data.gender, mobile:data.mobile,verify:data.userVerify, profileImgPreview:data.profileImg, date:data.birthdate})
            else setState({...state,fname:data.fname,lname:data.lname,email:data.email, gender:data.gender, mobile:data.mobile,verify:data.userVerify, date:data.birthdate})
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[effectState])

    // Function to handle AlertBox
    const [alert,setAlert] = useState({state:false, status:0, success:false, message:''})
    const alertClose = () => {
        setAlert({state:false, status:0, success:false, message:''})
    }


    //Handler Functions
    const handler = e => {
        let name = e.target.name
        switch(name){
            case 'fname':
                setError({...error,fname:RegForName.test(fnameRef.current.value)?'':'Please enter first name'})
                setState({...state,fname:fnameRef.current.value})
                break

            case 'lname':
                setError({...error,lname:RegForName.test(lnameRef.current.value)?'':'Please enter last name'})
                setState({...state,lname:lnameRef.current.value})
                break

            case "email":
                setError({...error,email:RegForEmail.test(emailRef.current.value)?'':'Please enter email'})
                setState({...state,email:emailRef.current.value})
                break
                
            case 'mobile':
                setError({...error,mobile:RegForMobile.test(mobileRef.current.value)?'':'Please enter mobile no.'})
                setState({...state,mobile:mobileRef.current.value})
                break

            case 'gender':
                setState({...state,gender:e.target.value})
                break

            case 'profileImg':
                setState({...state,profileImg:e.target.files[0]})
                break

            case 'date':
                setState({...state,date:e.target.value})
                break

            case 'oldpass':
                setErrPassword({...errPassword,oldpass:RegForPassword.test(e.target.value)?'':'Password Format is Wrong'})
                setPassword ({...password,oldpass:e.target.value})
                break

            case 'newpass':
                setErrPassword({...errPassword,newpass:RegForPassword.test(e.target.value)?'':'Password Format is Wrong'})
                setPassword ({...password,newpass:e.target.value})
                break

            case 'confirmpass':
                setErrPassword({...errPassword,confirmpass:password.newpass===e.target.value?'':'New Password and Confirm Password must be same.'})
                setPassword ({...password,confirmpass:e.target.value})
                break

            default:  
        }
    }

    //Function to Update Profile Data

    const updateUser = () =>{
        if(state.fname!=='' && state.lname!=='' && state.email!=='' && state.gender!=='' && state.mobile!=='' && state.date!==''){
            if(error.fname==='' && error.lname==='' && error.email==='' && error.mobile===''){
                updateProfile({fname:state.fname,email:state.email, lname:state.lname,gender:state.gender,mobile:state.mobile, date:state.date})
                .then(res =>{
                    setAlert({state:true, status:res.data.status_code, success:res.data.success, message:res.data.message})  
                    setChanger('Profile')
                })     
            }else setAlert({state:true, status:404, success:false, message:'Validation Error'}) 
        } else setAlert({state:true, status:404, success:false, message:'Input Field must not be empty'})
    }



    const showProfile = (
        <>
            <Typography sx={{fontStyle:'bold', mt:4, ml:5}} variant='h4' >Profile</Typography>
            <TextField variant='outlined' sx={{mb:2, width:'90%', ml:5, mt:3}} InputProps={{ readOnly:true}} label='First Name' value={state.fname}/>
            <TextField variant='outlined' sx={{my:2, width:'90%', ml:5}} InputProps={{ readOnly:true}} label='Last Name' value={state.lname} />
            <TextField variant='outlined' sx={{my:2, width:'90%', ml:5}} InputProps={{ readOnly:true}} label='Email' value={state.email} />
            <FormControl sx={{ml:5}} component={"fieldset"}>
                <FormLabel>Gender</FormLabel>
                <RadioGroup row value={state.gender} >
                    <FormControlLabel  readOnly label="Male" control={<Radio/>} value="male"/>
                    <FormControlLabel readOnly label="Female" control={<Radio/>} value="female"/>
                </RadioGroup>
            </FormControl>
            <TextField variant='outlined' sx={{my:2, width:'90%', ml:5}} InputProps={{ readOnly:true}} label='Date of Birth' value={state.date} />
            <TextField variant='outlined' sx={{my:2, width:'90%', ml:5}} InputProps={{ readOnly:true}} label='Mobile' value={state.mobile} />
            <Typography sx={{ml:5, mt:2}} color={state.verify?'green':''} variant='h5'>Email Verified</Typography>
            <Button onClick={()=>{setChanger('EditProfile')}} sx={{alignSelf:'end', mr:'5%', mt:2, px:3}} variant="contained">Edit</Button>
        </>
    )

    const editProfile = (
        <>
            <Typography sx={{fontStyle:'bold', mt:5, ml:5}} variant='h4' >Edit Profile</Typography>
            <TextField variant='outlined' sx={{mb:2, width:'90%', ml:5, mt:3}} label='First Name' name='fname' inputRef={fnameRef} onChange={e=>handler(e)} error={error.fname!==''?true:false} helperText={error.fname} value={state.fname}/>
            <TextField variant='outlined' sx={{my:2, width:'90%', ml:5}} label='Last Name'  name='lname' inputRef={lnameRef} onChange={e=>handler(e)} error={error.lname!==''?true:false} helperText={error.lname} value={state.lname}/>
            <FormControl sx={{ml:5}} component={"fieldset"}>
                <FormLabel>Gender</FormLabel>
                <RadioGroup row value={state.gender} >
                    <FormControlLabel  label="Male" control={<Radio/>} name='gender' value="male" onChange={e=>handler(e)} />
                    <FormControlLabel  label="Female" control={<Radio/>} name='gender' value="female" onChange={e=>handler(e)} />
                </RadioGroup>
            </FormControl>
            <FormControl sx={{ml:5, my:2}}>
                <FormLabel>Date of Birth</FormLabel>
                <input type='date' className='birth-date-picker' name='date' max="2022-01-05" onChange={e=>handler(e)} value={state.date} />
            </FormControl>

            <TextField variant='outlined' sx={{my:2, width:'90%', ml:5}} label='Mobile'  name='mobile' inputRef={mobileRef} onChange={e=>handler(e)} error={error.mobile!==''?true:false} helperText={error.mobile} value={state.mobile}/>
            <Box sx={{alignSelf:'end'}}>
                <Button onClick={()=>updateUser()} sx={{mr:5}} variant="contained">Update</Button>
                <Button onClick={()=>setChanger('Profile')} sx={{mr:3}} variant="contained">Cancel</Button>
            </Box>
            
        </>
    )

    const changePassword = (
        <>
            <Typography sx={{fontStyle:'bold', my:5, ml:5}} variant='h4' >Change Password</Typography>
            <TextField variant='outlined' sx={{mb:2, width:'90%', ml:5, mt:3}} label='Old Password' name='oldpass' onChange={e=>handler(e)} error={errPassword.oldpass!==''?true:false} helperText={errPassword.oldpass} />
            <TextField variant='outlined' sx={{mb:2, width:'90%', ml:5, mt:3}} label='New Password' name='newpass' onChange={e=>handler(e)} error={errPassword.newpass!==''?true:false} helperText={errPassword.newpass} />
            <TextField variant='outlined' sx={{mb:2, width:'90%', ml:5, mt:3}} label='Confirm Password' name='confirmpass' onChange={e=>handler(e)} error={errPassword.confirmpass!==''?true:false} helperText={errPassword.confirmpass} />
            <Button onClick={e=>updatePassword(e)} sx={{alignSelf:'end', mr:'5%', mt:3, px:3}} variant="contained">Update</Button>
        </>
    )

    const photoupload = e => {
        e.preventDefault()
        if(colorState && state.email!==''){
            let formData = new FormData()
            formData.append('email',state.email)
            formData.append('profileImg',state.profileImg)
            updateProfileImage(formData)
            .then(res => {
                setAlert({state:true, status:res.data.status_code, success:res.data.success, message:res.data.message})  
                setEffectState(prev => !prev)
                setColorState(prev => !prev)
            })
        }
    }

    const updatePassword = e => {
        e.preventDefault()
        if(password.oldpass!=='' && password.newpass!=='' && password.confirmpass!=='' && state.email!==''){
            if(errPassword.oldpass==='' && errPassword.newpass==='' && errPassword.confirmpass===''){
                updateUserPassword({email:state.email, oldpass:password.oldpass, newpass:password.newpass})
                .then(res => {
                    setAlert({state:true, status:res.data.status_code, success:res.data.success, message:res.data.message})  
                    setChanger('Profile')
                })
            }else setAlert({state:true, status:404, success:false, message:'Validation Error'}) 
        } else setAlert({state:true, status:404, success:false, message:'Input Field must not be empty'})
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
                                <Box sx={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                    <label className="custom-file-upload"><input type="file" accept='image/png, image/jpg, image/jpeg' name='profileImg' onChange={e=>{setColorState(true);handler(e);}}/><PhotoCameraIcon sx={{fontSize:35}}/></label>
                                    <img src={state.profileImgPreview} alt='profile-img' style={{width:'200px', height:'200px', borderRadius:'100%'}} />
                                    <Button onClick={photoupload} sx={{my:3, mt:2}} color={colorState?'success':'primary'} variant="outlined"><Typography sx={{fontSize:20}} variant='body2'>Photo Upload</Typography></Button>
                                </Box>
                            <Button onClick={()=>navigate('/order')} sx={{my:3, width:{lg:'30%', md:'50%', sm:'60%'}, mt:10}} variant="outlined"><Typography sx={{fontSize:20}} variant='body2'>Order</Typography></Button>
                            <Button onClick={()=>setChanger('Profile')} sx={{my:3, width:{lg:'30%', md:'50%', sm:'60%'}}} variant="outlined"><Typography sx={{fontSize:20}} variant='body2'>Profile</Typography></Button>
                            <Button onClick={()=>navigate('/address')} sx={{my:3, width:{lg:'30%', md:'50%', sm:'60%'}}} variant="outlined"><Typography sx={{fontSize:20}} variant='body2'>Address</Typography></Button>
                            <Button onClick={()=>setChanger('ChangePassword')} sx={{my:3, width:{lg:'30%', md:'50%', sm:'60%'}}} variant="outlined"><Typography sx={{fontSize:20}} variant='body2'>Change Password</Typography></Button>
                        </Box>
                    </Grid>
                    <Grid sx={{mt:5}} item lg={6} md={8} sm={12}>
                        <Paper elevation={20} sx={{display:'flex', flexDirection:'column', mx:5, py:2}}>
                            { changer==='Profile'?showProfile : null }
                            { changer === 'EditProfile'? editProfile : null}
                            { changer === 'ChangePassword'? changePassword : null} 
                            
                        </Paper>
                    </Grid>
                </Grid>
                <AlertBox open={alert} onClose={alertClose}/>
            </ThemeProvider>
            <Footer/>
        </div>
    )
}

export default Profile
