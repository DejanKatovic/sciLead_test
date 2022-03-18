import React, { forwardRef, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  Paper,
  Box,
  Grid,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  Button,
  FormControl,
  IconButton,
  SelectChangeEvent,
} from "@mui/material";

import { Close } from "@mui/icons-material";

import { Researcher } from "../../../types/Researcher";
import moment from "moment";

interface Props {
  handleClose: () => void;
  data: Researcher[];
  setData: (value: Researcher[]) => void;
  selectedRow: Researcher | undefined;
}

export const ModalContent = forwardRef(
  ({ handleClose, data, setData, selectedRow }: Props, ref) => {
    const [name, setName] = React.useState<string>(
      selectedRow ? selectedRow.name : ""
    );
    const [email, setEmail] = React.useState<string>(
      selectedRow ? selectedRow.email : ""
    );
    const [date, setDate] = React.useState<string>(
      moment(selectedRow ? selectedRow.date : new Date()).format("YYYY-MM-DD")
    );
    const [background, setBackground] = React.useState<string>(
      selectedRow ? selectedRow.background : "default"
    );

    const validationSchema = Yup.object().shape({
      name: Yup.string().required("Fullname is required"),
      email: Yup.string()
        .required("Email is required")
        .notOneOf(
          data.map((res) => (selectedRow?.email === res.email ? "" : res.email))
        )
        .email("Email is invalid"),
      date: Yup.date().required("Date is required"),
      background: Yup.string()
        .required("Please select a Background")
        .oneOf(["Academic", "Industry"]),
    });

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(validationSchema),
    });

    const onSubmit = (row: any) => {
      if (selectedRow) {
        setData(
          data.map((res) => {
            if (res.email === selectedRow.email) {
              return row;
            }
            return res;
          })
        );
      } else {
        setData([...data, row]);
      }
      handleClose();
    };

    const background_datas = ["Academic", "Industry"];

    return (
      <Paper
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Box px={3} py={2} position="relative">
          <IconButton
            aria-label="delete"
            size="small"
            sx={{ position: "absolute", right: "-1rem", top: "-1rem" }}
            onClick={handleClose}
          >
            <Close fontSize="small" />
          </IconButton>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                value={name}
                id="name"
                label="Name"
                fullWidth
                margin="dense"
                {...register("name")}
                error={errors.name ? true : false}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
              />
              <Typography variant="inherit" color="textSecondary">
                {errors.fullname?.message}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                value={email}
                id="email"
                label="Email Adress"
                fullWidth
                margin="dense"
                {...register("email")}
                error={errors.email ? true : false}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
              />
              <Typography variant="inherit" color="textSecondary">
                {errors.email?.message}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="date"
                value={date}
                label="date"
                type="date"
                fullWidth
                margin="dense"
                {...register("date")}
                error={errors.date ? true : false}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setDate(e.target.value)
                }
              />
              <Typography variant="inherit" color="textSecondary">
                {errors.date?.message}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                variant="standard"
                fullWidth
                sx={{
                  marginTop: "0.3rem",
                }}
              >
                <InputLabel id="label_background">Background</InputLabel>
                <Select
                  labelId="label_background"
                  id="background"
                  label="Background"
                  value={background}
                  {...register("background")}
                  error={errors.background ? true : false}
                  onChange={(e: SelectChangeEvent<string>) =>
                    setBackground(e.target.value)
                  }
                >
                  <MenuItem value="default" disabled>
                    Please Select
                  </MenuItem>
                  {background_datas.map((data: string) => (
                    <MenuItem value="Academic">{data}</MenuItem>
                  ))}
                </Select>
                <Typography variant="inherit" color="textSecondary">
                  {errors.background?.message}
                </Typography>
              </FormControl>
            </Grid>
            <Grid item sm={12} mt={4} textAlign="right">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit(onSubmit)}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    );
  }
);
