import { useState, memo } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

import { House } from "@/types/citybuilder";
import { houseColors } from "@/constants/colors";

interface HouseCardProps {
  house: House;
  updateHouse: (id: string, updatedHouse: House) => void;
  removeHouse: (id: string) => void;
  setHouses: React.Dispatch<React.SetStateAction<House[]>>;
}

const HouseCard: React.FC<HouseCardProps> = ({
  house,
  updateHouse,
  removeHouse,
  setHouses,
}) => {
  const [editingHouseId, setEditingHouseId] = useState<string | null>(null);

  const handleFloorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const floors =
      parseInt(e.target.value) < house.floors.length
        ? house.floors.slice(1)
        : [{ id: house.floors.length, color: "" }, ...house.floors];

    updateHouse(house.id, {
      ...house,
      floors,
    });
  };

  return (
    <div
      className={`border p-2 rounded mb-2 shadow-md transition-all duration-500 ${
        house.status === "removed"
          ? "animate-scaleDown"
          : house.status === "added"
          ? "animate-scaleUp"
          : ""
      }`}
    >
      <div className="flex justify-between items-center">
        {editingHouseId === house.id ? (
          <input
            type="text"
            value={house.name}
            onChange={(e) =>
              updateHouse(house.id, {
                ...house,
                name: e.target.value,
              })
            }
            onBlur={() => setEditingHouseId(null)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setEditingHouseId(null);
              }
            }}
            className="border p-1 text-sm sm:text-base"
            autoFocus
          />
        ) : (
          <h3
            className="font-bold text-sm sm:text-base cursor-pointer relative group flex items-center justify-between"
            onClick={() => setEditingHouseId(house.id)}
            title="Click to edit name, Enter when done"
          >
            {house.name}
            <FaEdit className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-2" />
          </h3>
        )}
        <button
          className="text-red-600"
          onClick={() => removeHouse(house.id)}
          title="Click to delete house"
        >
          <FaTrash />
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mt-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <label className="text-sm sm:text-base" htmlFor="floors">
              Floors:
            </label>
            <input
              type="number"
              min="1"
              max="12"
              value={house.floors.length}
              onChange={handleFloorChange}
              className="border p-1 text-sm sm:text-base"
              id="floors"
            />
          </div>
          <div className="mt-2 w-full">
            <input
              type="range"
              min="1"
              max="12"
              value={house.floors.length}
              className="w-full"
              onChange={handleFloorChange}
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2" title="House color">
            <label className="text-sm sm:text-base">Color:</label>
            <select
              className="border p-1 flex-1 text-sm sm:text-base rounded focus:outline-none shadow-md hover:shadow-lg transition-all duration-300"
              value={house.color}
              onChange={(e) =>
                updateHouse(house.id, {
                  ...house,
                  color: e.target.value,
                })
              }
            >
              {Object.keys(houseColors).map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end mt-2" title="Duplicate house">
            <button
              className="p-1 rounded shadow-lg text-sm text-white sm:text-base w-full transition-all duration-300 hover:-translate-y-0.5 active:translate-y-1 hover:shadow-2xl active:shadow-lg"
              style={{
                backgroundColor:
                  houseColors[house.color as keyof typeof houseColors],
              }}
              onClick={() => {
                const newHouse = {
                  ...house,
                  id: uuidv4(),
                  status: "added" as const,
                };
                setHouses((prevHouses) => [...prevHouses, newHouse]);
              }}
            >
              Duplicate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(HouseCard);
