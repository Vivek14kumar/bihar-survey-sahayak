"use client";

import React from 'react';
import DirectionSymbol from "./DirectionSymbol";
import { Kalam } from "next/font/google";

function formatDate(date) {
  return new Intl.DateTimeFormat("en-GB")
    .format(date)
    .replace(/\//g, "-");
}

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});


export default function NazriNaksha(){
    const today = formatDate(new Date());
    return(
        <div className={kalam.className}>
        <div className="p-16 ">
            <h1 className="text-center p-2 text-2xl font-bold text-gray-400">नजरी नक्शा </h1>
           <div className=" max-w-4xl w-[210mm] mx-auto h-[297mm] p-4 border bg-white">
            <div className="flex items-center justify-between h-14 px-4 border-b border-gray-300">

              {/* Left Spacer */}
              <div className="flex-1"></div>
                
              {/* Center Title */}
              <div className="flex-1 text-center">
                <span className="font-semibold text-gray-800 text-lg tracking-wide">
                  नजरी नक्सा
                </span>
              </div>
                
              {/* Date */}
              <div className="flex-1 flex justify-end items-center gap-2">
                <span className="font-medium text-gray-700">
                  दिनांक :-
                </span>
                
                <input
                  type="text"
                  value={today}
                  readOnly
                  className="w-28 border-b border-black outline-none text-center bg-transparent"
                />
              </div>
                
            </div>
            <div className="mt-5 absolute ">
                    <DirectionSymbol/>
                </div>
            <div className="ml-24 text-sm p-4 flex flex-col md:flex-row items-start gap-4 w-fit">
                
              {/* Left Section (Form Details) */}
              <div className="flex flex-col gap-4 mt-1">
                <div className="flex items-center gap-3">
                  <label className="w-16 font-medium flex justify-between">
                    <span>मौजा</span> <span>:-</span>
                  </label>
                  <input
                    type="text"
                    className="w-48 border-b border-black outline-none bg-transparent px-1"
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <label className="w-16 font-medium flex justify-between">
                    <span>थाना</span> <span>:-</span>
                  </label>
                  <input
                    type="text"
                    className="w-48 border-b border-black outline-none bg-transparent px-1"
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <label className="w-16 font-medium flex justify-between">
                    <span>प्रखंड</span> <span>:-</span>
                  </label>
                  <input
                    type="text"
                    className="w-48 border-b border-black outline-none bg-transparent px-1"
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <label className="w-16 font-medium flex justify-between">
                    <span>जिला</span> <span>:-</span>
                  </label>
                  <input
                    type="text"
                    className="w-48 border-b border-black outline-none bg-transparent px-1"
                  />
                </div>
              </div>
                
              {/* Right Section (Table) */}
              <div className="overflow-x-auto rounded-lg border border-gray-300">
                <table className="w-full min-w-[350px] text-sm text-left text-gray-800">
                  <thead className="text-xs bg-gray-100 border-b border-gray-300">
                    <tr>
                      <th
                        scope="col"
                        rowSpan={2}
                        className=" border-r border-gray-300 text-center align-middle font-semibold"
                      >
                        खाता
                      </th>
                      <th
                        scope="col"
                        rowSpan={2}
                        className=" border-r border-gray-300 text-center align-middle font-semibold"
                      >
                        खसरा
                      </th>
                      <th
                        scope="col"
                        colSpan={2}
                        className="py-1.5 border-b border-gray-300 text-center font-semibold"
                      >
                        रकवा
                      </th>
                    </tr>
                    <tr>
                      <th
                        scope="col"
                        className="py-1 border-r border-gray-300 text-center font-medium bg-gray-50"
                      >
                        एकड़
                      </th>
                      <th
                        scope="col"
                        className="py-1 text-center font-medium bg-gray-50"
                      >
                        डिसमिल
                      </th>
                    </tr>
                  </thead>
                
                  <tbody>
                    <tr className="bg-white ">
                      <td className="p-1 border-r border-gray-200">
                        <input
                          type="text"
                          placeholder="खाता नं."
                          className="w-full text-center focus:border-blue-600 outline-none bg-transparent py-1 transition-colors placeholder-gray-400"
                        />
                      </td>
                      <td className="p-1 border-r border-gray-200">
                        <input
                          type="text"
                          placeholder="खसरा नं."
                          className="w-full text-center focus:border-blue-600 outline-none bg-transparent py-1 transition-colors placeholder-gray-400"
                        />
                      </td>
                      <td className="p-1 border-r border-gray-200">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder="0"
                          className="w-full text-center focus:border-blue-600 outline-none bg-transparent py-1 transition-colors placeholder-gray-400"
                          onChange={(e) => {
                            // Optional: This prevents users from typing letters manually
                            e.target.value = e.target.value.replace(/[^0-9./,-]/g, ''); 
                          }}
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder="00"
                          className="w-full text-center focus:border-blue-600 outline-none bg-transparent py-1 transition-colors placeholder-gray-400"
                          onChange={(e) => {
                            // Optional: This prevents users from typing letters manually
                            e.target.value = e.target.value.replace(/[^0-9./,-]/g, '');
                          }}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
                
            </div>
            <div className=" text-center h-100 ml-18 mt-20">
                Canvas Map Drawing Area
            </div>
            <div className=" h-20 p-1 ">
                नोट :- 
            </div>
            <div className=" p-2 mt-1 flex justify-end">
                <div>
                    <p>पैमाईस कर्ता </p>
                    <label htmlFor="">नाम :-</label>
                    <input type="text" />
                    <label htmlFor="">पता :-</label>
                    <input type="text" />
                    <label htmlFor="">मोबाइल न० </label>
                    <input type="text" name="" id="" />
                    <label htmlFor="">दिनाक </label>
                    <input type="date" />
                </div>
            </div>
            </div> 
            
        </div>
        </div>
    );
}