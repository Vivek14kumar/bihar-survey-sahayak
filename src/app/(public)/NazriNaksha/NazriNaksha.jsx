import React from 'react';
import DirectionSymbol from "./DirectionSymbol";

function formatDate(date) {
  return new Intl.DateTimeFormat("en-GB")
    .format(date)
    .replace(/\//g, "-");
}

export default function NazriNaksha(){
    const today = formatDate(new Date());
    return(
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
            <div className="ml-40 border p-4 flex justify-between gap-10 w-fit">

  {/* Left Section */}
  <div className="space-y-3">

    <div className="flex items-center gap-2">
      <label className="w-20 font-medium">मौजा :-</label>
      <input
        type="text"
        className="w-48 border-b border-black outline-none bg-transparent text-center"
      />
    </div>

    <div className="flex items-center gap-2">
      <label className="w-20 font-medium">थाना :-</label>
      <input
        type="text"
        className="w-48 border-b border-black outline-none bg-transparent text-center"
      />
    </div>

    <div className="flex items-center gap-2">
      <label className="w-20 font-medium">प्रखंड :-</label>
      <input
        type="text"
        className="w-48 border-b border-black outline-none bg-transparent text-center"
      />
    </div>

    <div className="flex items-center gap-2">
      <label className="w-20 font-medium">जिला :-</label>
      <input
        type="text"
        className="w-48 border-b border-black outline-none bg-transparent text-center"
      />
    </div>

  </div>

  {/* Right Section */}
  <div className="space-y-3">

    <div className="flex items-center gap-2">
      <label className="w-16 font-medium">खाता</label>
      <input
        type="text"
        className="w-32 border-b border-black outline-none bg-transparent text-center"
      />
    </div>

    <div className="flex items-center gap-2">
      <label className="w-16 font-medium">खसरा</label>
      <input
        type="text"
        className="w-32 border-b border-black outline-none bg-transparent text-center"
      />
    </div>

    <div className="flex items-center gap-2">
      <label className="w-16 font-medium">रकवा</label>
      <input
        type="text"
        className="w-32 border-b border-black outline-none bg-transparent text-center"
      />
    </div>

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
    );
}