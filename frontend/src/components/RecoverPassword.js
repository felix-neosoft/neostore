import React, {useState, useRef} from 'react'
import { Dialog, DialogTitle, Alert, Box, TextField, Button, InputAdornment, IconButton } from '@mui/material';
import { RegForEmail, RegForPassword, RegForOTP } from '../config/Controller';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { changePassword, recoverPassword } from '../config/UserNodeService';


function RecoverPassword(props) {
    // props data
    const { onClose, open } = props;


    //state variables
    const [state, setState] = useState({email:'',password:'',cpassword:'',code:''})
    const [error, setError] = useState({email:'',password:'',cpassword:'',code:''})
    const [changer, setChanger] = useState(true)
    const [showpassword, setShowPassword] = useState({pass:false,cpass:false})
    const [emailQuery, setEmailQuery] = useState({state:false,status:0, success:false, message:''})
    const [passwordQuery, setPasswordQuery] = useState({state:false,status:0, success:false, message:''})

    // useRef Assigning
    const emailRef = useRef()
    const passwordRef = useRef()
    const cpasswordRef = useRef()
    const codeRef = useRef()

    //handler function to perform validation
    const handler = e =>{
        let name = e.target.name
        switch(name){
            case "email":
                setError({...error,email:RegForEmail.test(emailRef.current.value)?'':'Please enter email'})
                setState({...state,email:emailRef.current.value})
                break

            case 'code':
                setError({...error,code:RegForOTP.test(codeRef.current.value)?'':'OTP must be six digits'})
                setState({...state,code:codeRef.current.value})
                break

            case 'password':
                setError({...error,password:RegForPassword.test(passwordRef.current.value)?'':'Please enter password'})
                setState({...state,password:passwordRef.current.value})
                break

            case 'cpassword':
                setError({...error,cpassword:state.password=== cpasswordRef.current.value?'':'Password and Confirm Password must be match'})
                setState({...state,cpassword:cpasswordRef.current.value})
                break

            default:  
        }
    }

    const sendEmail = () => {
        if(state.email!==''){
            if(error.email===''){
                recoverPassword(state.email)
                .then(res=>{
                    if(res.data.status_code===200){
                        setChanger(prev => !prev)
                        setEmailQuery({state:false,status:0, success:false, message:''})
                    }
                    else setEmailQuery({state:true,status:res.data.status_code, success:res.data.success, message:res.data.message})
                })
            }else alert('Validation Error')
        }else alert('Email must not be blank')
    }

    const changePasswordFunc = () => {
        if(state.code!=='' && state.password!=='' && state.cpassword!==''){
            if(error.password==='' && error.cpassword==='' && error.code===''){
                changePassword({email:state.email,password:state.password,code:state.code})
                .then(res => {
                    if(res.data.status_code===200){
                        setChanger(prev => !prev)
                        setPasswordQuery({state:false,status:0, success:false, message:''})
                        onClose()
                    } else setPasswordQuery({state:true,status:res.data.status_code, success:res.data.success, message:res.data.message})
                })
            }else alert('Validation error')
        }else alert('Input Fields must not be blank')
    }

    const provideEmail = (
        <>
            <Alert sx={{mx:2, width:300}} severity={emailQuery.state?'warning':'info'}>{emailQuery.state? emailQuery.message:'Please enter your email ID to recover password'}</Alert>
            <TextField sx={{width:'90%', mx:'auto', my:2}} color='secondary'  label='Email' name='email' inputRef={emailRef} onChange={handler} error={error.email!==''?true:false} helperText={error.email} />
            <Button onClick={sendEmail} sx={{alignSelf:'flex-end', mr:3, my:2}} variant='contained'>Submit</Button>

        </>
    )

    const provideNewPassword = (
        <>
            <Alert sx={{mx:2, width:300}} severity={passwordQuery.state?'warning':'info'}>{passwordQuery.state? passwordQuery.message:'OTP has been send to registered email'}</Alert>
            <Box sx={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                <TextField sx={{width:'90%', mt:2, mb:1}} color='secondary'  label='Verification Code' name='code' inputRef={codeRef} onChange={e=>handler(e)} error={error.code!==''?true:false} helperText={error.code}  />
                {/* Implemented Show and Hide Password */}
                <TextField sx={{width:'90%', mx:'auto', my:2}} label='Password' name='password' inputRef={passwordRef} error={error.password!==''?true:false} helperText={error.password} 
                type={showpassword.pass?'text':'password'}
                onMouseLeave={()=>setShowPassword({...showpassword,pass:false})}
                onChange={e=>handler(e)}
                value={state.password}
                InputProps={{ endAdornment:<InputAdornment position='end'>
                    <IconButton onClick={()=>setShowPassword({...showpassword,pass:!showpassword.pass})} >
                        {showpassword.pass?<Visibility/>:<VisibilityOff/>}</IconButton>
                    </InputAdornment>}}
                />
                {/* Implemented Show and Hide Password */}
                <TextField sx={{width:'90%', mx:'auto', my:2}} label='Confirm Password' name='cpassword' inputRef={cpasswordRef} error={error.cpassword!==''?true:false} helperText={error.cpassword} 
                type={showpassword.cpass?'text':'password'}
                onMouseLeave={()=>setShowPassword({...showpassword,cpass:false})}
                onChange={e=>handler(e)}
                value={state.cpassword}
                InputProps={{ endAdornment:<InputAdornment position='end'>
                    <IconButton onClick={()=>setShowPassword({...showpassword,cpass:!showpassword.cpass})} >
                        {showpassword.cpass?<Visibility/>:<VisibilityOff/>}</IconButton>
                    </InputAdornment>}}
                />
            </Box>
            <Button onClick={()=>{ changePasswordFunc()  }} sx={{alignSelf:'flex-end', mr:3, my:2}} variant='contained'>Submit</Button>
        </>
    )

    return (
        <div>
            <Dialog onClose={()=>{setChanger(true); onClose()}} open={open}>
                <DialogTitle sx={{textAlign:'center'}}>Recover Password</DialogTitle>
                {changer? provideEmail: provideNewPassword}
            </Dialog>
        </div>
    )
}

export default RecoverPassword
