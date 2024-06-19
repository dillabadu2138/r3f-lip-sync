import { Environment } from "@react-three/drei";
import { Avatar } from "./Avatar";

function Scene() {
  return (
    <>
      <Avatar position={[0, -1, 0]} />
      <Environment preset="city" />
    </>
  );
}

export default Scene;
