import * as React from "react";
import { useTheme } from "@mui/material/styles";

import {
  Button,
  Box,
  Slider,
  InputBase,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";

import {
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

import moment from "moment";
import { Researcher } from "../../../types/Researcher";
import { useDebouncedCallback } from "use-debounce";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions({
  count,
  page,
  rowsPerPage,
  onPageChange,
}: TablePaginationActionsProps) {
  const theme = useTheme();

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

interface Props {
  handleOpen: () => void;
  data: Researcher[];
  setData: (rows: Researcher[]) => void;
  setSelectedRow: (row: Researcher | undefined) => void;
}

export const DataTable = ({
  handleOpen,
  data,
  setData,
  setSelectedRow,
}: Props) => {
  const [filterData, setFilterData] = React.useState<Researcher[]>(data);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [searched, setSearched] = React.useState<string>("");
  const [delay, setDelay] = React.useState<number>(1000);
  const rowsPerPageOptions = [5, 10, 25, { label: "All", value: -1 }];

  React.useMemo(() => {
    setFilterData(data);
  }, [data]);

  const handleDelayChange = (event: Event, newValue: number | number[]) => {
    setDelay(newValue as number);
  };

  const requestSearch = useDebouncedCallback((searchedVal: string) => {
    const filteredRows = data.filter((row) => {
      return (
        row.name.toLowerCase().includes(searchedVal.toLowerCase()) ||
        row.email.toLowerCase().includes(searchedVal.toLowerCase()) ||
        row.background.toLowerCase().includes(searchedVal.toLowerCase())
      );
    });
    setFilterData(filteredRows);
  }, delay);

  const addRow = (row: Researcher): void => {
    handleOpen();
    setSelectedRow(row);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filterData.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box width="100%">
      <Box display="flex" justifyContent="space-between" width="100%" mb="1rem">
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedRow(undefined);
            handleOpen();
          }}
          sx={{ width: "20%" }}
          size="small"
        >
          Add
        </Button>
        <Box sx={{ width: 300 }}>
          <Box component="div" display="inline">
            Delay
          </Box>
          <Slider
            aria-label="Volume"
            value={delay}
            valueLabelDisplay="on"
            min={500}
            max={2500}
            onChange={handleDelayChange}
          />
        </Box>
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 400,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search"
            value={searched}
            onChange={(e) => {
              setSearched(e.target.value);
              requestSearch(e.target.value);
            }}
            inputProps={{ "aria-label": "search" }}
          />
          <IconButton
            type="submit"
            sx={{ p: "10px" }}
            aria-label="search"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>
      {filterData && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Background</TableCell>
                <TableCell align="center">Edit</TableCell>
                <TableCell align="center">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? filterData.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : filterData
              ).map((row) => (
                <TableRow key={row.email}>
                  <TableCell component="th" align="center">
                    {row.name}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="center">
                    {row.email}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="center">
                    {moment(row.date).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="center">
                    {row.background}
                  </TableCell>
                  <TableCell align="center">
                    <Button variant="contained" onClick={() => addRow(row)}>
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      onClick={() => {
                        setData(data.filter((res) => res.email !== row.email));
                      }}
                      sx={{ backgroundColor: "red" }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={rowsPerPageOptions}
                  colSpan={5}
                  count={filterData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
