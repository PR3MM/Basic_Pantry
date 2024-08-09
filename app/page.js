"use client";

import { Box, Stack, Typography, Button, Modal } from "@mui/material";
import { firestore } from "@/firebase";
import { collection, query, getDocs, setDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { TextField } from "@mui/material";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)',
  width: '400px',
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  backgroundColor: '#f9f9f9',
  padding: '20px',
  borderRadius: '5px',
  gap: 3,
  display: 'flex',
  flexDirection: 'column'
};

export default function PantryManager() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updatePantry = async () => {
    try {
      const snapshot = query(collection(firestore, "pantry"));
      const docs = await getDocs(snapshot);
      const pantrylist = docs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Pantry List:", JSON.stringify(pantrylist, null, 2));
      setPantry(pantrylist);
    } catch (err) {
      console.error("Error fetching pantry items:", err);
    }
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const addItems = async (items) => {
    const existingItem = pantry.find((item) => item.name === items);
    if (existingItem) {
      // Increment the quantity of the existing item
      const docRef = doc(firestore, "pantry", existingItem.id);
      await updateDoc(docRef, { quantity: existingItem.quantity + 1 });
    } else {
      // Create a new item
      const docRef = doc(collection(firestore, 'pantry'), items);
      await setDoc(docRef, { name: items, quantity: 1 });
    }
    updatePantry();
  };

  const removeItem = async (itemId) => {
    try {
      await deleteDoc(doc(firestore, "pantry", itemId));
      updatePantry();
    } catch (err) {
      console.error("Error removing item from pantry:", err);
    }
  };

  const getItemName = (item) => {
    if (item.name && typeof item.name === "string" && item.name.trim() !== "") {
      return `${item.name} (${item.quantity})`;
    } else {
      console.warn("Using ID as name for item:", JSON.stringify(item, null, 2));
      return item.id.charAt(0).toUpperCase() + item.id.slice(1);
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f0f0f0"
      p={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={"row"} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItems(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Button variant="contained" onClick={handleOpen}>
        Add
      </Button>

      <Box
        width="800px"
        height="100px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h1" color="#333" textAlign="center">
          Pantry Items
        </Typography>
      </Box>
      <Stack
        width="800px"
        height="400px"
        spacing={2}
        overflow="auto"
        p={2}
        bgcolor="#fff"
        borderRadius={2}
        boxShadow={3}
      >
        {pantry.map((item) => (
          <Box
            key={item.id}
            width="100%"
            height="100px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            bgcolor="#f0f0f0"
            borderRadius={1}
            p={2}
          >
            <Typography variant="h5" color="#333" textAlign="center">
              {getItemName(item)}
            </Typography>
            <Button
              variant="contained"
              color="error"
              onClick={() => removeItem(item.id)}
            >
              Remove
            </Button>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}