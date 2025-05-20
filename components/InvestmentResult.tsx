import { CircleCheck, CircleMinus, CircleX } from "lucide-react";
import { format } from "date-fns";

const InvestmentResult = () => {

  const formattedDate = (subtract: number) => {
    const date = new Date(); // Ensure a fresh date instance
    const newDate = new Date(date); // Clone date to prevent mutation
    newDate.setDate(newDate.getDate() - subtract); // Subtract days
    return format(newDate, "EEE dd/MM");
  };

  return (
    <div className="relative w-full h-fit">
      <div className="absolute inset-0 bg-[url(/bg-image-2.jpg)] bg-center opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/70 to-secondary" />
      <div className="relative z-10 text-white p-2 w-full flex flex-wrap gap-4">
        <h2 className="w-full uppercase font-bold text-xl md:text-2xl text-center">
          Investment Plan Results Last 7 days
        </h2>
        <table className="border-collapse w-full text-center text-[10px]">
          <thead>
            <tr className="bg-white text-primary">
              <th className="py-2">Date</th>
              <th>{formattedDate(7)}</th>
              <th>{formattedDate(6)}</th>
              <th>{formattedDate(5)}</th>
              <th>{formattedDate(4)}</th>
              <th>{formattedDate(3)}</th>
              <th>{formattedDate(2)}</th>
              <th>{formattedDate(1)}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-[12px] bg-white border-b">
              <td className="py-2 text-black">Result</td>
              <td>
                <CircleX className="bg-red-600 rounded-full justify-self-center" />
              </td>
              <td>
                <CircleMinus className="bg-gray-500 rounded-full justify-self-center" />
              </td>
              <td>
                <CircleCheck className="bg-green-600 rounded-full justify-self-center"/>
              </td>
              <td>
                <CircleCheck className="bg-green-600 rounded-full justify-self-center"/>
              </td>
              <td>
                <CircleCheck className="bg-green-600 rounded-full justify-self-center"/>
              </td>
              <td>
                <CircleCheck className="bg-green-600 rounded-full justify-self-center"/>
              </td>
              <td>
                <CircleCheck className="bg-green-600 rounded-full justify-self-center"/>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvestmentResult;
