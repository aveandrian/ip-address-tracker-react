import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMap, } from 'react-leaflet'
import './App.css'

var locationIcon = L.icon({iconUrl: '/images/icon-location.svg'})

function MyMap({coords}) {
  const map = useMap()
  
  map.setView(coords, 15)

  return (
    <>
    <TileLayer
          attribution='&copy; <a href="https://www.thunderforest.com/terms/">Thunderforest</a> contributors'
          url="https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=d77b8625df734d9e8c58c576603e7f42"
        />
       <Marker position={coords} icon={locationIcon} />
    </>
  )
}
function App() {
  const [inputValue, setInputValue] = useState('')
  const [ipAddress, setIpAddress] = useState(null)
  const [location, setLocation] = useState()
  const [coords, setCoords] = useState([51.505, -0.09])

  useEffect(()=>{
    fetch('https://api.ipify.org/?format=json')
    .then(res => res.json())
    .then(data => {
      setIpAddress(data.ip)
      setInputValue(data.ip)
    })
    .catch(e => console.log(e))
    
  }, [])

  useEffect(()=>{
    if(ipAddress)
      fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_9aYLegQlFbUO4oL8bVZGEpTHg4gO6&ipAddress=${ipAddress}`)
      .then(res => res.json())
      .then(data => {
        setLocation(data)
        setCoords([data.location.lat, data.location.lng])
      })
      .catch(e => console.log(e))
  }, [ipAddress])
  
  function handleChange(e){
    setInputValue(e.target.value)
  }

  function handleClick(e){
    e.preventDefault()
    setIpAddress(inputValue)
  }

  return (
    <>
    <header>
      <h1 className='title'>IP Address Tracker</h1>
      <form className='input-wrapper'>
        <input className='input' placeholder='Search for any IP address or domain' value={inputValue} onChange={handleChange} />
        <button type='submit' className='submit-btn' onClick={handleClick}>
          <img className='arrow-icon' src='/images/icon-arrow.svg'></img>
        </button>
      </form>
    </header>
    <main>
      <div className='results-container'>
        <div className='results-item'>
          <p className='result-name'>IP Address</p>
          <h1 className='result-value'>{ipAddress}</h1>
        </div>
        <div className='divider'></div>
        <div className='results-item'>
          <p className='result-name'>Location</p>
          {location && <h1 className='result-value'>{location.location.city}, {location.location.region} {location.location.postalCode}</h1>}
        </div>
        <div className='divider'></div>
        <div className='results-item'>
          <p className='result-name'>Timezone</p>
          {location &&<h1 className='result-value'>UTC {location.location.timezone}</h1>}
        </div>
        <div className='divider'></div>
        <div className='results-item'>
          <p className='result-name'>ISP</p>
          {location &&<h1 className='result-value'>{location.isp}</h1>}
        </div>
      </div>
      <MapContainer center={coords} zoom={15} scrollWheelZoom={false}> 
        <MyMap coords={coords}/>
      </MapContainer>
    </main>
      <footer className="attribution">
        Challenge by <a href="https://www.frontendmentor.io?ref=challenge" target="_blank">Frontend Mentor</a>. 
        Coded by <a href="https://github.com/aveandrian">aveandrian</a>.
      </footer>
    </>
  )
}

export default App
