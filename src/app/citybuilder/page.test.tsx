import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CityBuilder from "./page";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockGeolocation = {
  getCurrentPosition: jest.fn(),
};
Object.defineProperty(global.navigator, "geolocation", {
  value: mockGeolocation,
});

jest.mock("@tanstack/react-query");
const mockUseQuery = useQuery as jest.Mock;

const mockPosition = {
  coords: {
    latitude: 51.5074,
    longitude: -0.1278,
  },
};

const mockWeatherData = {
  current_weather: {
    temperature: 15.5,
    weathercode: 3,
  },
};

beforeAll(() => {
  mockUseQuery.mockReturnValue({
    data: mockWeatherData,
    isLoading: false,
    error: false,
  });

  mockGeolocation.getCurrentPosition.mockImplementation((success) =>
    success(mockPosition)
  );

  mockedAxios.get.mockResolvedValue({ data: mockWeatherData });
});

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("CityBuilder", () => {
  const renderComponent = () => render(<CityBuilder />);

  test("renders CityBuilder component", () => {
    renderComponent();
    expect(
      screen.getByRole("heading", { name: /City Builder/i })
    ).toBeInTheDocument();
  });

  test("adds a new house", () => {
    renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /Build a new house/i }));
    expect(screen.getByText("House Default name")).toBeInTheDocument();
  });

  test("removes a house", async () => {
    renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /Build a new house/i }));
    const removeButton = screen.getByRole("button", {
      name: /Click to delete house/i,
    });
    fireEvent.click(removeButton);
    await waitFor(() => {
      expect(screen.queryByText("House Default name")).not.toBeInTheDocument();
    });
  });

  test("loads houses from localStorage", () => {
    const houses = [
      {
        id: "1",
        floors: [{ id: 0, color: "" }],
        color: "Orange",
        name: "House 1",
        height: 100,
      },
    ];
    localStorage.setItem("houses", JSON.stringify(houses));
    renderComponent();
    expect(screen.getByText("House 1")).toBeInTheDocument();
  });

  test("edits a house name", async () => {
    renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /Build a new house/i }));
    const editName = screen.getByText("House Default name");
    fireEvent.click(editName);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "New House Name" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    await waitFor(() => {
      expect(screen.getByText("New House Name")).toBeInTheDocument();
    });
  });

  test("updates house color", async () => {
    renderComponent();
    await userEvent.click(
      screen.getByRole("button", { name: /Build a new house/i })
    );
    const selects = screen.getAllByRole("combobox");
    const select = selects[1];
    await userEvent.selectOptions(select, "Alizarin");
    const house = screen.getByRole("region", { name: "house" });
    expect(house).toHaveStyle("background-color: #E32636");
    expect(select).toHaveValue("Alizarin");
  });

  test("updates house floors", async () => {
    renderComponent();
    await userEvent.click(
      screen.getByRole("button", { name: /Build a new house/i })
    );
    const numberInput = screen.getByRole("spinbutton", { name: "Floors:" });
    const rangeInput = screen.getByRole("slider");
    const desiredFloors = 3;
    for (let i = 2; i <= desiredFloors; i++) {
      fireEvent.change(rangeInput, { target: { value: i } });
    }
    const house = screen.getByRole("region", { name: "house" });
    expect(rangeInput).toHaveValue(desiredFloors.toString());
    expect(numberInput).toHaveValue(desiredFloors);
    expect(house.children).toHaveLength(desiredFloors);
  });

  test("displays weather information", async () => {
    renderComponent();
    await waitFor(() => {
      const temperatureElement = screen.getByText(/15.5°C/i);
      expect(temperatureElement).toBeInTheDocument();
    });
  });
});
