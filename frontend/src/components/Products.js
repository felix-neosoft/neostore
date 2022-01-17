import React, {useState, useEffect} from 'react'
import { Box, Button, Card, CardContent, createTheme, ThemeProvider, Typography, Grid, Paper, Accordion, AccordionSummary, AccordionDetails, Pagination, Rating } from '@mui/material'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import 'react-lazy-load-image-component/src/effects/blur.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toast } from 'react-toastify'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import jwt_decode from 'jwt-decode'
import Footer from './Footer'
import Header from './Header'
import { getProducts } from '../config/ProductNodeService'
import { sortArray } from '../config/Controller';
import ProductsInfo from './ProductsInfo';
import { addCartDispatch } from '../redux/CartReducer';
import { closeCheckout } from '../redux/userReducer';


const theme = createTheme({
    palette:{
        mode:'dark',
        white:{
          main:'#FFFFFF',
          backgroundColor:'#FFFFFF'
        }
    }
  })





function Products() {
    // State variables
    const [state,setState] = useState({data:[], fetchdata:[], loading:false, currentPage:1, cardPerPage:6, category:'', color:'',sortValue:''})
    const [product, setProducts] = useState({info:[],component:'AllProducts'})
    const [search,setSearch] = useState({entry:'',component:'AllProducts'})

    // Redux functions and variables
    const dispatch = useDispatch()
    const token = useSelector(state=> state.user.token)
    const checkout = useSelector(state=> state.user.checkout)

    // Function to Navigate to diffrent components
    const navigate = useNavigate()


    let currentCardPage

    // Function to get product data from server
    useEffect(()=>{
        if(token!=='' && checkout){
            navigate('/checkout')
        }else dispatch(closeCheckout())
        setState({...state,loading:true})
        getProducts().then(res => {
            setState({...state,data:res.data,fetchdata:res.data,loading:false})
        })
       // eslint-disable-next-line react-hooks/exhaustive-deps 
    },[])

    // Function to Categories Product by Category, Color and SortBy
    useEffect(()=>{
        const temp = state.fetchdata.filter(val => {
            if(state.category===''){
                if(state.color==='') return val
                else if(val.color.some((e)=>{return e.name===state.color})) return val
            }
            else if(val.category===state.category){
                if(state.color==='') return val
                else if(val.color.some((e)=>{return e.name===state.color})) return val
            } 
            return null
        })
        let myarray = sortArray(state.sortValue,temp)
        if(search.entry!==''){
            myarray = myarray.filter(ele => {
                if(ele.name.toLowerCase().includes(search.entry.toLowerCase()) || ele.producer.toLowerCase().includes(search.entry.toLowerCase())) return ele
                return null
            })
        }
        setState({...state,data:myarray})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[state.category, state.color, state.sortValue,search])
    


    const indexofLastCard = state.currentPage * state.cardPerPage
    const indexofFirstCard = indexofLastCard - state.cardPerPage
    currentCardPage = state.data.slice(indexofFirstCard,indexofLastCard)

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

    const CardData = () => {
        if(state.loading) return <h1>Loading...</h1>
        else return (
            <>
                {currentCardPage.map((data,id)=>(
                <Card key={id} sx={{maxWidth:350, my:2, mx:2, display:'inline-block'}}>
                    <LazyLoadImage onClick={()=>setProducts({...product,info:data,component:'Info'})} effect='blur' loading='lazy' src={data.images[0].location} alt='products' width='350' />
                    <CardContent sx={{border:1, borderRadius:2}}>
                        <Typography sx={{display:'block'}} variant='h5'>{data.producer}</Typography>
                        <Typography sx={{display:'block'}} variant='body2'>{data.name}</Typography>
                        <Typography sx={{display:'block'}} variant='body2'>{data.cost}</Typography>
                        <Rating  value={data.rating} readOnly />
                        <Button onClick={()=>addCartFunc({id:data._id, name:data.name, producer: data.producer, color:data.color[0].name, img:data.images[0].location,numofitems:1, stock:data.stock, cost:data.cost})} variant='contained'>Add to Cart</Button>
                    </CardContent>
                </Card>
                ))}
                <Box sx={{display:'flex', flexDirection:'column', alignItems:'center', my:3}}><Pagination sx={{mx:'auto'}} count={Math.ceil(state.data.length/state.cardPerPage)} color="primary" onChange={(e,p)=>setState({...state,currentPage:p})} page={state.currentPage}/></Box>
            </>
        )
    }


    return (
        <div>
            <Header component={search.component} searchFunc={(entry)=>setSearch({...search,entry:entry})}/>
            <ThemeProvider theme={theme}>
                { product.component==='AllProducts'?
                <Grid  container sx={{my:5}}>
                    <Grid item lg={3} md={3} sm={12} sx={{mx:2, mb:{sm:2}}}>
                        <Accordion>
                            <AccordionSummary>
                                <Typography variant='h6' >All Categories</Typography>
                                <Button onClick={()=>setState({...state,category:'',color:'',sortValue:'increase'})} variant='text'>All</Button>

                            </AccordionSummary>
                        </Accordion>
                        <Accordion sx={{my:3}}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                <Typography variant='h6' >Category</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Button onClick={()=>setState({...state,category:'bed'})} variant='text'>Bed</Button>
                                <Button onClick={()=>setState({...state,category:'sofa'})} variant='text'>Sofa</Button>
                                <Button onClick={()=>setState({...state,category:'table'})} variant='text'>Table</Button>
                                <Button onClick={()=>setState({...state,category:'cupboard'})} variant='text'>Cupboard</Button>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                <Typography variant='h6' >Color</Typography>
                            </AccordionSummary>
                            <AccordionDetails >
                                <Button onClick={()=>setState({...state,color:'White'})} variant='text'>White</Button>
                                <Button onClick={()=>setState({...state,color:'Black'})} variant='text'>Black</Button>
                                <Button onClick={()=>setState({...state,color:'Grey'})} variant='text'>Grey</Button>
                                <Button onClick={()=>setState({...state,color:'Brown'})} variant='text'>Brown</Button>
                                <Button onClick={()=>setState({...state,color:'Beige'})} variant='text'>Beige</Button>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                    <Grid component={Paper} item lg={8} md={8} sm={12} >
                        <Typography sx={{my:1,ml:3, display:'inline-flex'}} variant='h6'>Category: {state.category===''?'All':state.category} / Color: {state.color===''?'All':state.color} </Typography>
                        <Typography sx={{my:1,ml:{lg:'60%', md:'55%', sm:'20%'}, display:'inline-flex',}} variant='h6'><Button onClick={()=>setState({...state,sortValue:'rating'})}>Rating</Button><Button onClick={()=>setState({...state,sortValue:'increase'})}><ArrowUpwardIcon/></Button><Button onClick={()=>setState({...state,sortValue:'decrease'})}><ArrowDownwardIcon/></Button></Typography>
                        <hr/>
                        <CardData/>
                        
                    </Grid>
                </Grid> :
                <ProductsInfo info={product.info} change={() => setProducts({...product,component:'AllProducts'})}/> }
                
            </ThemeProvider>
            
            <Footer/>
            
        </div>
    )
}

export default Products
