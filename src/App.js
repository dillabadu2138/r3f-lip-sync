import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import Scene from "./components/Scene";

function App() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 15 }}>
      <Scene />
      <OrbitControls />
    </Canvas>
  );
}

export default App;
