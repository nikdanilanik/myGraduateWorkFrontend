import { myRxStompConfig } from "./myRxStormConfig";
import { RxStompService } from "./rx-stompService";

export function rxStompServiceFactory() {
  const rxStomp = new RxStompService();
  rxStomp.configure(myRxStompConfig);
  rxStomp.activate();
  return rxStomp;
}
