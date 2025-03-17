import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  IconButton,
  Collapse,
} from "@mui/material";
import { Search, Close } from "@mui/icons-material";
import axios from "axios";

const ProductSelector = ({
  open,
  onClose,
  setSearchTerm,
  searchTerm,
  setSelectedProducts,
  selectedProducts,
  selectedInputId,
  setInput,
  input,
}) => {
  const [products, setProducts] = useState([]);
  const [openProduct, setOpenProduct] = useState(null);

  useEffect(() => {
    if (searchTerm) {
      fetchProducts(searchTerm);
    } else {
      setProducts([]);
    }
  }, [searchTerm]);

  const fetchProducts = async (query) => {
    try {
      const response = await axios.get(
        `https://stageapi.monkcommerce.app/task/products/search?search=${query}&page=1&limit=5`,
        {
          headers: { "x-api-key": "72njgfa948d9aS7gs5" },
        }
      );
      setProducts(response?.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const toggleSubProducts = (productId) => {
    setOpenProduct(openProduct === productId ? null : productId);
  };

  const handleSelect = (variant, product) => {
    setSelectedProducts((prev) => {
      const exists = prev.some((item) => item.id === variant.id);
      const updatedProducts = exists
        ? prev.filter((item) => item.id !== variant.id)
        : [
            ...prev,
            {
              ...variant,
              parentTitle: product.title,
              inputId: selectedInputId,
            },
          ];

      setInput((prevInputs) =>
        prevInputs.map((input) =>
          input.id === selectedInputId
            ? { ...input, selectedProducts: updatedProducts }
            : input
        )
      );

      return updatedProducts;
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Add Products
        <IconButton onClick={onClose} sx={{ position: "absolute", right: 8 }}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          placeholder="Search products..."
          variant="outlined"
          InputProps={{
            startAdornment: <Search sx={{ mr: 1 }} />,
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <List>
          {products?.map((product) => (
            <div key={product.id}>
              <ListItem button onClick={() => toggleSubProducts(product.id)}>
                <img
                  src={product?.image?.src}
                  alt="ad"
                  height={50}
                  width={50}
                />
                <ListItemText primary={product.title} />
              </ListItem>
              <Collapse
                in={openProduct === product.id}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {product.variants?.map((variant) => (
                    <ListItem
                      key={variant.id}
                      button
                      onClick={() => handleSelect(variant, product)}
                    >
                      <ListItemIcon>
                        <Checkbox
                          checked={selectedProducts.some(
                            (item) => item.id === variant.id
                          )}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${variant.title} - ₹${variant.price}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </div>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          Cancel
        </Button>
        <Button onClick={onClose} color="primary" variant="contained">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductSelector;
