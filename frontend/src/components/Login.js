import React, {useState, useRef} from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { createTheme, Grid, ThemeProvider, CssBaseline, Typography, Box, TextField, Button, InputAdornment, IconButton } from '@mui/material'
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { RegForEmail, RegForPassword } from '../config/Controller';
import Footer from './Footer'
import Header from './Header'
import RecoverPassword from './RecoverPassword';
import { getUser, socialLogin } from '../config/UserNodeService';
import AlertBox from './AlertBox';
import { userLogin } from '../redux/userReducer';
import { getCart } from '../config/ProductNodeService';
import { mergeCartDispatch } from '../redux/CartReducer';
import SocialButton from './SocialButton';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';




const theme = createTheme({
    palette:{
        mode:'dark',
        white:{
          main:'#FFFFFF',
          backgroundColor:'#FFFFFF'
        }
    }
  })


function Login() {

     //state variables
     const [state,setState] = useState({email:'',password:''})
     const [error,setError] = useState({email:'',password:''})
     const [showpassword, setShowPassword] = useState(false)
 
     //useRef Assigning
     const emailRef = useRef(null)
     const passwordRef = useRef(null)
     const socialRef = useRef(null)
 
     // Function to navigate to diffrent components
     const navigate = useNavigate()

     // Function to call redux Functions
     const dispatch = useDispatch()
 
     //handler function to perform validation
     const handler = e =>{
         let name = e.target.name
         switch(name){
 
             case "email":
                 setError({...error,email:RegForEmail.test(emailRef.current.value)?'':'Please enter email'})
                 setState({...state,email:emailRef.current.value})
                 break
 
             case 'password':
                 setError({...error,password:RegForPassword.test(passwordRef.current.value)?'':'Please enter password'})
                 setState({...state,password:passwordRef.current.value})
                 break
 
             default:  
         }
    }

    const formSubmit = e =>{
        e.preventDefault()
        if(state.email!=='' && state.pasword!==''){
            if(error.email==='' && error.password===''){
                getUser({email:state.email,password:state.password})
                .then(res=>{
                    if(res.data.status_code===200){
                        const decode = jwtDecode(res.data.token)
                        getCart(decode.email).then(res => {
                            dispatch(mergeCartDispatch(res.data,decode.email))
                        })
                        dispatch(userLogin('LOGGED_IN',res.data.token))
                    }
                    setAlert({state:true, status:res.data.status_code, success:res.data.success, message:res.data.message})  
                })
            }else setAlert({state:true, status:404, success:false, message:'Validation Error'}) 
        } else setAlert({state:true, status:404, success:false, message:'Input Field must not be empty'})
        
    }

    // Function to handle AlertBox
    const [alert,setAlert] = useState({state:false, status:0, success:false, message:''})
    const alertClose = () => {
        const bool = alert.success
        setAlert({state:false, status:0, success:false, message:''})
        if(bool) navigate('/')
    }

    // Functions to open and close Dialog Box
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    //Functions to handle Social Login
    const socialLoginFunc = (user) => {
        const {email, firstName, lastName} = user._profile
        socialLogin({email:email,fname:firstName, lname:lastName,}).then(res=>{
            if(res.data.status_code===200){
                const decode = jwtDecode(res.data.token)
                getCart(decode.email).then(res => {
                    dispatch(mergeCartDispatch(res.data,decode.email))
                })
                dispatch(userLogin('LOGGED_IN',res.data.token))
            }
            setAlert({state:true, status:res.data.status_code, success:res.data.success, message:res.data.message})  
        })
    }




    return (
        <div>
            <Header/>
            <ThemeProvider theme={theme}>
                <Grid container sx={{
                            backgroundImage:'url(images/login-wall.jpg)',
                            backgroundRepeat:'no-repeat',
                            backgroundSize:'cover',
                            backgroundPosition:'center',
                            paddingBottom:10

                    }}>
                    <CssBaseline/>
                    <Grid item xs={false} lg={6} md={4} sm={12}>
                        <Box sx={{my:10, display:'flex', flexDirection:'column', alignItems:'center', width:'70%', mx:'auto'}}> 
                            <SocialButton
                                provider="google"
                                appId="64099276089-funuirs2ap64q0jvaj5rbvlqafo18pt2.apps.googleusercontent.com"
                                onLoginSuccess={socialLoginFunc}
                                color='red'
                                ref={socialRef}
                                >
                                <GoogleIcon sx={{fontSize:35, mr:3}}/> Login with Google 
                            </SocialButton>
                            <SocialButton
                                provider="facebook"
                                appId="287007216646743"
                                onLoginSuccess={socialLoginFunc}
                                color='blue'
                                red={socialRef}
                                >
                                <FacebookIcon sx={{fontSize:35, mr:3}}/> Login with Facebook
                            </SocialButton>
                            <Button fullWidth sx={{height:70, my:2,  backgroundColor:'skyblue', fontSize:20}} variant='contained'><TwitterIcon sx={{fontSize:35, mr:3}}/>Login with Twitter</Button> 
                        </Box>

                    </Grid>
                    <Grid item xs={false} lg={6} md={8} sm={12} >
                        <Box sx={{my:10, mx:4, display:'flex', flexDirection:'column', alignItems:'center', borderLeft:6, borderColor:'#FFFFFF', color:'#FFFFFF'}}>
                            <Box sx={{display:'inline-flex '}}><LockOpenIcon sx={{fontSize:42}}/><ArrowRightAltIcon sx={{fontSize:42}}/><Typography variant='h4'>NeoSTORE</Typography></Box>
                            <Box component='form' onSubmit={formSubmit} >
                                <Box sx={{mt:10, display:'flex', flexDirection:'column', alignItems:'center'}}>
                                <TextField sx={{width:{lg:700,md:600,sm:500}, my:1}} label='Email' name='email' inputRef={emailRef} onChange={handler} error={error.email!==''?true:false} helperText={error.email} />
                                    {/* Implemented Show and Hide Password */}
                                    <TextField sx={{width:{lg:700,md:600,sm:500}, my:1}} label='Password' name='password' inputRef={passwordRef} error={error.password!==''?true:false} helperText={error.password} 
                                    type={showpassword?'text':'password'}
                                    onMouseLeave={()=>setShowPassword(false)}
                                    onChange={handler}
                                    value={state.password}
                                    InputProps={{ endAdornment:<InputAdornment position='end'>
                                        <IconButton onClick={()=>setShowPassword(prev => !prev)} >
                                            {showpassword?<Visibility/>:<VisibilityOff/>}</IconButton>
                                    </InputAdornment>}}
                                    />
                                </Box>
                                <Button type='submit' fullWidth sx={{mt:10}} variant='contained'>Log In</Button> 
                                <Box sx={{mt:2,display:'flex', flexDirection: 'row-reverse' }}><Button onClick={handleClickOpen} variant='text'>Forgot Password</Button></Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
               
                <RecoverPassword open={open} onClose={handleClose}/>
                <AlertBox open={alert} onClose={alertClose}/>
            </ThemeProvider>
            <Footer/>
        </div>
    )
}

export default Login
