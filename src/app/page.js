"use client"
import DemoSection from "@/components/DemoSection";
import PageHeaders from "@/components/PageHeaders";
import SparklesIcon from "@/components/SparklesIcon";
import UploadForm from "@/components/UploadForm";
import { countries } from "@/components/countries";
// import { useState } from "react";
export default function Home() {
  // const [countrycode, setcountcode]= useState("");
//   const arrcountryname=[];
//   for (const item in countries) {
//     arrcountryname.push(item);
//   }

//  function handlechange(e){
//   setcountcode(e.target.value);

//   console.log(countrycode);
//  }

  return (

    <>
      <PageHeaders
        h1Text={"Add epic captions to your videos"}
        h2Text={"Just upload your video and we will do the rest"}
      />
      <div className="text-center">
        <UploadForm />
      </div>
      {/* <div className="flex flex-row m-5 justify-center items-center">
      target language :<select className="w-100 text-black"  onChange={handlechange}>
      {

        arrcountryname.map((key,item)=>{
          return <option className="w-100 text-black"  value={key}>{countries[key]}</option> 
        })
      }
      </select> */}
      {/* </div> */}
      {/* <DemoSection />  */}
    </>
  );
}
