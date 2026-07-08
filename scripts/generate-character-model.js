import { writeFile, mkdir } from "node:fs/promises";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

const OUTPUT_PATH = "public/models/character.glb";

if (typeof globalThis.FileReader === "undefined") {
  globalThis.FileReader = class FileReader {
    readAsArrayBuffer(blob) {
      blob
        .arrayBuffer()
        .then((buffer) => {
          this.result = buffer;
          this.onloadend?.();
        })
        .catch((error) => {
          this.error = error;
          this.onerror?.(error);
        });
    }
  };
}

const materials = {
  skin: standard(0xe9bca5, 0.72, 0.12),
  skinShade: standard(0xd89d87, 0.78, 0.08),
  hair: standard(0x080706, 0.58, 0.22),
  hairSoft: standard(0x15110f, 0.64, 0.18),
  eye: standard(0x050505, 0.35, 0.35),
  eyeGlint: standard(0xffffff, 0.28, 0.4),
  lip: standard(0xb86b70, 0.55, 0.18),
  shirt: standard(0xf8f5ed, 0.62, 0.08),
  shirtShadow: standard(0xe7e3d9, 0.72, 0.05),
  shorts: standard(0x1f8f59, 0.66, 0.1),
  shortsDark: standard(0x126241, 0.72, 0.08),
  shoe: standard(0xf6f3ea, 0.56, 0.12),
  shoeTrim: standard(0x16985f, 0.48, 0.18),
  sole: standard(0xd9ddd3, 0.75, 0.05),
  metal: standard(0xb8c1be, 0.25, 0.65),
};

const root = new THREE.Group();
root.name = "ModelRoot";

const body = buildCharacter();
root.add(body);

const animations = [createIdleClip(), createWalkClip()];
const exporter = new GLTFExporter();
const glb = await exporter.parseAsync(root, {
  binary: true,
  animations,
  onlyVisible: true,
  trs: true,
});

await mkdir("public/models", { recursive: true });
await writeFile(OUTPUT_PATH, Buffer.from(glb));
console.log(`Wrote ${OUTPUT_PATH}`);

function standard(color, roughness, metalness = 0) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness,
  });
}

function buildCharacter() {
  const character = new THREE.Group();
  character.name = "DetailedGirl";

  const hips = new THREE.Group();
  hips.name = "Hips";
  character.add(hips);

  const chest = new THREE.Group();
  chest.name = "Chest";
  chest.position.set(0, 1.24, 0);
  character.add(chest);

  addMesh(
    chest,
    "TShirtBody",
    new THREE.CapsuleGeometry(0.32, 0.48, 20, 48),
    materials.shirt,
    {
      scale: [0.88, 1, 0.52],
    },
  );

  addMesh(
    chest,
    "TShirtHem",
    new THREE.CylinderGeometry(0.265, 0.31, 0.08, 48),
    materials.shirtShadow,
    {
      position: [0, -0.28, 0],
      scale: [1, 1, 0.64],
    },
  );

  addMesh(
    character,
    "ShortsWaist",
    new THREE.CapsuleGeometry(0.23, 0.16, 16, 48),
    materials.shorts,
    {
      position: [0, 0.91, 0],
      rotation: [0, 0, Math.PI / 2],
      scale: [0.66, 1.35, 0.82],
    },
  );

  addMesh(
    character,
    "ShortsBelt",
    new THREE.TorusGeometry(0.27, 0.012, 8, 64),
    materials.shortsDark,
    {
      position: [0, 1.03, 0],
      rotation: [Math.PI / 2, 0, 0],
      scale: [1.2, 0.68, 1],
    },
  );

  const neck = addMesh(
    character,
    "Neck",
    new THREE.CapsuleGeometry(0.075, 0.13, 12, 28),
    materials.skin,
    {
      position: [0, 1.56, 0],
    },
  );
  neck.scale.z = 0.9;

  const head = new THREE.Group();
  head.name = "Head";
  head.position.set(0, 1.76, -0.02);
  character.add(head);

  addMesh(head, "Face", new THREE.SphereGeometry(0.32, 64, 40), materials.skin, {
    scale: [0.88, 1.08, 0.76],
  });

  addHair(head);
  addFace(head);
  addGlasses(head);

  addArm(character, -1);
  addArm(character, 1);
  addLeg(character, -1);
  addLeg(character, 1);

  return character;
}

