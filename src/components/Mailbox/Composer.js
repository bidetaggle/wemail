import React, { useState } from "react";
import {
  TextField,
  Button,
  ThemeProvider,
  InputAdornment
} from '@material-ui/core';
import theme from './../Theme'
import './Composer.css'
import sendMail from './../../lib/sendMail'

function Composer(props){
  const [S_recipient, setRecipient] = useState('QpxXig-nv-RBngCNx6oagRQYvJguJ1JEKAidAZKc3Cw')
  const [S_mail, setMail] = useState({
    subject: '',
    content: '',
    ARamount: '0',
  })
  const [S_formRecipientError, setFormRecipientError] = useState(false)

  const handleRecipientChange = event => {
    setRecipient(event.target.value)
  }

  const handleMailChange = prop => event => {
    let val = event.target.value
    if(prop === 'ARamount'){
      if(!val) val = '0'
      if(val.match(/^0\d.*$/g)) val = val.slice(1)
      if(!val.match(/^\d+\.?\d*$/g))
        val = S_mail.ARamount
    }

    setMail({
      ...S_mail,
      [prop]: val
    })
  }

  const handleSendButtonClick = async () => {
    sendMail(S_recipient.trim(), S_mail, props.user)
    .then((result) => {
      console.log(result);
      alert('mail sent!')
    })
    .catch(err => {
      setFormRecipientError(err)
    })
  }

  return (
    <ThemeProvider theme={theme}>
      <form id="composer">
        <TextField
          error={Boolean(S_formRecipientError)}
          helperText={S_formRecipientError}
          className="standard-basic"
          label="Recipient"
          placeholder="QpxXig-nv-RBngCNx6oagRQYvJguJ1JEKAidAZKc3Cw"
          onChange={handleRecipientChange}
          value={S_recipient}
        />
        <TextField
          className="standard-basic"
          label="Subject"
          onChange={handleMailChange('subject')}
          value={S_mail.subject}
        />
        <TextField
          className="standard-multiline-static"
          label="Content"
          multiline
          variant="outlined"
          onChange={handleMailChange('content')}
          value={S_mail.content}
        />
        <TextField
          label="Send AR"
          className="outlined-end-adornment"
          InputProps={{
            endAdornment: <InputAdornment position="end">AR</InputAdornment>,
          }}
          onChange={handleMailChange('ARamount')}
          value={S_mail.ARamount}
        />
        <Button
          variant="contained"
          color="primary"
          endIcon={<i className="far fa-paper-plane"></i>}
          onClick={handleSendButtonClick}
        >
          Send
        </Button>
      </form>
    </ThemeProvider>
  )
}
export default Composer;
