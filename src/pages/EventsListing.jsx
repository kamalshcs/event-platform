import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

// Fetch function for TanStack Query
const fetchEvents = async () => {
  const res = await fetch('http://localhost:3000/events');
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
};

export default function EventsListing() {
  // TanStack Query hook
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });

  if (isLoading) return <div>Loading events...</div>;
  if (error) return <div>Error loading events: {error.message}</div>;

  return (
    <div>
      <h2>Discover Events</h2>
      
      {/* Grid Layout for Events */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {events.map(event => (
          <div key={event.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <img 
              src={event.image} 
              alt={event.title} 
              style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} 
            />
            <h3 style={{ margin: '10px 0 5px' }}>{event.title}</h3>
            <p style={{ margin: '0 0 10px', color: '#555' }}>{event.date} at {event.time}</p>
            <p style={{ margin: '0 0 15px' }}>
              Starting at <strong>${event.ticketTypes[0]?.price}</strong>
            </p>
            
            <Link 
              to={`/events/${event.id}`} 
              style={{ 
                display: 'block', 
                padding: '10px', 
                background: '#007bff', 
                color: 'white', 
                textAlign: 'center', 
                textDecoration: 'none', 
                borderRadius: '4px' 
              }}
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}