import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Box, IconButton } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarGraph = ({titles, MonthlyData}) => {

  const months = MonthlyData.map(data => data.month);

  const data = {
    labels: months,
    datasets: [
      {
        label: titles[0],
        data: MonthlyData.map(data => data.cases),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: titles[1],
        data: MonthlyData.map(data => data.deaths),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const [showFirstHalf, setShowFirstHalf] = useState(true);

  const handleToggle = () => {
    setShowFirstHalf(!showFirstHalf);
  };

  const visibleMonths = showFirstHalf ? months.slice(0, 6) : months.slice(6);
  const visibleData = {
    labels: visibleMonths,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      data: showFirstHalf ? dataset.data.slice(0, 6) : dataset.data.slice(6),
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      
    },
  };

  return (
    <Box>
      {/* Pagination Buttons */}
      <Box display="flex" justifyContent="space-between" alignItems="center" >
        <IconButton onClick={handleToggle} disabled={showFirstHalf}>
          <ArrowBack />
        </IconButton>
        <IconButton onClick={handleToggle} disabled={!showFirstHalf}>
          <ArrowForward />
        </IconButton>
      </Box>

      {/* Bar Chart */}
      <div style={{ width: "100%", height: "400px" }}>
        <Bar data={visibleData} options={options} />
      </div>
    </Box>
  );
};

export default BarGraph;
