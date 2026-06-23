import { useReducer } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

// --- 1. State Management (useReducer) ---
const initialState = {
  step: 1,
  ticketType: 'General',
  quantity: 1,
  attendeeName: '',
  attendeeEmail: ''
};

function bookingReducer(state, action) {
  switch (action.type) {
    case 'NEXT_STEP': return { ...state, step: state.step + 1 };
    case 'PREV_STEP': return { ...state, step: state.step - 1 };
    case 'SET_TICKETS': return { ...state, ticketType: action.payload.type, quantity: action.payload.quantity };
    case 'SET_ATTENDEE': return { ...state, attendeeName: action.payload.name, attendeeEmail: action.payload.email };
    default: return state;
  }
}

// --- 2. Main Component ---
export default function BookingFlow() {
  const { eventId } = useParams();
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  // Fake API submission using TanStack Query
  const mutation = useMutation({
    mutationFn: async (newBooking) => {
      const res = await fetch('http://localhost:3000/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking),
      });
      return res.json();
    }
  });

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    dispatch({ type: 'SET_TICKETS', payload: { type: fd.get('type'), quantity: Number(fd.get('quantity')) }});
    dispatch({ type: 'NEXT_STEP' });
  };

  const handleAttendeeSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    dispatch({ type: 'SET_ATTENDEE', payload: { name: fd.get('name'), email: fd.get('email') }});
    dispatch({ type: 'NEXT_STEP' });
  };

  const handleConfirm = () => {
    mutation.mutate({
      eventId,
      userId: 'user1',
      status: 'confirmed',
      tickets: [{ type: state.ticketType, quantity: state.quantity }],
      attendees: [{ name: state.attendeeName, email: state.attendeeEmail }]
    });
  };

  // --- 3. UI Steps ---
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <h2>Booking for Event #{eventId}</h2>
      
      {/* Progress Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '0.9rem', color: '#666' }}>
        <span style={{ fontWeight: state.step >= 1 ? 'bold' : 'normal', color: state.step >= 1 ? '#000' : '#666' }}>1. Tickets</span> &rarr;
        <span style={{ fontWeight: state.step >= 2 ? 'bold' : 'normal', color: state.step >= 2 ? '#000' : '#666' }}>2. Details</span> &rarr;
        <span style={{ fontWeight: state.step >= 3 ? 'bold' : 'normal', color: state.step >= 3 ? '#000' : '#666' }}>3. Confirm</span>
      </div>

      {/* Step 1: Select Tickets */}
      {state.step === 1 && (
        <form onSubmit={handleTicketSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <label>
            Ticket Type:
            <select name="type" defaultValue={state.ticketType} style={{ display: 'block', width: '100%', padding: '8px', marginTop: '5px' }}>
              <option value="General">General ($99)</option>
              <option value="VIP">VIP ($299)</option>
            </select>
          </label>
          <label>
            Quantity:
            <input type="number" name="quantity" min="1" max="10" defaultValue={state.quantity} style={{ display: 'block', width: '100%', padding: '8px', marginTop: '5px' }} />
          </label>
          <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>Next Step</button>
        </form>
      )}

      {/* Step 2: Attendee Info */}
      {state.step === 2 && (
        <form onSubmit={handleAttendeeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <label>
            Full Name:
            <input type="text" name="name" required defaultValue={state.attendeeName} style={{ display: 'block', width: '100%', padding: '8px', marginTop: '5px' }} />
          </label>
          <label>
            Email:
            <input type="email" name="email" required defaultValue={state.attendeeEmail} style={{ display: 'block', width: '100%', padding: '8px', marginTop: '5px' }} />
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={() => dispatch({ type: 'PREV_STEP' })} style={{ flex: 1, padding: '10px' }}>Back</button>
            <button type="submit" style={{ flex: 1, padding: '10px', background: '#007bff', color: 'white', border: 'none' }}>Next Step</button>
          </div>
        </form>
      )}

      {/* Step 3: Confirmation */}
      {state.step === 3 && !mutation.isSuccess && (
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h3>Review Summary</h3>
          <p><strong>Tickets:</strong> {state.quantity}x {state.ticketType}</p>
          <p><strong>Name:</strong> {state.attendeeName}</p>
          <p><strong>Email:</strong> {state.attendeeEmail}</p>
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={() => dispatch({ type: 'PREV_STEP' })} style={{ flex: 1, padding: '10px' }}>Back</button>
            <button onClick={handleConfirm} disabled={mutation.isPending} style={{ flex: 2, padding: '10px', background: '#28a745', color: 'white', border: 'none' }}>
              {mutation.isPending ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      )}

      {/* Success State */}
      {mutation.isSuccess && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'green' }}>
          <h3>🎉 Booking Confirmed!</h3>
          <Link to="/events" style={{ display: 'inline-block', marginTop: '20px', color: '#007bff' }}>Return to Events</Link>
        </div>
      )}
    </div>
  );
}