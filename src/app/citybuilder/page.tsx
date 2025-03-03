"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { FaHome } from "react-icons/fa";
import { DndContext, DragEndEvent } from "@dnd-kit/core";

import { House } from "@/types/citybuilder";
import DraggableHouse from "@/components/citybuilder/draggablehouse";
import HouseCard from "@/components/citybuilder/housecard";
import { fetchWeather, WeatherIcon } from "../helpers/weather";

const calculateHeight = (floors: number) => (floors + 1) * 50;

const cities = {
  Sofia: { latitude: 42.698334, longitude: 23.319941 },
  Lyon: { latitude: 45.76342, longitude: 4.834277 },
  Atlanta: { latitude: 33.753746, longitude: -84.38633 },
};

interface WeatherData {
  current_weather: {
    temperature: number;
    weathercode: number;
  };
  city?: string;
}

export default function CityBuilder() {
  const [houses, setHouses] = useState<House[]>([]);
  const [selectedCity, setSelectedCity] = useState<keyof typeof cities | null>(
    null
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    const savedHouses = JSON.parse(localStorage.getItem("houses") || "null") as
      | House[]
      | null;
    setHouses(savedHouses || []);
  }, []);

  useEffect(() => {
    localStorage.setItem("houses", JSON.stringify(houses));
  }, [houses]);

  const {
    data: weather,
    error,
    isLoading,
  } = useQuery<WeatherData>({
    queryKey: ["weather", selectedCity],
    queryFn: async () => {
      if (!selectedCity) {
        return fetchWeather();
      } else {
        return fetchWeather(
          cities[selectedCity].latitude,
          cities[selectedCity].longitude
        );
      }
    },
  });

  const addHouse = () => {
    setHouses([
      ...houses,
      {
        id: uuidv4(),
        floors: [{ id: 0, color: "" }],
        color: "Orange",
        name: `House Default name`,
        height: calculateHeight(1),
        status: "added",
      },
    ]);
  };

  const updateHouse = useCallback((id: string, updatedHouse: House) => {
    setHouses((prevHouses) =>
      prevHouses.map((house) =>
        house.id === id
          ? {
              ...updatedHouse,
              height: calculateHeight(updatedHouse.floors.length),
            }
          : house
      )
    );
  }, []);

  const removeHouse = useCallback((id: string) => {
    setHouses((prevHouses) =>
      prevHouses.map((house) =>
        house.id === id ? { ...house, status: "removed" } : house
      )
    );

    setTimeout(() => {
      setHouses((prevHouses) => prevHouses.filter((house) => house.id !== id));
    }, 500); // should be < animation duration 'scaleDown' in tailwind.config.ts
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      setHouses((houses) => {
        const oldIndex = houses.findIndex((house) => house.id === active.id);
        const newIndex = houses.findIndex((house) => house.id === over.id);
        const newHouses = [...houses];
        const [movedHouse] = newHouses.splice(oldIndex, 1);
        newHouses.splice(newIndex, 0, movedHouse);
        return newHouses;
      });
    }
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(event.target.value as keyof typeof cities);
    queryClient.invalidateQueries({
      queryKey: ["weather", event.target.value],
    });
  };

  return (
    <div className="mx-auto p-4 sm:p-6 bg-gray-100">
      <div className="text-xl sm:text-2xl font-bold text-red-600 mb-4 flex justify-between items-center">
        <h1>City Builder</h1>
        <div className="flex items-center">
          {isLoading && <p>Loading weather...</p>}
          {error && <p>{error.message}</p>}
          {weather && (
            <p className="flex items-center">
              {weather?.current_weather?.temperature}°C
              <WeatherIcon
                weathercode={weather?.current_weather?.weathercode}
              />
            </p>
          )}
          <select
            value={selectedCity || (weather?.city ? weather.city : "")}
            onChange={handleCityChange}
            className="ml-6 p-2 border rounded text-black text-sm h-10 w-auto min-w-[150px] focus:outline-none bg-white shadow-md transition-all duration-300 hover:shadow-lg"
          >
            <option value="" disabled>
              Select a city
            </option>
            {Object.keys(cities).map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
            {weather?.city && !Object.keys(cities).includes(weather.city) && (
              <option key={weather.city} value={weather.city}>
                {weather.city}
              </option>
            )}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        <div className="lg:col-span-4 bg-white p-4 rounded shadow">
          <h2 className="text-base sm:text-lg font-semibold mb-2">
            Houses List
          </h2>
          <div>
            {houses.map((house) => (
              <HouseCard
                key={house.id}
                house={house}
                updateHouse={updateHouse}
                removeHouse={removeHouse}
                setHouses={setHouses}
              />
            ))}
          </div>
          <button
            onClick={addHouse}
            className="mt-4 w-full bg-gray-400 p-2 rounded shadow-lg text-white flex items-center justify-center text-sm sm:text-base transition-all duration-300 hover:-translate-y-0.5 active:translate-y-1 hover:shadow-2xl active:shadow-lg"
          >
            <FaHome className="mr-2 w-6 h-6" />
            Build a new house
          </button>
        </div>
        <DndContext onDragEnd={handleDragEnd}>
          <div
            className="lg:col-span-8 bg-white p-4 rounded shadow"
            id="city-view"
          >
            {houses.map((house) => (
              <DraggableHouse
                key={house.id}
                house={house}
                updateHouse={updateHouse}
                setHouses={setHouses}
              />
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  );
}
