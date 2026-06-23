import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';

const fetchSingleEvent = async (id) => {
  const res = await fetch(`http://localhost:3000/events/${id}`);
  if (!res.ok) throw new Error('Failed to fetch event');
  return res.json();
};

export default function EventDetails() {
  const { id } = useParams();

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: () => fetchSingleEvent(id),
  });

  if (isLoading) return <div>Loading event details...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!event) return <div>Event not found.</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <Link to="/events" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
        &larr; Back to Events
      </Link>
      
      <img 
        src={event.image} 
        alt={event.title} 
        style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px', marginBottom: '20px' }} 
      />
      
      <h2>{event.title}</h2>
      <p style={{ color: '#555', fontSize: '1.1rem' }}>
        <strong>{event.date}</strong> at <strong>{event.time}</strong> | {event.location}
      </p>
      <p style={{ lineHeight: '1.6', marginBottom: '30px' }}>{event.description}</p>

      <h3>Available Tickets</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
        {event.ticketTypes.map(ticket => (
          <div key={ticket.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <div>
              <h4 style={{ margin: '0 0 5px' }}>{ticket.name}</h4>
              <span style={{ color: '#666' }}>{ticket.available} remaining</span>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              ${ticket.price}
            </div>
          </div>
        ))}
      </div>

      <Link 
        to={`/book/${event.id}`} 
        style={{ 
          display: 'block', 
          padding: '15px', 
          background: '#28a745', 
          color: 'white', 
          textAlign: 'center', 
          textDecoration: 'none', 
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '1.1rem'
        }}
      >
        Book Now
      </Link>
    </div>
  );
}