"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { faker } from "@faker-js/faker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function AreaChart({ sensorData }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Tingkat Kelembapan",
      },
    },
  };

  const labels = sensorData?.map((item) => {
    const timestamp = new Date(item.timestamp);
    const hours = String(timestamp.getHours()).padStart(2, '0'); // Get the hour and pad with leading 0 if needed
    const minutes = String(timestamp.getMinutes()).padStart(2, '0'); // Get the minutes and pad with leading 0 if needed
    return `${hours}:${minutes}`;
  });

  // const data = {
  //   labels,
  //   datasets: [
  //     {
  //       fill: true,
  //       label: "Dataset 2",
  //       data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
  //       borderColor: "#006CC2",
  //       backgroundColor: "#94D2FF",
  //     },
  //   ],
  // };
  
  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: "Dataset 2",
        data: sensorData?.map((item) => item.temp),
        borderColor: "#006CC2",
        backgroundColor: "#94D2FF",
      },
    ],
  };

  return <Line options={options} data={data} />;
}
