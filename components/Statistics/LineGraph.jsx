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

// Custom plugin to add background text
const backgroundTextPlugin = {
  id: 'backgroundText',
  beforeDraw: (chart) => {
    const ctx = chart.ctx;
    const width = chart.width;
    const height = chart.height;
    ctx.save();
    ctx.font = 'bold 50px Arial';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Covid-19 Statistics', width / 2, height / 2);
    ctx.restore();
  }
};

const LineGraph = () => {
  const dates = CovidStats.map(stat => {
    const date = new Date(stat.Date);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  const parseValue = (value) => {
    if (typeof value === 'string') {
      return parseInt(value.replace(/\s/g, ''));
    }
    return value;
  };

  const totalConfirmedCases = CovidStats.map(stat => parseValue(stat["Total Confirmed Cases"]));
  const dailyConfirmedCases = CovidStats.map(stat => parseValue(stat["Daily Confirmed Cases"]));
  const totalDeaths = CovidStats.map(stat => parseValue(stat["Total Deaths"]));
  const totalRecovered = CovidStats.map(stat => parseValue(stat["Total Recovered"]));
  const activeCases = CovidStats.map(stat => parseValue(stat["Active Cases"]));
  const dailyDeaths = CovidStats.map(stat => parseValue(stat["Daily deaths"]));

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
          stepSize: 1, // Adjust this value to control the number of ticks
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
      backgroundText: {} // Enable the custom plugin
    },
  };

  return (
    <div style={{ width: "100%", height: "800px" }}>
      <Line data={data} options={options} plugins={[backgroundTextPlugin]} />
    </div>
  );
};

export default LineGraph;