function addHair(head) {
  addMesh(
    head,
    "HairCap",
    new THREE.SphereGeometry(0.333, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.58),
    materials.hair,
    {
      position: [0, 0.095, 0.02],
      scale: [0.98, 0.88, 0.9],
    },
  );

  addMesh(
    head,
    "BackScalpFill",
    new THREE.SphereGeometry(0.335, 64, 32, 0, Math.PI, 0.18, Math.PI * 0.55),
    materials.hair,
    {
      position: [0, 0.045, 0.03],
      scale: [1.01, 1.02, 0.93],
    },
  );

  addMesh(
    head,
    "FrontHairline",
    strandGeometry([-0.23, 0.16, -0.215], [-0.02, 0.205, -0.25], [0.23, 0.16, -0.215], 0.028),
    materials.hair,
  );

  addMesh(
    head,
    "LeftTempleFill",
    new THREE.SphereGeometry(0.13, 32, 18),
    materials.hair,
    {
      position: [-0.22, 0.055, -0.12],
      rotation: [0.08, -0.05, -0.18],
      scale: [0.78, 1.25, 0.72],
    },
  );

  addMesh(
    head,
    "RightTempleFill",
    new THREE.SphereGeometry(0.13, 32, 18),
    materials.hair,
    {
      position: [0.22, 0.055, -0.12],
      rotation: [0.08, 0.05, 0.18],
      scale: [0.78, 1.25, 0.72],
    },
  );

  addMesh(
    head,
    "BackBob",
    new THREE.SphereGeometry(0.28, 48, 28),
    materials.hair,
    {
      position: [0, -0.22, 0.13],
      scale: [1.05, 1.08, 0.72],
    },
  );

  addMesh(
    head,
    "LeftHairMass",
    new THREE.CapsuleGeometry(0.085, 0.36, 16, 32),
    materials.hairSoft,
    {
      position: [-0.28, -0.18, -0.03],
      rotation: [0.18, 0, -0.08],
      scale: [0.86, 1, 0.74],
    },
  );

  addMesh(
    head,
    "RightHairMass",
    new THREE.CapsuleGeometry(0.085, 0.36, 16, 32),
    materials.hairSoft,
    {
      position: [0.28, -0.18, -0.03],
      rotation: [0.18, 0, 0.08],
      scale: [0.86, 1, 0.74],
    },
  );

  const strandSpecs = [
    ["BangA", [-0.16, 0.22, -0.23], [-0.08, 0.09, -0.32], [-0.03, -0.03, -0.3], 0.018],
    ["BangB", [0.05, 0.24, -0.24], [0.1, 0.08, -0.32], [0.08, -0.04, -0.29], 0.017],
    ["LeftSideStrand", [-0.24, 0.15, -0.12], [-0.33, -0.08, -0.16], [-0.25, -0.36, -0.09], 0.021],
    ["RightSideStrand", [0.24, 0.15, -0.12], [0.33, -0.08, -0.16], [0.25, -0.36, -0.09], 0.021],
    ["BackLeftStrand", [-0.16, 0.1, 0.21], [-0.2, -0.15, 0.2], [-0.11, -0.43, 0.11], 0.02],
    ["BackRightStrand", [0.16, 0.1, 0.21], [0.2, -0.15, 0.2], [0.11, -0.43, 0.11], 0.02],
  ];

  strandSpecs.forEach(([name, a, b, c, radius]) => {
    addMesh(head, name, strandGeometry(a, b, c, radius), materials.hair);
  });
}

