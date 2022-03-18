import React from "react";
import { ModalContent } from "./components/modalContent";
import { Stack, Modal, Typography } from "@mui/material";
import { DataTable } from "./components/dataTable";
import { Researcher } from "../../types/Researcher";

export const Main = () => {
  const [data, setData] = React.useState<Researcher[]>([]);
  const [selectedRow, setSelectedRow] = React.useState<Researcher | undefined>(
    undefined
  );
  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Stack
      spacing={2}
      alignItems="center"
      maxWidth="80%"
      mx="auto"
      marginTop="2rem"
    >
      <Typography variant="h3" component="div" gutterBottom color="yellowgreen">
        Researchers’ contact records
      </Typography>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalContent
          handleClose={handleClose}
          data={data}
          setData={setData}
          selectedRow={selectedRow}
        />
      </Modal>
      <DataTable
        handleOpen={handleOpen}
        data={data}
        setData={setData}
        setSelectedRow={setSelectedRow}
      />
    </Stack>
  );
};
