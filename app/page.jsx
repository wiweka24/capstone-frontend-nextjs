"use client";

import { useState, useEffect } from "react";
import fillBlue from "@/public/fill-blue.svg";
import fillRed from "@/public/fill-red.svg";
import fillOrange from "@/public/fill-orange.svg";
import { IoIosNotifications, IoMdSettings, IoIosRefresh } from "react-icons/io";
import TrashBin from "@/components/trash-bin";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import LineChart from "@/components/line-chart";
import AreaChart from "@/components/area-chart";
import { axiosInstance } from "@/utils/config";
import format from "date-fns/format";
import idLocale from "date-fns/locale/id";

// Register ChartJS components using ChartJS.register
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Home() {
  const binName = "bin-1-teti";
  const [location, setLocation] = useState("lokasi");
  const [temp, setTemp] = useState(0);
  const [trashCount, setTrashCount] = useState(35);
  const [trashData, setTrashData] = useState({});
  const [currentData, setCurrentData] = useState([]);
  const [currentColor, setCurrentColor] = useState("#006CC2");
  const [latestTrashData, setLatestTrashData] = useState({});
  const [update, setUpdate] = useState("");

  const [notifState, setNotifState] = useState(false);
  const [notifData, setNotifData] = useState([]);

  const levelHeight = [
    "-bottom-64",
    "-bottom-56",
    "-bottom-48",
    "-bottom-40",
    "-bottom-32",
    "-bottom-24",
    "-bottom-16",
    "-bottom-8",
    "-bottom-4",
    "-bottom-0",
  ];

  const tempData = {
    datasets: [
      {
        label: "Suhu",
        data: [temp, 100 - temp],
        backgroundColor: ["#006CC2", "#ffffff"],
        borderWidth: 1,
      },
    ],
  };

  function rerender() {
    setUpdate(`update ${Math.random()}`);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [binData, trashData, latestTrashData, notifData] =
          await Promise.all([
            axiosInstance.get(`/bin/${binName}`),
            axiosInstance.get(`/bin/${binName}/10`),
            axiosInstance.get(`/bin/${binName}/latest`),
            axiosInstance.get("/notification"),
          ]);

        const binDataRes = binData.data;
        const trashDataRes = trashData.data;
        const latestTrashDataRes = latestTrashData.data;
        const notifDataRes = notifData.data;

        setLocation(binDataRes.location);
        calculateTrashCount(binDataRes.organicData);

        setTrashData(trashDataRes);
        setCurrentData(trashDataRes.organicData);

        setLatestTrashData(latestTrashDataRes);
        setTemp(latestTrashDataRes.organicData.temp);

        setNotifData(notifDataRes);
      } catch (err) {
        console.log(err);
      }
    };

    // Fetch data initially
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000); // 5 minutes

    // Clear the interval on cleanup
    return () => clearInterval(interval);
  }, [binName, update]);

  function firstDigit(number) {
    const level = number < 10 ? 0 : number > 99 ? 99 : number;
    const matches = String(level).match(/\d/);
    const digit = Number(matches[0]);
    return digit;
  }

  function calculateTrashCount(trashData) {
    const currentTime = new Date(); // Current time
  
    // Filter the trash data for the last hour
    const lastHourTrashData = trashData.filter(data => {
      const dataTime = new Date(data.timestamp);
      const timeDifference = currentTime - dataTime;
      return timeDifference <= 3600000 && timeDifference >= 0; // Within the last hour and in the past
    });
  
    // Calculate the total trash count for the last hour
    let totalTrashCount = 0;
    for (const data of lastHourTrashData) {
      totalTrashCount += data.numberOfTrash;
    }
  
    setTrashCount(totalTrashCount);
  }

  function formattedDateTime(timestamp) {
    const formattedDate = format(new Date(timestamp), "dd MMMM yyyy HH:mm", {
      locale: idLocale,
    });
    return formattedDate;
  }

  return (
    <main className="min-h-screen bg-neutral-200">
      <div className="text-gray-900 mx-auto container py-8 flex flex-col items-center">
        {/* Top Section */}
        <div className="flex justify-between w-full">
          <div className="w-1/3" />
          <div className="w-1/3 flex flex-col items-center">
            <h1 className="w-max text-4xl font-medium drop-shadow">
              Dashboard
            </h1>
            <p className="text-xl">{location}</p>
          </div>
          <div className="w-1/3 flex items-center gap-4 justify-end">
            <div className="relative">
              <div
                onClick={() => setNotifState(!notifState)}
                className="h-14 bg-white hover:bg-gray-50 aspect-square rounded-md drop-shadow-lg text-gray-400 flex items-center justify-center"
              >
                <IoIosNotifications className="h-8 w-8" />
              </div>
              {notifState ? (
                <div className="absolute z-50 w-96 border rounded-lg right-0 mt-4 bg-white">
                  <div className="flex flex-col gap-2 p-4">
                    {notifData?.map((item, index) => (
                      <div key={index} className="flex flex-col gap-1 text-black text-right">
                        <p className="text-sm font-semibold">{item.text}</p>
                        <p className="text-xs text-red-800 font-light">
                          {formattedDateTime(item.timestamp)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div
              onClick={() => rerender()}
              className="h-14 bg-white hover:bg-gray-50 aspect-square rounded-md drop-shadow-lg text-gray-400 flex items-center justify-center"
            >
              <IoIosRefresh className="h-7 w-7" />
            </div>

            <div className="h-14 bg-white hover:bg-gray-50 aspect-square rounded-md drop-shadow-lg text-gray-400 flex items-center justify-center">
              <IoMdSettings className="h-7 w-7" />
            </div>
          </div>
        </div>

        {/* Trash Section */}
        <div className="flex w-max gap-16 pt-16">
          <div
            onClick={() => {
              setCurrentData(trashData.organicData), setCurrentColor("#006CC2");
            }}
          >
            <TrashBin
              fill={fillBlue}
              height={
                levelHeight[firstDigit(latestTrashData.organicData?.level || 0)]
              }
              trashType="organik"
              level={latestTrashData.organicData?.level}
            />
          </div>
          <div
            onClick={() => {
              setCurrentData(trashData.plasticData), setCurrentColor("#FFB215");
            }}
          >
            <TrashBin
              fill={fillOrange}
              height={
                levelHeight[firstDigit(latestTrashData.plasticData?.level || 0)]
              }
              trashType="plastik"
              level={latestTrashData.plasticData?.level}
            />
          </div>
          <div
            onClick={() => {
              setCurrentData(trashData.paperData), setCurrentColor("#FF6C75");
            }}
          >
            <TrashBin
              fill={fillRed}
              height={
                levelHeight[firstDigit(latestTrashData.paperData?.level || 0)]
              }
              trashType="kertas"
              level={latestTrashData.paperData?.level}
            />
          </div>
        </div>

        {/* Temp and Total Trash Section */}
        <div className="flex w-1/3 justify-between items-center pt-4">
          <div className="w-20 h-20 flex items-center justify-center gap-2">
            <Doughnut data={tempData} />
            <p className="text-2xl font-semibold">{temp > 100 ? 0 : temp}°C</p>
          </div>
          <div className="p-4 h-max bg-white rounded-lg drop-shadow-md flex flex-col justify-center">
            <p className="text-xl font-semibold">Sampah Masuk : {trashCount}</p>
            <p className="text-xs font-light">
              <span className="text-red-600">*</span>dalam 1 jam terakhir
            </p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="flex w-2/3 justify-center gap-8 pt-8">
          <div className="w-1/2 h-72 flex justify-center bg-white rounded-lg p-4">
            <LineChart color={currentColor} sensorData={currentData} />
          </div>
          <div className="w-1/2 h-72 flex justify-center bg-white rounded-lg p-4">
            {currentData == trashData.organicData ? (
              <AreaChart sensorData={currentData} />
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