function addFace(head) {
  [-1, 1].forEach((side) => {
    addMesh(head, side < 0 ? "LeftEye" : "RightEye", new THREE.SphereGeometry(0.035, 32, 18), materials.eye, {
      position: [side * 0.105, 0.03, -0.245],
      scale: [1.05, 0.68, 0.34],
    });

    addMesh(
      head,
      side < 0 ? "LeftEyeGlint" : "RightEyeGlint",
      new THREE.SphereGeometry(0.008, 12, 8),
      materials.eyeGlint,
      {
        position: [side * 0.095, 0.045, -0.27],
        scale: [1, 1, 0.3],
      },
    );

    addMesh(
      head,
      side < 0 ? "LeftBrow" : "RightBrow",
      strandGeometry([side * 0.065, 0.1, -0.26], [side * 0.12, 0.115, -0.265], [side * 0.17, 0.1, -0.255], 0.007),
      materials.hair,
    );

    addMesh(head, side < 0 ? "LeftEar" : "RightEar", new THREE.SphereGeometry(0.055, 24, 16), materials.skin, {
      position: [side * 0.285, 0, 0.02],
      scale: [0.55, 1, 0.38],
    });
  });

  addMesh(head, "NoseBridge", new THREE.CapsuleGeometry(0.014, 0.055, 8, 16), materials.skinShade, {
    position: [0, -0.035, -0.255],
    rotation: [0.18, 0, 0],
    scale: [0.8, 1, 0.65],
  });

  addMesh(head, "NoseTip", new THREE.SphereGeometry(0.025, 20, 12), materials.skinShade, {
    position: [0, -0.055, -0.27],
    scale: [0.85, 0.62, 0.5],
  });

  addMesh(head, "Mouth", new THREE.CapsuleGeometry(0.012, 0.09, 8, 20), materials.lip, {
    position: [0, -0.165, -0.247],
    rotation: [0, 0, Math.PI / 2],
    scale: [0.55, 1, 0.35],
  });
}

function addGlasses(head) {
  [-1, 1].forEach((side) => {
    addMesh(head, side < 0 ? "LeftLens" : "RightLens", new THREE.TorusGeometry(0.062, 0.0045, 8, 40), materials.metal, {
      position: [side * 0.105, 0.035, -0.263],
      scale: [1.2, 0.72, 1],
    });

    addMesh(
      head,
      side < 0 ? "LeftTemple" : "RightTemple",
      strandGeometry([side * 0.17, 0.035, -0.258], [side * 0.24, 0.02, -0.14], [side * 0.275, 0, -0.015], 0.0045),
      materials.metal,
    );
  });

  addMesh(head, "GlassesBridge", new THREE.CapsuleGeometry(0.004, 0.06, 6, 12), materials.metal, {
    position: [0, 0.035, -0.263],
    rotation: [0, 0, Math.PI / 2],
  });
}

function addArm(character, side) {
  const shoulder = new THREE.Group();
  shoulder.name = side < 0 ? "LeftShoulder" : "RightShoulder";
  shoulder.position.set(side * 0.345, 1.38, -0.005);
  shoulder.rotation.z = side * -0.1;
  character.add(shoulder);

  addMesh(
    shoulder,
    side < 0 ? "LeftSleeve" : "RightSleeve",
    new THREE.CapsuleGeometry(0.082, 0.14, 12, 28),
    materials.shirt,
    {
      position: [side * 0.02, -0.03, 0],
      rotation: [0, 0, Math.PI / 2],
      scale: [0.78, 1, 0.9],
    },
  );

  const arm = new THREE.Group();
  arm.name = side < 0 ? "LeftArm" : "RightArm";
  arm.position.set(side * 0.04, -0.08, 0);
  shoulder.add(arm);

  addMesh(arm, side < 0 ? "LeftForearm" : "RightForearm", new THREE.CapsuleGeometry(0.055, 0.5, 14, 28), materials.skin, {
    position: [side * 0.012, -0.29, 0],
    rotation: [0, 0, side * -0.06],
  });

  addMesh(arm, side < 0 ? "LeftHand" : "RightHand", new THREE.SphereGeometry(0.06, 24, 16), materials.skin, {
    position: [side * 0.03, -0.59, -0.01],
    scale: [0.72, 1, 0.58],
  });
}

