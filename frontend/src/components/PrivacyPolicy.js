import React from 'react'
import { PDFReader } from 'react-read-pdf';
import Footer from './Footer'
import Header from './Header'

function PrivacyPolicy() {
    return (
        <div>
            <Header/>
            <div style={{height:1300}}>
                <PDFReader url="http://localhost:9000/systemData/privacy-policy.pdf"/>
           </div>

            <Footer/>
        </div>
    )
}

export default PrivacyPolicy
