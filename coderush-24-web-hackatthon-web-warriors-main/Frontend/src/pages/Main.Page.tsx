import React, { useCallback, useEffect, useState } from "react";
import Button from "../components/Button";
import * as _ from "lodash";
import { gameService } from "../services/GameService";
import { gameStore } from "../store/GameStore";
import { UserRole } from "../models/entities/Player";
import Input from "../components/Input";
import AvatarCanvasArea from "../components/AvatarCanvasArea";
import avatarImage from "../assests/images.png";
import { canvasService } from "../services/CanvasService";
import {TiPencil} from  "react-icons/ti"
import {BiEraser} from "react-icons/bi"
import {AiOutlineClear} from "react-icons/ai"
import {GiPerspectiveDiceSixFacesRandom} from "react-icons/gi"

interface Props {
  roomId: string;
}

const MainPage: React.FC<Props> = ({ roomId }) => {
  const [name, setName] = useState("");
  const [defaultavatar,setDefaultavatar] = useState(true);

  const [drawing, setDrawing] = useState(false);
  const [tool, setTool] = useState(0);


  // const breakPoint = useBreakPoint();
  const handleInput = (e: any) => {
    setName(e.target.value);
  };

  const handlePlay = () => {
    if (_.isEmpty(name)) return;
    if(_.isEmpty(roomId)){
      gameService.createRoomClient({
        id: gameStore.myId || "",
        name: name,
        role: UserRole.CREATER,
        score: 0,
        avatar: defaultavatar? "" :canvasService.canvasToUrl()
      });
    }else{
      gameService.joinRoomClient(roomId, {
        id: gameStore.myId || "",
        name: name,
        role: UserRole.JOINER,
        score: 0,
        avatar: defaultavatar? "" :canvasService.canvasToUrl()
      });  
    }
  };

  useEffect(() => {
    if (_.isEmpty(roomId)) return;
    if (_.isEmpty(name)) return;
    gameService.joinRoomClient(roomId, {
      id: gameStore.myId || "",
      name: name,
      role: UserRole.JOINER,
      score: 0,
    });
  }, []);

  const handleDefault = useCallback(()=>{
    setDefaultavatar(t=>!t)
  },[])

  const selectPencil = () => {
    setTool(0);
  };

  const selectEraser = () => {
    setTool(1);
  };

  const selectClear = () => {
    canvasService.clearCanvas();
    setTool(0);
  };

  return (
    <div>
    <div
      className="lg:w-2/5 lg:h-5/6 h-max xl:w-4/6 lg:mx-auto h-full w-full p-2 shadow-lg rounded-md lg:flex  flex-col bg-slate-50">
      <div className="xl:w-2/6 lg:w-2/5 p-2 h-4/6 lg:h-full mx-auto">
    <div className="text-center text-3xl  font-bold "> Virtual pictionnary Game</div>
        <h2 className="text-center my-2 text-xl">Draw your avatar</h2>
        <div className=" p-2 h-4/6 lg:h-5/6 rounded-md">
          <div className="m-1 border-2 border-black w-full md:w-1/2 mx-auto h-4/6 lg:w-full lg:h-3/5 rounded-md p-2">
            <div className={`${defaultavatar ? "hidden" : ""} w-full h-full`}>
              <AvatarCanvasArea tool={tool} drawing={drawing} setDrawing={setDrawing}/>
            </div>
            <div className={`${!defaultavatar ? "hidden":""} w-full h-full`}>
              <img src={avatarImage} className="object-fit w-full h-full"></img>
            </div>
          </div>
          <div className=" flex space-x-2 p-1 justify-center text-blue-600/75">
            <Button icon={TiPencil} onClick={selectPencil}/>
            <Button icon={BiEraser} onClick={selectEraser}/>
            <Button icon={AiOutlineClear} onClick={selectClear}/>
            <Button icon={GiPerspectiveDiceSixFacesRandom} onClick={handleDefault}/>
          </div>
          <div className="mt-6 flex justify-start items-center md:w-1/2 w-full lg:w-full mx-auto space-x-2">
            <Input
              value={name}
              onChange={handleInput}
              placeholder={"Enter your name"}
              className={" border-2 border-black rounded-md "}
            />
          </div>
          <div className="lg:w-4/6 h-2/6 lg:h-full  p-2 mx-auto ">
        <div className="lg:mt-6 mx-auto max-w-max lg:ml-4 ">
        <Button className="bg-stone-400" onClick={handlePlay}>Play</Button>
        </div>
      </div>
        </div>
      </div>
     
    </div>
    </div>
  );
};

MainPage.defaultProps = {};

export default React.memo(MainPage);
