import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  TextField,
  IconButton,
  Grid,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import {
  DragIndicator,
  Edit,
  ExpandLess,
  ExpandMore,
  Close,
} from "@mui/icons-material";
import ProductSelector from "./productDilog";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const App = () => {
  const [input, setInput] = useState([{ id: 1, selectedProducts: [] }]);
  const [selectedInputId, setSelectedInputId] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [showVariants, setShowVariants] = useState({});
  const [manageDiscount, setManageDiscount] = useState({});
  const [discountValue, setDiscountValue] = useState("");
  const [discountType, setDiscountType] = useState("% off");

  useEffect(() => {
    if (selectedInputId) {
      const matchedProduct = input.find(
        (product) => product.id === selectedInputId
      );
      setSelectedProducts(
        matchedProduct ? matchedProduct.selectedProducts || [] : []
      );
    }
  }, [selectedInputId, input]);

  const handleOpenModal = useCallback((id) => {
    setSelectedInputId(id);
    setModalOpen(true);
  }, []);

  const handleAddProduct = useCallback(() => {
    setInput((prev) => [
      ...prev,
      { id: prev.length + 1, selectedProducts: [] },
    ]);
  }, []);

  const toggleVariants = (id) => {
    setShowVariants((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRemoveVariant = (productId, variantId) => {
    setInput((prev) =>
      prev.map((product) =>
        product.id === productId
          ? {
              ...product,
              selectedProducts: product.selectedProducts.filter(
                (v) => v.id !== variantId
              ),
            }
          : product
      )
    );
  };

  const handleDragEnd = (result, productId) => {
    if (!result.destination) return;

    setInput((prev) =>
      prev.map((product) => {
        if (product.id === productId) {
          const updatedVariants = [...product.selectedProducts];
          const [movedItem] = updatedVariants.splice(result.source.index, 1);
          updatedVariants.splice(result.destination.index, 0, movedItem);
          return { ...product, selectedProducts: updatedVariants };
        }
        return product;
      })
    );
  };

  const handleDiscount = (productId) => {
    setManageDiscount((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#f8f9fa" }}>
      {input.map((product, index) => (
        <Box
          key={product.id}
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 2,
            backgroundColor: "#fff",
            border: "1px solid #ddd",
          }}
        >
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <DragIndicator sx={{ color: "gray", cursor: "grab" }} />
            </Grid>
            <Grid item>
              <Typography>{index + 1}.</Typography>
            </Grid>
            <Grid item xs>
              <TextField
                fullWidth
                placeholder="Select Product"
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => handleOpenModal(product.id)}>
                      <Edit sx={{ color: "gray" }} />
                    </IconButton>
                  ),
                }}
                value={
                  product.selectedProducts.length
                    ? product.selectedProducts[0].parentTitle
                    : ""
                }
              />
            </Grid>
            <Grid item>
              {manageDiscount[product.id] ? (
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      placeholder="Enter Discount"
                      size="small"
                      variant="outlined"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                    />
                  </Grid>
                  <Grid item>
                    <Select
                      size="small"
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value)}
                    >
                      <MenuItem value="% off">% off</MenuItem>
                      <MenuItem value="Flat off">Flat off</MenuItem>
                    </Select>
                  </Grid>
                </Grid>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleDiscount(product.id)}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  Add Discount
                </Button>
              )}
            </Grid>
          </Grid>

          {product.selectedProducts.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 1,
                  cursor: "pointer",
                  color: "blue",
                  mt: 1,
                  width: "100%",
                }}
                onClick={() => toggleVariants(product.id)}
              >
                {showVariants[product.id] ? <ExpandLess /> : <ExpandMore />}
                <Typography variant="body2">
                  {showVariants[product.id] ? "Hide Variants" : "Show Variants"}
                </Typography>
              </Box>

              {showVariants[product.id] && (
                <DragDropContext
                  onDragEnd={(result) => handleDragEnd(result, product.id)}
                >
                  <Droppable droppableId={`droppable-${product.id}`}>
                    {(provided) => (
                      <Box
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        sx={{ mt: 2 }}
                      >
                        {product.selectedProducts.map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={String(item.id)}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <Box
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  p: 1,
                                  mt: 1,
                                  borderRadius: 5,
                                  backgroundColor: snapshot.isDragging
                                    ? "#e0e0e0"
                                    : "#f2f2f2",
                                  boxShadow: snapshot.isDragging
                                    ? "0px 2px 5px rgba(0,0,0,0.2)"
                                    : "none",
                                }}
                              >
                                <DragIndicator
                                  sx={{ color: "gray", cursor: "grab", mr: 1 }}
                                />
                                <Typography sx={{ flexGrow: 1 }}>
                                  {`${item.parentTitle} - ${item.title}`}
                                </Typography>
                                <IconButton
                                  onClick={() =>
                                    handleRemoveVariant(product.id, item.id)
                                  }
                                  size="small"
                                >
                                  <Close fontSize="small" />
                                </IconButton>
                              </Box>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </Box>
          )}
        </Box>
      ))}

      <Box display="flex" justifyContent="center">
        <Button variant="outlined" color="success" onClick={handleAddProduct}>
          Add Product
        </Button>
      </Box>

      <ProductSelector
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        setSelectedProducts={setSelectedProducts}
        selectedProducts={selectedProducts}
        selectedInputId={selectedInputId}
        setInput={setInput}
      />
    </Box>
  );
};

export default App;
