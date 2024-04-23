"use client";
import axios from "axios";
import UploadIcon from "./UploadIcon";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadForm() {
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  async function upload(ev) {
    ev.preventDefault();
    const files = ev.target?.files;

    if (files.length > 0) {
      const file = files[0];
      setIsUploading(true);
      const res = await axios.postForm("/api/upload", {
        file,
      });

      setIsUploading(false);
      const newName = res.data.newName;
      router.push("/" + newName);
    }
  }

  return (
    <>
      {isUploading && (
        <div className="bg-black/90 text-white fixed inset-0 flex items-center">
          <div className="w-full text-center">
            <h2 className="text-4xl mb-4">Uploading...</h2>
            <h2 className="text-xl">Please wait</h2>
          </div>
        </div>
      )}
      <label className="bg-green-600 px-6 py-2 rounded-full inline-flex gap-2 border-2 border-purple-700/50 cursor-pointer bg-green-500 px-6 py-2 rounded-full inline-flex gap-2 border-2 border-purple-700/50 cursor-pointer  hover:bg-green-600 active:bg-green-700 focus:outline-none focus:ring focus:ring-green-300">
        <UploadIcon />
        <span>Choose file</span>
        <input onChange={upload} type="file" className="hidden" />
      </label>
    </>
  );
}
