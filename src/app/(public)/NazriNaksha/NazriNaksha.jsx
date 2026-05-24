export default function NazriNaksha(){
    return(
        <div className="p-16">
            <h1 className="text-center p-2 text-2xl font-bold text-gray-400">नजरी नक्शा </h1>
           <div className="border max-w-4xl w-[210mm] mx-auto h-[297mm] p-4">
            <div className="border h-10">

            </div>
            <div className="border border-green-200 flex p-1 justify-between">
                <div className="border  w-10">
                    
                </div>
                <div className="border">
                    <div>
                        <label htmlFor="">मौजा :- </label>
                        <input type="text" className=""/>
                    </div>
                    <div>
                        <label htmlFor="">थाना :- </label>
                        <input type="text" className=""/>
                    </div>
                    <div>
                        <label htmlFor="">प्रखंड :- </label>
                        <input type="text" className=""/>
                    </div>
                    <div>
                        <label htmlFor="">जिला :- </label>
                        <input type="text" className=""/>
                    </div>
                </div>
                <div className="border">
                    <input type="date" />
                </div>
            </div>
            </div> 
        </div>
    );
}