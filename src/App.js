import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

import $ from "jquery"
import Mailbox from './Mailbox'

function App() {
  const [S_emailsList, setEmailsList] = useState([])
  const [S_loading, setLoading] = useState(true)

  useEffect(() => {
    $.ajax({url: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/311743/dummy-emails.json',
    	type: 'GET',
    	success: function(result) {
    		setEmailsList(result)
        setLoading(false)
        console.log(result);
    	}
    });
  }, []);

  return (
    !S_loading && <Mailbox emails={S_emailsList} />
  );
}

export default App;
