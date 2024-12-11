import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Paper } from '@mui/material';

const NotificationPermission = () => {
  const [permission, setPermission] = useState(Notification.permission);

  const requestNotificationPermission = () => {
    Notification.requestPermission().then((newPermission) => {
      setPermission(newPermission);
      if (newPermission === 'granted') {
        console.log('Notifications enabled');
      }
    });
  };

  useEffect(() => {
    // Update state if Notification permission changes during runtime
    const handlePermissionChange = () => {
      setPermission(Notification.permission);
    };

    window.addEventListener('focus', handlePermissionChange);
    return () => {
      window.removeEventListener('focus', handlePermissionChange);
    };
  }, []);

  return (
    permission === 'default' && (
      <Box
        className="fixed inset-0 flex items-center justify-center z-50"
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          padding: '20px',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '100%',
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.15)',
          }}
        >
          <Typography variant="body2" align="center" gutterBottom>
            We’d like to send you notifications. Allow notifications?
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={requestNotificationPermission}
            sx={{
              padding: '8px 16px',
              fontSize: '13px',
              backgroundColor: '#4CAF50',
              '&:hover': {
                backgroundColor: '#45a049',
              },
            }}
          >
            Allow Notifications
          </Button>
        </Paper>
      </Box>
    )
  );
};

export default NotificationPermission;
