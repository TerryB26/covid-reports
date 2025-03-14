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

const BarGraph = () => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const data = {
    labels: months,
    datasets: [
      {
        label: "Sales 2024",
        data: [65, 59, 80, 81, 56, 55, 40, 45, 60, 70, 75, 90],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Sales 2025",
        data: [75, 69, 90, 91, 66, 65, 50, 55, 70, 80, 85, 100],
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
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
      title: {
        display: true,
        text: "Monthly Sales Data",
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
