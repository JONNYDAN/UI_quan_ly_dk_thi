import React, { useEffect, useState } from 'react';

import { Box, Card, Typography, List, ListItem } from '@mui/material';

import userService from 'src/services/userService';

export default function UserManagementView() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    userService.getAllUser()
      .then((res: any) => { if (mounted) setUsers(res || []); })
      .catch(() => { if (mounted) setUsers([]); });
    return () => { mounted = false; };
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Users</Typography>
        <List>
          {users.map((u) => (
            <ListItem key={u.id}>{u.fullname || u.name || JSON.stringify(u)}</ListItem>
          ))}
        </List>
      </Card>
    </Box>
  );
}