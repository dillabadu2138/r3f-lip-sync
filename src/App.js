import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import Scene from './components/Scene';

function App() {
  return (
    <Canvas camera={{ position: [3, 3, 3], fov: 30 }}>
      <Scene />
      <OrbitControls />
    </Canvas>
  );
}

export default App;
