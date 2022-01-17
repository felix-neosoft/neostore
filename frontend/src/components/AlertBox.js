import React from 'react'
import { Dialog, DialogTitle, Alert, Button } from '@mui/material';

function AlertBox(props) {
    const { onClose, open } = props;
    return (
        <div>
            <Dialog  open={open.state}>
                <DialogTitle sx={{textAlign:'center'}}>Alert</DialogTitle>
                <Alert sx={{mx:1, width:500, my:2}} severity={open.status===200?'success':'warning'}>{open.message}</Alert>
                <Button onClick={()=>onClose()} sx={{alignSelf:'flex-end',my:1}} variant="text">Exit</Button>
            </Dialog>
        </div>
    )
}

export default AlertBox
