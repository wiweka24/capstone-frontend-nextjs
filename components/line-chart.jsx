"use client"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LineChart({ sensorData, color, dataset }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Tingkat Penuh Sampah",
      },
      yAxes: [
        {
          ticks: {
            min: 0,
            max: 100,
            stepSize: 20,
          },
        },
      ],
    },
    
  };
  
  const labels = sensorData?.map((item) => {
    const timestamp = new Date(item.timestamp);
    const hours = String(timestamp.getHours()).padStart(2, "0"); // Get the hour and pad with leading 0 if needed
    const minutes = String(timestamp.getMinutes()).padStart(2, "0"); // Get the minutes and pad with leading 0 if needed
    return `${hours}:${minutes}`;
  });

  const data = {
    labels,
    datasets: [
      {
        label: `Data Sampah ${dataset}`,
        data: sensorData?.map((item) => item.level),
        backgroundColor: color,
      },
    ],
  };

  return (
    <Line options={options} data={data} />
  )
}
