"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

import fillBlue from "@/public/fill-blue.svg";
import fillRed from "@/public/fill-red.svg";
import fillOrange from "@/public/fill-orange.svg";
import loading from "@/public/loading.gif";
import TrashBin from "@/components/trash-bin";
import { axiosInstance } from "@/utils/config";

import format from "date-fns/format";
import idLocale from "date-fns/locale/id";
import { IoIosNotifications, IoMdSettings, IoIosRefresh } from "react-icons/io";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import LineChart from "@/components/line-chart";
import AreaChart from "@/components/area-chart";

// Register ChartJS components using ChartJS.register
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Home() {
  const binName = "bin-1-teti";
  const [location, setLocation] = useState("lokasi");

  const [temp, setTemp] = useState(0);
  const [humid, setHumid] = useState(0);
  const [trashCount, setTrashCount] = useState(0);
  const [trashData, setTrashData] = useState({});
  const [currentData, setCurrentData] = useState([]);
  const [currentColor, setCurrentColor] = useState("#006CC2");
  const [currentDataName, setCurrentDataName] = useState("organik");
  const [latestTrashData, setLatestTrashData] = useState({});
  const [update, setUpdate] = useState("");

  const [notifState, setNotifState] = useState(false);
  const [notifData, setNotifData] = useState([]);
  const [isLoading, setLoading] = useState(true);

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

  const tempBgColor = temp < 30 ? "#006CC2" : temp > 50 ? "#FF6C75" : "#FFB215";
  const tempData = {
    datasets: [
      {
        label: "Suhu",
        data: [temp, 100 - temp],
        backgroundColor: [tempBgColor, "#ffffff"],
        borderWidth: 1,
      },
    ],
  };

  const humidBgColor =
    humid < 30 ? "#006CC2" : humid > 50 ? "#FF6C75" : "#FFB215";
  const humidData = {
    datasets: [
      {
        label: "Kelembaban",
        data: [humid, 100 - humid],
        backgroundColor: [humidBgColor, "#ffffff"],
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
        setLoading(true);
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
        setHumid(latestTrashDataRes.organicData.humidity);

        setNotifData(notifDataRes);

        // stop loading
        setLoading(false);
      } catch (err) {
        // do nothing
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
    const lastHourTrashData = trashData.filter((data) => {
      const dataTime = new Date(data.timestamp);
      const timeDifference = currentTime - dataTime;
      return timeDifference <= 3600000 && timeDifference >= 0; // Within the last hour and in the past
    });

    // Calculate the total trash count for the last hour
    let totalTrashCount = 0;
    for (const data of lastHourTrashData) {
      if (!isNaN(data.numberOfTrash)) {
        totalTrashCount += data.numberOfTrash;
      }
    }

    setTrashCount(totalTrashCount);
  }

  function formattedDateTime(timestamp) {
    const formattedDate = format(new Date(timestamp), "dd MMMM yyyy HH:mm", {
      locale: idLocale,
    });
    return formattedDate;
  }

  if (isLoading)
    return (
      <main className="flex w-screen h-screen bg-neutral-200">
        <div className="m-auto justify-center text-center space-y-8">
          <Image
            className="scale-50 lg:scale-100 -my-16 lg:m-0"
            src={loading}
            alt="loading"
          />
          <p className="text-gray-900 text-base lg:text-lg font-semibold">
            memuat data ...
          </p>
        </div>
      </main>
    );

  return (
    <main className="min-h-screen bg-neutral-200">
      <div className="text-gray-900 mx-auto container py-8 flex flex-col items-center">
        {/* Top Section */}
        <div className="flex justify-between w-full px-4 lg:px-0">
          <div className="w-1/3" />
          <div className="w-1/3 flex flex-col items-center">
            <h1 className="w-max text-2xl lg:text-4xl font-medium drop-shadow">
              Dashboard
            </h1>
            <p className="text-base lg:text-xl">{location}</p>
          </div>
          <div className="w-1/3 flex items-center gap-2 lg:gap-4 justify-end">
            <div className="relative">
              <div
                onClick={() => setNotifState(!notifState)}
                className="h-10 lg:h-14 bg-white hover:bg-gray-50 aspect-square rounded-md drop-shadow-lg text-gray-400 flex items-center justify-center"
              >
                <IoIosNotifications className="lg:h-8 lg:w-8 h-4 w-4" />
              </div>
              {notifState ? (
                <div className="absolute z-50 w-56 lg:w-96 border rounded-lg right-0 mt-4 bg-white">
                  <div className="flex flex-col gap-2 p-4">
                    {notifData?.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-1 text-black text-right"
                      >
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
              className="h-10 lg:h-14 bg-white hover:bg-gray-50 aspect-square rounded-md drop-shadow-lg text-gray-400 flex items-center justify-center"
            >
              <IoIosRefresh className="lg:h-7 lg:w-7 h-4 w-4" />
            </div>

            <div className="hidden h-14 bg-white hover:bg-gray-50 aspect-square rounded-md drop-shadow-lg text-gray-400 lg:flex items-center justify-center">
              <IoMdSettings className="h-7 w-7" />
            </div>
          </div>
        </div>

        {/* Trash Section */}
        <div className="flex w-max gap-8 lg:gap-16 lg:pt-16 lg:scale-100 scale-[.6] -mb-8 lg:mb-0">
          <div
            onClick={() => {
              setCurrentData(trashData.organicData), setCurrentColor("#006CC2"), setCurrentDataName("Organik");
            }}
          >
            <TrashBin
              fill={fillBlue}
              height={
                levelHeight[firstDigit(latestTrashData.organicData?.level || 0)]
              }
              trashType="Organik"
              level={latestTrashData.organicData?.level}
            />
          </div>
          <div
            onClick={() => {
              setCurrentData(trashData.plasticData), setCurrentColor("#FFB215"), setCurrentDataName("Plastik");
            }}
          >
            <TrashBin
              fill={fillOrange}
              height={
                levelHeight[firstDigit(latestTrashData.plasticData?.level || 0)]
              }
              trashType="Plastik"
              level={latestTrashData.plasticData?.level}
            />
          </div>
          <div
            onClick={() => {
              setCurrentData(trashData.paperData), setCurrentColor("#FF6C75"), setCurrentDataName("Kertas");
            }}
          >
            <TrashBin
              fill={fillRed}
              height={
                levelHeight[firstDigit(latestTrashData.paperData?.level || 0)]
              }
              trashType="Kertas"
              level={latestTrashData.paperData?.level}
            />
          </div>
        </div>

        {/* Temp and Total Trash Section */}
        <div className="flex flex-col lg:flex-row lg:w-2/5 justify-between items-center pt-4 lg:gap-0">
          <div className="flex gap-24">
            <div className="w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center gap-2">
              <Doughnut data={tempData} />
              <p className="text-lg lg:text-2xl font-semibold">
                (🌡️) {temp > 100 ? 0 : temp}°C
              </p>
            </div>
            <div className="w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center gap-2">
              <Doughnut data={humidData} />
              <p className="text-lg lg:text-2xl font-semibold">
                (💧) {humid > 100 ? 0 : humid}%
              </p>
            </div>
          </div>
          <div className="p-4 h-max bg-white rounded-lg drop-shadow-md flex flex-col justify-center">
            <p className="text-base lg:text-xl font-semibold">
              Sampah Masuk : {trashCount}
            </p>
            <p className="text-xs font-light">
              <span className="text-red-600">*</span>dalam 1 jam terakhir
            </p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="flex flex-col lg:flex-row lg:w-2/3 justify-center gap-8 pt-8">
          <div className="lg:w-1/2 lg:h-72 flex justify-center bg-white rounded-lg p-4">
            <LineChart color={currentColor} sensorData={currentData} dataset={currentDataName}/>
          </div>
          <div className="lg:w-1/2 lg:h-72 flex justify-center bg-white rounded-lg p-4">
            {currentData == trashData.organicData ? (
              <AreaChart sensorData={currentData} dataset={currentDataName} />
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
