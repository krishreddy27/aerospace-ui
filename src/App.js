import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import logo from './assets/Honeywell-logo-large-scaled.jpg';

function App() {
  const [mode, setMode] = useState(null);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleEncrypt = (data) => {
    axios.get(`http://localhost:8085/rest/honeywell/encrypt/${data}`)
      .then(response => {
        const { encryptedData, key } = response.data;
        setOutput(encryptedData);
        localStorage.setItem('encryptionKey', key); 
      })
      .catch(error => {
        setOutput('Encryption failed');
      });
  };

  const handleDecrypt = () => {
    const key = localStorage.getItem('encryptionKey'); 
    if (!key) {
      setOutput('Decryption key not found');
      return;
    }

    const requestData = {
      encryptedData: input,
      encodedKey: key
    };

    axios.post('http://localhost:8085/rest/honeywell/decrypt', requestData)
      .then(response => {
        setOutput(response.data); 
      })
      .catch(error => {
        setOutput('Decryption failed');
      });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    alert('Copied to clipboard!');
  };

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    setInput(text);
  };

  return (
    <div className="App">
      <nav className="navbar">
        <img src={logo} alt="Honeywell Logo" className="logo" />
      </nav>
      <div className="content">
        <div className="button-group">
          <button
            className="action-button"
            onClick={() => {
              setMode('encrypt');
              setInput(''); // Clear input when switching modes
            }}
          >
            Encryption
          </button>
          <button
            className="action-button"
            onClick={() => {
              setMode('decrypt');
              setInput(''); // Clear input when switching modes
            }}
          >
            Decryption
          </button>
        </div>
        {mode && (
          <div className={`input-section ${mode}`}>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder={`Enter string to ${mode}`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="text-input"
              />
              {mode === 'decrypt' && (
                <button className="icon-button" onClick={handlePaste}>📋</button>
              )}
            </div>
            <button
              className="submit-button"
              onClick={mode === 'encrypt' ? () => handleEncrypt(input) : handleDecrypt}
            >
              {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
            </button>
            {output && (
              <div className="response-box">
                <span>{output}</span>
                {mode === 'encrypt' && (
                  <button className="icon-button" onClick={handleCopy}>📋</button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
