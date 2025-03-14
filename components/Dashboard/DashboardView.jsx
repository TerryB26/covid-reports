import React, { useState,useEffect } from 'react';
import {Box, Grid,Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, TableSortLabel, TablePagination} from "@mui/material";
import PageHeader from "@/components/General/PageHeader";
import InfoCard from "@/components/General/InfoCard";
import { MdOutlineAdsClick } from "react-icons/md";
import BarGraph from '@/components/Statistics/BarGraph';
import PieChart from '@/components/Statistics/PieChart';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import DialogForm from '@/components/General/DialogForm';
import { CovidStats } from '@/library/DummyDB';

const DashboardView = () => {

  const aggregateMonthlyData = (data) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyData = {};
    data.forEach(entry => {
      const [year, month] = entry.Date.split('/').slice(0, 2);
      const key = monthNames[parseInt(month) - 1];
      if (!monthlyData[key]) {
        monthlyData[key] = { cases: 0, deaths: 0 };
      }
      monthlyData[key].cases += parseInt(entry['Total Confirmed Cases']) || 0;
      monthlyData[key].deaths += parseInt(entry['Total Deaths']) || 0;
    });
    return Object.entries(monthlyData).map(([key, value]) => ({
      month: key,
      cases: value.cases,
      deaths: value.deaths
    }));
  };

    const [searchTerm, setSearchTerm] = useState('');
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('Date');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5); 
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');  
    const [dialogContent, setDialogContent] = useState('');

    const [totalConfirmed, setTotalConfirmed] = useState(0);
    const [totalDeaths, setTotalDeaths] = useState(0);
    const [totalRecovered, setTotalRecovered] = useState(0);
    const [totalActiveCases, setTotalActiveCases] = useState(0);
    const [lowestDate, setLowestDate] = useState('');
    const [highestDate, setHighestDate] = useState('');
    const [monthlyData, setMonthlyData] = useState([]);
    
    useEffect(() => {
      const toInt = (value) => (isNaN(parseInt(value)) ? 0 : parseInt(value));
      const confirmed = CovidStats.reduce((sum, entry) => sum + toInt(entry["Total Confirmed Cases"]), 0);
      const deaths = CovidStats.reduce((sum, entry) => sum + toInt(entry["Total Deaths"]), 0);
      const recovered = CovidStats.reduce((sum, entry) => sum + toInt(entry["Total Recovered"]), 0);
      const activeCases = CovidStats.reduce((sum, entry) => sum + toInt(entry["Active Cases"]), 0);
    
      const dates = CovidStats.map(entry => new Date(entry.Date.replace(/\//g, '-')));
      const minDate = new Date(Math.min(...dates));
      const maxDate = new Date(Math.max(...dates));

      const aggregatedData = aggregateMonthlyData(CovidStats);



      setMonthlyData(aggregatedData);
      setTotalConfirmed(confirmed);
      setTotalDeaths(deaths);
      setTotalRecovered(recovered);
      setTotalActiveCases(activeCases);
      setLowestDate(minDate.toISOString().split('T')[0]);
      setHighestDate(maxDate.toISOString().split('T')[0]);
    }, []);
    
    const handleIconClick = (title) => {
      let dialogContent = '';
      switch (title) {
        case 'Confirmed Cases':
          dialogContent = `Since <b>${lowestDate}</b> till <b>${highestDate}</b>, we have recorded a total of <b>${totalConfirmed}</b> <b>${title}</b>`;
          break;
        case 'Active Cases':
          dialogContent = `Since <b>${lowestDate}</b> till <b>${highestDate}</b>, we have confirmed a total of <b>${totalActiveCases}</b> <b>${title}</b>`;
          break;
        case 'Total Recovered':
          dialogContent = `Since <b>${lowestDate}</b> till <b>${highestDate}</b>, we have recorded a total of <b>${totalRecovered}</b> <b>${title}</b> patients`;
          break;
        case 'Total Deaths':
          dialogContent = `Since <b>${lowestDate}</b> till <b>${highestDate}</b>, we recorded at least <b>${totalDeaths}</b> <b>${title}</b>`;
          break;
        default:
          dialogContent = 'Details not available';
      }
      setDialogTitle(title);
      setDialogContent(dialogContent);
      setDialogOpen(true);
    };
    
      const handleClose = () => {
        setDialogOpen(false);
      };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
      };
    
      const handleClearSearch = () => {
        setSearchTerm('');
      };
    
      const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
      };
    
      const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };
    
      const filteredData = CovidStats.filter((row) =>
        row["Total Confirmed Cases"].toString().includes(searchTerm.toLowerCase()) ||
        row["Total Deaths"].toString().includes(searchTerm.toLowerCase()) ||
        row["Total Recovered"].toString().includes(searchTerm.toLowerCase()) ||
        row["Active Cases"].toString().includes(searchTerm.toLowerCase()) ||
        row["Daily Confirmed Cases"].toString().includes(searchTerm.toLowerCase()) ||
        row["Daily  deaths"].toString().includes(searchTerm.toLowerCase()) 
      );
      
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
    <div style={{ padding: "20px" }}>
      <PageHeader/>

      <Grid container spacing={3}>
        {/* Info Cards */}
        
          <Grid item xs={12} md={3} key="Total1">
            <InfoCard
              header={
                <>
                  <MdOutlineAdsClick
                    style={{ marginRight: "8px", verticalAlign: 'middle', position: 'relative', top: '-2px', cursor: 'pointer' }}
                    onClick={() => handleIconClick('Confirmed Cases')}
                  />
                  Confirmed Cases
                </>
              }
              innerText={totalConfirmed}
            />
          </Grid>
          <Grid item xs={12} md={3} key="Total2">
            <InfoCard
              header={
                <>
                  <MdOutlineAdsClick
                    style={{ marginRight: "8px", verticalAlign: 'middle', position: 'relative', top: '-2px', cursor: 'pointer' }}
                    onClick={() => handleIconClick('Active Cases')}
                  />
                  Active Cases
                </>
              }
              innerText={totalActiveCases}
            />
          </Grid>
          <Grid item xs={12} md={3} key="Total3">
            <InfoCard
              header={
                <>
                  <MdOutlineAdsClick
                    style={{ marginRight: "8px", verticalAlign: 'middle', position: 'relative', top: '-2px', cursor: 'pointer' }}
                    onClick={() => handleIconClick('Total Recovered')}
                  />
                  Total Recovered
                </>
              }
              innerText={totalRecovered}
            />
          </Grid>
          <Grid item xs={12} md={3} key="Total4">
            <InfoCard
              header={
                <>
                  <MdOutlineAdsClick
                    style={{ marginRight: "8px", verticalAlign: 'middle', position: 'relative', top: '-2px', cursor: 'pointer' }}
                    onClick={() => handleIconClick('Total Deaths')}
                  />
                  Total Deaths
                </>
              }
              innerText={totalDeaths}
            />
          </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <InfoCard
            header="Cases & Deaths"
            innerText={
              <BarGraph titles={["Recorded Cases" , "Recorded Deaths"]} MonthlyData={monthlyData}/>
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <InfoCard
            header="Cases, Recoveries & Deaths"
            innerText={
                <PieChart titles={["Confimed Cases" , "Recorded Deaths" , "Recorded Recoveries"]} PieData={[totalConfirmed,totalDeaths,totalRecovered]}/>
              }
          />
        </Grid>

        <Grid item xs={12} md={12}>
            <InfoCard
              header="Summarized Data"
              innerText={
                <Box p={2}>
                  <Box p={2} display="flex" alignItems="center">
                    <TextField
                      label="Search"
                      placeholder='Search by Confirmed Cases, Deaths & Recovered'
                      variant="outlined"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      fullWidth
                      style={{ marginRight: '20px' }}
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
                  <TableContainer component={Paper} style={{ maxHeight: 400 }}>
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
                </Box>
              }
            />
        </Grid>
      </Grid>

      <DialogForm
        title={dialogTitle}
        content={dialogContent}
        open={dialogOpen}
        onClose={handleClose}
        width='sm'
      />

    </div>
  )
}

export default DashboardView