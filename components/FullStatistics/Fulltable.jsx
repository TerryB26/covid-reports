import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, Typography, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, TablePagination, Box, TableSortLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { CovidStats } from '@/library/DummyDB';
import { BsCalendar2Date } from "react-icons/bs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const PaginationContainer = styled('div')(({ theme }) => ({
  '& .MuiTablePagination-selectRoot': {
    display: 'flex',
    alignItems: 'center',
  },
  '& .MuiTablePagination-select': {
    minWidth: '50px',
  },
}));

const CustomTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: '#ECEBF9',
}));

const AddUserButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  textTransform: "none",
  '&:hover': {
    backgroundColor: "#ECEBF9",
  },
}));

const Fulltable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('Date');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedDate(null); // Clear the selected date
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const filteredData = CovidStats.filter((row) => {
    const matchesSearchTerm = row["Total Confirmed Cases"].toString().includes(searchTerm.toLowerCase()) ||
      row["Total Deaths"].toString().includes(searchTerm.toLowerCase()) ||
      row["Total Recovered"].toString().includes(searchTerm.toLowerCase()) ||
      row["Active Cases"].toString().includes(searchTerm.toLowerCase()) ||
      row["Daily Confirmed Cases"].toString().includes(searchTerm.toLowerCase()) ||
      row["Daily deaths"].toString().includes(searchTerm.toLowerCase());

    const matchesDate = selectedDate ? new Date(row.Date).toDateString() === new Date(selectedDate).toDateString() : true;

    return matchesSearchTerm && matchesDate;
  });

  const sortedData = filteredData.sort((a, b) => {
    if (orderBy === 'Date') {
      return order === 'asc'
        ? new Date(a.Date) - new Date(b.Date)
        : new Date(b.Date) - new Date(a.Date);
    } else {
      return order === 'asc'
        ? a[orderBy] - b[orderBy]
        : b[orderBy] - a[orderBy];
    }
  });

  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ padding: "20px" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <TextField
            label="Search"
            placeholder='Search by Confirmed Cases, Deaths & Recovered'
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ marginRight: '10px', flex: 1 }}
            InputProps={{
              style: {
                height: '40px',
              },
            }}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#550000',
                },
                '&:hover fieldset': {
                  borderColor: '#ff0000',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#550000',
                },
              },
            }}
          />
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            slotProps={{
                textField: {
                variant: "outlined",
                sx: {
                    width: "200px", // Adjust width if needed
                    height: "40px", // Set height
                    '& .MuiOutlinedInput-root': {
                    height: "40px", // Reduce height
                    backgroundColor: "white",
                    border: "1px solid #550000",
                    color: "#550000",
                    '& fieldset': {
                        borderColor: "#550000",
                    },
                    '&:hover fieldset': {
                        borderColor: "#ff0000",
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: "#550000",
                    },
                    },
                    '& .MuiInputBase-input': {
                    padding: "10px", // Adjust padding for text
                    },
                },
                },
            }}
            />

          <Button
            variant="contained"
            color="secondary"
            onClick={handleClearSearch}
            startIcon={<SearchOffIcon sx={{ color: '#550000' }} />}
            sx={{
              height: '40px',
              backgroundColor: 'white',
              border: '1px solid #550000',
              color: '#550000',
              marginLeft: '10px',
              '&:hover': {
                backgroundColor: 'white',
                border: '1px solid #ff0000',
                color: '#ff0000',
              },
            }}
          >
            Clear
          </Button>
        </Box>

        <TableContainer component={Paper} style={{ maxHeight: 500 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'Date'}
                    direction={orderBy === 'Date' ? order : 'asc'}
                    onClick={(event) => handleRequestSort(event, 'Date')}
                  >
                    Date
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === 'Total Confirmed Cases'}
                    direction={orderBy === 'Total Confirmed Cases' ? order : 'asc'}
                    onClick={(event) => handleRequestSort(event, 'Total Confirmed Cases')}
                  >
                    Total Confirmed Cases
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === 'Total Recovered'}
                    direction={orderBy === 'Total Recovered' ? order : 'asc'}
                    onClick={(event) => handleRequestSort(event, 'Total Recovered')}
                  >
                    Total Recovered
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === 'Active Cases'}
                    direction={orderBy === 'Active Cases' ? order : 'asc'}
                    onClick={(event) => handleRequestSort(event, 'Active Cases')}
                  >
                    Active Cases
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === 'Total Deaths'}
                    direction={orderBy === 'Total Deaths' ? order : 'asc'}
                    onClick={(event) => handleRequestSort(event, 'Total Deaths')}
                  >
                    Total Deaths
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === 'Daily Confirmed Cases'}
                    direction={orderBy === 'Daily Confirmed Cases' ? order : 'asc'}
                    onClick={(event) => handleRequestSort(event, 'Daily Confirmed Cases')}
                  >
                    Daily Confirmed Cases
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#E4F2FF',
                    },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {row.Date}
                  </TableCell>
                  <TableCell align="right">{row["Total Confirmed Cases"]}</TableCell>
                  <TableCell align="right">{row["Total Recovered"]}</TableCell>
                  <TableCell align="right">{row["Active Cases"]}</TableCell>
                  <TableCell align="right">{row["Total Deaths"]}</TableCell>
                  <TableCell align="right">{row["Daily Confirmed Cases"]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </div>
    </LocalizationProvider>
  );
};

export default Fulltable;