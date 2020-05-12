import React, {useState, useCallback} from 'react';
import './Login.css';

import Dropzone from 'react-dropzone'
import Arweave from 'arweave/web'

function Login(props) {
  const [S_loading, setLoading] = useState(false)

  const onDrop = useCallback((acceptedFiles) => {
    setLoading(true)
    const arweave = Arweave.init();

    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        try{
          let jwk = JSON.parse(reader.result);
          arweave.wallets.jwkToAddress(jwk).then((address) => {
            arweave.wallets.getBalance(address).then((balance) => {
              console.log(JSON.stringify(jwk));
              console.log(address);
              console.log(arweave.ar.winstonToAr(balance));
              props.setUser({
                jwk: jwk,
                address: address,
                balance: arweave.ar.winstonToAr(balance)
              })
            });
          })
          .catch((e) => {
            alert("This file is not valid")
            setLoading(false)
          })
        }
        catch(e){
          alert("This file is not valid")
          setLoading(false)
        }
      }
      reader.readAsText(file)
    })
  }, [props])

  return (
    <main id="login">
      <section>
        <h1>
          <i className="far fa-envelope"></i> WeMail
        </h1>
        <Dropzone onDrop={onDrop}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()} className="drop-zone">
              <input {...getInputProps()} />
              <i className="fas fa-key"></i>
              <p className="dropin">
                {!S_loading && <span>Drop a keyfile to login</span>}
                {S_loading && <span>Loading...</span>}
              </p>
            </div>
          )}
        </Dropzone>
        <aside>
          <ul>
            <li>WeMail is mail that <b>Google cannot read.</b></li>
            <li>Mail that <b>cannot be censored.</b></li>
            <li>Mail that <b>cannot be lost.</b></li>
            <li>WeMail is mail that <b>you own.</b></li>
          </ul>
          <button onClick={() => window.open('https://tokens.arweave.org','_blank')}>
            Get a wallet with some tokens
          </button>
        </aside>
      </section>
    </main>
  )
}

export default Login;
