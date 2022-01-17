import React, {useState, useRef} from 'react'
import { useNavigate } from 'react-router-dom';
import { createTheme, Grid, ThemeProvider, CssBaseline, Paper, Typography, Box, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button, InputAdornment, IconButton} from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { RegForName, RegForEmail, RegForMobile, RegForPassword } from '../config/Controller';
import Footer from './Footer'
import Header from './Header'
import { addUser } from '../config/UserNodeService';
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

function Register() {

    //state variables
    const [state,setState] = useState({fname:'',lname:'',email:'',password:'',cpassword:'',gender:'',mobile:''})
    const [error,setError] = useState({fname:'',lname:'',email:'',password:'',cpassword:'',mobile:''})
    const [showpassword, setShowPassword] = useState({pass:false,cpass:false})

    //useRef Assigning
    const fnameRef = useRef(null)
    const lnameRef = useRef(null)
    const mobileRef = useRef(null)
    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const cpasswordRef = useRef(null)

    // Function to navigate to diffrent components
    const navigate = useNavigate()

    //handler function to perform validation
    const handler = e =>{
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

            case 'password':
                setError({...error,password:RegForPassword.test(passwordRef.current.value)?'':'Please enter password'})
                setState({...state,password:passwordRef.current.value})
                break

            case 'cpassword':
                setError({...error,cpassword:state.password=== cpasswordRef.current.value?'':'Password and Confirm Password must be match'})
                setState({...state,cpassword:cpasswordRef.current.value})
                break
                
            case 'mobile':
                setError({...error,mobile:RegForMobile.test(mobileRef.current.value)?'':'Please enter mobile no.'})
                setState({...state,mobile:mobileRef.current.value})
                break

            case 'gender':
                setState({...state,gender:e.target.value})
                break

            default:  
        }
    }

    // Function to handle AlertBox
    const [alert,setAlert] = useState({state:false, status:0, success:false, message:''})
    const alertClose = () => {
        const bool = alert.success
        setAlert({state:false, status:0, success:false, message:''})
        if(bool) navigate('/login')
    }

    //function to submit form data to server
    const formSubmit = async(e) =>{
        e.preventDefault()
        const checkpass = await checkPassword()
        if(state.fname!=='' && state.lname!=='' && state.email!=='' && state.password!=='' && state.cpassword!=='' && state.gender!=='' && state.mobile!==''){
            if(error.fname==='' && error.lname==='' && error.email==='' && error.password==='' && error.cpassword==='' && error.mobile===''){
                if(checkpass){
                    addUser({fname:state.fname,lname:state.lname,email:state.email,password:state.password,mobile:state.mobile,gender:state.gender})
                    .then(res=>{
                        setAlert({state:true, status:res.data.status_code, success:res.data.success, message:res.data.message})
                    })
                    // navigate('/login')
                }
                else setAlert({state:true, status:404, success:false, message:'Password and Confirm Password must be match'}) 
            }else setAlert({state:true, status:404, success:false, message:'Validation Error'}) 
        } else setAlert({state:true, status:404, success:false, message:'Input Field must not be empty'})  
    }

    // function to check whether password and confirm password match
    const checkPassword = () =>{
        return new Promise((resolve,reject)=>{
            if(state.password!==state.cpassword) {
                setError({...error,cpassword:'Password and Confirm Password must be match'})
                resolve(false)
            } else{
                setError({...error,cpassword:''})
                resolve(true)
            } 
        })
    }


    return (
        <div>
            <Header/>
            <ThemeProvider theme={theme}>
                <Grid container>
                    <CssBaseline/>
                    <Grid item xs={false} lg={6} md={4} sm={12} 
                        sx={{
                            backgroundImage:'url(images/register-wall.jpg)',
                            backgroundRepeat:'no-repeat',
                            backgroundSize:'cover',
                            backgroundPosition:'center'

                    }} />
                    <Grid item xs={false} lg={6} md={8} sm={12} component={Paper} elevation={20}>
                        <Box sx={{my:10, mx:4, display:'flex', flexDirection:'column', alignItems:'center'}}>
                            <Box sx={{display:'inline-flex '}}><AccountCircleIcon sx={{fontSize:42}}/><ArrowRightAltIcon sx={{fontSize:42}}/><Typography variant='h4'>NeoSTORE</Typography></Box>
                            <Box component='form' onSubmit={formSubmit} >
                                <Box sx={{mt:10, display:'flex', flexDirection:'column', alignItems:'center'}}>
                                    <TextField sx={{width:{lg:700,md:600,sm:500}, my:1}} label='First Name' name='fname' inputRef={fnameRef} onChange={handler} error={error.fname!==''?true:false} helperText={error.fname} />
                                    <TextField sx={{width:{lg:700,md:600,sm:500}, my:1}} label='Last Name' name='lname' inputRef={lnameRef} onChange={handler} error={error.lname!==''?true:false} helperText={error.lname} />
                                    <TextField sx={{width:{lg:700,md:600,sm:500}, my:1}} label='Email' name='email' inputRef={emailRef} onChange={handler} error={error.email!==''?true:false} helperText={error.email} />
                                    {/* Implemented Show and Hide Password */}
                                    <TextField sx={{width:{lg:700,md:600,sm:500}, my:1}} label='Password' name='password' inputRef={passwordRef} error={error.password!==''?true:false} helperText={error.password} 
                                    type={showpassword.pass?'text':'password'}
                                    onMouseLeave={()=>setShowPassword({...showpassword,pass:false})}
                                    onChange={handler}
                                    value={state.password}
                                    InputProps={{ endAdornment:<InputAdornment position='end'>
                                        <IconButton onClick={()=>setShowPassword({...showpassword,pass:!showpassword.pass})} >
                                            {showpassword.pass?<Visibility/>:<VisibilityOff/>}</IconButton>
                                    </InputAdornment>}}
                                    />
                                    {/* Implemented Show and Hide Password */}
                                    <TextField sx={{width:{lg:700,md:600,sm:500}, my:1}} label='Confirm Password' name='cpassword' inputRef={cpasswordRef} error={error.cpassword!==''?true:false} helperText={error.cpassword} 
                                    type={showpassword.cpass?'text':'password'}
                                    onMouseLeave={()=>setShowPassword({...showpassword,cpass:false})}
                                    onChange={handler}
                                    value={state.cpassword}
                                    InputProps={{ endAdornment:<InputAdornment position='end'>
                                        <IconButton onClick={()=>setShowPassword({...showpassword,cpass:!showpassword.cpass})} >
                                            {showpassword.cpass?<Visibility/>:<VisibilityOff/>}</IconButton>
                                    </InputAdornment>}}
                                    />
                                    <TextField sx={{width:{lg:700,md:600,sm:500}, my:1}} label='Mobile No.' name='mobile' inputRef={mobileRef} onChange={handler} error={error.mobile!==''?true:false} helperText={error.mobile} />
                                </Box>
                                <FormControl component='fieldset' sx={{my:3}} >
                                    <FormLabel component='legend'>Gender</FormLabel>
                                    <RadioGroup row>
                                        <FormControlLabel value='male' control={<Radio/>} name='gender' label='Male' onChange={e=>handler(e)} />
                                        <FormControlLabel value='female' control={<Radio/>} name='gender' label='Female' onChange={e=>handler(e)}/>
                                    </RadioGroup>
                                </FormControl>
                                <Button type='submit' fullWidth variant='contained'>Register</Button> 
                            </Box>
                        </Box>

                    </Grid>
                </Grid>
                <AlertBox open={alert} onClose={alertClose}/>
            </ThemeProvider>
            <Footer/>
        </div>
    )
}

export default Register
