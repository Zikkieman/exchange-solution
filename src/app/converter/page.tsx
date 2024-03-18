"use client";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import Spinner from "../components/spinner";

interface MapType {
  id: number;
  name: string;
  sign: string;
  symbol: string;
}

export default function Converter() {
  const [currencyArr, setCurrencyArr] = useState<MapType[]>([]);
  const [fiatAmount, setFiatAmount] = useState("");
  const [convertFrom, setConvertFrom] = useState("USD");
  const [convertTo, setConvertTo] = useState("USD");
  const [conversionData, setConversionData] = useState(0);
  const [spinner, setSpinner] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFiatAmount(e.target.value);
  };

  const handleSwap = () => {
    setConvertFrom(convertTo);
    setConvertTo(convertFrom);
  };

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const storedData = localStorage.getItem("currencies");
        if (!storedData) {
          const response = await fetch("/api/getMap");
          const currencies = await response.json();
          localStorage.setItem(
            "currencies",
            JSON.stringify(currencies.message)
          );
          setCurrencyArr(currencies.message);
        } else {
          setCurrencyArr(JSON.parse(storedData));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCurrencies();
  }, []);

  const conversionHanlder = async () => {
    const amount = fiatAmount;
    const symbol = convertFrom;
    const convert = convertTo;

    if (amount === "" || symbol === "" || convert === "") {
      return window.alert("All fields are required!!!");
    }
    setSpinner(true);
    try {
      const response = await fetch(
        `api/converter?amount=${amount}&symbol=${symbol}&convert=${convert}`
      );
      const result = await response.json();
      if (typeof result.message === "number") {
        setConversionData(result.message);
      } else {
        window.alert("Conversion Failed!!! Try Again");
      }
    } catch (error) {
      window.alert("Conversion Failed!!! Try Again");
    }
    setSpinner(false);
  };

  return (
    <main className="flex h-screen justify-center items-center relative bg bg-cover ">
      <div className="bg-[#0a1938] w-[500px] rounded-xl py-5 bg-opacity-[0.4] border border-[#bfbdbd] px-5 mx-2">
        <div className="">
          <div className="bg-white p-5 rounded-xl">
            <div className=" flex justify-between">
              <p>From</p>
              <p>Currency Type</p>
            </div>
            <div className="mt-5 flex justify-between">
              <input
                className="border-black border w-[100px] text-center focus:outline-none rounded-md py-1 px-2"
                value={fiatAmount}
                placeholder="0"
                onChange={handleChange}
              />
              <select
                className="border border-black w-[100px] focus:outline-none rounded-md "
                onChange={(e) => {
                  setConvertFrom(e.target.value);
                }}
                value={convertFrom}
              >
                {currencyArr.map((currency) => (
                  <option
                    value={currency.symbol}
                    key={currency.id}
                    className=""
                  >
                    {currency.symbol}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div
            className="bg-black w-fit text-white py-3 px-5 rounded-full mx-auto abslute relative z-[3px] mt-[-15px] cursor-pointer"
            onClick={handleSwap}
          >
            <p>Swap</p>
          </div>

          <div className="bg-white p-5 rounded-xl mt-[-15px]">
            <div className=" flex justify-between">
              <p>To</p>
              <p>Currency Type</p>
            </div>
            <div className="mt-5 flex justify-between">
              <div className=" min-w-[150px] focus:outline-none rounded-md py-1 px-2">
                {conversionData.toFixed(2)}
              </div>
              <select
                value={convertTo}
                className="border border-black w-[100px] focus:outline-none rounded-md "
                onChange={(e) => {
                  setConvertTo(e.target.value);
                }}
              >
                {currencyArr.map((currency) => (
                  <option
                    value={currency.symbol}
                    key={currency.id}
                    className=""
                  >
                    {currency.symbol}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <button
          className="w-full text-white bg-blue-500 rounded-lg py-3 mt-5 flex justify-center items-center"
          onClick={() => conversionHanlder()}
        >
          {spinner ? <Spinner /> : "Convert"}
        </button>
      </div>
    </main>
  );
}
