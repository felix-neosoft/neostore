import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ThemeProvider, createTheme, Typography, Button, TextField, Grid } from '@mui/material'

// material ui theme
const theme = createTheme({
    palette:{
        mode:'dark',
        white:{
          main:'#FFFFFF'
        }
    }
  })

function Footer() {
    const navigate = useNavigate()
    return (
        <div>
            <ThemeProvider theme={theme}>
                    <Grid container spacing={2} sx={{backgroundColor:'black', color:'#FFFFFF'}}>
                        <Grid item xs={4} sx={{mt:2}}>
                            <Typography sx={{mb:3}} textAlign='center' variant="h5">About Company</Typography>
                            <Typography textAlign='center' variant="body2">NeoSOFT Technologies is here at your quick and easy service</Typography>
                            <Typography textAlign='center' variant="body2">for Shopping</Typography>
                            <Typography textAlign='center' variant="h6">Contract information</Typography>
                            <Typography textAlign='center' variant="body2">Email: contact@neosofttech.com</Typography>
                            <Typography textAlign='center' variant="body2">Phone: +91 0000000000</Typography>
                            <Typography textAlign='center' variant="body2">MUMBAI, INDIA</Typography>
                        </Grid>
                        <Grid item xs={4} sx={{mt:2, display:'flex', flexDirection:'column', alignItems:'center'}}>
                            <Typography sx={{mb:3}} textAlign='center' variant="h5">Information</Typography>
                            <Button color='white'  variant='text'><Typography onClick={()=>navigate('/privacypolicy')} textAlign='center' variant="body2">Terms and Conditions</Typography></Button>
                            <Button color='white' variant='text'><Typography textAlign='center' variant="body2">Guarantee and Return Policy</Typography></Button>
                            <Button color='white' variant='text'><Typography textAlign='center' variant="body2">Contact Us</Typography></Button>
                            <Button color='white' variant='text'><Typography textAlign='center' variant="body2">Privacy Policy</Typography></Button>
                            <Button color='white' variant='text'><Typography onClick={()=>navigate('/maps')} textAlign='center' variant="body2">Locate Us</Typography></Button>
                        </Grid>
                        <Grid item xs={4} sx={{mt:2}}>
                            <Typography sx={{mb:3}} textAlign='center' variant="h5">Newsletter</Typography>
                            <Typography textAlign='center' variant="body2">Signup to get exclusive offer from our favorite hands and to</Typography>
                            <Typography textAlign='center' variant="body2">be well up in the news</Typography>
                            <TextField sx={{display:'block', ml:{lg:26, md:11}, my:2 }} inputProps={{ style: { textAlign: "center" } }} variant="standard" placeholder='your email' />
                            <Button sx={{display:'block', ml:{lg:31, md:16}}} variant="contained">Subscribe</Button>
                        </Grid>
                        <Grid item xs={12}><Typography textAlign='center' variant="body2">Copyright &copy; 2021 NeoSOFT Technologies. All rigits resevered | Designed By Felix Mathew</Typography></Grid>
                    </Grid>
                    
            </ThemeProvider>
        </div>
    )
}

export default Footer
