import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EventsListing from './pages/EventsListing';
import EventDetails from './pages/EventDetails';
import BookingFlow from './pages/BookingFlow';
import { Provider } from 'react-redux';
import { store } from './store';
import CreateEvent from './pages/CreateEvent';
import { AppProviders, ThemeContext, AuthContext } from './context';
import { useContext } from 'react';

// --- 1. Setup TanStack Query Client ---
const queryClient = new QueryClient();

// --- 2. Base Layout & Error Boundary ---
const RootLayout = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #ccc', 
        paddingBottom: '10px', 
        marginBottom: '20px' 
      }}>
        <h1>Event Management</h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '0.9rem' }}>Welcome, {user.name}</span>
          <button 
            onClick={toggleTheme}
            style={{
              padding: '8px 12px',
              background: theme === 'dark' ? '#fff' : '#333',
              color: theme === 'dark' ? '#333' : '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

const ErrorPage = () => (
  <div style={{ padding: '20px', color: 'red' }}>
    <h2>404 - Something went wrong or page not found!</h2>
  </div>
);

// --- 3. Route Configuration ---
// These exactly match the paths required in your PDF
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { 
        index: true, 
        element: <h2>Welcome! Go to /events in the URL.</h2> 
      },
      { 
        path: "events", 
        element: <EventsListing /> 
      },
      { 
        path: "events/:id", 
        element: <EventDetails /> 
      },
      { 
        path: "book/:eventId", 
        element: <BookingFlow /> 
      },
      { 
        path: "create-event", 
        element: <CreateEvent /> 
      },
      { 
        path: "events/:id", 
        element: <h2>Event Details Page</h2> 
      },
      { 
        path: "book/:eventId", 
        element: <h2>Booking Flow</h2> 
      },
      { 
        path: "my-bookings", 
        element: <h2>User Bookings</h2> 
      },
      { 
        path: "create-event", 
        element: <h2>Create Event Wizard</h2> 
      },
      { 
        path: "profile", 
        element: <h2>User Profile</h2> 
      }
    ]
  }
]);

// --- 4. Render App ---
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppProviders>
          <RouterProvider router={router} />
        </AppProviders>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);