import React, {useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { ThemeProvider, createTheme, Box, AppBar, Toolbar, Typography, Container, Button, Menu, MenuItem, TextField, Badge } from '@mui/material'
import jwtDecode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import InputAdornment from '@mui/material/InputAdornment';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import LoginIcon from '@mui/icons-material/Login';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import MenuIcon from '@mui/icons-material/Menu';
import { userLogout } from '../redux/userReducer';
import { clearCartDispatch } from '../redux/CartReducer';


// material ui theme
const theme = createTheme({
    palette:{
        mode:'dark',
        white:{
          main:'#FFFFFF'
        }
    }
  })

function Header(props) {
    // redux state variables
    const status = useSelector(state => state.user.status)
    const items = useSelector(state => state.cart.NumOfItems)
    const token = useSelector(state => state.user.token)

    const component = ['Dashboard','AllProducts']

    // Function to Navigate to diffrent components
    const navigate = useNavigate()

     // Function to call redux Functions
     const dispatch = useDispatch()

     const logout = () => {
        if(token!==''){
            const decode = jwtDecode(token)
            dispatch(clearCartDispatch(decode.email));
        }
        dispatch(userLogout());
        handleClose();
        window.location.replace('/')
     }


    // MenuBar Operations
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // function to change user operations based on login 
    const userControl = (
        <>
        {status==='NOT_LOGGED'?
            <><Button sx={{ml:3, mt:1}} color="secondary" variant="contained" onClick={()=>navigate('/login')} ><LoginIcon/> Sign In</Button>
            <Button sx={{ml:3, mt:1}} color="secondary" variant="contained" onClick={()=>navigate('/register')}><LoginIcon/> Sign Up</Button></> :
            <Button sx={{ml:3, mt:1}} onClick={handleClick} color="secondary" variant="contained"><AccountBoxIcon/><KeyboardArrowDownIcon/></Button> 
        }
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose} >
            <MenuItem><Typography onClick={()=>navigate('/profile')} variant="body">Profile</Typography></MenuItem>
            <MenuItem onClick={()=>logout()}><Typography variant="body">Logout</Typography></MenuItem>
        </Menu>
        </>
    )
    return (
        <div>
            {/* Navbar */}
            <ThemeProvider theme={theme}>
                <AppBar position='static'>
                    <Container maxWidth='none'>
                        <Toolbar disableGutters>
                            {/* Media Query for lg */}
                            <Box sx={{display:{lg:'flex', md:'none', sm:'none'}}}>
                                <Typography variant="h4" noWrap component="div" sx={{ml:1, display:'flex', mt:1}}><span>Neo</span><span style={{color:'red'}}>STORE</span></Typography>
                                <Box sx={{display:'flex'}}>
                                    <Button sx={{fontSize:20, ml:10, mt:1}} variant="text" color='white' onClick={()=>navigate('/')}>Home</Button>
                                    <Button sx={{fontSize:20, ml:10, mt:1}} variant="text" color='white' onClick={()=>navigate('/products')}>Products</Button>
                                    <Button sx={{fontSize:20, ml:10, mt:1, display:token!==''?'':'none'}} variant="text" color='white' onClick={()=>navigate('/order')}>Order</Button>
                                    <Box sx={{position:'absolute',right:0}}>
                                        <TextField sx={{width:300, display:component.includes(props.component)?'':'none'}} placeholder='Search' onChange={e=>props.searchFunc(e.target.value)} InputProps={{ startAdornment: ( <InputAdornment position="start"> <SearchIcon /> </InputAdornment> ), }} variant="filled"  />
                                        <Button onClick={()=>navigate('/cart')} sx={{ml:5,mt:1,py:1}} color="secondary" variant="contained"><Badge badgeContent={items}><ShoppingCartIcon/></Badge> </Button>
                                        {userControl}
                                    </Box>       
                                </Box>
                            </Box>
                            {/* Media Query for md */}
                            <Box sx={{display:{lg:'none',md:'flex',sm:'none'}}}>
                                <Accordion sx={{width:'100%'}}>
                                    <AccordionSummary expandIcon={<MenuIcon />}>
                                        <Typography variant="h4" noWrap component="div" sx={{ml:1, display:'flex', mt:1}}><span>Neo</span><span style={{color:'red'}}>STORE</span></Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Button sx={{fontSize:20, ml:10, mt:1}} variant="text" color='white' onClick={()=>navigate('/')}>Home</Button>
                                        <Button sx={{fontSize:20, ml:10, mt:1}} variant="text" color='white' onClick={()=>navigate('/products')}>Products</Button>
                                        <Button sx={{fontSize:20, ml:10, mt:1, display:token!==''?'':'none'}} variant="text" color='white' onClick={()=>navigate('/order')}>Order</Button>
                                        <TextField fullWidth sx={{display:'block', my:1, display:component.includes(props.component)?'':'none'}} placeholder='Search' onChange={e=>props.searchFunc(e.target.value)} InputProps={{ startAdornment: ( <InputAdornment position="start"> <SearchIcon /> </InputAdornment> ), }} variant="filled"  />
                                    </AccordionDetails>
                                </Accordion>
                                <Box sx={{position:'absolute', right:10, mt:1}}>
                                <Button sx={{ml:5,mt:1,py:1}} onClick={()=>navigate('/cart')} color="secondary" variant="contained"><Badge badgeContent={4}><ShoppingCartIcon/></Badge> </Button>
                                    {userControl}
                                </Box>
                            </Box>
                            {/* Media Query for sm */}
                            <Box sx={{display:{lg:'none',md:'none',sm:'block'}}}>
                                <Accordion sx={{width:'100%'}}>
                                    <AccordionSummary expandIcon={<MenuIcon />}>
                                        <Typography variant="h4" noWrap component="div" sx={{ml:1, display:'flex', mt:1}}><span>Neo</span><span style={{color:'red'}}>STORE</span></Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Button sx={{fontSize:20, ml:10, mt:1}} variant="text" color='white' onClick={()=>navigate('/')}>Home</Button>
                                        <Button sx={{fontSize:20, ml:10, mt:1}} variant="text" color='white' onClick={()=>navigate('/products')}>Products</Button>
                                        <Button sx={{fontSize:20, ml:10, mt:1, display:token!==''?'':'none'}} variant="text" color='white'onClick={()=>navigate('/order')}>Order</Button>
                                        <TextField fullWidth sx={{display:'block', my:1, display:component.includes(props.component)?'':'none'}} placeholder='Search' onChange={e=>props.searchFunc(e.target.value)} InputProps={{ startAdornment: ( <InputAdornment position="start"> <SearchIcon /> </InputAdornment> ), }} variant="filled"  />
                                        <Box sx={{mt:1}}>
                                        <Button sx={{ml:5,mt:1,py:1}} onClick={()=>navigate('/cart')} color="secondary" variant="contained"><Badge badgeContent={4}><ShoppingCartIcon/></Badge> </Button>
                                            {userControl}
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
            </ThemeProvider>
        </div>
    )
}

export default Header
