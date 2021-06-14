import { BiCalendar } from 'react-icons/bi';
import Search from './components/Search';
import Apponitment from './components/Appointment'
import AppointmentInfo from './components/AppointmentInfo'
import { useState, useEffect, useCallback } from 'react'

function App() {

  let [ AppointmentList, setAppointmentList ] = useState([]);
  let [ query, setQuery ] = useState("");
  let [ sortBy, setSortBy] = useState("petName")
  let [ orderBy, setOrderBy] = useState("asc")

  const filteredAppointment = AppointmentList.filter( 
    iteam => {
      return(
        iteam.petName.toLowerCase().includes(query.toLowerCase()) ||
        iteam.ownerName.toLowerCase().includes(query.toLowerCase()) ||
        iteam.aptNotes.toLowerCase().includes(query.toLowerCase()) 
      )
    }
  ).sort((a,b) => {
    let order = (orderBy === 'asc')? 1 : -1 ;
    if( a[sortBy].toLowerCase() < b[sortBy].toLowerCase() )
      return -1*order
    else return 1*order;
  })

  const fetchData = useCallback(
    () => {
      fetch('./data.json')
        .then(response => response.json()) 
        .then(data => {
            setAppointmentList(data)
          })
    },
    [],
  )

  useEffect( () => {
    fetchData()
  }, [fetchData])

  return (
    <div className="App container mt-3 mx-auto font-thin">
       <h1 className="text-5xl"> 
        Your Appointment <BiCalendar className="inline-block text-red-300 text-5xl" />  
       </h1> 
       <Apponitment 
        onSendAppointment={appointment => { setAppointmentList([...AppointmentList,appointment]) }}
        lastId={AppointmentList.reduce((max,iteam) => Number(iteam.id) > max ? Number(iteam.id) : max ,0)}
       />
       <Search query={query}
        onQueryChange={(myquery) => setQuery(myquery)}
        orderBy={orderBy}
        onOrderByChange={(myorder) => setOrderBy(myorder)}
        sortBy={sortBy}
        onSortByChange={(mysort) => setSortBy(mysort)}
       />

       <ul className="divide-y divide-gray-200">
        {filteredAppointment.map(appointment => (
          <AppointmentInfo 
            appointment={appointment} 
            onDeleteAppointment={
              appointmentID => {
                setAppointmentList(AppointmentList.filter(appointment => appointment.id !== appointmentID))
              }
            }
            key={appointment.id} />
        ))}
       </ul>
    </div>
  );
}

export default App;
