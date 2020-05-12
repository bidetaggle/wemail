import React from "react";
import { TextField, Button, ThemeProvider } from '@material-ui/core';
import theme from './../Theme'
import './Composer.css'

function Composer(){

  return (
    <ThemeProvider theme={theme}>
      <form id="composer">
        <TextField
          className="standard-basic"
          label="Recipient"
        />
        <TextField
          className="standard-basic"
          label="Subject"
        />
        <TextField
          className="standard-multiline-static"
          label="Content"
          multiline
          variant="outlined"
        />
        <Button
          variant="contained"
          color="primary"
          endIcon={<i className="far fa-paper-plane"></i>}
        >
          Send
        </Button>
      </form>
    </ThemeProvider>
  )
}
export default Composer;
