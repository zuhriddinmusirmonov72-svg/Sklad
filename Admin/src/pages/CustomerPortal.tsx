import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  Chip
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import { useOrders } from './Orders/OrdersContext';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function CustomerPortal() {
  const { products } = useOrders();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  // Animated background
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const handleOrderClick = (product: any) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCustomerName('');
    setPhoneNumber('');
    setNameError('');
    setPhoneError('');
  };

  const validateName = (name: string): boolean => {
    if (name.length < 3) {
      setNameError('Ism kamida 3 ta harfdan iborat bo\'lishi kerak');
      return false;
    }
    if (!/^[a-zA-Zа-яА-ЯўҳғқўҚҒҲ\s]+$/.test(name)) {
      setNameError('Ismda faqat harflar bo\'lishi kerak');
      return false;
    }
    setNameError('');
    return true;
  };

  const validatePhone = (phone: string): boolean => {
    if (!/^\d+$/.test(phone)) {
      setPhoneError('Telefon raqamda faqat raqamlar bo\'lishi kerak');
      return false;
    }
    if (phone.length < 9) {
      setPhoneError('Telefon raqam kamida 9 ta raqamdan iborat bo\'lishi kerak');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleSubmitOrder = async () => {
    const isNameValid = validateName(customerName);
    const isPhoneValid = validatePhone(phoneNumber);

    if (!isNameValid || !isPhoneValid) {
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      console.log('Sending order:', {
        customerName,
        phoneNumber,
        productId: selectedProduct.id,
        productName: selectedProduct.name
      });

      const response = await fetch(`${API_URL}/api/customer-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          phoneNumber,
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          productPrice: selectedProduct.price,
          productWeight: selectedProduct.weight,
          productPackQuantity: selectedProduct.packQuantity,
          status: 'pending',
          createdAt: new Date().toISOString()
        })
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        setSnackbar({
          open: true,
          message: 'Zakaz muvaffaqiyatli yuborildi! Tez orada siz bilan bog\'lanamiz.',
          severity: 'success'
        });
        handleCloseModal();
      } else {
        throw new Error(data.message || 'Failed to submit order');
      }
    } catch (error) {
      console.error('Order submit error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Noma\'lum xatolik';
      setSnackbar({
        open: true,
        message: `Xatolik yuz berdi: ${errorMessage}`,
        severity: 'error'
      });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Animated Background */}
      <Box
        ref={backgroundRef}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            left: `${mousePosition.x - 250}px`,
            top: `${mousePosition.y - 250}px`,
            transition: 'all 0.3s ease',
            pointerEvents: 'none',
          }
        }}
      />

      {/* Content */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 3, sm: 4, md: 6 } }}>
        {/* Header with Logout Button */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 2, sm: 0 },
          mb: { xs: 3, sm: 4, md: 6 }
        }}>
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
              textAlign: { xs: 'center', sm: 'left' },
              color: 'white',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            Mahsulotlar
          </Typography>
          <Button
            variant="contained"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            fullWidth={false}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              fontWeight: 'bold',
              py: { xs: 1.5, sm: 1 },
              px: { xs: 3, sm: 2 },
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)'
              }
            }}
          >
            Chiqish
          </Button>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            },
            gap: { xs: 2, sm: 3, md: 4 }
          }}
        >
          {products.map((product) => (
            <Box key={product.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.2)'
                  }
                }}
              >
                {product.image ? (
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'grey.200',
                      fontSize: '64px'
                    }}
                  >
                    📦
                  </Box>
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {product.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    {product.weight > 0 && (
                      <Chip
                        label={`${product.weight}g`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    )}
                    {product.packQuantity > 0 && (
                      <Chip
                        label={`${product.packQuantity} dona`}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    )}
                  </Box>

                  <Typography variant="h5" color="success.main" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {(product.price * 12000).toLocaleString()} so'm
                  </Typography>

                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => handleOrderClick(product)}
                    sx={{
                      bgcolor: '#667eea',
                      '&:hover': {
                        bgcolor: '#764ba2'
                      }
                    }}
                  >
                    Zakas berish
                  </Button>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Order Modal */}
      <Dialog 
        open={openModal} 
        onClose={handleCloseModal} 
        maxWidth="sm" 
        fullWidth
        fullScreen={false}
        slotProps={{
          paper: {
            sx: {
              m: { xs: 2, sm: 3 },
              maxHeight: { xs: '90vh', sm: '80vh' }
            }
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" component="span" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              Zakas berish
            </Typography>
            <IconButton
              onClick={handleCloseModal}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedProduct && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                {selectedProduct.name}
              </Typography>
              <Typography color="text.secondary">
                Narx: {(selectedProduct.price * 12000).toLocaleString()} so'm | {selectedProduct.weight}g | {selectedProduct.packQuantity} dona
              </Typography>
            </Box>
          )}

          <TextField
            fullWidth
            label="Ismingiz"
            value={customerName}
            onChange={(e) => {
              setCustomerName(e.target.value);
              if (e.target.value) validateName(e.target.value);
            }}
            error={!!nameError}
            helperText={nameError || "Kamida 3 ta harf (faqat harflar)"}
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            label="Telefon raqam"
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
              if (e.target.value) validatePhone(e.target.value);
            }}
            error={!!phoneError}
            helperText={phoneError || "Faqat raqamlar (masalan: 998901234567)"}
            placeholder="998901234567"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Bekor qilish</Button>
          <Button
            variant="contained"
            onClick={handleSubmitOrder}
            disabled={!customerName || !phoneNumber || !!nameError || !!phoneError}
          >
            Yuborish
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
