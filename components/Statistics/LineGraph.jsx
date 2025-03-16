import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { CovidStats } from '@/library/DummyDB';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineGraph = () => {
  const dates = CovidStats.map(stat => {
    const date = new Date(stat.Date);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
  const totalConfirmedCases = CovidStats.map(stat => stat["Total Confirmed Cases"]);
  const dailyConfirmedCases = CovidStats.map(stat => stat["Daily Confirmed Cases"]);
  const totalDeaths = CovidStats.map(stat => stat["Total Deaths"]);
  const totalRecovered = CovidStats.map(stat => stat["Total Recovered"]);
  const activeCases = CovidStats.map(stat => stat["Active Cases"]);
  const dailyDeaths = CovidStats.map(stat => stat["Daily  deaths"]);

  const data = {
    labels: dates,
    datasets: [
      {
        label: "Total Confirmed Cases",
        data: totalConfirmedCases,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 1,
      },
      {
        label: "Daily Confirmed Cases",
        data: dailyConfirmedCases,
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderWidth: 1,
      },
      {
        label: "Total Deaths",
        data: totalDeaths,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 1,
      },
      {
        label: "Total Recovered",
        data: totalRecovered,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 1,
      },
      {
        label: "Active Cases",
        data: activeCases,
        borderColor: "rgba(255, 206, 86, 1)",
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderWidth: 1,
      },
      {
        label: "Daily Deaths",
        data: dailyDeaths,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          stepSize: 1, 
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Covid-19 Statistics",
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "800px" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineGraph;