import { useSelector, useDispatch } from 'react-redux';
import { nextStep, prevStep, updateForm, publishEvent, resetForm } from '../store/eventSlice';
import { Link } from 'react-router-dom';

export default function CreateEvent() {
  const dispatch = useDispatch();
  const { step, formData, status } = useSelector((state) => state.event);

  const handleChange = (e) => {
    dispatch(updateForm({ [e.target.name]: e.target.value }));
  };

  const handlePublish = () => {
    // Add a default ticket type just to satisfy the payload for this demo
    const finalData = { ...formData, ticketTypes: [{ id: '1', name: 'General Entry', price: 50, available: 100 }] };
    dispatch(publishEvent(finalData));
  };

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2 style={{ color: 'green' }}>Event Published Successfully!</h2>
        <button onClick={() => dispatch(resetForm())} style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Create Another Event
        </button>
        <br/><br/>
        <Link to="/events">Go to Event Listing</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <h2>Create New Event</h2>
      <p style={{ color: '#666' }}>Draft automatically saved. Step {step} of 3</p>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" name="title" placeholder="Event Title" value={formData.title} onChange={handleChange} style={{ padding: '10px' }} />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} style={{ padding: '10px', minHeight: '100px' }} />
          <select name="category" value={formData.category} onChange={handleChange} style={{ padding: '10px' }}>
            <option value="">Select Category</option>
            <option value="Technology">Technology</option>
            <option value="Music">Music</option>
            <option value="Art">Art</option>
          </select>
          <input type="text" name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} style={{ padding: '10px' }} />
          <button onClick={() => dispatch(nextStep())} style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none' }}>Next: Date & Location</button>
        </div>
      )}

      {/* Step 2: Date & Location */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="date" name="date" value={formData.date} onChange={handleChange} style={{ padding: '10px' }} />
          <input type="time" name="time" value={formData.time} onChange={handleChange} style={{ padding: '10px' }} />
          <input type="text" name="location" placeholder="Venue/Location" value={formData.location} onChange={handleChange} style={{ padding: '10px' }} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => dispatch(prevStep())} style={{ flex: 1, padding: '10px' }}>Back</button>
            <button onClick={() => dispatch(nextStep())} style={{ flex: 1, padding: '10px', background: '#007bff', color: 'white', border: 'none' }}>Next: Preview</button>
          </div>
        </div>
      )}

      {/* Step 3: Preview */}
      {step === 3 && (
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h3>Preview</h3>
          <h2>{formData.title || 'Untitled Event'}</h2>
          <p><strong>{formData.date}</strong> at <strong>{formData.time}</strong></p>
          <p>{formData.location}</p>
          <p>{formData.description}</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button onClick={() => dispatch(prevStep())} style={{ flex: 1, padding: '10px' }}>Edit</button>
            <button onClick={handlePublish} disabled={status === 'loading'} style={{ flex: 2, padding: '10px', background: '#28a745', color: 'white', border: 'none' }}>
              {status === 'loading' ? 'Publishing...' : 'Publish Event'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}