function addLeg(character, side) {
  const leg = new THREE.Group();
  leg.name = side < 0 ? "LeftLeg" : "RightLeg";
  leg.position.set(side * 0.14, 0.87, 0);
  character.add(leg);

  addMesh(leg, side < 0 ? "LeftShortsLeg" : "RightShortsLeg", new THREE.CapsuleGeometry(0.105, 0.18, 12, 32), materials.shorts, {
    position: [0, -0.08, 0],
    scale: [1.1, 1, 0.86],
  });

  addMesh(leg, side < 0 ? "LeftShin" : "RightShin", new THREE.CapsuleGeometry(0.072, 0.5, 16, 32), materials.skin, {
    position: [0, -0.43, 0],
    scale: [0.9, 1, 0.82],
  });

  addMesh(leg, side < 0 ? "LeftSock" : "RightSock", new THREE.CylinderGeometry(0.064, 0.068, 0.055, 28), materials.shirt, {
    position: [0, -0.715, -0.006],
    scale: [1, 1, 0.82],
  });

  const shoe = new THREE.Group();
  shoe.name = side < 0 ? "LeftShoe" : "RightShoe";
  shoe.position.set(0, -0.79, -0.075);
  leg.add(shoe);

  addMesh(shoe, "ShoeUpper", new THREE.CapsuleGeometry(0.075, 0.2, 12, 28), materials.shoe, {
    rotation: [Math.PI / 2, 0, 0],
    scale: [1.05, 1, 0.62],
  });

  addMesh(shoe, "ShoeToe", new THREE.SphereGeometry(0.08, 24, 14), materials.shoe, {
    position: [0, 0, -0.12],
    scale: [1.08, 0.5, 0.82],
  });

  addMesh(shoe, "ShoeSole", new THREE.BoxGeometry(0.17, 0.035, 0.31), materials.sole, {
    position: [0, -0.045, -0.02],
  });

  addMesh(shoe, "GreenSideStripe", new THREE.BoxGeometry(0.013, 0.04, 0.16), materials.shoeTrim, {
    position: [side * -0.083, 0.028, -0.04],
  });

  addMesh(shoe, "GreenHeel", new THREE.BoxGeometry(0.14, 0.05, 0.018), materials.shoeTrim, {
    position: [0, 0.02, 0.1],
  });
}

function addMesh(parent, name, geometry, material, options = {}) {
  geometry.computeVertexNormals();

  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  if (options.position) {
    mesh.position.fromArray(options.position);
  }

  if (options.rotation) {
    mesh.rotation.fromArray(options.rotation);
  }

  if (options.scale) {
    mesh.scale.fromArray(options.scale);
  }

  parent.add(mesh);
  return mesh;
}

function strandGeometry(a, b, c, radius) {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(...a),
    new THREE.Vector3(...b),
    new THREE.Vector3(...c),
  ]);
  return new THREE.TubeGeometry(curve, 18, radius, 10, false);
}

function createIdleClip() {
  const times = [0, 0.8, 1.6];
  return new THREE.AnimationClip("Idle", 1.6, [
    quaternionTrack("Head", times, [
      [0.02, 0, 0],
      [-0.015, 0.035, 0],
      [0.02, 0, 0],
    ]),
    quaternionTrack("Chest", times, [
      [0, 0, 0],
      [0.012, 0, 0],
      [0, 0, 0],
    ]),
  ]);
}

function createWalkClip() {
  const times = [0, 0.2, 0.4, 0.6, 0.8];
  return new THREE.AnimationClip("Walk", 0.8, [
    quaternionTrack("LeftLeg", times, [
      [-0.36, 0, 0],
      [0, 0, 0],
      [0.34, 0, 0],
      [0, 0, 0],
      [-0.36, 0, 0],
    ]),
    quaternionTrack("RightLeg", times, [
      [0.34, 0, 0],
      [0, 0, 0],
      [-0.36, 0, 0],
      [0, 0, 0],
      [0.34, 0, 0],
    ]),
    quaternionTrack("LeftArm", times, [
      [0.28, 0, 0],
      [0, 0, 0],
      [-0.28, 0, 0],
      [0, 0, 0],
      [0.28, 0, 0],
    ]),
    quaternionTrack("RightArm", times, [
      [-0.28, 0, 0],
      [0, 0, 0],
      [0.28, 0, 0],
      [0, 0, 0],
      [-0.28, 0, 0],
    ]),
    quaternionTrack("Chest", times, [
      [0, 0.035, 0],
      [0, 0, 0],
      [0, -0.035, 0],
      [0, 0, 0],
      [0, 0.035, 0],
    ]),
  ]);
}

function quaternionTrack(name, times, eulers) {
  const values = [];
  eulers.forEach(([x, y, z]) => {
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z));
    values.push(q.x, q.y, q.z, q.w);
  });
  return new THREE.QuaternionKeyframeTrack(`${name}.quaternion`, times, values);
}
