import { observer } from "mobx-react";
import React, { useEffect } from "react";
import Button from "../components/Button";
import DropDown from "../components/DropDown";
import { UserRole } from "../models/entities/Player";
import { gameService } from "../services/GameService";
import store from "../store";

interface Props {}

const LobbyPage: React.FC<Props> = (props) => {
  const {  roomId, me, setting,players} = store.gameStore;

  const disabled = me?.role === UserRole.JOINER || players.length < 2;
const roundOptions = Array(8)
  .fill(0)
  .map((_, index) => (
    <option key={`round-${index}`} value={index + 3}>
      {index + 3}
    </option>
  ));

const timeOptions = Array(8)
  .fill(45)
  .map((n, index) => (
    <option key={`time-${index}`} value={n + index * 15}>
      {n + index * 15}
    </option>
  ));

  const handleStartGame = () => {
    gameService.startGameClient();
  };

  const handleRoundChange = (event: any) => {
    store.gameStore.setSetting({
      total_rounds: +event.target.value,
      round_time: setting.round_time,
    });
  };

  const handleTimeChange = (event: any) => {
    store.gameStore.setSetting({
      round_time: +event.target.value,
      total_rounds: setting.total_rounds,
    });
  };


  useEffect(() => {
    if (me && me.role === UserRole.CREATER) gameService.roomSyncClient({settings:setting});
  }, [setting.round_time, setting.total_rounds, me?.role]);

  return (
   <div >
   <div className="lg:w-4/5  h-96 xl:w-4/6 lg:mx-auto 
    lg:pt-1/20 xl:pt-1/50 flex  flex-col justify-start items-center 
    space-y-4 pt-1/3 md:pt-1/8 lg:shadow-lg rounded-md bg-slate-50">
    <div className="text-center text-5xl mx-auto font-bold"> Virtual pictionnary Game</div>
        <DropDown
          id="rounds"
          title="No Of Rounds :"
          value={setting.total_rounds}
          onChange={handleRoundChange}
          disabled={disabled}
        >
          {roundOptions}
        </DropDown>
        <DropDown
          id="time"
          title="Time Each Round :"
          value={setting.round_time}
          onChange={handleTimeChange}
          disabled={disabled}
        >
          {timeOptions}
        </DropDown>
        <Button className="bg-stone-400" onClick={handleStartGame}>Play</Button>
        <div className="flex justify-center items-center">
        <h2 className=" mt-2 px-4 text-lg font-medium">Lobby Code: <a href={`/?${roomId}`} target={"_blank"} className=" text-blue-400">{roomId}</a> </h2>
        </div>
      </div>
   </div>
  );
};

LobbyPage.defaultProps = {};

export default observer(LobbyPage);
