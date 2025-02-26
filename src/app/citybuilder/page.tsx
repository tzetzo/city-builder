"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaHome } from "react-icons/fa";

import { House } from "@/types/citybuilder";
import { fetchWeather, WeatherIcon } from "../helpers/weather";

const cities = {
  Sofia: { latitude: 42.698334, longitude: 23.319941 },
  Lyon: { latitude: 45.76342, longitude: 4.834277 },
  Atlanta: { latitude: 33.753746, longitude: -84.38633 },
};

export default function CityBuilder() {
  const [houses, setHouses] = useState<House[]>([]);
  const [selectedCity, setSelectedCity] =
    useState<keyof typeof cities>("Sofia");

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
  } = useQuery({
    queryKey: ["weather", selectedCity],
    queryFn: () =>
      fetchWeather(
        cities[selectedCity].latitude,
        cities[selectedCity].longitude
      ),
  });

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
              {weather.current_weather.temperature}°C
              <WeatherIcon weathercode={weather.current_weather.weathercode} />
            </p>
          )}
          <select
            value={selectedCity}
            onChange={handleCityChange}
            className="ml-6 p-2 border rounded text-black text-sm h-10 w-40 focus:outline-none bg-white shadow-md transition-all duration-300 hover:shadow-lg"
          >
            {Object.keys(cities).map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        <div className="lg:col-span-4 bg-white p-4 rounded shadow">
          <h2 className="text-base sm:text-lg font-semibold mb-2">
            Houses List
          </h2>
          <div>HouseCard component</div>
          <button className="mt-4 w-full bg-gray-400 p-2 rounded shadow-lg text-white flex items-center justify-center text-sm sm:text-base transition-all duration-300 hover:-translate-y-0.5 active:translate-y-1 hover:shadow-2xl active:shadow-lg">
            <FaHome className="mr-2 w-6 h-6" />
            Build a new house
          </button>
        </div>

        <div
          className="lg:col-span-8 bg-white p-4 rounded shadow"
          id="city-view"
        >
          DraggableHouse component
        </div>
      </div>
    </div>
  );
}
