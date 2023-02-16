import React from "react";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";

const Answers = () => {
  return (
    <div
      className="flex items-start px-14 pt-5 my-4 w-full border-t-2
    border-gray-300 border-t-gray-300"
    >
      <AnswersStats />
      <div className="ml-10">
        <p className="">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sequi,
          tenetur? Possimus numquam veniam laudantium molestias corporis in
          illum aliquid voluptatibus est laborum sit earum quis architecto rem
          quos mollitia distinctio, alias labore quas similique, beatae ea nisi
          expedita! Reprehenderit, rerum. Lorem ipsum dolor sit, amet
          consectetur adipisicing elit. Totam quibusdam, necessitatibus sint
          fugit animi quisquam? Optio voluptatum reiciendis magni ducimus! Earum
          quaerat harum est sequi maiores velit corporis maxime ut molestias
          nemo illo corrupti voluptatibus rerum quod obcaecati, ex accusantium
          possimus, doloribus provident nobis quidem? Nulla eos obcaecati
          similique deserunt.
        </p>
      </div>
    </div>
  );
};

const AnswersStats = () => {
  return (
    <div className="flex flex-col items-center">
      <h2>8</h2>
      <h2>Answers</h2>
      <div className="mt-5 text-center text-blue-600 ">
        <div>
          <TiArrowSortedUp size={20} />
        </div>
        <p className="text-black">23</p>
        <div>
          <TiArrowSortedDown size={20} />
        </div>
      </div>
    </div>
  );
};

export default Answers;
