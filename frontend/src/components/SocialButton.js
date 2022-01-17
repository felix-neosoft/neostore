import React from 'react'
import SocialLogin from "react-social-login";
import { Button } from '@mui/material';


class SocialButton extends React.Component {
    render() {
        const {children , color, triggerLogin, triggerLogout, ...props} = this.props
        return (
            <Button fullWidth sx={{height:70, my:2 , backgroundColor:`${color}`, fontSize:20}} onClick={triggerLogin} {...props} variant='contained'>{children}</Button> 
        )
    }
}

export default SocialLogin(SocialButton)