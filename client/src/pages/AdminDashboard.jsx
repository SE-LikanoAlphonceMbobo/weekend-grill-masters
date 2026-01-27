import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Tabs, 
  Tab, 
  Box, 
  Button, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, // <--- I added this
  TableHead, 
  TableRow, 
  Paper, 
  MenuItem, 
  Select, 
  InputLabel, 
  FormControl 
} from '@mui/material';
import axios from 'axios';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return <div role="tabpanel" hidden={value !== index} {...other}>{children}</div>;
}

export default function AdminDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [openAddItem, setOpenAddItem] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', image_url: 'https://picsum.photos/400/300', category: 'Grill' });

  useEffect(() => { 
    fetchBookings(); 
    fetchInventory(); 
  }, []);

  const fetchBookings = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/bookings/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings", err);
    }
  };

  const fetchInventory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/inventory');
      setInventory(res.data);
    } catch (err) {
      console.error("Error fetching inventory", err);
    }
  };

  const handleAddItem = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/inventory', newItem, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOpenAddItem(false);
      setNewItem({ name: '', description: '', price: '', image_url: 'https://picsum.photos/400/300', category: 'Grill' });
      fetchInventory();
    } catch (err) {
      alert("Error adding item");
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/inventory/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchInventory();
    } catch (err) {
      alert("Error deleting item");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/bookings/status/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBookings();
    } catch (err) {
      alert("Error updating status");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Admin Control Panel</Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="All Bookings" />
          <Tab label="Manage Inventory" />
        </Tabs>
      </Box>

      {/* TAB 1: BOOKINGS */}
      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map(b => (
                <TableRow key={b.id}>
                  <TableCell>#{b.id}</TableCell>
                  <TableCell>{b.name} ({b.email})</TableCell>
                  <TableCell>{new Date(b.event_date).toLocaleDateString()}</TableCell>
                  <TableCell>{b.location}</TableCell>
                  <TableCell>R{b.total_price}</TableCell>
                  <TableCell>
                    <FormControl size="small">
                      <Select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                        sx={{ minWidth: 100 }}
                      >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Confirmed">Confirmed</MenuItem>
                        <MenuItem value="Delivered">Delivered</MenuItem>
                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* TAB 2: INVENTORY */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button variant="contained" onClick={() => setOpenAddItem(true)}>Add New Item</Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>R{item.price}</TableCell>
                  <TableCell>
                    <Button color="error" size="small" onClick={() => handleDeleteItem(item.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ADD ITEM DIALOG */}
        <Dialog open={openAddItem} onClose={() => setOpenAddItem(false)}>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogContent>
            <TextField autoFocus margin="dense" label="Name" fullWidth variant="standard" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
            <TextField margin="dense" label="Description" fullWidth variant="standard" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} />
            <TextField margin="dense" label="Price" type="number" fullWidth variant="standard" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddItem(false)}>Cancel</Button>
            <Button onClick={handleAddItem}>Add</Button>
          </DialogActions>
        </Dialog>
      </TabPanel>
    </Container>
  );
}