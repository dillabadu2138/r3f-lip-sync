import React, { useState, useRef, useEffect, useMemo } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { useGLTF, useFBX, useAnimations } from "@react-three/drei";
import { useControls } from "leva";
import * as THREE from "three";

const lookUpTable = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_E",
  D: "viseme_aa",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_sil",
};

export function Avatar(props) {
  const { playAudio, script } = useControls({
    playAudio: false,
    script: {
      value: "intro",
      options: ["intro", "hobby"],
    },
  });

  const audio = useMemo(() => new Audio(`/audios/${script}.mp3`), [script]);
  const jsonFile = useLoader(THREE.FileLoader, `audios/${script}.json`);
  const lipsync = JSON.parse(jsonFile);

  useFrame(() => {
    const currentAudioTime = audio.currentTime;

    if (audio.paused || audio.ended) setAnimation("Idle");

    // reset morphTargetInfluences
    Object.values(lookUpTable).forEach((value) => {
      nodes.Wolf3D_Head.morphTargetInfluences[
        nodes.Wolf3D_Head.morphTargetDictionary[value]
      ] = 0;
      nodes.Wolf3D_Teeth.morphTargetInfluences[
        nodes.Wolf3D_Teeth.morphTargetDictionary[value]
      ] = 0;
    });

    for (let i = 0; i < lipsync.mouthCues.length; i++) {
      const mouthCue = lipsync.mouthCues[i];

      if (
        currentAudioTime >= mouthCue.start &&
        currentAudioTime <= mouthCue.end
      ) {
        nodes.Wolf3D_Head.morphTargetInfluences[
          nodes.Wolf3D_Head.morphTargetDictionary[lookUpTable[mouthCue.value]]
        ] = 1;
        nodes.Wolf3D_Teeth.morphTargetInfluences[
          nodes.Wolf3D_Teeth.morphTargetDictionary[lookUpTable[mouthCue.value]]
        ] = 1;

        break;
      }
    }
  });

  useEffect(() => {
    if (playAudio) {
      audio.play();
      if (script === "intro") setAnimation("Greeting");
      if (script === "hobby") setAnimation("Dribble");
    } else {
      audio.pause();
      setAnimation("Idle");
    }
  }, [playAudio, script]);

  const { nodes, materials } = useGLTF("/models/Aaron.glb");
  const { animations: idleAnimation } = useFBX("/animations/Idle.fbx");
  const { animations: greetingAnimation } = useFBX("/animations/Greeting.fbx");
  const { animations: dribbleAnimation } = useFBX("/animations/Dribble.fbx");

  // change animations names
  idleAnimation[0].name = "Idle";
  greetingAnimation[0].name = "Greeting";
  dribbleAnimation[0].name = "Dribble";

  const [animation, setAnimation] = useState("Idle");

  const group = useRef();
  const { actions } = useAnimations(
    [idleAnimation[0], greetingAnimation[0], dribbleAnimation[0]],
    group
  );

  useEffect(() => {
    actions[animation].reset().fadeIn(0.5).play();

    return () => actions[animation].fadeOut(0.5);
  }, [animation, actions]);

  return (
    <group {...props} dispose={null} ref={group}>
      <primitive object={nodes.Hips} />
      <skinnedMesh
        geometry={nodes.Wolf3D_Hair.geometry}
        material={materials.Wolf3D_Hair}
        skeleton={nodes.Wolf3D_Hair.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
    </group>
  );
}

useGLTF.preload("/models/Aaron.glb");
