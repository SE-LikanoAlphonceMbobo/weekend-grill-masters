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
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  MenuItem, 
  Select, 
  InputLabel, 
  FormControl,
  CircularProgress,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import axios from 'axios';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

// CONFIGURATION: Update these with your Cloudinary details
const CLOUD_NAME = 'djejaplo5'; 
const UPLOAD_PRESET = 'grill_masters_upload'; 

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return <div role="tabpanel" hidden={value !== index} {...other}>{children}</div>;
}

export default function AdminDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [openAddItem, setOpenAddItem] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Mobile if < 600px
  
  const [newItem, setNewItem] = useState({ 
    name: '', 
    description: '', 
    price: '', 
    imageFile: null, 
    category: 'Grill' 
  });

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

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);
    data.append("cloud_name", CLOUD_NAME);

    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, data);
      return res.data.secure_url;
    } catch (err) {
      console.error("Cloudinary Error:", err);
      alert("Failed to upload image to cloud. Check console.");
      return null;
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.price) return alert("Please fill in Name and Price");
    
    setLoading(true);
    
    let imageUrl = 'https://picsum.photos/400/300'; 

    if (newItem.imageFile) {
      const uploadedUrl = await uploadToCloudinary(newItem.imageFile);
      if (uploadedUrl) imageUrl = uploadedUrl;
    }

    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/inventory', {
        name: newItem.name,
        description: newItem.description,
        price: newItem.price,
        image_url: imageUrl,
        category: newItem.category
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOpenAddItem(false);
      setNewItem({ name: '', description: '', price: '', imageFile: null, category: 'Grill' });
      fetchInventory();
    } catch (err) {
      alert("Error adding item to database");
    } finally {
      setLoading(false);
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
        <TableContainer component={Paper} sx={{ mt: 2, overflowX: 'auto' }}>
          <Table sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }}}>ID</TableCell>
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
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }}}>#{b.id}</TableCell>
                  <TableCell>{b.name}</TableCell>
                  <TableCell>{new Date(b.event_date).toLocaleDateString()}</TableCell>
                  <TableCell sx={{ maxWidth: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {b.location}
                  </TableCell>
                  <TableCell>R{b.total_price}</TableCell>
                  <TableCell>
                    <FormControl size="small" sx={{ minWidth: 100 }}>
                      <Select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
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
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }}}>Preview</TableCell>
                <TableCell>Name</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }}}>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.map(item => (
                <TableRow key={item.id}>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                     <Box component="img" src={item.image_url} alt={item.name} sx={{ height: 50, width: 50, objectFit: 'cover' }} />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{item.category}</TableCell>
                  <TableCell>R{item.price}</TableCell>
                  <TableCell>
                    {/* Responsive Action: Icon on Mobile, Button on Desktop */}
                    {isMobile ? (
                      <IconButton color="error" onClick={() => handleDeleteItem(item.id)}>
                        <DeleteIcon />
                      </IconButton>
                    ) : (
                      <Button color="error" size="small" onClick={() => handleDeleteItem(item.id)}>Delete</Button>
                    )}
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
            <TextField autoFocus margin="dense" label="Name" fullWidth variant="standard" 
              value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
            <TextField margin="dense" label="Description" fullWidth variant="standard" 
              value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} />
            <TextField margin="dense" label="Price" type="number" fullWidth variant="standard" 
              value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} />
            
            <Box sx={{ mt: 2, border: '1px dashed #ccc', p: 2, textAlign: 'center' }}>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setNewItem({...newItem, imageFile: e.target.files[0]})} 
              />
            </Box>
            {newItem.imageFile && <Typography variant="caption" display="block" sx={{ mt: 1 }}>Selected: {newItem.imageFile.name}</Typography>}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddItem(false)} disabled={loading}>Cancel</Button>
            <Button onClick={handleAddItem} disabled={loading}>
              {loading ? <CircularProgress size={20} /> : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </TabPanel>
    </Container>
  );
}