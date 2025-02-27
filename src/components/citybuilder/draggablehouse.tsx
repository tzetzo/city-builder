import { useEffect, useState } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";

import { House } from "@/types/citybuilder";
import { houseColors } from "@/constants/colors";
import Modal from "@/components/modal";

interface DraggableHouseProps {
  house: House;
  updateHouse: (id: string, updatedHouse: House) => void;
  setHouses: (updater: (houses: House[]) => House[]) => void;
}

export default function DraggableHouse({
  house,
  updateHouse,
  setHouses,
}: DraggableHouseProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: house.id,
  });
  const { setNodeRef: setDroppableNodeRef } = useDroppable({
    id: house.id,
  });

  const [activeFloorId, setActiveFloorId] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("#ffffff");

  useEffect(() => {
    setTimeout(() => {
      setHouses((prevHouses) =>
        prevHouses.map((h) =>
          h.id === house.id ? { ...h, status: "default" } : h
        )
      );
    }, 700); // should be > the animation duration in tailwind.config.ts
  }, []);

  const handleDoubleClick = (floorId: number) => {
    const floor = house.floors.find((f) => f.id === floorId);
    if (floor) {
      setSelectedColor(floor.color || "#ffffff");
      setActiveFloorId(floorId);
    }
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const color = event.target.value;
    setSelectedColor(color);

    if (activeFloorId !== null) {
      updateHouse(house.id, {
        ...house,
        floors: house.floors.map((f) =>
          f.id === activeFloorId ? { ...f, color: color } : f
        ),
      });
    }
  };

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    height: house.height,
  };

  const roofStyle = {
    "--b": "5px",
    aspectRatio: "1/cos(30deg)",
    clipPath:
      "polygon(50% 0,100% 100%,0 100%,50% 0,50% var(--b),calc(var(--b)*cos(30deg)) calc(100% - var(--b)/2),calc(100% - var(--b)*cos(30deg)) calc(100% - var(--b)/2),50% var(--b))",
    background: "linear-gradient(45deg,#FA6900,#C02942)",
  } as React.CSSProperties;

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        setDroppableNodeRef(node);
      }}
      style={style}
      {...(activeFloorId === null ? attributes : {})} // Disables dragging when modal is open
      {...(activeFloorId === null ? listeners : {})}
      className={`inline-block m-2 relative transition-all duration-500 ${
        house.status === "removed"
          ? "animate-scaleDown"
          : house.status === "added"
          ? "animate-scaleUp"
          : ""
      }`}
    >
      <div
        className="w-0 h-0 border-l-[32px] border-l-transparent border-r-[32px] border-r-transparent border-b-[50px] border-b-black"
        style={roofStyle}
      ></div>
      <div
        className="w-16 border-l-2 border-r-2 border-black transition-all duration-300"
        style={{
          backgroundColor: houseColors[house.color as keyof typeof houseColors],
        }}
        role="region"
        aria-label="house"
      >
        {house.floors.map((floor, i) => (
          <div
            key={floor.id}
            className={`w-full h-[50px] border-l-1 border-r-1 border-black relative transition-all duration-300 ease-in-out hover:border hover:border-black hover:scale-120 ${
              i === house.floors.length - 1 && "border-b-2 border-black"
            }`}
            style={{
              transition: "transform 0.3s, border 0.3s, background-color 0.3s",
              backgroundColor: floor.color,
            }}
            title="Drag/drop house OR double-click to recolor floor"
            onDoubleClick={(e) => handleDoubleClick(floor.id)}
          >
            {i === house.floors.length - 1 ? (
              <>
                <div className="w-4 h-10 bg-white border border-black absolute bottom-0 left-2"></div>
                <div className="w-4 h-6 bg-white border border-black absolute top-2 right-2"></div>
              </>
            ) : (
              <>
                <div className="w-4 h-6 bg-white border border-black absolute top-2 left-2"></div>
                <div className="w-4 h-6 bg-white border border-black absolute top-2 right-2"></div>
              </>
            )}
            <Modal
              isOpen={activeFloorId === floor.id}
              onClose={() => setActiveFloorId(null)}
              title="Choose floor color"
            >
              <input
                type="color"
                value={selectedColor}
                onChange={handleColorChange}
                className="w-full h-10 cursor-pointer"
                autoFocus
              />
              <button
                className="w-full bg-gray-400 text-white text-sm py-2 px-4 rounded transition-all duration-300 hover:-translate-y-0.5 active:translate-y-1 hover:shadow-2xl active:shadow-lg"
                style={{
                  backgroundColor:
                    houseColors[house.color as keyof typeof houseColors],
                }}
                onClick={() => {
                  updateHouse(house.id, {
                    ...house,
                    floors: house.floors.map((f) =>
                      f.id === activeFloorId ? { ...f, color: "" } : f
                    ),
                  });
                }}
              >
                Restore house color
              </button>
            </Modal>
          </div>
        ))}
      </div>
    </div>
  );
}
