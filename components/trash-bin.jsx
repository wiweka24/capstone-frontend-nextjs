import Image from "next/image";
import trash from "@/public/trash-exclude.svg";

export default function TrashBin(props) {
  // Use a conditional to display 0 if props.level is less than 0
  const displayLevel = props.level < 0 ? 0 : props.level > 100 ? 100 : props.level;

  return (
    <div className="space-y-2">
      <div className="relative flex justify-center items-center bg-white h-[271px] w-[183px] overflow-hidden">
        <p className="text-3xl z-30 font-bold">{displayLevel}%</p>
        <Image
          className="absolute z-20 inset-0 h-[271px] w-[183px] object-cover"
          src={trash}
          alt="trash"
        />
        <div className={`absolute z-10 -left-60 h-[271px] w-[500px] ${props.height}`}>
          <Image
            className="h-[271px] object-cover animate-translateX"
            src={props.fill}
            alt="trash fill"fillBlue
          />
        </div>
      </div>
      <p className="text-md font-medium text-center">{props.trashType}</p>
    </div>
  );
}

