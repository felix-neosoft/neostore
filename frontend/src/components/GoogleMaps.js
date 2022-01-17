import React, { Component } from 'react'
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';
import Header from './Header';
import Footer from './Footer';
import { Box } from '@mui/material';


 
export class GoogleMaps extends Component {
  render() {
    return (
        <>
            <Header/>
            <Box sx={{mb:2, width:'100%', height:'800px'}}>
                <Map initialCenter={{lat:19.024896521185838, lng:72.84418320959288}} style={{height:'800px'}} google={this.props.google} zoom={14}>
                
                <Marker onClick={this.onMarkerClick}
                        name={'NeoSOFT Technologies'} />

                </Map>
            </Box>
            <Footer/>
        </>
            
    );
  }
}
 
export default GoogleApiWrapper({
  apiKey: ("AIzaSyDe_dRJFvM9wtlXffmZF9RHSDPxUBk__2k")
})(GoogleMaps)