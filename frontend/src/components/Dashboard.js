import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { toast } from 'react-toastify'
import { Box, Button, Card, CardActions, CardContent, createTheme, ThemeProvider, Typography, Grid,Paper, Rating } from '@mui/material'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Carousel from 'react-elastic-carousel'
import 'react-lazy-load-image-component/src/effects/blur.css';
import Footer from './Footer'
import Header from './Header'
import { getProducts } from '../config/ProductNodeService'
import { addCartDispatch } from '../redux/CartReducer';
import { sortArray } from '../config/Controller';
import ProductsInfo from './ProductsInfo';
import { closeCheckout} from '../redux/userReducer';


const theme = createTheme({
    palette:{
        mode:'dark',
        white:{
          main:'#FFFFFF',
          backgroundColor:'#FFFFFF'
        }
    }
  })

function Dashboard() {
    //state variables 
    const [products, setProducts] = useState([])
    const [search,setSearch] = useState({entry:'',component:'Dashboard'})
    const [product, setProduct] = useState({info:[],component:'AllProducts'})

    // Navigate to diffrent component
    const navigate = useNavigate()


    const item = [
        {id:1, img:'http://localhost:9000/wallpapers/bed.png', text:'Welcome to NeoSTORE',top:'20%', left:'60%'},
        {id:2, img:'http://localhost:9000/wallpapers/sofa.png', text:'Welcome to NeoSTORE',top:'20%', left:'30%'},
        {id:3, img:'http://localhost:9000/wallpapers/cupboard.png', text:'',top:'20%', left:'30%'},
        {id:4, img:'http://localhost:9000/wallpapers/table.png', text:'Welcome to NeoSTORE',top:'10%', left:'60%'}
    ]

    //redux state variables and functions
    const token = useSelector(state => state.user.token) 
    const checkout = useSelector(state => state.user.checkout)
    const dispatch = useDispatch()

    // useEffect Function to get Products data
    useEffect(()=>{
        if(token!=='' && checkout){
            navigate('/checkout')
        }else dispatch(closeCheckout())
        
        getProducts().then(res => {
            let myarray = sortArray('rating',res.data)
            if(search.entry!==''){
                myarray = myarray.filter(ele => {
                    if(ele.name.toLowerCase().includes(search.entry.toLowerCase()) || ele.producer.toLowerCase().includes(search.entry.toLowerCase())) return ele
                    return null
                })
            }
            myarray = myarray.slice(0,10)
            setProducts(myarray)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[search])

    // Funtion to add product in cart
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

    return (
        <div>
            <Header component={search.component} searchFunc={(entry)=>setSearch({...search,entry:entry})}/>
            <ThemeProvider theme={theme}>
                { product.component==='AllProducts' ?
                <>
                <Carousel showArrows={false} enableSwipe={false} enableAutoPlay={true} pagination={false} autoPlaySpeed={5000}>
                    {item.map(ele =>(
                        <div key={ele.id} style={{position:'relative', width:'100%'}}>
                        <LazyLoadImage  effect='blur'  loading='lazy' src={ele.img} alt='products-wall'  />
                        <p style={{color:'white',position:'absolute', top:ele.top, left:ele.left, transform:'translate(-50%,-50%', fontSize:'70px'}}>{ele.text}</p>
                        </div>
                    ))}
                </Carousel>
                <Grid container sx={{my:5, display:'flex', flexDirection:'column', alignItems:'center'}}>
                    <Grid component={Paper} item lg={12} sx={{width:'88%'}}>
                        <Box >
                            {products.map((data,id)=>(
                                <Card key={id} sx={{maxWidth:300, my:2, mx:2, display:'inline-block'}}>
                                    <LazyLoadImage onClick={()=>setProduct({...product,info:data,component:'Info'})} effect='blur' loading='lazy' src={data.images[0].location} alt='products' width='300'  />
                                    <CardContent>
                                        <Typography sx={{display:'block'}} variant='h5'>{data.producer}</Typography>
                                        <Typography sx={{display:'block'}} variant='body2'>{data.name}</Typography>
                                        <Typography sx={{display:'block'}} variant='body2'>{data.cost}</Typography>
                                        <Rating  value={data.rating} readOnly />
                                    </CardContent>
                                    <CardActions>
                                        <Button onClick={()=>addCartFunc({id:data._id, name:data.name, producer: data.producer, color:data.color[0].name, img:data.images[0].location,numofitems:1, stock:data.stock, cost:data.cost})} variant='contained'>Add to Cart</Button>
                                    </CardActions>
                                </Card>
                            ))}
                        </Box>
                    </Grid> 
                </Grid> 
                </>:
                <>
                <ProductsInfo info={product.info} change={() => setProduct({...product,component:'AllProducts'})}/>
                </>    
                }
            </ThemeProvider>
            <Footer/>
        </div>
    )
}

export default Dashboard
