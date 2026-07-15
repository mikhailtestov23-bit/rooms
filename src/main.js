import "./styles.css?v=graveyard-wall-fade-3";
import * as THREE from "three";
import photoGateImageUrl from "./assets/marfa-beach-goal.jpg";
import thirdRoomWallImageUrl from "./assets/marfa-sleeping-room.jpg";
import fourthRoomDoorImageUrl from "./assets/marfa-bath-door.jpg";
import room4GalleryPhoto1Url from "./assets/room4-gallery/photo-1.jpg";
import room4GalleryPhoto2Url from "./assets/room4-gallery/photo-2.jpg";
import room4GalleryPhoto3Url from "./assets/room4-gallery/photo-3.jpg";
import room4GalleryPhoto4Url from "./assets/room4-gallery/photo-4.jpg";
import room4GalleryPhoto5Url from "./assets/room4-gallery/photo-5.jpg";
import room4GalleryPhoto6Url from "./assets/room4-gallery/photo-6.jpg";
import room2GalleryPhoto1Url from "./assets/room2-gallery/photo-1.jpg";
import room2GalleryPhoto2Url from "./assets/room2-gallery/photo-2.jpg";
import room2GalleryPhoto3Url from "./assets/room2-gallery/photo-3.jpg";
import room2GalleryPhoto4Url from "./assets/room2-gallery/photo-4.jpg";
import room2GalleryPhoto5Url from "./assets/room2-gallery/photo-5.jpg";
import room2GalleryPhoto6Url from "./assets/room2-gallery/photo-6.jpg";
import room2GalleryPhoto7Url from "./assets/room2-gallery/photo-7.jpg";
import room2GalleryPhoto8Url from "./assets/room2-gallery/photo-8.jpg";
import room2GalleryPhoto9Url from "./assets/room2-gallery/photo-9.jpg";
import room2GalleryPhoto10Url from "./assets/room2-gallery/photo-10.jpg";
import fifthRoomDoorPhoto1Url from "./assets/room5-door/panel-1.jpg";
import fifthRoomDoorPhoto2Url from "./assets/room5-door/panel-2.jpg";

const URL_PARAMS = new URLSearchParams(window.location.search);
const GRAVEYARD_VARIANT = URL_PARAMS.get("variant") === "graveyard";
const ROOM_COUNT = GRAVEYARD_VARIANT ? 7 : 6;
const ROOM_WIDTH = 18;
const ROOM_LENGTH = 24;
const CORRIDOR_LENGTH = 6.5;
const ROOM_STEP = ROOM_LENGTH + CORRIDOR_LENGTH;
const WALL_HEIGHT = 5.5;
const WALL_THICKNESS = 0.7;
const DOOR_HALF_WIDTH = 3.1;
const CORRIDOR_HALF_WIDTH = DOOR_HALF_WIDTH + 0.55;
const PLAYER_RADIUS = 0.55;
const PLAYER_HEIGHT = 2.1;
const WALK_SPEED = 7.4;
const BACKPEDAL_SPEED_MULTIPLIER = 0.58;
const TURN_SPEED = 3.25;
const TAP_TURN_STEP = 0.22;
const CAMERA_DISTANCE = 8;
const CAMERA_HEIGHT = 4.8;
const CAMERA_LOOK_AHEAD = 4.2;
const CAMERA_TURN_FOLLOW_SPEED = 18;
const DEFAULT_CHARACTER_VRM_URL = "/models/character.vrm";
const DEFAULT_CHARACTER_GLB_URL = "/models/character.glb";
const CHARACTER_DB_NAME = "rooms-character";
const CHARACTER_STORE_NAME = "models";
const CHARACTER_RECORD_KEY = "active";
const CHARACTER_ROTATION_KEY = "rooms-character-rotation-v4";
const BIRTHDAY_GALLERY_TITLE = "Marfa's Birthday Gallery";
const PARTY_LIGHT_COLORS = [0xff4fd8, 0x58e6ff, 0xffdd4d, 0x74ff62, 0xff6b4a, 0xb46cff, 0x48a6ff];
const DEBUG_UI_ENABLED = URL_PARAMS.has("debug");
const PERFORMANCE_MODE = URL_PARAMS.get("quality") !== "high";
const MAX_RENDER_PIXEL_RATIO = PERFORMANCE_MODE ? 1 : 1.6;
const CAMERA_FAR = PERFORMANCE_MODE ? 130 : 220;
const SPARKLE_COUNT = PERFORMANCE_MODE ? 36 : 120;
const CAMERA_FADE_TRACE_INTERVAL = PERFORMANCE_MODE ? 3 : 1;
function getRoomCenterZ(index) {
  return -index * ROOM_STEP;
}

function getRoomFrontZ(index) {
  return getRoomCenterZ(index) + ROOM_LENGTH / 2;
}

function getRoomBackZ(index) {
  return getRoomCenterZ(index) - ROOM_LENGTH / 2;
}

const SECOND_ROOM_INDEX = 1;
const SECOND_ROOM_CENTER_Z = getRoomCenterZ(SECOND_ROOM_INDEX);
const SECOND_TO_THIRD_BOUNDARY_Z = getRoomBackZ(SECOND_ROOM_INDEX);
const THIRD_ROOM_INDEX = 2;
const THIRD_ROOM_CENTER_Z = getRoomCenterZ(THIRD_ROOM_INDEX);
const THIRD_TO_FOURTH_BOUNDARY_Z = getRoomBackZ(THIRD_ROOM_INDEX);
const FOURTH_ROOM_INDEX = 3;
const FOURTH_ROOM_CENTER_Z = getRoomCenterZ(FOURTH_ROOM_INDEX);
const FOURTH_TO_FIFTH_BOUNDARY_Z = getRoomBackZ(FOURTH_ROOM_INDEX);
const FIFTH_ROOM_INDEX = 4;
const FIFTH_ROOM_CENTER_Z = getRoomCenterZ(FIFTH_ROOM_INDEX);
const FIFTH_TO_SIXTH_BOUNDARY_Z = getRoomBackZ(FIFTH_ROOM_INDEX);
const GRAVEYARD_ROOM_INDEX = GRAVEYARD_VARIANT ? 5 : -1;
const GRAVEYARD_ROOM_CENTER_Z = GRAVEYARD_VARIANT ? getRoomCenterZ(GRAVEYARD_ROOM_INDEX) : 0;
const GRAVEYARD_TO_FINALE_BOUNDARY_Z = GRAVEYARD_VARIANT
  ? getRoomBackZ(GRAVEYARD_ROOM_INDEX)
  : Number.POSITIVE_INFINITY;
const SIXTH_ROOM_INDEX = GRAVEYARD_VARIANT ? 6 : 5;
const SIXTH_ROOM_CENTER_Z = getRoomCenterZ(SIXTH_ROOM_INDEX);
const ROOM_ENTRY_INSTRUCTION_DURATION = 5;
const ROOM_ENTRY_INSTRUCTION_FADE_DURATION = 1.1;
const ROOM_ENTRY_SOUND_COOLDOWN = 0.55;
const ROOM_ENTRY_INSTRUCTIONS = {
  [SECOND_ROOM_INDEX]: {
    title: "score your goals",
    hint: "(space bar to kick)",
  },
  [THIRD_ROOM_INDEX]: {
    title: "play your own tune",
    hint: "(step on right tiles in a right order)",
  },
  [FOURTH_ROOM_INDEX]: {
    title: "blow your bubbles",
    hint: "(space bar to pierce)",
  },
  [FIFTH_ROOM_INDEX]: {
    title: "spread your love",
    hint: "(space bar to water the plant)",
  },
  ...(GRAVEYARD_VARIANT ? {
    [GRAVEYARD_ROOM_INDEX]: {
      title: "Have fun at work",
      hint: "(space bar to clean the grave)",
    },
  } : {}),
};
const PHOTO_GATE_IMAGE_URL = photoGateImageUrl;
const THIRD_ROOM_WALL_IMAGE_URL = thirdRoomWallImageUrl;
const FOURTH_ROOM_DOOR_IMAGE_URL = fourthRoomDoorImageUrl;
const FIFTH_ROOM_DOOR_PHOTO_URLS = [fifthRoomDoorPhoto1Url, fifthRoomDoorPhoto2Url];
const ROOM4_GALLERY_PHOTO_URLS = [
  room4GalleryPhoto1Url,
  room4GalleryPhoto2Url,
  room4GalleryPhoto3Url,
  room4GalleryPhoto4Url,
  room4GalleryPhoto5Url,
  room4GalleryPhoto6Url,
];
const ROOM2_GALLERY_PHOTO_URLS = [
  room2GalleryPhoto1Url,
  room2GalleryPhoto2Url,
  room2GalleryPhoto3Url,
  room2GalleryPhoto4Url,
  room2GalleryPhoto5Url,
  room2GalleryPhoto6Url,
  room2GalleryPhoto7Url,
  room2GalleryPhoto8Url,
  room2GalleryPhoto9Url,
  room2GalleryPhoto10Url,
];
const PHOTO_GATE_SECOND_ROOM_OFFSET = 0.82;
const PHOTO_GATE_Z = SECOND_TO_THIRD_BOUNDARY_Z + PHOTO_GATE_SECOND_ROOM_OFFSET;
const PHOTO_GATE_WIDTH = DOOR_HALF_WIDTH * 2.18;
const PHOTO_GATE_HEIGHT = 4.35;
const THIRD_ROOM_DOOR_Z = THIRD_TO_FOURTH_BOUNDARY_Z + 0.78;
const THIRD_ROOM_DOOR_WIDTH = DOOR_HALF_WIDTH * 2.05;
const THIRD_ROOM_DOOR_HEIGHT = 4.25;
const THIRD_ROOM_TILE_SIZE = 3.9;
const THIRD_ROOM_TILE_TRIGGER_RADIUS = 2.1;
const FOURTH_ROOM_DOOR_Z = FOURTH_TO_FIFTH_BOUNDARY_Z + 0.78;
const FOURTH_ROOM_DOOR_WIDTH = DOOR_HALF_WIDTH * 2.18;
const FOURTH_ROOM_DOOR_HEIGHT = 4.42;
const FOURTH_ROOM_BUBBLE_POP_RANGE = 3.45;
const FOURTH_ROOM_POP_ANIMATION_DURATION = 0.58;
const FOURTH_ROOM_REWARD_GRAVITY = 7.6;
const FIFTH_ROOM_DOOR_Z = FIFTH_TO_SIXTH_BOUNDARY_Z + 0.78;
const FIFTH_ROOM_DOOR_WIDTH = DOOR_HALF_WIDTH * 2.14;
const FIFTH_ROOM_DOOR_HEIGHT = 4.42;
const FIFTH_ROOM_WATER_RANGE = 2.9;
const FIFTH_ROOM_WATER_ANIMATION_DURATION = 0.68;
const GRAVEYARD_WATER_RANGE = 3.15;
const GRAVEYARD_WATER_ANIMATION_DURATION = 0.78;
const GRAVEYARD_GRAVE_LAYOUT = [
  { x: -5.8, z: 7.7, rotation: 0.08, flowerColor: 0xc9a4ff },
  { x: -1.9, z: 6.1, rotation: -0.06, flowerColor: 0xf4d36f },
  { x: 4.8, z: 7.2, rotation: 0.05, flowerColor: 0x9fc9ff },
  { x: 6.1, z: 2.7, rotation: -0.08, flowerColor: 0xf0a0bd },
  { x: 1.8, z: 1.6, rotation: 0.04, flowerColor: 0xc8e97a },
  { x: -4.7, z: 2.0, rotation: -0.04, flowerColor: 0xe8b2ff },
  { x: -6.0, z: -3.4, rotation: 0.06, flowerColor: 0xffc58e },
  { x: -1.7, z: -5.2, rotation: -0.08, flowerColor: 0x9ee4dc },
  { x: 4.4, z: -3.3, rotation: 0.07, flowerColor: 0xe9a4d1 },
  { x: 5.8, z: -8.0, rotation: -0.05, flowerColor: 0xf5e6a1 },
];
const FOURTH_ROOM_BUBBLE_LAYOUT = [
  { x: -5.9, z: 8.2, y: 2.25, radius: 1.05 },
  { x: 0.2, z: 8.85, y: 2.72, radius: 1.18 },
  { x: 5.6, z: 7.35, y: 2.16, radius: 0.96 },
  { x: -2.8, z: 5.4, y: 3.34, radius: 1.08 },
  { x: 3.15, z: 4.25, y: 2.58, radius: 1.22 },
  { x: -6.65, z: 2.0, y: 2.82, radius: 1.26 },
  { x: -0.75, z: 1.18, y: 2.08, radius: 0.92 },
  { x: 6.7, z: 0.65, y: 3.14, radius: 1.12 },
  { x: -3.9, z: -2.1, y: 2.38, radius: 1.0 },
  { x: 2.2, z: -2.95, y: 3.38, radius: 1.3 },
  { x: -7.0, z: -5.8, y: 2.1, radius: 0.95 },
  { x: -0.1, z: -6.45, y: 2.8, radius: 1.12 },
  { x: 6.35, z: -6.85, y: 2.32, radius: 1.06 },
  { x: -3.15, z: -9.2, y: 3.2, radius: 1.24 },
  { x: 3.8, z: -9.35, y: 2.44, radius: 1.08 },
];
const FIFTH_ROOM_PLANT_LAYOUT = [
  { x: -5.9, z: 7.2, kind: 0, leafColor: 0x53b957, flowerColor: 0xff76c8 },
  { x: -1.75, z: 6.05, kind: 1, leafColor: 0x2f9656, flowerColor: 0xffd75e },
  { x: 4.75, z: 5.95, kind: 2, leafColor: 0x69c95a, flowerColor: 0x86e7ff },
  { x: 7.15, z: 8.85, kind: 1, leafColor: 0x4bbf65, flowerColor: 0xffab59 },
  { x: -7.15, z: 9.15, kind: 2, leafColor: 0x8ad86b, flowerColor: 0xa6ff7a },
  { x: 2.15, z: 8.85, kind: 0, leafColor: 0x63c87a, flowerColor: 0xff79a8 },
  { x: -6.45, z: 1.05, kind: 2, leafColor: 0x3fa35e, flowerColor: 0xc084ff },
  { x: -3.95, z: 3.35, kind: 1, leafColor: 0x62be55, flowerColor: 0x75f0ff },
  { x: 0.65, z: 0.2, kind: 0, leafColor: 0x57be6f, flowerColor: 0xff8a5f },
  { x: 4.05, z: 2.4, kind: 2, leafColor: 0x38a967, flowerColor: 0xffe679 },
  { x: 6.25, z: -1.45, kind: 1, leafColor: 0x318f4c, flowerColor: 0xf5ff77 },
  { x: -7.15, z: -3.2, kind: 0, leafColor: 0x4ab76f, flowerColor: 0xe697ff },
  { x: -3.9, z: -5.65, kind: 1, leafColor: 0x74c157, flowerColor: 0x78ffb0 },
  { x: 2.55, z: -6.95, kind: 2, leafColor: 0x4faf62, flowerColor: 0xff7ee5 },
  { x: 7.05, z: -5.55, kind: 0, leafColor: 0x55b24e, flowerColor: 0xffc3ef },
  { x: -1.45, z: -9.2, kind: 2, leafColor: 0x73d15e, flowerColor: 0x8fc2ff },
  { x: 5.45, z: -9.45, kind: 1, leafColor: 0x3c9d51, flowerColor: 0xfff29a },
];
const FOOTBALL_RADIUS = 0.42;
const FOOTBALL_START_Z = SECOND_ROOM_CENTER_Z + ROOM_LENGTH * 0.31;
const FOOTBALL_KICK_SPEED = 17.5;
const FOOTBALL_KICK_RANGE = 2.75;
const FOOTBALL_WALL_RESTITUTION = 0.68;
const FOOTBALL_FRICTION_PER_SECOND = 0.36;
const KICK_ANIMATION_DURATION = 0.46;
const SECOND_ROOM_OBSTACLE_HEIGHT = 0.78;
const SECOND_ROOM_MAZE_OBSTACLES = [
  { x: -2.85, z: SECOND_ROOM_CENTER_Z + 4.1, width: 11.8, depth: 0.68 },
  { x: 2.85, z: SECOND_ROOM_CENTER_Z + 0.7, width: 11.8, depth: 0.68 },
  { x: -2.9, z: SECOND_ROOM_CENTER_Z - 2.8, width: 11.6, depth: 0.68 },
  { x: 2.75, z: SECOND_ROOM_CENTER_Z - 6.15, width: 11.7, depth: 0.68 },
  { x: -5.55, z: SECOND_ROOM_CENTER_Z - 8.25, width: 0.72, depth: 3.8 },
];
const THIRD_ROOM_MELODY = [
  { name: "C5", frequency: 523.25 },
  { name: "E5", frequency: 659.25 },
  { name: "G5", frequency: 783.99 },
  { name: "B5", frequency: 987.77 },
  { name: "A5", frequency: 880 },
  { name: "G5", frequency: 783.99 },
  { name: "E5", frequency: 659.25 },
  { name: "D5", frequency: 587.33 },
];
const THIRD_ROOM_FINAL_MELODY = [
  { name: "C5", frequency: 523.25 },
  { name: "E5", frequency: 659.25 },
  { name: "G5", frequency: 783.99 },
  { name: "B5", frequency: 987.77 },
  { name: "A5", frequency: 880 },
  { name: "G5", frequency: 783.99 },
  { name: "E5", frequency: 659.25 },
  { name: "D5", frequency: 587.33 },
  { name: "F5", frequency: 698.46 },
  { name: "A5", frequency: 880 },
  { name: "C6", frequency: 1046.5 },
  { name: "B5", frequency: 987.77 },
  { name: "G5", frequency: 783.99 },
  { name: "E5", frequency: 659.25 },
  { name: "G5", frequency: 783.99 },
  { name: "C6", frequency: 1046.5 },
];
const AMBIENT_PIANO_LOOP_DURATION = 18;
const AMBIENT_PIANO_VOLUME = 0.06;
const AMBIENT_PIANO_ROOM3_VOLUME = 0.0001;
const AMBIENT_PIANO_PHRASE = [
  { time: 0, frequency: 261.63, duration: 1.1, velocity: 0.55 },
  { time: 0.38, frequency: 329.63, duration: 0.92, velocity: 0.42 },
  { time: 0.76, frequency: 392, duration: 1.05, velocity: 0.44 },
  { time: 1.48, frequency: 523.25, duration: 1.28, velocity: 0.48 },
  { time: 2.62, frequency: 493.88, duration: 0.95, velocity: 0.34 },
  { time: 3.18, frequency: 440, duration: 1.1, velocity: 0.38 },
  { time: 4.35, frequency: 349.23, duration: 1.18, velocity: 0.38 },
  { time: 4.78, frequency: 440, duration: 0.9, velocity: 0.32 },
  { time: 5.2, frequency: 523.25, duration: 1.15, velocity: 0.4 },
  { time: 6.18, frequency: 392, duration: 1.05, velocity: 0.34 },
  { time: 7.05, frequency: 329.63, duration: 1.4, velocity: 0.34 },
  { time: 8.95, frequency: 293.66, duration: 1.1, velocity: 0.42 },
  { time: 9.32, frequency: 369.99, duration: 0.92, velocity: 0.34 },
  { time: 9.75, frequency: 440, duration: 1.1, velocity: 0.38 },
  { time: 10.72, frequency: 587.33, duration: 1.18, velocity: 0.42 },
  { time: 11.92, frequency: 523.25, duration: 1.22, velocity: 0.36 },
  { time: 12.8, frequency: 392, duration: 1.18, velocity: 0.34 },
  { time: 13.62, frequency: 329.63, duration: 1.35, velocity: 0.32 },
  { time: 15.12, frequency: 261.63, duration: 1.65, velocity: 0.42 },
];
const AMBIENT_PIANO_BASS = [
  { time: 0, frequency: 130.81, duration: 2.4, velocity: 0.26 },
  { time: 4.35, frequency: 174.61, duration: 2.1, velocity: 0.22 },
  { time: 8.95, frequency: 146.83, duration: 2.3, velocity: 0.23 },
  { time: 13.62, frequency: 196, duration: 2.2, velocity: 0.2 },
  { time: 15.12, frequency: 130.81, duration: 2.6, velocity: 0.22 },
];
const SIXTH_ROOM_FINALE_DURATION = 20;
const SIXTH_ROOM_CONFETTI_GRAVITY = 2.8;
const SIXTH_ROOM_BOUQUET_LAYOUT = [
  { x: -7.1, z: 7.6, flowerColor: 0xffb4d8, leafColor: 0x5ab85f },
  { x: -5.0, z: 6.35, flowerColor: 0xffdf72, leafColor: 0x72c864 },
  { x: -2.75, z: 7.25, flowerColor: 0xb7d6ff, leafColor: 0x52b86c },
  { x: 0.15, z: 6.05, flowerColor: 0xf0a5ff, leafColor: 0x68c75a },
  { x: 2.95, z: 7.35, flowerColor: 0xff9a88, leafColor: 0x4da96a },
  { x: 6.1, z: 6.55, flowerColor: 0xffffff, leafColor: 0x7acb5e },
  { x: -6.6, z: 3.75, flowerColor: 0xffc3ef, leafColor: 0x57b85c },
  { x: -3.85, z: 3.05, flowerColor: 0x9df5ff, leafColor: 0x59ad71 },
  { x: -0.9, z: 3.9, flowerColor: 0xffec91, leafColor: 0x78c86b },
  { x: 2.15, z: 2.85, flowerColor: 0xff9ec7, leafColor: 0x56b96a },
  { x: 5.85, z: 3.9, flowerColor: 0xffc9a3, leafColor: 0x61b866 },
  { x: -7.25, z: 0.55, flowerColor: 0xd9b0ff, leafColor: 0x4fa867 },
  { x: -4.75, z: -0.45, flowerColor: 0xfff0a8, leafColor: 0x76c660 },
  { x: -1.75, z: 0.65, flowerColor: 0xa7f6ff, leafColor: 0x4aae70 },
  { x: 1.05, z: -0.65, flowerColor: 0xffbad7, leafColor: 0x6fc25f },
  { x: 3.95, z: 0.55, flowerColor: 0xf5ffab, leafColor: 0x56ad58 },
  { x: 7.0, z: -0.4, flowerColor: 0xff9bdc, leafColor: 0x60bb6c },
  { x: -6.65, z: -3.15, flowerColor: 0xb5ffdf, leafColor: 0x51a96a },
  { x: -3.35, z: -4.05, flowerColor: 0xffa5a5, leafColor: 0x6ac05c },
  { x: -0.25, z: -3.25, flowerColor: 0xffffff, leafColor: 0x7acb5e },
  { x: 2.85, z: -4.15, flowerColor: 0xd0d8ff, leafColor: 0x53a96f },
  { x: 6.25, z: -3.05, flowerColor: 0xffdc88, leafColor: 0x66bd63 },
  { x: -7.15, z: -6.65, flowerColor: 0xffb6f2, leafColor: 0x55b974 },
  { x: -4.35, z: -7.85, flowerColor: 0xc2ff9f, leafColor: 0x4dae63 },
  { x: -1.25, z: -6.65, flowerColor: 0xffefb5, leafColor: 0x72c864 },
  { x: 1.8, z: -7.8, flowerColor: 0xaee8ff, leafColor: 0x52b86c },
  { x: 4.55, z: -6.55, flowerColor: 0xffb0bd, leafColor: 0x5ab85f },
  { x: 7.15, z: -7.65, flowerColor: 0xf1d1ff, leafColor: 0x57b85c },
  { x: -2.75, z: -9.9, flowerColor: 0xffd1a8, leafColor: 0x6bc46a },
  { x: 3.15, z: -10.1, flowerColor: 0xffffc7, leafColor: 0x5cb96b },
];
const FINALE_BIRTHDAY_MELODY = [
  { time: 0, frequency: 523.25, duration: 0.48, volume: 0.13 },
  { time: 0.42, frequency: 523.25, duration: 0.36, volume: 0.1 },
  { time: 0.84, frequency: 587.33, duration: 0.72, volume: 0.13 },
  { time: 1.58, frequency: 523.25, duration: 0.72, volume: 0.12 },
  { time: 2.32, frequency: 698.46, duration: 0.84, volume: 0.14 },
  { time: 3.14, frequency: 659.25, duration: 1.05, volume: 0.13 },
  { time: 4.35, frequency: 523.25, duration: 0.48, volume: 0.13 },
  { time: 4.77, frequency: 523.25, duration: 0.36, volume: 0.1 },
  { time: 5.18, frequency: 587.33, duration: 0.72, volume: 0.13 },
  { time: 5.92, frequency: 523.25, duration: 0.72, volume: 0.12 },
  { time: 6.66, frequency: 783.99, duration: 0.84, volume: 0.14 },
  { time: 7.48, frequency: 698.46, duration: 1.08, volume: 0.13 },
  { time: 8.78, frequency: 523.25, duration: 0.5, volume: 0.12 },
  { time: 9.18, frequency: 523.25, duration: 0.32, volume: 0.09 },
  { time: 9.56, frequency: 1046.5, duration: 0.72, volume: 0.13 },
  { time: 10.32, frequency: 880, duration: 0.72, volume: 0.13 },
  { time: 11.05, frequency: 698.46, duration: 0.72, volume: 0.12 },
  { time: 11.78, frequency: 659.25, duration: 0.72, volume: 0.12 },
  { time: 12.48, frequency: 587.33, duration: 1.05, volume: 0.11 },
  { time: 13.68, frequency: 932.33, duration: 0.5, volume: 0.12 },
  { time: 14.08, frequency: 932.33, duration: 0.32, volume: 0.09 },
  { time: 14.48, frequency: 880, duration: 0.72, volume: 0.12 },
  { time: 15.22, frequency: 698.46, duration: 0.72, volume: 0.12 },
  { time: 15.96, frequency: 783.99, duration: 0.86, volume: 0.13 },
  { time: 16.82, frequency: 698.46, duration: 1.35, volume: 0.13 },
  { time: 18.28, frequency: 523.25, duration: 1.45, volume: 0.1 },
];
const THIRD_ROOM_TILE_LAYOUT = [
  { x: -5.8, z: 7.1 },
  { x: 0.3, z: 4.8 },
  { x: 5.9, z: 7.0 },
  { x: -5.9, z: 0.7 },
  { x: 0.1, z: -1.5 },
  { x: 5.8, z: 0.8 },
  { x: -5.4, z: -7.0 },
  { x: 4.5, z: -7.1 },
];

const app = document.querySelector("#app");
app?.classList.toggle("is-debug", DEBUG_UI_ENABLED);
const roomLabel = document.querySelector("#roomLabel");
const distanceLabel = document.querySelector("#distanceLabel");
const roomJumpTools = document.querySelector("#roomJumpTools");
const moveStick = document.querySelector("#moveStick");
const moveKnob = document.querySelector("#moveKnob");
const modelButton = document.querySelector("#modelButton");
const rotateModelButton = document.querySelector("#rotateModelButton");
const resetModelButton = document.querySelector("#resetModelButton");
const modelInput = document.querySelector("#modelInput");
const modelStatus = document.querySelector("#modelStatus");
const startOverlay = document.querySelector("#startOverlay");
const startButton = document.querySelector("#startButton");
const actionButton = document.querySelector("#actionButton");

if (GRAVEYARD_VARIANT && roomJumpTools && !roomJumpTools.querySelector('[data-room-jump="7"]')) {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.roomJump = "7";
  button.setAttribute("aria-label", "Перейти в комнату 7");
  button.textContent = "7";
  roomJumpTools.appendChild(button);
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x11181a);
scene.fog = new THREE.FogExp2(0x142024, 0.018);

const camera = new THREE.PerspectiveCamera(
  58,
  window.innerWidth / window.innerHeight,
  0.1,
  CAMERA_FAR,
);

const renderer = new THREE.WebGLRenderer({
  antialias: !PERFORMANCE_MODE,
  powerPreference: PERFORMANCE_MODE ? "low-power" : "high-performance",
  preserveDrawingBuffer: false,
  precision: PERFORMANCE_MODE ? "mediump" : "highp",
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_RENDER_PIXEL_RATIO));
renderer.shadowMap.enabled = !PERFORMANCE_MODE;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
app.appendChild(renderer.domElement);

const clock = new THREE.Clock();
const loader = new THREE.TextureLoader();
let gltfLoader = null;
let vrmLoader = null;
let characterRotationOffset = readStoredCharacterRotation();

const input = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  joystick: new THREE.Vector2(),
};

const cameraState = {
  yaw: 0,
  pitch: 0.05,
  draggingPointer: null,
  lastX: 0,
  lastY: 0,
};

const player = createPlayer();
player.userData.proceduralChildren = [...player.children];
setProceduralCharacterVisible(!shouldAttemptDetailedCharacter());
player.position.set(0, 0, 0);
scene.add(player);
loadDetailedCharacter();

const roomLights = [];
const sparkleSystems = [];
const boundaryZ = [];
const cameraFadeMeshes = [];
const cameraFadeRaycaster = new THREE.Raycaster();
const roomEntryInstructionGroups = new Map();
const roomEntryInstructionState = {
  lastRoomIndex: null,
  lastSoundAt: -Infinity,
};
const partyRibbonMaterialCache = new Map();
let cameraFadeTargets = new Set();
let cameraFadeFrame = 0;
let sparkleFrame = 0;
let lightFrame = 0;
let melodyAudioContext = null;
let gameStarted = false;
const ambientAudioState = {
  started: false,
  intervalId: null,
  masterGain: null,
  filter: null,
  mutedForRoom: false,
};
const secondRoomPuzzle = {
  ball: null,
  ballVelocity: new THREE.Vector3(),
  photoGate: null,
  leftPanel: null,
  rightPanel: null,
  photoCover: null,
  obstacles: [],
  fishes: [],
  kickTimer: 0,
  opened: false,
  opening: 0,
};
const thirdRoomPuzzle = {
  tiles: [],
  currentStep: 0,
  activeTileIndex: null,
  completed: false,
  opened: false,
  opening: 0,
  openDelay: 0,
  leftDoor: null,
  rightDoor: null,
};
const fourthRoomPuzzle = {
  bubbles: [],
  rewardParticles: [],
  popTool: null,
  popTimer: 0,
  popTarget: null,
  poppedCount: 0,
  completed: false,
  opened: false,
  opening: 0,
  leftDoor: null,
  rightDoor: null,
};
const fifthRoomPuzzle = {
  plants: [],
  particles: [],
  wateringCan: null,
  wateringTimer: 0,
  wateringTarget: null,
  wateredCount: 0,
  completed: false,
  opened: false,
  opening: 0,
  leftDoor: null,
  rightDoor: null,
};
const graveyardPuzzle = {
  graves: [],
  particles: [],
  hedgehogs: [],
  sunLights: [],
  sunBeams: [],
  wateringCan: null,
  wateringTimer: 0,
  wateringTarget: null,
  wateredCount: 0,
  completed: false,
  opened: false,
  opening: 0,
  lightingProgress: 0,
  leftGate: null,
  rightGate: null,
};
const sixthRoomFinale = {
  started: false,
  timer: 0,
  confettiTimer: 0,
  title: null,
  titleMaterial: null,
  sea: null,
  seagulls: [],
  bouquets: [],
  confetti: [],
};

buildLighting();
buildRooms();
buildRoomEntryInstructions();
buildSecondRoomPuzzle();
buildThirdRoomPuzzle();
buildFourthRoomPuzzle();
buildFifthRoomPuzzle();
if (GRAVEYARD_VARIANT) {
  buildGraveyardPuzzle();
}
buildSixthRoomFinale();
const portalGlow = createPortalGlow();
scene.add(portalGlow);

window.addEventListener("resize", resizeRenderer);
window.addEventListener("keydown", (event) => setKey(event, true));
window.addEventListener("keyup", (event) => setKey(event, false));
renderer.domElement.addEventListener("pointerdown", onScenePointerDown);
renderer.domElement.addEventListener("pointermove", onScenePointerMove);
renderer.domElement.addEventListener("pointerup", onScenePointerUp);
renderer.domElement.addEventListener("pointercancel", onScenePointerUp);
moveStick.addEventListener("pointerdown", onStickPointerDown);
moveStick.addEventListener("pointermove", onStickPointerMove);
moveStick.addEventListener("pointerup", resetStick);
moveStick.addEventListener("pointercancel", resetStick);
actionButton?.addEventListener("pointerdown", onActionButtonPointerDown);
actionButton?.addEventListener("pointerup", onActionButtonPointerUp);
actionButton?.addEventListener("pointercancel", onActionButtonPointerUp);
actionButton?.addEventListener("pointerleave", onActionButtonPointerUp);
modelButton.addEventListener("click", () => modelInput.click());
modelInput.addEventListener("change", onModelInputChange);
rotateModelButton.addEventListener("click", rotateDetailedCharacter);
resetModelButton.addEventListener("click", resetDetailedCharacter);
roomJumpTools?.addEventListener("click", onRoomJumpClick);
startButton?.addEventListener("click", startGame);

animate();

if (import.meta.env.DEV || URL_PARAMS.has("debug")) {
  const debugView = new URLSearchParams(window.location.search).get("view");
  if (debugView === "front") {
    cameraState.yaw = Math.PI;
    cameraState.pitch = 0;
  }

  const debugRoomNumber = Number(URL_PARAMS.get("room"));
  if (Number.isFinite(debugRoomNumber)) {
    jumpToRoom(debugRoomNumber);
  }

  if (URL_PARAMS.has("completeMelody")) {
    window.setTimeout(completeThirdRoomMelody, 600);
  }

  if (URL_PARAMS.has("completeBubbles")) {
    window.setTimeout(completeFourthRoomBubbles, 600);
  }

  if (URL_PARAMS.has("completePlants")) {
    window.setTimeout(completeFifthRoomPlants, 600);
  }

  if (URL_PARAMS.has("completeGraves") && GRAVEYARD_VARIANT) {
    window.setTimeout(completeGraveyardPuzzle, 600);
  }

  const autoWalkSeconds = Number(new URLSearchParams(window.location.search).get("autowalk"));
  if (Number.isFinite(autoWalkSeconds) && autoWalkSeconds > 0) {
    input.forward = true;
    window.setTimeout(() => {
      input.forward = false;
    }, Math.min(autoWalkSeconds, 12) * 1000);
  }

  window.__roomsDebug = {
    getState() {
      return {
        x: +player.position.x.toFixed(2),
        z: +player.position.z.toFixed(2),
        room: roomLabel.textContent,
        progress: distanceLabel.textContent,
        performanceMode: PERFORMANCE_MODE,
        pixelRatio: renderer.getPixelRatio(),
      };
    },
    getSecondRoomPuzzleState() {
      return {
        opened: secondRoomPuzzle.opened,
        opening: +secondRoomPuzzle.opening.toFixed(2),
        ball: secondRoomPuzzle.ball
          ? {
            x: +secondRoomPuzzle.ball.position.x.toFixed(2),
            z: +secondRoomPuzzle.ball.position.z.toFixed(2),
            speed: +secondRoomPuzzle.ballVelocity.length().toFixed(2),
          }
          : null,
      };
    },
    getThirdRoomPuzzleState() {
      return {
        currentStep: thirdRoomPuzzle.currentStep,
        completed: thirdRoomPuzzle.completed,
        opened: thirdRoomPuzzle.opened,
        opening: +thirdRoomPuzzle.opening.toFixed(2),
        activeTileIndex: thirdRoomPuzzle.activeTileIndex,
      };
    },
    getFourthRoomPuzzleState() {
      return {
        bubblesLeft: fourthRoomPuzzle.bubbles.filter((bubble) => !bubble.popped).length,
        poppedCount: fourthRoomPuzzle.poppedCount,
        completed: fourthRoomPuzzle.completed,
        opened: fourthRoomPuzzle.opened,
        opening: +fourthRoomPuzzle.opening.toFixed(2),
      };
    },
    getFifthRoomPuzzleState() {
      return {
        plantsLeft: fifthRoomPuzzle.plants.filter((plant) => !plant.watered).length,
        wateredCount: fifthRoomPuzzle.wateredCount,
        completed: fifthRoomPuzzle.completed,
        opened: fifthRoomPuzzle.opened,
        opening: +fifthRoomPuzzle.opening.toFixed(2),
      };
    },
    getGraveyardPuzzleState() {
      return {
        enabled: GRAVEYARD_VARIANT,
        gravesLeft: graveyardPuzzle.graves.filter((grave) => !grave.watered).length,
        wateredCount: graveyardPuzzle.wateredCount,
        completed: graveyardPuzzle.completed,
        opened: graveyardPuzzle.opened,
        opening: +graveyardPuzzle.opening.toFixed(2),
      };
    },
    kickFootball,
    openPhotoGate: openSecondRoomPhotoGate,
    openMelodyDoor: completeThirdRoomMelody,
    popBubble: popFourthRoomBubble,
    completeBubbles: completeFourthRoomBubbles,
    waterPlant: waterFifthRoomPlant,
    completePlants: completeFifthRoomPlants,
    waterGrave: waterGraveyardGrave,
    completeGraves: completeGraveyardPuzzle,
    getCharacterState() {
      const state = player.userData.detailedCharacter;
      return {
        detailed: !!state,
        sourceName: state?.sourceName || "",
        rotationDegrees: state?.rotationDegrees ?? 0,
        playerYaw: +THREE.MathUtils.radToDeg(player.rotation.y).toFixed(1),
        cameraYaw: +THREE.MathUtils.radToDeg(cameraState.yaw).toFixed(1),
        proceduralVisible: player.userData.proceduralChildren?.some((child) => child.visible) ?? true,
      };
    },
    async walkForward(seconds = 2.5) {
      input.forward = true;
      await new Promise((resolve) => window.setTimeout(resolve, seconds * 1000));
      input.forward = false;
      return this.getState();
    },
    goToRoom(roomNumber = 1) {
      jumpToRoom(roomNumber);
      return this.getState();
    },
    reset() {
      input.forward = false;
      input.backward = false;
      input.left = false;
      input.right = false;
      input.joystick.set(0, 0);
      player.position.set(0, 0, 0);
      player.rotation.set(0, 0, 0);
      updateHud();
      return this.getState();
    },
  };
}

function buildLighting() {
  const hemisphere = new THREE.HemisphereLight(0xbfeee5, 0x1d1713, PERFORMANCE_MODE ? 1.6 : 1.45);
  scene.add(hemisphere);

  const sun = new THREE.DirectionalLight(0xfff1be, PERFORMANCE_MODE ? 1.25 : 2.15);
  sun.position.set(-9, 18, 14);
  sun.castShadow = !PERFORMANCE_MODE;

  if (!PERFORMANCE_MODE) {
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 80;
    sun.shadow.camera.left = -32;
    sun.shadow.camera.right = 32;
    sun.shadow.camera.top = 32;
    sun.shadow.camera.bottom = -32;
  }

  scene.add(sun);
}

function buildRooms() {
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0x4c6663,
    roughness: 0.86,
    metalness: 0.02,
  });
  const trimMaterial = new THREE.MeshStandardMaterial({
    color: 0x7f886f,
    roughness: 0.76,
  });
  const caveMaterials = {
    rock: createCaveRockMaterial("#4d4d43", "#272b28"),
    darkRock: createCaveRockMaterial("#343831", "#171c1a"),
    floor: createCaveFloorMaterial(),
    looseStone: new THREE.MeshStandardMaterial({
      color: 0x68675b,
      roughness: 0.94,
    }),
    torchWood: new THREE.MeshStandardMaterial({
      color: 0x4b2d1d,
      roughness: 0.86,
    }),
    torchMetal: new THREE.MeshStandardMaterial({
      color: 0x2a2723,
      roughness: 0.52,
      metalness: 0.45,
    }),
    flameCore: new THREE.MeshBasicMaterial({
      color: 0xfff1a0,
      transparent: true,
      opacity: 0.9,
    }),
    flameOuter: new THREE.MeshBasicMaterial({
      color: 0xff7a24,
      transparent: true,
      opacity: 0.68,
    }),
    sign: createBirthdaySignMaterial(),
    signBack: new THREE.MeshStandardMaterial({
      color: 0x2b1550,
      emissive: 0x8e28d8,
      emissiveIntensity: 0.55,
      roughness: 0.5,
      metalness: 0.04,
    }),
    signFrame: new THREE.MeshStandardMaterial({
      color: 0xffd665,
      emissive: 0xffa32b,
      emissiveIntensity: 0.62,
      roughness: 0.36,
      metalness: 0.16,
    }),
    signCord: new THREE.MeshStandardMaterial({
      color: 0x16100f,
      roughness: 0.72,
      metalness: 0.18,
    }),
  };
  const floorMaterials = [
    createFloorMaterial("#667257", "#2f473e"),
    createFloorMaterial("#6f7057", "#334c50"),
    createFloorMaterial("#546f69", "#473b46"),
    createFloorMaterial("#74695d", "#315c57"),
    createFloorMaterial("#5f6f52", "#413f5d"),
    createFloorMaterial("#6d6558", "#2f5651"),
  ];
  const secondRoomFloorMaterial = createSoccerStadiumFloorMaterial();
  const thirdRoomFloorMaterial = createThirdRoomFloorMaterial();
  const fourthRoomFloorMaterial = createDollhouseFloorMaterial();
  const fifthRoomFloorMaterial = createJungleFloorMaterial();
  const graveyardFloorMaterial = createGraveyardFloorMaterial();
  const sixthRoomFloorMaterial = createBeachFloorMaterial();
  const corridorMaterials = createCorridorMaterials();

  for (let i = 0; i < ROOM_COUNT; i += 1) {
    const cameraFadeStartIndex = cameraFadeMeshes.length;
    const z = getRoomCenterZ(i);
    const room = new THREE.Group();
    room.position.z = z;
    const isCaveEntrance = i === 0;
    const isSecondRoom = i === SECOND_ROOM_INDEX;
    const isThirdRoom = i === THIRD_ROOM_INDEX;
    const isFourthRoom = i === FOURTH_ROOM_INDEX;
    const isFifthRoom = i === FIFTH_ROOM_INDEX;
    const isGraveyardRoom = GRAVEYARD_VARIANT && i === GRAVEYARD_ROOM_INDEX;
    const isSixthRoom = i === SIXTH_ROOM_INDEX;

    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(ROOM_WIDTH, 0.32, ROOM_LENGTH),
      isCaveEntrance
        ? caveMaterials.floor
        : (isSecondRoom
          ? secondRoomFloorMaterial
          : (isThirdRoom
            ? thirdRoomFloorMaterial
              : (isFourthRoom
                ? fourthRoomFloorMaterial
                : (isFifthRoom
                  ? fifthRoomFloorMaterial
                  : (isGraveyardRoom
                    ? graveyardFloorMaterial
                    : (isSixthRoom ? sixthRoomFloorMaterial : floorMaterials[i % floorMaterials.length])))))),
    );
    floor.position.y = -0.18;
    floor.receiveShadow = true;
    room.add(floor);

    if (isCaveEntrance) {
      buildCaveEntranceRoom(room, caveMaterials);
    } else if (isSixthRoom) {
      addSixthRoomBeachExit(room, wallMaterial, trimMaterial);
      addSixthRoomSunsetLighting(z);
    } else {
      addSideWalls(room, wallMaterial);
      if (i > 0) {
        addBoundaryWall(room, ROOM_LENGTH / 2, false, wallMaterial, trimMaterial);
      }
      addBoundaryWall(room, -ROOM_LENGTH / 2, i === ROOM_COUNT - 1, wallMaterial, trimMaterial);
      addCeilingBeams(room, trimMaterial);

      if (isThirdRoom) {
        addThirdRoomPhotoWalls(room);
        addThirdRoomRomanticDecor(room);
      } else if (isFourthRoom) {
        addFourthRoomDollhouseDecor(room);
      } else if (isFifthRoom) {
        addFifthRoomJungleDecor(room);
      } else if (isGraveyardRoom) {
        addGraveyardRoomDecor(room);
      } else {
        if (i === SECOND_ROOM_INDEX) {
          addSecondRoomBirthdayDecor(room);
        } else {
          addFloorRunes(room, i);
          addRoomObjects(room, i);
        }
      }

      if (isThirdRoom) {
        addThirdRoomRomanticLighting(z);
      } else if (isFourthRoom) {
        addFourthRoomDollhouseLighting(z);
      } else if (isFifthRoom) {
        addFifthRoomJungleLighting(z);
      } else if (isGraveyardRoom) {
        addGraveyardRoomLighting(z);
      } else {
        const light = new THREE.PointLight(
          i % 2 === 0 ? 0x83ffd7 : 0xffd38a,
          PERFORMANCE_MODE ? 2.4 : 4.2,
          PERFORMANCE_MODE ? 13 : 20,
          2,
        );
        light.position.set(i % 2 === 0 ? -5.4 : 5.4, 3.2, z - 2);
        light.castShadow = !PERFORMANCE_MODE;
        roomLights.push(light);
        scene.add(light);
      }
    }

    if (isGraveyardRoom) {
      cameraFadeMeshes.slice(cameraFadeStartIndex).forEach((mesh) => {
        mesh.userData.graveyardCameraFade = true;
      });
    }

    const sparkles = createSparkles(z, i);
    sparkleSystems.push(sparkles);
    scene.add(sparkles.points);

    scene.add(room);
  }

  for (let i = 0; i < ROOM_COUNT - 1; i += 1) {
    addRoomCorridor(i, corridorMaterials);
    boundaryZ.push(getRoomBackZ(i), getRoomFrontZ(i + 1));
  }
}

function buildRoomEntryInstructions() {
  Object.entries(ROOM_ENTRY_INSTRUCTIONS).forEach(([roomIndexText, copy]) => {
    const roomIndex = Number(roomIndexText);
    const entry = createRoomEntryInstruction(copy.title, copy.hint);
    entry.group.position.set(0, entry.baseY, getRoomCenterZ(roomIndex));
    entry.group.visible = false;
    entry.group.renderOrder = 12;
    roomEntryInstructionGroups.set(roomIndex, entry);
    scene.add(entry.group);
  });
}

function createRoomEntryInstruction(title, hint) {
  const texture = createRoomEntryInstructionTexture(title, hint);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0,
    depthTest: false,
    depthWrite: false,
    side: THREE.FrontSide,
    toneMapped: false,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(6.15, 1.92), material);
  mesh.renderOrder = 24;
  const group = new THREE.Group();
  group.add(mesh);

  return {
    group,
    material,
    timer: 0,
    baseY: 4.2,
  };
}

function createRoomEntryInstructionTexture(title, hint) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 320;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const aura = ctx.createRadialGradient(512, 144, 32, 512, 156, 470);
  aura.addColorStop(0, "rgba(239, 218, 203, 0.18)");
  aura.addColorStop(0.42, "rgba(184, 156, 174, 0.1)");
  aura.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";

  setFittedCanvasFont(
    ctx,
    title,
    980,
    126,
    66,
    (size) => `600 ${size}px "Snell Roundhand", "Apple Chancery", "Brush Script MT", "Segoe Script", "Bradley Hand", cursive`,
  );
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.lineWidth = 11;
  ctx.strokeStyle = "rgba(0, 0, 0, 0.82)";
  ctx.strokeText(title, 512, 128);
  const titleGradient = ctx.createLinearGradient(0, 78, 0, 178);
  titleGradient.addColorStop(0, "#f2dfd2");
  titleGradient.addColorStop(0.52, "#d8b9c4");
  titleGradient.addColorStop(1, "#c5b8ca");
  ctx.fillStyle = titleGradient;
  ctx.fillText(title, 512, 128);

  ctx.shadowColor = "rgba(106, 83, 94, 0.24)";
  ctx.shadowBlur = 9;
  ctx.strokeStyle = "rgba(191, 160, 158, 0.34)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(324, 184);
  ctx.bezierCurveTo(404, 204, 620, 204, 700, 184);
  ctx.stroke();

  setFittedCanvasFont(
    ctx,
    hint,
    900,
    46,
    30,
    (size) => `500 ${size}px "Helvetica Neue", Arial, sans-serif`,
  );
  ctx.shadowColor = "rgba(0, 0, 0, 0.46)";
  ctx.shadowBlur = 8;
  ctx.lineWidth = 8;
  ctx.strokeStyle = "rgba(0, 0, 0, 0.74)";
  ctx.strokeText(hint, 512, 236);
  ctx.fillStyle = "rgba(239, 232, 220, 0.88)";
  ctx.fillText(hint, 512, 236);

  for (let i = 0; i < 18; i += 1) {
    const angle = i * 2.399;
    const radius = 250 + (i % 4) * 42;
    const x = 512 + Math.cos(angle) * radius;
    const y = 160 + Math.sin(angle) * (radius * 0.28);
    const starSize = 2.5 + (i % 3) * 1.6;
    ctx.fillStyle = i % 2 === 0 ? "rgba(238, 216, 184, 0.45)" : "rgba(205, 174, 193, 0.34)";
    ctx.beginPath();
    ctx.arc(x, y, starSize, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = PERFORMANCE_MODE ? 1 : 4;
  texture.needsUpdate = true;
  return texture;
}

function setFittedCanvasFont(ctx, text, maxWidth, maxSize, minSize, fontFactory) {
  for (let size = maxSize; size >= minSize; size -= 2) {
    ctx.font = fontFactory(size);
    if (ctx.measureText(text).width <= maxWidth) {
      return size;
    }
  }

  ctx.font = fontFactory(minSize);
  return minSize;
}

function createCorridorMaterials() {
  return {
    floor: new THREE.MeshStandardMaterial({
      color: 0x5a6f4e,
      roughness: 0.78,
      metalness: 0.02,
      emissive: 0x132515,
      emissiveIntensity: 0.18,
    }),
    wall: new THREE.MeshStandardMaterial({
      color: 0x273f34,
      roughness: 0.86,
      metalness: 0.02,
      emissive: 0x0a1c18,
      emissiveIntensity: 0.22,
    }),
    trim: new THREE.MeshStandardMaterial({
      color: 0xd8c778,
      roughness: 0.38,
      metalness: 0.12,
      emissive: 0x5b4d1e,
      emissiveIntensity: 0.22,
    }),
    glass: new THREE.MeshBasicMaterial({
      color: 0x9fffd1,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
      side: THREE.DoubleSide,
      toneMapped: false,
    }),
  };
}

function addRoomCorridor(index, materials) {
  const startZ = getRoomBackZ(index);
  const endZ = getRoomFrontZ(index + 1);
  const centerZ = (startZ + endZ) / 2;
  const length = Math.abs(startZ - endZ);
  const group = new THREE.Group();
  group.position.z = centerZ;

  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(CORRIDOR_HALF_WIDTH * 2 + 0.8, 0.22, length + 0.35),
    materials.floor,
  );
  floor.position.y = -0.12;
  floor.receiveShadow = true;
  group.add(floor);

  for (const side of [-1, 1]) {
    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, WALL_HEIGHT - 0.35, length + 0.4),
      materials.wall,
    );
    wall.position.set(side * (CORRIDOR_HALF_WIDTH + 0.36), WALL_HEIGHT / 2 - 0.08, 0);
    wall.castShadow = true;
    wall.receiveShadow = true;
    markCameraFadeMesh(wall, 0.1);
    group.add(wall);

    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, length + 0.44), materials.trim);
    rail.position.set(side * (CORRIDOR_HALF_WIDTH + 0.12), 1.25, 0);
    group.add(rail);
  }

  const ceiling = new THREE.Mesh(
    new THREE.BoxGeometry(CORRIDOR_HALF_WIDTH * 2 + 1.1, 0.32, length + 0.45),
    materials.wall,
  );
  ceiling.position.y = WALL_HEIGHT - 0.18;
  markCameraFadeMesh(ceiling, 0.08);
  group.add(ceiling);

  const runner = new THREE.Mesh(
    new THREE.PlaneGeometry(CORRIDOR_HALF_WIDTH * 1.35, length - 0.55),
    materials.glass,
  );
  runner.rotation.x = -Math.PI / 2;
  runner.position.y = 0.018;
  group.add(runner);

  for (const localZ of [length / 2, -length / 2]) {
    const arch = new THREE.Mesh(
      new THREE.BoxGeometry(CORRIDOR_HALF_WIDTH * 2 + 1.2, 0.16, 0.28),
      materials.trim,
    );
    arch.position.set(0, WALL_HEIGHT - 0.62, localZ);
    group.add(arch);

    for (const side of [-1, 1]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.18, WALL_HEIGHT - 1.0, 0.24), materials.trim);
      post.position.set(side * (CORRIDOR_HALF_WIDTH + 0.04), (WALL_HEIGHT - 1.0) / 2, localZ);
      group.add(post);
    }
  }

  const light = new THREE.PointLight(index % 2 === 0 ? 0x98ffd1 : 0xffdf91, PERFORMANCE_MODE ? 0.75 : 1.35, 7.5, 2);
  light.position.set(0, WALL_HEIGHT - 1.25, centerZ);
  light.userData.baseIntensity = PERFORMANCE_MODE ? 0.62 : 1.05;
  light.userData.flicker = 0.18;
  roomLights.push(light);
  scene.add(light);

  scene.add(group);
}

function buildCaveEntranceRoom(room, materials) {
  addCaveSideWalls(room, materials);
  addCaveBoundaryWall(room, ROOM_LENGTH / 2, true, materials);
  addCaveBoundaryWall(room, -ROOM_LENGTH / 2, false, materials);
  addCaveCeiling(room, materials);
  addCaveFloorDetails(room, materials);
  addCaveTorches(room, materials);
}

function addCaveSideWalls(room, materials) {
  const wallGeometry = new THREE.BoxGeometry(WALL_THICKNESS * 1.9, WALL_HEIGHT + 0.7, ROOM_LENGTH + 0.9);

  for (const side of [-1, 1]) {
    const wall = new THREE.Mesh(wallGeometry, materials.rock);
    wall.position.set(side * (ROOM_WIDTH / 2 + WALL_THICKNESS * 0.42), WALL_HEIGHT / 2, 0);
    wall.castShadow = true;
    wall.receiveShadow = true;
    markCameraFadeMesh(wall, 0.12);
    room.add(wall);

    addRockFaceScatter(room, materials.darkRock, {
      count: 24,
      side,
      zMin: -ROOM_LENGTH / 2 + 0.9,
      zMax: ROOM_LENGTH / 2 - 0.9,
    });
  }
}

function addCaveBoundaryWall(room, localZ, closed, materials) {
  const z = localZ;
  const wallDepth = WALL_THICKNESS * 1.7;
  const segmentWidth = (ROOM_WIDTH - DOOR_HALF_WIDTH * 2) / 2;

  if (closed) {
    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(ROOM_WIDTH + WALL_THICKNESS * 2.2, WALL_HEIGHT + 0.7, wallDepth),
      materials.darkRock,
    );
    wall.position.set(0, WALL_HEIGHT / 2, z);
    wall.castShadow = true;
    wall.receiveShadow = true;
    markCameraFadeMesh(wall, 0.12);
    room.add(wall);

    addRockFaceScatter(room, materials.rock, {
      count: 18,
      z,
      xMin: -ROOM_WIDTH / 2 + 0.8,
      xMax: ROOM_WIDTH / 2 - 0.8,
    });
    return;
  }

  for (const side of [-1, 1]) {
    const segment = new THREE.Mesh(
      new THREE.BoxGeometry(segmentWidth + 0.8, WALL_HEIGHT + 0.7, wallDepth),
      materials.darkRock,
    );
    segment.position.set(side * (DOOR_HALF_WIDTH + segmentWidth / 2 + 0.12), WALL_HEIGHT / 2, z);
    segment.castShadow = true;
    segment.receiveShadow = true;
    markCameraFadeMesh(segment, 0.12);
    room.add(segment);
  }

  const lintel = new THREE.Mesh(
    new THREE.BoxGeometry(DOOR_HALF_WIDTH * 2.35, 1.25, wallDepth * 1.15),
    materials.rock,
  );
  lintel.position.set(0, WALL_HEIGHT - 0.2, z);
  lintel.castShadow = true;
  lintel.receiveShadow = true;
  markCameraFadeMesh(lintel, 0.12);
  room.add(lintel);

  addBirthdayArchLights(room, z, materials);
  room.add(createBirthdayGallerySign(z + 1.28, materials));
}

function addBirthdayArchLights(room, z, materials) {
  const points = [];
  const radius = DOOR_HALF_WIDTH + 0.42;
  const bulbCount = 11;

  for (let i = 0; i < bulbCount; i += 1) {
    const angle = Math.PI * (0.08 + i * 0.084);
    const x = Math.cos(angle) * radius;
    const y = 2.48 + Math.sin(angle) * 1.9;
    points.push(new THREE.Vector3(x, y, z + 1.18));

    const color = PARTY_LIGHT_COLORS[i % PARTY_LIGHT_COLORS.length];
    const lamp = createPartyLamp(color, i);
    lamp.position.set(x, y, z + 1.28);
    lamp.rotation.set(Math.random() * 0.12, Math.random() * Math.PI, Math.random() * 0.12);
    room.add(lamp);
  }

  const cord = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), PERFORMANCE_MODE ? 24 : 48, 0.025, PERFORMANCE_MODE ? 4 : 6, false),
    materials.signCord,
  );
  cord.castShadow = true;
  room.add(cord);
}

function createPartyLamp(color, index) {
  const group = new THREE.Group();
  const bulbColor = new THREE.Color(color);
  const bulbMaterial = new THREE.MeshBasicMaterial({
    color,
    toneMapped: false,
  });
  const glowMaterial = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.3,
    depthWrite: false,
    toneMapped: false,
  });
  const capMaterial = new THREE.MeshStandardMaterial({
    color: 0x181412,
    roughness: 0.58,
    metalness: 0.35,
  });

  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(0.74, PERFORMANCE_MODE ? 12 : 24, PERFORMANCE_MODE ? 8 : 16),
    glowMaterial,
  );
  group.add(glow);

  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.36, PERFORMANCE_MODE ? 12 : 28, PERFORMANCE_MODE ? 8 : 18),
    bulbMaterial,
  );
  bulb.castShadow = false;
  bulb.receiveShadow = false;
  group.add(bulb);

  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.17, 0.16, 12), capMaterial);
  cap.position.y = -0.28;
  cap.rotation.x = Math.PI / 2;
  cap.castShadow = true;
  group.add(cap);

  if (!PERFORMANCE_MODE) {
    const light = new THREE.PointLight(bulbColor, 2.6, 6.2, 2.1);
    light.userData.baseIntensity = 2.15;
    light.userData.flicker = 0.7;
    light.userData.phase = index * 1.1;
    roomLights.push(light);
    group.add(light);
  }

  return group;
}

function createBirthdayGallerySign(z, materials) {
  const group = new THREE.Group();
  group.position.set(0, 4.78, z);

  const back = new THREE.Mesh(new THREE.BoxGeometry(7.75, 0.96, 0.12), materials.signBack);
  back.castShadow = true;
  back.receiveShadow = true;
  group.add(back);

  const face = new THREE.Mesh(new THREE.PlaneGeometry(7.25, 0.72), materials.sign);
  face.position.z = 0.071;
  group.add(face);

  const frameGeometry = new THREE.BoxGeometry(7.95, 0.09, 0.15);
  for (const y of [-0.55, 0.55]) {
    const frame = new THREE.Mesh(frameGeometry, materials.signFrame);
    frame.position.y = y;
    frame.castShadow = true;
    group.add(frame);
  }

  const sideFrameGeometry = new THREE.BoxGeometry(0.09, 1.05, 0.15);
  for (const x of [-3.95, 3.95]) {
    const frame = new THREE.Mesh(sideFrameGeometry, materials.signFrame);
    frame.position.x = x;
    frame.castShadow = true;
    group.add(frame);
  }

  for (let i = 0; i < 9; i += 1) {
    const x = THREE.MathUtils.mapLinear(i, 0, 8, -3.45, 3.45);
    const color = PARTY_LIGHT_COLORS[(i + 2) % PARTY_LIGHT_COLORS.length];
    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.085, PERFORMANCE_MODE ? 8 : 14, PERFORMANCE_MODE ? 6 : 10),
      new THREE.MeshBasicMaterial({
        color,
        toneMapped: false,
      }),
    );
    bulb.position.set(x, -0.51, 0.1);
    group.add(bulb);
  }

  if (!PERFORMANCE_MODE) {
    const light = new THREE.PointLight(0xff7bd5, 2.2, 8, 2);
    light.position.set(0, 0, 0.9);
    light.userData.baseIntensity = 1.8;
    light.userData.flicker = 0.38;
    light.userData.phase = 3.4;
    roomLights.push(light);
    group.add(light);
  }

  return group;
}

function addRockFaceScatter(room, material, options) {
  const count = PERFORMANCE_MODE ? Math.max(6, Math.round(options.count * 0.45)) : options.count;

  for (let i = 0; i < count; i += 1) {
    const rock = createCaveRockMesh(material);
    const x = options.side
      ? options.side * (ROOM_WIDTH / 2 - THREE.MathUtils.randFloat(0.05, 0.42))
      : THREE.MathUtils.randFloat(options.xMin, options.xMax);
    const z = options.side
      ? THREE.MathUtils.randFloat(options.zMin, options.zMax)
      : options.z + THREE.MathUtils.randFloatSpread(0.24);

    rock.position.set(x, THREE.MathUtils.randFloat(0.55, WALL_HEIGHT - 0.45), z);
    rock.scale.set(
      THREE.MathUtils.randFloat(0.18, 0.72),
      THREE.MathUtils.randFloat(0.16, 0.58),
      THREE.MathUtils.randFloat(0.12, 0.45),
    );
    rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    room.add(rock);
  }
}

function addCaveCeiling(room, materials) {
  const ceiling = new THREE.Mesh(
    new THREE.BoxGeometry(ROOM_WIDTH + 1.5, 0.9, ROOM_LENGTH + 1.2),
    materials.darkRock,
  );
  ceiling.position.set(0, WALL_HEIGHT + 0.12, 0);
  ceiling.castShadow = true;
  ceiling.receiveShadow = true;
  markCameraFadeMesh(ceiling, 0.1);
  room.add(ceiling);

  const stalactiteCount = PERFORMANCE_MODE ? 12 : 28;

  for (let i = 0; i < stalactiteCount; i += 1) {
    const length = THREE.MathUtils.randFloat(0.35, 1.25);
    let x = THREE.MathUtils.randFloatSpread(ROOM_WIDTH - 2.2);
    let z = THREE.MathUtils.randFloatSpread(ROOM_LENGTH - 2.2);

    for (let attempt = 0; attempt < 8 && Math.abs(x) < 4.6 && z < -ROOM_LENGTH / 2 + 4.4; attempt += 1) {
      x = THREE.MathUtils.randFloatSpread(ROOM_WIDTH - 2.2);
      z = THREE.MathUtils.randFloatSpread(ROOM_LENGTH - 2.2);
    }

    const stalactite = new THREE.Mesh(
      new THREE.ConeGeometry(THREE.MathUtils.randFloat(0.12, 0.32), length, 7),
      i % 3 === 0 ? materials.rock : materials.darkRock,
    );
    stalactite.position.set(
      x,
      WALL_HEIGHT - length / 2 + 0.1,
      z,
    );
    stalactite.rotation.set(Math.PI, Math.random() * 0.5, Math.random() * 0.2);
    stalactite.castShadow = true;
    room.add(stalactite);
  }
}

function addCaveFloorDetails(room, materials) {
  const stoneGeometry = new THREE.CylinderGeometry(1, 1, 0.08, 8);
  const stoneCount = PERFORMANCE_MODE ? 16 : 34;

  for (let i = 0; i < stoneCount; i += 1) {
    const stone = new THREE.Mesh(stoneGeometry, materials.looseStone);
    stone.position.set(
      THREE.MathUtils.randFloatSpread(ROOM_WIDTH - 2.2),
      0.005,
      THREE.MathUtils.randFloatSpread(ROOM_LENGTH - 2),
    );
    stone.scale.set(
      THREE.MathUtils.randFloat(0.14, 0.62),
      1,
      THREE.MathUtils.randFloat(0.1, 0.42),
    );
    stone.rotation.y = Math.random() * Math.PI;
    stone.castShadow = true;
    stone.receiveShadow = true;
    room.add(stone);
  }

  for (const [x, z, scale] of [
    [-7.2, 8.2, 1.1],
    [7.1, 7.6, 0.9],
    [-7.4, -8.6, 1.0],
    [7.2, -8.1, 1.15],
  ]) {
    const boulder = createCaveRockMesh(materials.rock);
    boulder.position.set(x, 0.34, z);
    boulder.scale.set(scale, scale * 0.58, scale * 0.82);
    boulder.rotation.set(0.2, Math.random() * Math.PI, 0.1);
    room.add(boulder);
  }
}

function addCaveTorches(room, materials) {
  const torchPositions = [
    [-1, -7.4],
    [1, -7.4],
    [-1, 4.8],
    [1, 4.8],
  ];

  torchPositions.forEach(([side, z], index) => {
    const torch = createWallTorch(side, z, materials, index);
    room.add(torch);
  });
}

function createWallTorch(side, z, materials, index) {
  const group = new THREE.Group();
  group.position.set(side * (ROOM_WIDTH / 2 - 0.18), 2.15, z);

  const inward = -side;
  const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.08, 0.09), materials.torchMetal);
  bracket.position.x = inward * 0.2;
  bracket.castShadow = true;
  group.add(bracket);

  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.075, 0.72, 8), materials.torchWood);
  handle.position.set(inward * 0.4, -0.04, 0);
  handle.rotation.z = side * 0.28;
  handle.castShadow = true;
  group.add(handle);

  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.09, 0.16, 10), materials.torchMetal);
  cup.position.set(inward * 0.48, 0.36, 0);
  cup.castShadow = true;
  group.add(cup);

  const flameOuter = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.52, 10), materials.flameOuter);
  flameOuter.position.set(inward * 0.48, 0.72, 0);
  flameOuter.rotation.y = Math.random() * Math.PI;
  group.add(flameOuter);

  const flameCore = new THREE.Mesh(new THREE.ConeGeometry(0.095, 0.38, 10), materials.flameCore);
  flameCore.position.set(inward * 0.48, 0.72, 0);
  group.add(flameCore);

  const light = new THREE.PointLight(
    0xff9a46,
    PERFORMANCE_MODE ? 3.4 : 5.1,
    PERFORMANCE_MODE ? 9 : 13,
    1.65,
  );
  light.position.set(inward * 0.5, 0.72, 0);
  light.castShadow = !PERFORMANCE_MODE;
  light.userData.baseIntensity = PERFORMANCE_MODE ? 3.1 : 4.65;
  light.userData.flicker = PERFORMANCE_MODE ? 0.55 : 0.95;
  light.userData.phase = index * 1.7;
  roomLights.push(light);
  group.add(light);

  return group;
}

function createCaveRockMesh(material) {
  const rock = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), material);
  rock.castShadow = true;
  rock.receiveShadow = true;
  return rock;
}

function markCameraFadeMesh(mesh, fadedOpacity = 0.16) {
  if (!mesh.material?.clone) {
    return mesh;
  }

  const material = mesh.material.clone();
  const baseOpacity = Number.isFinite(material.opacity) ? material.opacity : 1;
  const baseDepthWrite = material.depthWrite;
  material.transparent = true;
  material.opacity = baseOpacity;
  material.depthWrite = baseDepthWrite;
  mesh.material = material;
  mesh.userData.cameraFadeBaseOpacity = baseOpacity;
  mesh.userData.cameraFadeBaseDepthWrite = baseDepthWrite;
  mesh.userData.cameraFadeOpacity = fadedOpacity;
  cameraFadeMeshes.push(mesh);
  return mesh;
}

function createBirthdaySignMaterial() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#ff4fd8");
  gradient.addColorStop(0.45, "#7c5cff");
  gradient.addColorStop(1, "#20e3ff");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255, 246, 156, 0.24)";
  for (let i = 0; i < 38; i += 1) {
    const radius = THREE.MathUtils.randFloat(5, 18);
    ctx.beginPath();
    ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = "rgba(255, 239, 122, 0.92)";
  ctx.lineWidth = 16;
  ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);

  ctx.font = "bold 82px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0, 0, 0, 0.78)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;
  ctx.lineWidth = 10;
  ctx.strokeStyle = "#32124d";
  ctx.strokeText(BIRTHDAY_GALLERY_TITLE, canvas.width / 2, canvas.height / 2 + 4);
  ctx.fillStyle = "#fff6a8";
  ctx.fillText(BIRTHDAY_GALLERY_TITLE, canvas.width / 2, canvas.height / 2 + 4);

  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
  ctx.fillRect(42, 40, canvas.width - 84, 9);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  return new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
}

function addSideWalls(room, material) {
  const wallGeometry = new THREE.BoxGeometry(WALL_THICKNESS, WALL_HEIGHT, ROOM_LENGTH + WALL_THICKNESS);

  const left = new THREE.Mesh(wallGeometry, material);
  left.position.set(-ROOM_WIDTH / 2 - WALL_THICKNESS / 2, WALL_HEIGHT / 2 - 0.1, 0);
  left.castShadow = true;
  left.receiveShadow = true;
  markCameraFadeMesh(left, 0.14);
  room.add(left);

  const right = left.clone();
  right.position.x = ROOM_WIDTH / 2 + WALL_THICKNESS / 2;
  markCameraFadeMesh(right, 0.14);
  room.add(right);
}

function addBoundaryWall(room, localZ, closed, wallMaterial, trimMaterial) {
  const segmentWidth = (ROOM_WIDTH - DOOR_HALF_WIDTH * 2) / 2;
  const segmentHeight = WALL_HEIGHT;
  const z = localZ;

  if (closed) {
    const fullWall = new THREE.Mesh(
      new THREE.BoxGeometry(ROOM_WIDTH + WALL_THICKNESS * 2, WALL_HEIGHT, WALL_THICKNESS),
      wallMaterial,
    );
    fullWall.position.set(0, WALL_HEIGHT / 2 - 0.1, z);
    fullWall.castShadow = true;
    fullWall.receiveShadow = true;
    markCameraFadeMesh(fullWall, 0.14);
    room.add(fullWall);
    return;
  }

  const leftSegment = new THREE.Mesh(
    new THREE.BoxGeometry(segmentWidth, segmentHeight, WALL_THICKNESS),
    wallMaterial,
  );
  leftSegment.position.set(
    -(DOOR_HALF_WIDTH + segmentWidth / 2),
    WALL_HEIGHT / 2 - 0.1,
    z,
  );
  leftSegment.castShadow = true;
  leftSegment.receiveShadow = true;
  markCameraFadeMesh(leftSegment, 0.14);
  room.add(leftSegment);

  const rightSegment = leftSegment.clone();
  rightSegment.position.x = DOOR_HALF_WIDTH + segmentWidth / 2;
  markCameraFadeMesh(rightSegment, 0.14);
  room.add(rightSegment);

  const lintel = new THREE.Mesh(
    new THREE.BoxGeometry(DOOR_HALF_WIDTH * 2.3, 0.85, WALL_THICKNESS * 1.3),
    trimMaterial,
  );
  lintel.position.set(0, WALL_HEIGHT - 0.35, z);
  lintel.castShadow = true;
  markCameraFadeMesh(lintel, 0.14);
  room.add(lintel);

  const columnGeometry = new THREE.CylinderGeometry(0.34, 0.42, WALL_HEIGHT - 0.65, 12);
  const leftColumn = new THREE.Mesh(columnGeometry, trimMaterial);
  leftColumn.position.set(-DOOR_HALF_WIDTH - 0.32, (WALL_HEIGHT - 0.65) / 2 - 0.1, z);
  leftColumn.castShadow = true;
  leftColumn.receiveShadow = true;
  room.add(leftColumn);

  const rightColumn = leftColumn.clone();
  rightColumn.position.x = DOOR_HALF_WIDTH + 0.32;
  markCameraFadeMesh(leftColumn, 0.12);
  markCameraFadeMesh(rightColumn, 0.12);
  room.add(rightColumn);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(DOOR_HALF_WIDTH + 0.16, 0.055, 8, 48, Math.PI),
    new THREE.MeshStandardMaterial({
      color: 0xcbe6bd,
      emissive: 0x456f5e,
      emissiveIntensity: 0.9,
      roughness: 0.55,
    }),
  );
  ring.position.set(0, 2.2, z + (localZ < 0 ? -0.36 : 0.36));
  ring.rotation.set(Math.PI / 2, 0, Math.PI);
  room.add(ring);
}

function addThirdRoomPhotoWalls(room) {
  const sideMaterial = createThirdRoomPhotoWallMaterial(4, 1);
  const endMaterial = createThirdRoomPhotoWallMaterial(1.05, 1);
  const doorTopMaterial = createThirdRoomPhotoWallMaterial(1.2, 0.45);
  const wallY = WALL_HEIGHT / 2 - 0.1;
  const innerX = ROOM_WIDTH / 2 - 0.025;
  const innerZ = ROOM_LENGTH / 2 - WALL_THICKNESS * 0.5 - 0.03;

  const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_LENGTH, WALL_HEIGHT), sideMaterial);
  leftWall.position.set(-innerX, wallY, 0);
  leftWall.rotation.y = Math.PI / 2;
  markCameraFadeMesh(leftWall, 0.06);
  room.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_LENGTH, WALL_HEIGHT), sideMaterial);
  rightWall.position.set(innerX, wallY, 0);
  rightWall.rotation.y = -Math.PI / 2;
  markCameraFadeMesh(rightWall, 0.06);
  room.add(rightWall);

  const segmentWidth = (ROOM_WIDTH - DOOR_HALF_WIDTH * 2) / 2;
  const photoSegments = [
    { x: -(DOOR_HALF_WIDTH + segmentWidth / 2), z: innerZ, rotationY: Math.PI },
    { x: DOOR_HALF_WIDTH + segmentWidth / 2, z: innerZ, rotationY: Math.PI },
    { x: -(DOOR_HALF_WIDTH + segmentWidth / 2), z: -innerZ, rotationY: 0 },
    { x: DOOR_HALF_WIDTH + segmentWidth / 2, z: -innerZ, rotationY: 0 },
  ];

  photoSegments.forEach((segment) => {
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(segmentWidth, WALL_HEIGHT), endMaterial);
    panel.position.set(segment.x, wallY, segment.z);
    panel.rotation.y = segment.rotationY;
    markCameraFadeMesh(panel, 0.06);
    room.add(panel);
  });

  for (const z of [innerZ, -innerZ]) {
    const topPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(DOOR_HALF_WIDTH * 2.1, 1.15),
      doorTopMaterial,
    );
    topPanel.position.set(0, WALL_HEIGHT - 0.68, z);
    topPanel.rotation.y = z > 0 ? Math.PI : 0;
    markCameraFadeMesh(topPanel, 0.06);
    room.add(topPanel);
  }
}

function createThirdRoomPhotoWallMaterial(repeatX, repeatY) {
  const material = new THREE.MeshStandardMaterial({
    color: 0xffd7d1,
    roughness: 0.72,
    metalness: 0,
    emissive: 0x2b141f,
    emissiveIntensity: 0.2,
    side: THREE.FrontSide,
  });

  const texture = loader.load(THIRD_ROOM_WALL_IMAGE_URL);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.anisotropy = PERFORMANCE_MODE ? 1 : 4;
  material.map = texture;

  return material;
}

function addFourthRoomDollhouseDecor(room) {
  addFourthRoomWallpaper(room);
  addRoom4PhotoGallery(room);
  addFourthRoomCeilingDecor(room);
  addDollhouseFurniture(room);
  addFourthRoomCandyFloor(room);
}

function addFourthRoomWallpaper(room) {
  const sideMaterial = createDollhouseWallpaperMaterial("#ffd2ec", "#ff7ebf", "#fff0f9");
  const endMaterial = createDollhouseWallpaperMaterial("#ffc2e2", "#ff8bc8", "#fff4fb");
  const wallY = WALL_HEIGHT / 2 - 0.1;
  const innerX = ROOM_WIDTH / 2 - 0.024;
  const innerZ = ROOM_LENGTH / 2 - WALL_THICKNESS * 0.5 - 0.032;
  const sideGeometry = new THREE.PlaneGeometry(ROOM_LENGTH, WALL_HEIGHT);

  const left = new THREE.Mesh(sideGeometry, sideMaterial);
  left.position.set(-innerX, wallY, 0);
  left.rotation.y = Math.PI / 2;
  markCameraFadeMesh(left, 0.08);
  room.add(left);

  const right = new THREE.Mesh(sideGeometry, sideMaterial.clone());
  right.position.set(innerX, wallY, 0);
  right.rotation.y = -Math.PI / 2;
  markCameraFadeMesh(right, 0.08);
  room.add(right);

  const segmentWidth = (ROOM_WIDTH - DOOR_HALF_WIDTH * 2) / 2;
  const endSegments = [
    { x: -(DOOR_HALF_WIDTH + segmentWidth / 2), z: innerZ, rotationY: Math.PI },
    { x: DOOR_HALF_WIDTH + segmentWidth / 2, z: innerZ, rotationY: Math.PI },
    { x: -(DOOR_HALF_WIDTH + segmentWidth / 2), z: -innerZ, rotationY: 0 },
    { x: DOOR_HALF_WIDTH + segmentWidth / 2, z: -innerZ, rotationY: 0 },
  ];

  endSegments.forEach((segment) => {
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(segmentWidth, WALL_HEIGHT), endMaterial.clone());
    panel.position.set(segment.x, wallY, segment.z);
    panel.rotation.y = segment.rotationY;
    markCameraFadeMesh(panel, 0.08);
    room.add(panel);
  });

  for (const z of [innerZ, -innerZ]) {
    const topPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(DOOR_HALF_WIDTH * 2.1, 1.15),
      endMaterial.clone(),
    );
    topPanel.position.set(0, WALL_HEIGHT - 0.68, z);
    topPanel.rotation.y = z > 0 ? Math.PI : 0;
    markCameraFadeMesh(topPanel, 0.08);
    room.add(topPanel);
  }
}

function addRoom4PhotoGallery(room) {
  const sideX = ROOM_WIDTH / 2 - 0.06;
  const backZ = -(ROOM_LENGTH / 2 - WALL_THICKNESS * 0.5 - 0.055);
  const placements = [
    { photoIndex: 0, x: -sideX, y: 3.55, z: 6.95, rotationY: Math.PI / 2 },
    { photoIndex: 1, x: sideX, y: 3.55, z: 6.55, rotationY: -Math.PI / 2 },
    { photoIndex: 2, x: -sideX, y: 3.5, z: -4.95, rotationY: Math.PI / 2 },
    { photoIndex: 3, x: sideX, y: 3.5, z: -5.35, rotationY: -Math.PI / 2 },
    { photoIndex: 4, x: -5.75, y: 3.58, z: backZ, rotationY: 0 },
    { photoIndex: 5, x: 5.75, y: 3.58, z: backZ, rotationY: 0 },
  ];

  placements.forEach((placement) => {
    const frame = createRoom4PhotoFrame(ROOM4_GALLERY_PHOTO_URLS[placement.photoIndex]);
    frame.position.set(placement.x, placement.y, placement.z);
    frame.rotation.y = placement.rotationY;
    room.add(frame);
  });
}

function createRoom4PhotoFrame(photoUrl) {
  const width = 1.04;
  const height = 1.38;
  const rail = 0.08;
  const texture = loader.load(photoUrl);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = PERFORMANCE_MODE ? 1 : 4;

  const group = new THREE.Group();
  group.name = "room4GalleryPhotoFrame";
  const backingMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd5ec,
    roughness: 0.48,
    metalness: 0.04,
  });
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0xf5c66f,
    roughness: 0.32,
    metalness: 0.28,
  });

  const backing = new THREE.Mesh(
    new THREE.BoxGeometry(width + rail * 2.1, height + rail * 2.1, 0.06),
    backingMaterial,
  );
  backing.position.z = -0.03;
  group.add(backing);

  const photo = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.FrontSide,
      toneMapped: false,
    }),
  );
  photo.name = "room4GalleryPhoto";
  photo.position.z = 0.012;
  group.add(photo);

  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
      side: THREE.FrontSide,
      toneMapped: false,
    }),
  );
  glass.position.z = 0.018;
  group.add(glass);

  const top = new THREE.Mesh(new THREE.BoxGeometry(width + rail * 2.2, rail, 0.09), frameMaterial);
  top.position.set(0, height / 2 + rail / 2, 0.03);
  group.add(top);
  const bottom = top.clone();
  bottom.position.y = -height / 2 - rail / 2;
  group.add(bottom);

  for (const x of [-width / 2 - rail / 2, width / 2 + rail / 2]) {
    const side = new THREE.Mesh(new THREE.BoxGeometry(rail, height + rail * 2.2, 0.09), frameMaterial);
    side.position.set(x, 0, 0.03);
    group.add(side);
  }

  const bowMaterial = new THREE.MeshBasicMaterial({
    color: 0xff76bc,
    transparent: true,
    opacity: 0.86,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  for (const side of [-1, 1]) {
    const bow = new THREE.Mesh(new THREE.CircleGeometry(0.09, 12), bowMaterial);
    bow.scale.set(1.2, 0.58, 1);
    bow.rotation.z = side * 0.55;
    bow.position.set(side * 0.08, height / 2 + 0.18, 0.04);
    group.add(bow);
  }

  return group;
}

function addFifthRoomJungleDecor(room) {
  addFifthRoomJungleWalls(room);
  addFifthRoomCanopy(room);
  addFifthRoomVines(room);
  addFifthRoomFloorRoots(room);
  addFifthRoomGrassTufts(room);
}

function addFifthRoomJungleWalls(room) {
  const sideMaterial = createJungleWallMaterial("#13432e", "#246d45", "#72d67d");
  const endMaterial = createJungleWallMaterial("#0f3a2d", "#1f6541", "#9ef27f");
  const wallY = WALL_HEIGHT / 2 - 0.1;
  const innerX = ROOM_WIDTH / 2 - 0.024;
  const innerZ = ROOM_LENGTH / 2 - WALL_THICKNESS * 0.5 - 0.032;
  const sideGeometry = new THREE.PlaneGeometry(ROOM_LENGTH, WALL_HEIGHT);

  const left = new THREE.Mesh(sideGeometry, sideMaterial);
  left.position.set(-innerX, wallY, 0);
  left.rotation.y = Math.PI / 2;
  markCameraFadeMesh(left, 0.08);
  room.add(left);

  const right = new THREE.Mesh(sideGeometry, sideMaterial.clone());
  right.position.set(innerX, wallY, 0);
  right.rotation.y = -Math.PI / 2;
  markCameraFadeMesh(right, 0.08);
  room.add(right);

  const segmentWidth = (ROOM_WIDTH - DOOR_HALF_WIDTH * 2) / 2;
  const endSegments = [
    { x: -(DOOR_HALF_WIDTH + segmentWidth / 2), z: innerZ, rotationY: Math.PI },
    { x: DOOR_HALF_WIDTH + segmentWidth / 2, z: innerZ, rotationY: Math.PI },
    { x: -(DOOR_HALF_WIDTH + segmentWidth / 2), z: -innerZ, rotationY: 0 },
    { x: DOOR_HALF_WIDTH + segmentWidth / 2, z: -innerZ, rotationY: 0 },
  ];

  endSegments.forEach((segment) => {
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(segmentWidth, WALL_HEIGHT), endMaterial.clone());
    panel.position.set(segment.x, wallY, segment.z);
    panel.rotation.y = segment.rotationY;
    markCameraFadeMesh(panel, 0.08);
    room.add(panel);
  });

  for (const z of [innerZ, -innerZ]) {
    const topPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(DOOR_HALF_WIDTH * 2.1, 1.15),
      endMaterial.clone(),
    );
    topPanel.position.set(0, WALL_HEIGHT - 0.68, z);
    topPanel.rotation.y = z > 0 ? Math.PI : 0;
    markCameraFadeMesh(topPanel, 0.08);
    room.add(topPanel);
  }
}

function addFifthRoomCanopy(room) {
  const leafColors = [0x1d7a3f, 0x2faa55, 0x5dca62, 0x9be66c];
  const count = PERFORMANCE_MODE ? 46 : 84;
  for (let i = 0; i < count; i += 1) {
    const color = leafColors[i % leafColors.length];
    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.62,
      depthWrite: false,
      side: THREE.DoubleSide,
      toneMapped: false,
    });
    const leaf = new THREE.Mesh(new THREE.CircleGeometry(0.55, PERFORMANCE_MODE ? 10 : 14), material);
    leaf.position.set(
      THREE.MathUtils.randFloatSpread(ROOM_WIDTH - 1.6),
      WALL_HEIGHT - THREE.MathUtils.randFloat(0.28, 0.88),
      THREE.MathUtils.randFloatSpread(ROOM_LENGTH - 1.2),
    );
    leaf.scale.set(THREE.MathUtils.randFloat(0.6, 1.45), THREE.MathUtils.randFloat(0.25, 0.55), 1);
    leaf.rotation.set(
      THREE.MathUtils.randFloat(-0.55, 0.55),
      THREE.MathUtils.randFloat(0, Math.PI),
      THREE.MathUtils.randFloat(0, Math.PI),
    );
    room.add(leaf);
  }
}

function addFifthRoomVines(room) {
  const vineMaterial = new THREE.MeshStandardMaterial({
    color: 0x225a32,
    roughness: 0.88,
    metalness: 0.02,
  });
  const leafMaterial = new THREE.MeshBasicMaterial({
    color: 0x67d56a,
    transparent: true,
    opacity: 0.82,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  const vineCount = PERFORMANCE_MODE ? 18 : 30;
  for (let i = 0; i < vineCount; i += 1) {
    const side = i % 2 === 0 ? -1 : 1;
    const baseX = side * (ROOM_WIDTH / 2 - 0.16);
    const z = THREE.MathUtils.randFloat(-ROOM_LENGTH / 2 + 1.4, ROOM_LENGTH / 2 - 1.2);
    const length = THREE.MathUtils.randFloat(1.7, 4.4);
    const points = [
      new THREE.Vector3(baseX, WALL_HEIGHT - 0.12, z),
      new THREE.Vector3(baseX - side * THREE.MathUtils.randFloat(0.1, 0.5), WALL_HEIGHT - length * 0.45, z + THREE.MathUtils.randFloat(-0.38, 0.38)),
      new THREE.Vector3(baseX - side * THREE.MathUtils.randFloat(0.0, 0.35), WALL_HEIGHT - length, z + THREE.MathUtils.randFloat(-0.58, 0.58)),
    ];
    const vine = new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), PERFORMANCE_MODE ? 5 : 8, 0.026, 5, false),
      vineMaterial,
    );
    room.add(vine);

    for (let j = 0; j < 3; j += 1) {
      const leaf = new THREE.Mesh(new THREE.CircleGeometry(0.18, 8), leafMaterial);
      leaf.position.copy(points[Math.min(j + 1, points.length - 1)]);
      leaf.position.y += THREE.MathUtils.randFloat(-0.08, 0.12);
      leaf.scale.set(1.25, 0.55, 1);
      leaf.rotation.set(THREE.MathUtils.randFloat(-0.5, 0.5), side * Math.PI / 2, THREE.MathUtils.randFloat(0, Math.PI));
      room.add(leaf);
    }
  }
}

function addFifthRoomFloorRoots(room) {
  const rootMaterial = new THREE.MeshStandardMaterial({
    color: 0x5e4129,
    roughness: 0.92,
    metalness: 0.02,
  });
  const stoneMaterial = new THREE.MeshStandardMaterial({
    color: 0x47634a,
    roughness: 0.9,
  });

  for (let i = 0; i < (PERFORMANCE_MODE ? 12 : 20); i += 1) {
    const root = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.07, THREE.MathUtils.randFloat(1.2, 2.8), 6),
      rootMaterial,
    );
    root.position.set(THREE.MathUtils.randFloatSpread(ROOM_WIDTH - 2), 0.035, THREE.MathUtils.randFloatSpread(ROOM_LENGTH - 2));
    root.rotation.set(Math.PI / 2, 0, THREE.MathUtils.randFloat(0, Math.PI));
    room.add(root);
  }

  for (let i = 0; i < (PERFORMANCE_MODE ? 10 : 18); i += 1) {
    const stone = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), stoneMaterial);
    stone.position.set(THREE.MathUtils.randFloatSpread(ROOM_WIDTH - 2), 0.04, THREE.MathUtils.randFloatSpread(ROOM_LENGTH - 2));
    stone.scale.set(THREE.MathUtils.randFloat(1.1, 2.0), 0.22, THREE.MathUtils.randFloat(0.85, 1.7));
    stone.rotation.y = THREE.MathUtils.randFloat(0, Math.PI);
    room.add(stone);
  }
}

function addFifthRoomGrassTufts(room) {
  const grassColors = [0x2e8d43, 0x4fad45, 0x6fc95a, 0x1f6f3c];
  const grassCount = PERFORMANCE_MODE ? 90 : 170;
  const bladeGeometry = new THREE.PlaneGeometry(0.07, 0.42);
  const materials = grassColors.map((color) => new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.72,
    side: THREE.DoubleSide,
    toneMapped: false,
  }));

  for (let i = 0; i < grassCount; i += 1) {
    const tuft = new THREE.Group();
    const bladeCount = 2 + (i % 3);
    tuft.position.set(
      THREE.MathUtils.randFloatSpread(ROOM_WIDTH - 1.5),
      0.08,
      THREE.MathUtils.randFloatSpread(ROOM_LENGTH - 1.4),
    );
    tuft.rotation.y = THREE.MathUtils.randFloat(0, Math.PI * 2);
    const scale = THREE.MathUtils.randFloat(0.45, 1.15);
    tuft.scale.setScalar(scale);

    for (let j = 0; j < bladeCount; j += 1) {
      const blade = new THREE.Mesh(bladeGeometry, materials[(i + j) % materials.length]);
      blade.position.set(THREE.MathUtils.randFloatSpread(0.1), 0.18, THREE.MathUtils.randFloatSpread(0.1));
      blade.rotation.set(THREE.MathUtils.randFloat(-0.25, 0.25), THREE.MathUtils.randFloat(0, Math.PI), THREE.MathUtils.randFloat(-0.42, 0.42));
      tuft.add(blade);
    }

    room.add(tuft);
  }
}

function addFifthRoomJungleLighting(centerZ) {
  const glow = new THREE.PointLight(0x7dff8a, PERFORMANCE_MODE ? 2.2 : 3.8, 18, 2);
  glow.position.set(-4.8, 4.1, centerZ - 1.2);
  glow.userData.baseIntensity = PERFORMANCE_MODE ? 1.75 : 2.95;
  glow.userData.flicker = 0.38;
  roomLights.push(glow);
  scene.add(glow);

  const gold = new THREE.PointLight(0xffd06b, PERFORMANCE_MODE ? 1.5 : 2.45, 14, 2);
  gold.position.set(5.2, 3.2, centerZ + 4.8);
  gold.userData.baseIntensity = PERFORMANCE_MODE ? 1.1 : 1.82;
  gold.userData.flicker = 0.26;
  roomLights.push(gold);
  scene.add(gold);
}

function addGraveyardRoomDecor(room) {
  addGraveyardStoneWalls(room);
  addGraveyardIvyCarpet(room);
  addGraveyardWallOvergrowth(room);
  addGraveyardIronFence(room);
  addGraveyardDeadTrees(room);
  addGraveyardBushes(room);
  addGraveyardCandles(room);
  addGraveyardMist(room);
  addGraveyardSunBeams(room);
}

function addGraveyardIvyCarpet(room) {
  const ivyColors = [0x294a31, 0x365a39, 0x426744, 0x203d2b];
  const leafMaterials = ivyColors.map((color) => new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.96,
    depthWrite: false,
    side: THREE.DoubleSide,
    toneMapped: false,
  }));
  const clumpMaterials = ivyColors.map((color) => new THREE.MeshStandardMaterial({
    color,
    roughness: 0.94,
    metalness: 0,
  }));
  const leafTransforms = ivyColors.map(() => []);
  const clumpTransforms = ivyColors.map(() => []);
  const sideSpacingZ = PERFORMANCE_MODE ? 0.58 : 0.46;
  const verticalSpacing = PERFORMANCE_MODE ? 0.55 : 0.44;
  let sequence = 0;

  const addIvyPatch = (position, rotationY, wallNormal, sizeBias = 1) => {
    const materialIndex = sequence % ivyColors.length;
    const leafScale = THREE.MathUtils.randFloat(1.02, 1.72) * sizeBias;
    leafTransforms[materialIndex].push({
      position,
      rotation: new THREE.Euler(
        THREE.MathUtils.randFloat(-0.18, 0.18),
        rotationY,
        THREE.MathUtils.randFloat(0, Math.PI),
      ),
      scale: new THREE.Vector3(leafScale * 1.35, leafScale * 0.72, 1),
    });

    if (sequence % 4 !== 0) {
      const clumpScale = THREE.MathUtils.randFloat(0.52, 0.98) * sizeBias;
      clumpTransforms[(materialIndex + 1) % ivyColors.length].push({
        position: position.clone().addScaledVector(wallNormal, 0.13),
        rotation: new THREE.Euler(
          THREE.MathUtils.randFloat(0, Math.PI),
          THREE.MathUtils.randFloat(0, Math.PI),
          THREE.MathUtils.randFloat(0, Math.PI),
        ),
        scale: new THREE.Vector3(clumpScale * 1.25, clumpScale * 0.76, clumpScale * 0.52),
      });
    }
    sequence += 1;
  };

  for (const side of [-1, 1]) {
    const wallX = side * (ROOM_WIDTH / 2 - 0.19);
    const normal = new THREE.Vector3(-side, 0, 0);
    for (let y = 0.5; y < WALL_HEIGHT - 0.22; y += verticalSpacing) {
      for (let z = -ROOM_LENGTH / 2 + 0.45; z < ROOM_LENGTH / 2 - 0.35; z += sideSpacingZ) {
        const waveGap = Math.sin(z * 0.82 + y * 1.6 + side) > 0.82;
        if (waveGap && sequence % 7 === 0) {
          sequence += 1;
          continue;
        }
        addIvyPatch(
          new THREE.Vector3(
            wallX,
            y + THREE.MathUtils.randFloatSpread(verticalSpacing * 0.38),
            z + THREE.MathUtils.randFloatSpread(sideSpacingZ * 0.38),
          ),
          side * Math.PI / 2,
          normal,
          0.82 + Math.sin(y * 1.1 + z * 0.22) * 0.12,
        );
      }
    }
  }

  const endSpacingX = PERFORMANCE_MODE ? 0.56 : 0.45;
  for (const side of [-1, 1]) {
    const wallZ = side * (ROOM_LENGTH / 2 - 0.19);
    const normal = new THREE.Vector3(0, 0, -side);
    for (let y = 0.5; y < WALL_HEIGHT - 0.22; y += verticalSpacing) {
      for (let x = -ROOM_WIDTH / 2 + 0.45; x < ROOM_WIDTH / 2 - 0.35; x += endSpacingX) {
        const insideDoorway = Math.abs(x) < DOOR_HALF_WIDTH + 0.5 && y < 4.55;
        if (insideDoorway) {
          continue;
        }
        if (Math.sin(x * 0.95 - y * 1.35 + side) > 0.92 && sequence % 7 === 0) {
          sequence += 1;
          continue;
        }
        addIvyPatch(
          new THREE.Vector3(
            x + THREE.MathUtils.randFloatSpread(endSpacingX * 0.36),
            y + THREE.MathUtils.randFloatSpread(verticalSpacing * 0.36),
            wallZ,
          ),
          side < 0 ? 0 : Math.PI,
          normal,
          0.84 + Math.cos(x * 0.4 + y) * 0.13,
        );
      }
    }
  }

  const leafGeometry = new THREE.CircleGeometry(0.24, 9);
  const clumpGeometry = new THREE.DodecahedronGeometry(0.32, 0);
  const helper = new THREE.Object3D();
  const addInstances = (transformsByMaterial, geometry, materials) => {
    transformsByMaterial.forEach((transforms, materialIndex) => {
      const instances = new THREE.InstancedMesh(geometry, materials[materialIndex], transforms.length);
      transforms.forEach((transform, index) => {
        helper.position.copy(transform.position);
        helper.rotation.copy(transform.rotation);
        helper.scale.copy(transform.scale);
        helper.updateMatrix();
        instances.setMatrixAt(index, helper.matrix);
      });
      instances.instanceMatrix.needsUpdate = true;
      markCameraFadeMesh(instances, geometry === leafGeometry ? 0.015 : 0.025);
      room.add(instances);
    });
  };
  addInstances(leafTransforms, leafGeometry, leafMaterials);
  addInstances(clumpTransforms, clumpGeometry, clumpMaterials);
}

function addGraveyardStoneWalls(room) {
  const stoneMaterial = new THREE.MeshStandardMaterial({
    color: 0x24272a,
    roughness: 0.96,
    metalness: 0.02,
  });
  const blockGeometry = new THREE.BoxGeometry(1.75, 0.72, 0.18);

  for (const side of [-1, 1]) {
    const x = side * (ROOM_WIDTH / 2 - 0.06);
    for (let row = 0; row < 7; row += 1) {
      for (let column = 0; column < 13; column += 1) {
        const block = new THREE.Mesh(blockGeometry, stoneMaterial);
        block.position.set(
          x,
          0.38 + row * 0.75,
          -ROOM_LENGTH / 2 + 0.92 + column * 1.82 + (row % 2) * 0.28,
        );
        block.rotation.y = Math.PI / 2;
        block.scale.z = 0.75 + ((row + column) % 3) * 0.1;
        markCameraFadeMesh(block, 0.07);
        room.add(block);
      }
    }
  }

  const archMaterial = new THREE.MeshStandardMaterial({
    color: 0x35383b,
    roughness: 0.9,
    metalness: 0.04,
  });
  for (const z of [-ROOM_LENGTH / 2 + 0.08, ROOM_LENGTH / 2 - 0.08]) {
    const arch = new THREE.Mesh(
      new THREE.TorusGeometry(DOOR_HALF_WIDTH + 0.38, 0.28, 8, PERFORMANCE_MODE ? 24 : 40, Math.PI),
      archMaterial,
    );
    arch.position.set(0, 4.36, z);
    arch.rotation.set(0, z < 0 ? 0 : Math.PI, 0);
    markCameraFadeMesh(arch, 0.08);
    room.add(arch);
  }
}

function addGraveyardWallOvergrowth(room) {
  const vineMaterial = new THREE.MeshStandardMaterial({
    color: 0x263e2b,
    roughness: 0.96,
    metalness: 0,
  });
  const dryBranchMaterial = new THREE.MeshStandardMaterial({
    color: 0x3b2b25,
    roughness: 1,
  });
  const leafMaterials = [0x35573b, 0x466447, 0x283f31].map((color) => new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.9,
    side: THREE.DoubleSide,
    toneMapped: false,
  }));
  const leafTransforms = leafMaterials.map(() => []);
  const vineCount = PERFORMANCE_MODE ? 44 : 72;

  for (let i = 0; i < vineCount; i += 1) {
    const onSideWall = i % 3 !== 0;
    const wallSign = i % 2 === 0 ? -1 : 1;
    const start = onSideWall
      ? new THREE.Vector3(
        wallSign * (ROOM_WIDTH / 2 - 0.22),
        WALL_HEIGHT - THREE.MathUtils.randFloat(0.1, 0.75),
        THREE.MathUtils.randFloat(-ROOM_LENGTH / 2 + 0.7, ROOM_LENGTH / 2 - 0.7),
      )
      : new THREE.Vector3(
        THREE.MathUtils.randFloat(-ROOM_WIDTH / 2 + 0.7, ROOM_WIDTH / 2 - 0.7),
        WALL_HEIGHT - THREE.MathUtils.randFloat(0.1, 0.7),
        wallSign * (ROOM_LENGTH / 2 - 0.2),
      );
    const fall = THREE.MathUtils.randFloat(1.35, 4.5);
    const inward = onSideWall
      ? new THREE.Vector3(-wallSign * THREE.MathUtils.randFloat(0.05, 0.28), -fall * 0.48, THREE.MathUtils.randFloatSpread(0.5))
      : new THREE.Vector3(THREE.MathUtils.randFloatSpread(0.5), -fall * 0.48, -wallSign * THREE.MathUtils.randFloat(0.05, 0.28));
    const end = start.clone().add(inward.clone().multiplyScalar(2));
    const points = [start, start.clone().add(inward), end];
    const curve = new THREE.CatmullRomCurve3(points);
    const vine = new THREE.Mesh(
      new THREE.TubeGeometry(curve, PERFORMANCE_MODE ? 5 : 8, 0.026, 5, false),
      vineMaterial,
    );
    markCameraFadeMesh(vine, 0.025);
    room.add(vine);

    for (let leafIndex = 0; leafIndex < 7; leafIndex += 1) {
      const t = 0.1 + leafIndex * 0.135;
      const radius = 0.17 + (leafIndex % 3) * 0.045;
      leafTransforms[(i + leafIndex) % leafMaterials.length].push({
        position: curve.getPoint(t),
        rotation: new THREE.Euler(
          THREE.MathUtils.randFloat(-0.4, 0.4),
          onSideWall ? Math.PI / 2 : 0,
          THREE.MathUtils.randFloat(0, Math.PI),
        ),
        scale: new THREE.Vector3(radius / 0.2 * 1.3, radius / 0.2 * 0.58, 1),
      });
    }
  }

  const leafGeometry = new THREE.CircleGeometry(0.2, 8);
  const transformHelper = new THREE.Object3D();
  leafTransforms.forEach((transforms, materialIndex) => {
    const leaves = new THREE.InstancedMesh(leafGeometry, leafMaterials[materialIndex], transforms.length);
    transforms.forEach((transform, index) => {
      transformHelper.position.copy(transform.position);
      transformHelper.rotation.copy(transform.rotation);
      transformHelper.scale.copy(transform.scale);
      transformHelper.updateMatrix();
      leaves.setMatrixAt(index, transformHelper.matrix);
    });
    leaves.instanceMatrix.needsUpdate = true;
    markCameraFadeMesh(leaves, 0.015);
    room.add(leaves);
  });

  const branchCount = PERFORMANCE_MODE ? 32 : 48;
  for (let i = 0; i < branchCount; i += 1) {
    const onSideWall = i % 2 === 0;
    const wallSign = i % 4 < 2 ? -1 : 1;
    const length = THREE.MathUtils.randFloat(1.1, 2.75);
    const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.075, length, 6), dryBranchMaterial);
    if (onSideWall) {
      branch.position.set(
        wallSign * (ROOM_WIDTH / 2 - 0.2),
        THREE.MathUtils.randFloat(1.1, WALL_HEIGHT - 0.55),
        THREE.MathUtils.randFloat(-ROOM_LENGTH / 2 + 0.8, ROOM_LENGTH / 2 - 0.8),
      );
      branch.rotation.set(THREE.MathUtils.randFloat(-0.8, 0.8), 0, THREE.MathUtils.randFloat(-1.25, 1.25));
    } else {
      branch.position.set(
        THREE.MathUtils.randFloat(-ROOM_WIDTH / 2 + 0.8, ROOM_WIDTH / 2 - 0.8),
        THREE.MathUtils.randFloat(1.1, WALL_HEIGHT - 0.55),
        wallSign * (ROOM_LENGTH / 2 - 0.2),
      );
      branch.rotation.set(THREE.MathUtils.randFloat(-1.2, 1.2), THREE.MathUtils.randFloat(-0.5, 0.5), Math.PI / 2);
    }
    markCameraFadeMesh(branch, 0.025);
    room.add(branch);
  }
}

function addGraveyardIronFence(room) {
  const ironMaterial = new THREE.MeshStandardMaterial({
    color: 0x111518,
    roughness: 0.46,
    metalness: 0.72,
  });
  const postGeometry = new THREE.CylinderGeometry(0.035, 0.045, 1.65, 6);
  const spikeGeometry = new THREE.ConeGeometry(0.09, 0.28, 6);
  const railGeometry = new THREE.BoxGeometry(0.055, 0.055, ROOM_LENGTH - 1.8);

  for (const side of [-1, 1]) {
    const x = side * (ROOM_WIDTH / 2 - 0.54);
    for (let i = 0; i < 19; i += 1) {
      const z = -ROOM_LENGTH / 2 + 1.05 + i * ((ROOM_LENGTH - 2.1) / 18);
      const post = new THREE.Mesh(postGeometry, ironMaterial);
      post.position.set(x, 1.02, z);
      markCameraFadeMesh(post, 0.04);
      room.add(post);
      const spike = new THREE.Mesh(spikeGeometry, ironMaterial);
      spike.position.set(x, 1.98, z);
      markCameraFadeMesh(spike, 0.04);
      room.add(spike);
    }
    for (const y of [0.72, 1.48]) {
      const rail = new THREE.Mesh(railGeometry, ironMaterial);
      rail.position.set(x, y, 0);
      markCameraFadeMesh(rail, 0.04);
      room.add(rail);
    }
  }
}

function addGraveyardDeadTrees(room) {
  const barkMaterial = new THREE.MeshStandardMaterial({
    color: 0x2e2522,
    roughness: 0.98,
  });
  const placements = [
    { x: -7.5, z: 7.9, scale: 1.05, rotation: 0.2 },
    { x: 7.3, z: 5.4, scale: 0.86, rotation: -0.35 },
    { x: -7.35, z: -7.3, scale: 0.78, rotation: 0.5 },
  ];

  placements.forEach((placement, index) => {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.42, 4.15, 7), barkMaterial);
    trunk.position.y = 2.05;
    trunk.rotation.z = placement.rotation * 0.12;
    tree.add(trunk);

    for (let branchIndex = 0; branchIndex < 6; branchIndex += 1) {
      const length = 1.25 + (branchIndex % 3) * 0.34;
      const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.13, length, 6), barkMaterial);
      const angle = (branchIndex / 6) * Math.PI * 2 + index * 0.45;
      branch.position.set(Math.cos(angle) * 0.42, 3.55 + (branchIndex % 2) * 0.45, Math.sin(angle) * 0.42);
      branch.rotation.set(Math.sin(angle) * 0.75, angle, Math.cos(angle) * 0.78);
      tree.add(branch);
    }

    tree.position.set(placement.x, 0, placement.z);
    tree.scale.setScalar(placement.scale);
    tree.rotation.y = placement.rotation;
    room.add(tree);
  });
}

function addGraveyardBushes(room) {
  const leafMaterials = [0x263b2d, 0x354b34, 0x40543c, 0x293f32].map((color) => new THREE.MeshStandardMaterial({
    color,
    roughness: 0.94,
    metalness: 0,
  }));
  const placements = [
    [-7.5, 6.2], [-7.2, 2.5], [-7.4, -2.7], [-7.2, -6.3],
    [7.4, 7.0], [7.2, 3.7], [7.4, -1.6], [7.1, -6.8],
    [-3.5, 9.5], [2.8, 9.6], [-4.1, -9.4], [1.0, -9.7],
  ];

  placements.forEach(([x, z], index) => {
    const bush = new THREE.Group();
    const clumpCount = 5 + (index % 4);
    for (let clumpIndex = 0; clumpIndex < clumpCount; clumpIndex += 1) {
      const clump = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.32 + (clumpIndex % 3) * 0.1, 0),
        leafMaterials[(index + clumpIndex) % leafMaterials.length],
      );
      const angle = (clumpIndex / clumpCount) * Math.PI * 2;
      clump.position.set(Math.cos(angle) * 0.34, 0.24 + (clumpIndex % 2) * 0.22, Math.sin(angle) * 0.3);
      clump.scale.set(1.2, 0.9, 1);
      bush.add(clump);
    }
    bush.position.set(x, 0.02, z);
    bush.rotation.y = index * 0.62;
    bush.scale.setScalar(0.9 + (index % 3) * 0.12);
    room.add(bush);
  });
}

function addGraveyardCandles(room) {
  const waxMaterial = new THREE.MeshStandardMaterial({ color: 0xd7d0bd, roughness: 0.8 });
  const flameMaterial = new THREE.MeshBasicMaterial({
    color: 0xffb45c,
    transparent: true,
    opacity: 0.92,
    toneMapped: false,
  });
  const candlePositions = [
    [-7.2, 9.8], [7.1, 9.1], [-7.25, 4.7], [7.15, 0.2],
    [-7.2, -1.1], [7.25, -5.0], [-7.1, -9.1], [7.0, -9.5],
  ];

  candlePositions.forEach(([x, z], index) => {
    const candle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.085, 0.38 + (index % 3) * 0.1, 8),
      waxMaterial,
    );
    candle.position.set(x, 0.2, z);
    room.add(candle);
    const flame = new THREE.Mesh(new THREE.SphereGeometry(0.055, 7, 5), flameMaterial.clone());
    flame.scale.set(0.65, 1.7, 0.65);
    flame.position.set(x, candle.position.y + 0.27, z);
    room.add(flame);
  });
}

function addGraveyardMist(room) {
  const mistMaterial = new THREE.MeshBasicMaterial({
    color: 0x9aa7ad,
    transparent: true,
    opacity: PERFORMANCE_MODE ? 0.055 : 0.075,
    depthWrite: false,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  const count = PERFORMANCE_MODE ? 12 : 22;
  for (let i = 0; i < count; i += 1) {
    const mist = new THREE.Mesh(new THREE.CircleGeometry(1.2 + (i % 4) * 0.45, 18), mistMaterial.clone());
    mist.position.set(
      THREE.MathUtils.randFloatSpread(ROOM_WIDTH - 2),
      0.16 + (i % 3) * 0.06,
      THREE.MathUtils.randFloatSpread(ROOM_LENGTH - 2),
    );
    mist.rotation.x = -Math.PI / 2;
    mist.scale.set(1.8, 0.58, 1);
    room.add(mist);
  }
}

function addGraveyardSunBeams(room) {
  graveyardPuzzle.sunBeams.length = 0;
  const beamMaterial = new THREE.MeshBasicMaterial({
    color: 0xffe2a1,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
  const placements = [
    { x: -4.2, z: -1.5, scale: 1.15, rotation: -0.22 },
    { x: 0.6, z: 2.4, scale: 0.9, rotation: 0.16 },
    { x: 4.6, z: -4.4, scale: 1.05, rotation: 0.28 },
  ];
  placements.forEach((placement, index) => {
    const beam = new THREE.Mesh(
      new THREE.ConeGeometry(1.45, WALL_HEIGHT + 0.4, PERFORMANCE_MODE ? 20 : 30, 1, true),
      beamMaterial.clone(),
    );
    beam.position.set(placement.x, WALL_HEIGHT / 2, placement.z);
    beam.rotation.z = placement.rotation;
    beam.scale.set(placement.scale, 1, placement.scale);
    beam.renderOrder = 3;
    beam.userData.phase = index * 1.8;
    room.add(beam);
    graveyardPuzzle.sunBeams.push(beam);
  });
}

function addGraveyardRoomLighting(centerZ) {
  const moon = new THREE.PointLight(0xa9c7e8, PERFORMANCE_MODE ? 2.35 : 4.2, 22, 2);
  moon.position.set(-3.8, 5.1, centerZ - 2.5);
  moon.userData.baseIntensity = PERFORMANCE_MODE ? 2.05 : 3.6;
  moon.userData.flicker = 0.08;
  roomLights.push(moon);
  scene.add(moon);

  const candleGlow = new THREE.PointLight(0xffa65c, PERFORMANCE_MODE ? 1.05 : 1.9, 11, 2);
  candleGlow.position.set(5.9, 1.7, centerZ + 4.4);
  candleGlow.userData.baseIntensity = PERFORMANCE_MODE ? 0.9 : 1.55;
  candleGlow.userData.flicker = 0.24;
  roomLights.push(candleGlow);
  scene.add(candleGlow);

  graveyardPuzzle.sunLights.length = 0;
  const sunPlacements = [
    { x: -4.2, y: 3.9, z: centerZ - 1.5, color: 0xffd17a, intensity: PERFORMANCE_MODE ? 7.2 : 10.5 },
    { x: 0.6, y: 3.8, z: centerZ + 2.4, color: 0xffefb0, intensity: PERFORMANCE_MODE ? 6.6 : 9.6 },
    { x: 4.6, y: 3.8, z: centerZ - 4.4, color: 0xffb86b, intensity: PERFORMANCE_MODE ? 5.9 : 8.8 },
  ];
  sunPlacements.forEach((placement) => {
    const light = new THREE.PointLight(placement.color, 0, 24, 1.16);
    light.position.set(placement.x, placement.y, placement.z);
    light.userData.targetIntensity = placement.intensity;
    graveyardPuzzle.sunLights.push(light);
    scene.add(light);
  });
}

function addSixthRoomBeachExit(room, wallMaterial, trimMaterial) {
  const rockMaterial = createCaveRockMaterial("#5d5649", "#2e302d");
  addBoundaryWall(room, ROOM_LENGTH / 2, false, rockMaterial, trimMaterial);
  addSixthRoomRockSides(room, rockMaterial);
  addSixthRoomCaveArch(room, rockMaterial);
  addSixthRoomSunsetBackdrop(room);
  addSixthRoomPalms(room);
  addSixthRoomBeachDetails(room);
}

function addSixthRoomRockSides(room, rockMaterial) {
  const wallGeometry = new THREE.BoxGeometry(WALL_THICKNESS * 1.65, WALL_HEIGHT, ROOM_LENGTH - 2.8);
  for (const side of [-1, 1]) {
    const wall = new THREE.Mesh(wallGeometry, rockMaterial);
    wall.position.set(side * (ROOM_WIDTH / 2 + WALL_THICKNESS * 0.42), WALL_HEIGHT / 2 - 0.15, 1.2);
    wall.castShadow = true;
    wall.receiveShadow = true;
    markCameraFadeMesh(wall, 0.08);
    room.add(wall);

    for (let i = 0; i < 12; i += 1) {
      const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(THREE.MathUtils.randFloat(0.28, 0.78), 0),
        rockMaterial,
      );
      rock.position.set(
        side * (ROOM_WIDTH / 2 - THREE.MathUtils.randFloat(0.15, 0.55)),
        THREE.MathUtils.randFloat(0.28, WALL_HEIGHT - 0.5),
        THREE.MathUtils.randFloat(-ROOM_LENGTH / 2 + 2.4, ROOM_LENGTH / 2 - 1.2),
      );
      rock.scale.set(
        THREE.MathUtils.randFloat(0.7, 1.55),
        THREE.MathUtils.randFloat(0.65, 1.45),
        THREE.MathUtils.randFloat(0.55, 1.3),
      );
      rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      room.add(rock);
    }
  }
}

function addSixthRoomCaveArch(room, rockMaterial) {
  const archZ = -ROOM_LENGTH / 2 + 0.85;
  const top = new THREE.Mesh(new THREE.BoxGeometry(ROOM_WIDTH - 1.4, 1.35, 1.2), rockMaterial);
  top.position.set(0, WALL_HEIGHT - 0.55, archZ);
  top.castShadow = true;
  top.receiveShadow = true;
  room.add(top);

  for (const side of [-1, 1]) {
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 1.1, WALL_HEIGHT - 0.8, 9), rockMaterial);
    pillar.position.set(side * (DOOR_HALF_WIDTH + 1.35), (WALL_HEIGHT - 0.8) / 2 - 0.05, archZ);
    pillar.scale.x = 1.18;
    pillar.scale.z = 0.82;
    pillar.castShadow = true;
    pillar.receiveShadow = true;
    room.add(pillar);
  }

  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(DOOR_HALF_WIDTH * 2.75, 3.65),
    new THREE.MeshBasicMaterial({
      color: 0xffc77b,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    }),
  );
  glow.position.set(0, 2.6, archZ - 0.08);
  room.add(glow);
}

function addSixthRoomSunsetBackdrop(room) {
  const sunsetSeaMaterial = createSunsetSeaMaterial();
  const backdrop = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 12),
    sunsetSeaMaterial,
  );
  backdrop.position.set(0, 3.05, -ROOM_LENGTH / 2 - 1.65);
  backdrop.renderOrder = -1;
  room.add(backdrop);

  const water = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 12),
    new THREE.MeshBasicMaterial({
      color: 0x2d7f98,
      transparent: true,
      opacity: 0.34,
      side: THREE.DoubleSide,
      toneMapped: false,
    }),
  );
  water.position.set(0, -0.08, -ROOM_LENGTH / 2 - 6.8);
  water.rotation.x = -Math.PI / 2;
  room.add(water);

  const sun = new THREE.Mesh(
    new THREE.CircleGeometry(0.72, PERFORMANCE_MODE ? 32 : 48),
    new THREE.MeshBasicMaterial({
      color: 0xffc56d,
      transparent: true,
      opacity: 0.86,
      side: THREE.DoubleSide,
      toneMapped: false,
    }),
  );
  sun.position.set(4.15, 3.66, -ROOM_LENGTH / 2 - 1.56);
  room.add(sun);

  addSixthRoomSeagulls(room);
}

function createSunsetSeaMaterial() {
  const canvas = document.createElement("canvas");
  canvas.width = PERFORMANCE_MODE ? 512 : 1024;
  canvas.height = PERFORMANCE_MODE ? 256 : 512;
  const ctx = canvas.getContext("2d");
  drawSunsetSeaTexture(ctx, canvas, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = PERFORMANCE_MODE ? 1 : 4;
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.FrontSide,
    toneMapped: false,
  });

  sixthRoomFinale.sea = {
    canvas,
    ctx,
    texture,
    nextUpdateAt: 0,
  };

  return material;
}

function drawSunsetSeaTexture(ctx, canvas, phase) {
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.scale(width / 1024, height / 512);

  const sky = ctx.createLinearGradient(0, 0, 0, 330);
  sky.addColorStop(0, "#48386e");
  sky.addColorStop(0.35, "#c46d8f");
  sky.addColorStop(0.68, "#f2a160");
  sky.addColorStop(1, "#ffd58d");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 1024, 330);

  const sea = ctx.createLinearGradient(0, 250, 0, 512);
  sea.addColorStop(0, "#285f83");
  sea.addColorStop(0.45, "#1f798d");
  sea.addColorStop(1, "#12465f");
  ctx.fillStyle = sea;
  ctx.fillRect(0, 250, 1024, 262);

  ctx.fillStyle = "rgba(255, 199, 114, 0.7)";
  ctx.beginPath();
  ctx.arc(660, 226, 54, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 229, 170, 0.38)";
  ctx.lineWidth = 4;
  let lineIndex = 0;
  for (let y = 300; y < 492; y += 24) {
    const drift = ((phase * (lineIndex % 2 === 0 ? 18 : -13)) % 44);
    ctx.beginPath();
    for (let x = -44; x <= 1068; x += 22) {
      const drawX = x + drift;
      const wave = y
        + Math.sin(x * 0.035 + y * 0.07 + phase * 1.15 + lineIndex * 0.24) * 5
        + Math.sin(x * 0.012 - phase * 0.75) * 1.8;
      if (x === -44) {
        ctx.moveTo(drawX, wave);
      } else {
        ctx.lineTo(drawX, wave);
      }
    }
    ctx.stroke();
    lineIndex += 1;
  }

  ctx.strokeStyle = "rgba(255, 243, 196, 0.18)";
  ctx.lineWidth = 3;
  for (let i = 0; i < 9; i += 1) {
    const x = ((i * 131 + phase * 34) % 1130) - 70;
    const y = 316 + (i % 5) * 34 + Math.sin(phase * 0.8 + i) * 5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + 34, y + Math.sin(phase + i) * 6, x + 88, y);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(71, 39, 72, 0.36)";
  ctx.beginPath();
  ctx.moveTo(0, 250);
  ctx.bezierCurveTo(190, 220, 330, 260, 500, 238);
  ctx.bezierCurveTo(710, 214, 830, 260, 1024, 232);
  ctx.lineTo(1024, 264);
  ctx.lineTo(0, 274);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function addSixthRoomSeagulls(room) {
  const birdConfigs = [
    { x: -5.15, y: 2.86, scale: 1.86, phase: 0.2, speed: 0.42, radiusX: 0.82, radiusY: 0.14 },
    { x: -0.25, y: 3.06, scale: 1.48, phase: 2.3, speed: 0.34, radiusX: 1.05, radiusY: 0.13 },
    { x: 4.6, y: 2.92, scale: 1.68, phase: 4.1, speed: 0.38, radiusX: 0.9, radiusY: 0.16 },
  ];

  sixthRoomFinale.seagulls.length = 0;
  birdConfigs.forEach((config, index) => {
    const bird = createSixthRoomSeagull(index, config);
    bird.group.position.set(config.x, config.y, -ROOM_LENGTH / 2 - 1.04);
    bird.group.scale.setScalar(config.scale);
    bird.group.renderOrder = 4;
    room.add(bird.group);
    sixthRoomFinale.seagulls.push(bird);
  });
}

function createSixthRoomSeagull(index, config) {
  const group = new THREE.Group();
  const material = new THREE.MeshBasicMaterial({
    color: 0xfff7e6,
    transparent: true,
    opacity: 0.94,
    side: THREE.DoubleSide,
    depthWrite: false,
    toneMapped: false,
  });

  const leftWing = new THREE.Mesh(createSeagullWingGeometry(-1), material);
  const rightWing = new THREE.Mesh(createSeagullWingGeometry(1), material);
  group.add(leftWing, rightWing);

  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.038, 8, 5),
    material,
  );
  body.scale.set(1.2, 0.52, 0.42);
  group.add(body);

  return {
    group,
    leftWing,
    rightWing,
    baseX: config.x,
    baseY: config.y,
    baseScale: config.scale,
    phase: config.phase + index * 0.31,
    speed: config.speed,
    radiusX: config.radiusX,
    radiusY: config.radiusY,
  };
}

function createSeagullWingGeometry(direction) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(direction * 0.28, 0.17, direction * 0.58, 0.025);
  shape.quadraticCurveTo(direction * 0.28, -0.045, 0, 0);
  return new THREE.ShapeGeometry(shape);
}

function addSixthRoomPalms(room) {
  const palmPositions = [
    { x: -7.6, z: -5.5, scale: 1.1, lean: -0.18 },
    { x: 7.45, z: -4.3, scale: 1.0, lean: 0.22 },
    { x: -7.1, z: 3.2, scale: 0.78, lean: 0.12 },
    { x: 7.0, z: 2.2, scale: 0.82, lean: -0.14 },
    { x: -8.05, z: -9.35, scale: 0.95, lean: 0.1 },
    { x: 8.05, z: -8.7, scale: 1.02, lean: -0.12 },
    { x: -7.95, z: 7.75, scale: 0.9, lean: -0.16 },
    { x: 7.9, z: 7.05, scale: 0.92, lean: 0.14 },
  ];

  palmPositions.forEach((config, index) => {
    const palm = createPalmTree(index);
    palm.position.set(config.x, 0, config.z);
    palm.scale.setScalar(config.scale);
    palm.rotation.z = config.lean;
    room.add(palm);
  });
}

function createPalmTree(index) {
  const group = new THREE.Group();
  const trunkMaterial = new THREE.MeshStandardMaterial({
    color: 0x8c6338,
    roughness: 0.78,
    metalness: 0.02,
  });
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.32, 4.6, 9), trunkMaterial);
  trunk.position.y = 2.25;
  trunk.rotation.z = Math.sin(index * 1.7) * 0.11;
  trunk.castShadow = true;
  group.add(trunk);

  const leafColors = [0x227c43, 0x2f9f55, 0x4dbb5d, 0x186c3e];
  const leafMaterial = leafColors.map((color) => new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.88,
    side: THREE.DoubleSide,
    toneMapped: false,
  }));
  for (let i = 0; i < 9; i += 1) {
    const leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.58, 2.4), leafMaterial[(i + index) % leafMaterial.length]);
    const angle = (i / 9) * Math.PI * 2 + index * 0.2;
    leaf.position.set(Math.cos(angle) * 0.52, 4.72, Math.sin(angle) * 0.52);
    leaf.rotation.set(0.82, angle, Math.sin(angle) * 0.18);
    leaf.scale.set(1.0, 1.0 + (i % 3) * 0.1, 1);
    group.add(leaf);
  }

  const coconuts = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 10, 8),
    new THREE.MeshStandardMaterial({ color: 0x6d4b2a, roughness: 0.8 }),
  );
  coconuts.position.set(0.08, 4.42, 0.12);
  group.add(coconuts);

  return group;
}

function addSixthRoomBeachDetails(room) {
  const shellMaterial = new THREE.MeshStandardMaterial({
    color: 0xffe0c6,
    roughness: 0.72,
    metalness: 0.02,
  });
  const driftwoodMaterial = new THREE.MeshStandardMaterial({
    color: 0x765138,
    roughness: 0.86,
  });

  for (let i = 0; i < (PERFORMANCE_MODE ? 16 : 30); i += 1) {
    const shell = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), shellMaterial);
    shell.position.set(THREE.MathUtils.randFloatSpread(ROOM_WIDTH - 2.0), 0.035, THREE.MathUtils.randFloatSpread(ROOM_LENGTH - 2.2));
    shell.scale.set(1.7, 0.32, 1.0);
    shell.rotation.y = Math.random() * Math.PI;
    room.add(shell);
  }

  for (let i = 0; i < 5; i += 1) {
    const wood = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.08, THREE.MathUtils.randFloat(0.9, 1.6), 7), driftwoodMaterial);
    wood.position.set(THREE.MathUtils.randFloatSpread(ROOM_WIDTH - 4), 0.07, THREE.MathUtils.randFloat(-ROOM_LENGTH / 2 + 2.5, ROOM_LENGTH / 2 - 2.2));
    wood.rotation.set(Math.PI / 2, 0, Math.random() * Math.PI);
    room.add(wood);
  }
}

function addSixthRoomSunsetLighting(centerZ) {
  const sunset = new THREE.PointLight(0xff9a62, PERFORMANCE_MODE ? 3.0 : 4.6, 24, 2);
  sunset.position.set(0, 4.2, centerZ - 8.6);
  sunset.castShadow = false;
  sunset.userData.baseIntensity = PERFORMANCE_MODE ? 2.4 : 3.7;
  sunset.userData.flicker = 0.08;
  roomLights.push(sunset);
  scene.add(sunset);

  const ocean = new THREE.PointLight(0x76d8ff, PERFORMANCE_MODE ? 1.1 : 1.7, 18, 2);
  ocean.position.set(-4.6, 2.4, centerZ - 7.8);
  ocean.castShadow = false;
  ocean.userData.baseIntensity = PERFORMANCE_MODE ? 0.85 : 1.25;
  ocean.userData.flicker = 0.05;
  roomLights.push(ocean);
  scene.add(ocean);
}

function createJungleWallMaterial(baseColor, vineColor, leafColor) {
  const textureSize = PERFORMANCE_MODE ? 256 : 512;
  const canvas = document.createElement("canvas");
  canvas.width = textureSize;
  canvas.height = textureSize;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, textureSize, textureSize);
  gradient.addColorStop(0, baseColor);
  gradient.addColorStop(0.45, "#0c2c24");
  gradient.addColorStop(1, "#21583b");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, textureSize, textureSize);

  ctx.strokeStyle = "rgba(160, 255, 150, 0.16)";
  ctx.lineWidth = 2;
  for (let x = 0; x < textureSize; x += textureSize / 7) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    for (let y = 0; y <= textureSize; y += textureSize / 8) {
      ctx.lineTo(x + Math.sin(y * 0.045 + x) * 12, y);
    }
    ctx.stroke();
  }

  const leafCount = PERFORMANCE_MODE ? 46 : 96;
  for (let i = 0; i < leafCount; i += 1) {
    const x = Math.random() * textureSize;
    const y = Math.random() * textureSize;
    const rx = THREE.MathUtils.randFloat(8, 24);
    const ry = THREE.MathUtils.randFloat(4, 12);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(THREE.MathUtils.randFloat(0, Math.PI));
    ctx.fillStyle = i % 3 === 0 ? leafColor : vineColor;
    ctx.globalAlpha = THREE.MathUtils.randFloat(0.16, 0.36);
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2.4, 1.25);
  texture.anisotropy = PERFORMANCE_MODE ? 1 : 4;

  return new THREE.MeshStandardMaterial({
    map: texture,
    color: 0xd8ffdd,
    roughness: 0.84,
    metalness: 0.02,
    emissive: 0x082a18,
    emissiveIntensity: 0.36,
    side: THREE.FrontSide,
  });
}

function createDollhouseWallpaperMaterial(baseColor, stripeColor, motifColor) {
  const textureSize = PERFORMANCE_MODE ? 256 : 512;
  const canvas = document.createElement("canvas");
  canvas.width = textureSize;
  canvas.height = textureSize;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, textureSize, textureSize);
  ctx.fillStyle = stripeColor;
  for (let x = 0; x < textureSize; x += textureSize / 8) {
    ctx.globalAlpha = 0.2;
    ctx.fillRect(x, 0, textureSize / 18, textureSize);
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = motifColor;
  const motifStep = textureSize / 4;
  for (let y = motifStep * 0.55; y < textureSize; y += motifStep) {
    for (let x = motifStep * 0.55; x < textureSize; x += motifStep) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(THREE.MathUtils.randFloat(-0.18, 0.18));
      ctx.globalAlpha = 0.46;
      ctx.beginPath();
      ctx.arc(-6, -5, 7, 0, Math.PI * 2);
      ctx.arc(6, -5, 7, 0, Math.PI * 2);
      ctx.moveTo(-13, -1);
      ctx.lineTo(0, 14);
      ctx.lineTo(13, -1);
      ctx.fill();
      ctx.restore();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 2);
  texture.anisotropy = PERFORMANCE_MODE ? 1 : 4;

  return new THREE.MeshStandardMaterial({
    map: texture,
    color: 0xffd9ef,
    roughness: 0.68,
    metalness: 0,
    emissive: 0x4d1836,
    emissiveIntensity: 0.13,
    side: THREE.FrontSide,
  });
}

function addFourthRoomCeilingDecor(room) {
  const trimMaterial = new THREE.MeshStandardMaterial({
    color: 0xffeef8,
    emissive: 0xff9fd1,
    emissiveIntensity: 0.28,
    roughness: 0.45,
  });

  for (const z of [-9.2, -4.7, -0.2, 4.3, 8.8]) {
    const lace = new THREE.Mesh(new THREE.BoxGeometry(ROOM_WIDTH - 1.3, 0.08, 0.1), trimMaterial);
    lace.position.set(0, WALL_HEIGHT - 0.43, z);
    room.add(lace);
  }

  const chandelier = new THREE.Group();
  chandelier.position.set(0, WALL_HEIGHT - 0.92, 0.4);
  const chainMaterial = new THREE.MeshStandardMaterial({
    color: 0xf0bf77,
    roughness: 0.28,
    metalness: 0.35,
  });
  const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.62, 8), chainMaterial);
  chain.position.y = 0.24;
  chandelier.add(chain);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.72, 0.035, 8, PERFORMANCE_MODE ? 28 : 44),
    chainMaterial,
  );
  ring.position.y = -0.08;
  ring.rotation.x = Math.PI / 2;
  chandelier.add(ring);

  const bulbMaterial = new THREE.MeshBasicMaterial({
    color: 0xfff1b8,
    transparent: true,
    opacity: 0.86,
    toneMapped: false,
  });
  for (let i = 0; i < 6; i += 1) {
    const angle = (i / 6) * Math.PI * 2;
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), bulbMaterial);
    bulb.position.set(Math.cos(angle) * 0.72, -0.1, Math.sin(angle) * 0.72);
    chandelier.add(bulb);
  }
  room.add(chandelier);
}

function addDollhouseFurniture(room) {
  const wood = new THREE.MeshStandardMaterial({
    color: 0xd39a74,
    roughness: 0.62,
    metalness: 0.02,
  });
  const whiteWood = new THREE.MeshStandardMaterial({
    color: 0xfff7ef,
    roughness: 0.55,
  });
  const roseFabric = new THREE.MeshStandardMaterial({
    color: 0xff8fc3,
    roughness: 0.82,
  });
  const mintFabric = new THREE.MeshStandardMaterial({
    color: 0xffb6d9,
    roughness: 0.82,
  });

  const furniture = [
    createDollhouseSofa(roseFabric, wood),
    createDollhouseBed(mintFabric, whiteWood),
    createDollhouseShelf(whiteWood),
    createDollhouseTable(wood),
    createDollhouseWardrobe(whiteWood),
  ];
  const placements = [
    { x: -7.0, z: 6.4, rotationY: Math.PI / 2 },
    { x: 6.8, z: 5.8, rotationY: -Math.PI / 2 },
    { x: -7.65, z: -2.35, rotationY: Math.PI / 2 },
    { x: 6.85, z: -2.3, rotationY: -Math.PI / 2 },
    { x: -6.95, z: -8.4, rotationY: Math.PI / 2 },
  ];

  furniture.forEach((item, index) => {
    const placement = placements[index];
    item.position.set(placement.x, 0, placement.z);
    item.rotation.y = placement.rotationY;
    room.add(item);
  });

  addDollhouseWallFrames(room);
}

function addFourthRoomCandyFloor(room) {
  addGummyScatter(room);
  addFloorConfettiScatter(room);
  addPinkCottonScatter(room);
}

function addGummyScatter(room) {
  const colors = [0xff5faf, 0xff86c7, 0xffcf56, 0xff6f8f, 0xd876ff, 0xff8b6b];
  const gumdropsPerColor = PERFORMANCE_MODE ? 28 : 46;
  const jellyPerColor = PERFORMANCE_MODE ? 24 : 38;
  const gumdropGeometry = new THREE.ConeGeometry(0.12, 0.22, PERFORMANCE_MODE ? 8 : 12);
  const jellyGeometry = new THREE.SphereGeometry(0.12, PERFORMANCE_MODE ? 8 : 12, PERFORMANCE_MODE ? 6 : 8);

  colors.forEach((color, colorIndex) => {
    const material = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.12,
    roughness: 0.24,
    metalness: 0.02,
    transparent: true,
      opacity: 0.88,
    });

    const gumdrops = new THREE.InstancedMesh(gumdropGeometry, material, gumdropsPerColor);
    for (let i = 0; i < gumdropsPerColor; i += 1) {
      const seed = colorIndex * 100 + i;
      const x = spreadFourthRoomFloor(seed, 1, -7.65, 7.65);
      const z = spreadFourthRoomFloor(seed, 2, -10.2, 10.2);
      const y = 0.13;
      const scale = new THREE.Vector3(
        0.72 + pseudoRandom01(seed, 3) * 0.5,
        0.68 + pseudoRandom01(seed, 4) * 0.54,
        0.72 + pseudoRandom01(seed, 5) * 0.5,
      );
      const rotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(
        pseudoRandom01(seed, 6) * 0.1,
        pseudoRandom01(seed, 7) * Math.PI * 2,
        pseudoRandom01(seed, 8) * 0.1,
      ));
      gumdrops.setMatrixAt(i, new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), rotation, scale));
    }
    gumdrops.instanceMatrix.needsUpdate = true;
    room.add(gumdrops);

    const jellyBeans = new THREE.InstancedMesh(jellyGeometry, material.clone(), jellyPerColor);
    for (let i = 0; i < jellyPerColor; i += 1) {
      const seed = colorIndex * 130 + i + 600;
      const x = spreadFourthRoomFloor(seed, 9, -7.75, 7.75);
      const z = spreadFourthRoomFloor(seed, 10, -10.35, 10.35);
      const y = 0.08;
      const scale = new THREE.Vector3(
        1.35 + pseudoRandom01(seed, 11) * 0.62,
        0.42 + pseudoRandom01(seed, 12) * 0.14,
        0.72 + pseudoRandom01(seed, 13) * 0.28,
      );
      const rotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(
        pseudoRandom01(seed, 14) * 0.18,
        pseudoRandom01(seed, 15) * Math.PI * 2,
        pseudoRandom01(seed, 16) * 0.2,
      ));
      jellyBeans.setMatrixAt(i, new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), rotation, scale));
    }
    jellyBeans.instanceMatrix.needsUpdate = true;
    room.add(jellyBeans);
  });
}

function addFloorConfettiScatter(room) {
  const colors = [0xffffff, 0xff78bd, 0xffd44f, 0x8edbff, 0xb688ff, 0x76ffb7, 0xff916e];
  const confettiPerColor = PERFORMANCE_MODE ? 32 : 58;
  const confettiGeometry = new THREE.PlaneGeometry(0.22, 0.07);

  colors.forEach((color, colorIndex) => {
    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide,
      toneMapped: false,
    });
    const confetti = new THREE.InstancedMesh(confettiGeometry, material, confettiPerColor);

    for (let i = 0; i < confettiPerColor; i += 1) {
      const seed = colorIndex * 180 + i + 1400;
      const x = spreadFourthRoomFloor(seed, 31, -8.05, 8.05);
      const z = spreadFourthRoomFloor(seed, 32, -10.75, 10.75);
      const y = 0.18 + pseudoRandom01(seed, 33) * 0.025;
      const scale = new THREE.Vector3(
        0.58 + pseudoRandom01(seed, 34) * 0.9,
        0.58 + pseudoRandom01(seed, 35) * 0.82,
        1,
      );
      const rotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(
        -Math.PI / 2 + pseudoRandom01(seed, 36) * 0.14,
        pseudoRandom01(seed, 37) * 0.18,
        pseudoRandom01(seed, 38) * Math.PI * 2,
      ));
      confetti.setMatrixAt(i, new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), rotation, scale));
    }

    confetti.instanceMatrix.needsUpdate = true;
    room.add(confetti);
  });
}

function addPinkCottonScatter(room) {
  const cottonCount = PERFORMANCE_MODE ? 72 : 118;
  const cottonGeometry = new THREE.SphereGeometry(0.34, PERFORMANCE_MODE ? 8 : 14, PERFORMANCE_MODE ? 6 : 10);
  const cottonMaterial = new THREE.MeshBasicMaterial({
    color: 0xffb8de,
    transparent: true,
    opacity: 0.42,
    depthWrite: false,
    toneMapped: false,
  });
  const cotton = new THREE.InstancedMesh(cottonGeometry, cottonMaterial, cottonCount);

  for (let i = 0; i < cottonCount; i += 1) {
    const x = spreadFourthRoomFloor(i, 21, -7.9, 7.9);
    const z = spreadFourthRoomFloor(i, 22, -10.6, 10.6);
    const y = 0.07 + pseudoRandom01(i, 23) * 0.055;
    const scale = new THREE.Vector3(
      1.18 + pseudoRandom01(i, 24) * 1.35,
      0.1 + pseudoRandom01(i, 25) * 0.11,
      0.8 + pseudoRandom01(i, 26) * 1.0,
    );
    const rotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(
      0,
      pseudoRandom01(i, 27) * Math.PI * 2,
      0,
    ));
    cotton.setMatrixAt(i, new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), rotation, scale));
  }

  cotton.instanceMatrix.needsUpdate = true;
  room.add(cotton);
}

function spreadFourthRoomFloor(seed, salt, min, max) {
  return THREE.MathUtils.lerp(min, max, pseudoRandom01(seed, salt));
}

function pseudoRandom01(seed, salt) {
  const value = Math.sin(seed * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function createDollhouseSofa(fabricMaterial, woodMaterial) {
  const group = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.38, 0.74), fabricMaterial);
  seat.position.y = 0.42;
  group.add(seat);

  const back = new THREE.Mesh(new THREE.BoxGeometry(2.32, 0.9, 0.28), fabricMaterial);
  back.position.set(0, 0.85, -0.36);
  group.add(back);

  for (const side of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.66, 0.8), fabricMaterial);
    arm.position.set(side * 1.26, 0.62, 0);
    group.add(arm);

    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.075, 0.36, 8), woodMaterial);
    leg.position.set(side * 0.86, 0.18, 0.25);
    group.add(leg);
  }

  for (const x of [-0.48, 0.42]) {
    const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.32, 0.16), new THREE.MeshStandardMaterial({
      color: x < 0 ? 0xffe8a9 : 0xd8c7ff,
      roughness: 0.84,
    }));
    pillow.position.set(x, 0.82, 0.26);
    pillow.rotation.z = x < 0 ? 0.08 : -0.07;
    group.add(pillow);
  }

  return group;
}

function createDollhouseBed(fabricMaterial, frameMaterial) {
  const group = new THREE.Group();
  const frame = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.32, 1.12), frameMaterial);
  frame.position.y = 0.36;
  group.add(frame);

  const mattress = new THREE.Mesh(new THREE.BoxGeometry(2.04, 0.22, 0.94), fabricMaterial);
  mattress.position.set(0, 0.58, 0.02);
  group.add(mattress);

  const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.18, 0.34), new THREE.MeshStandardMaterial({
    color: 0xfff5d8,
    roughness: 0.78,
  }));
  pillow.position.set(-0.52, 0.78, -0.26);
  group.add(pillow);

  const blanket = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.09, 0.94), new THREE.MeshStandardMaterial({
    color: 0xffb5cf,
    roughness: 0.86,
  }));
  blanket.position.set(0.45, 0.76, 0.08);
  group.add(blanket);

  const headboard = new THREE.Mesh(new THREE.BoxGeometry(2.34, 1.12, 0.16), frameMaterial);
  headboard.position.set(0, 0.78, -0.63);
  group.add(headboard);

  return group;
}

function createDollhouseShelf(material) {
  const group = new THREE.Group();
  const shelfMaterial = material;

  for (let i = 0; i < 3; i += 1) {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.09, 0.34), shelfMaterial);
    shelf.position.set(0, 0.45 + i * 0.52, 0);
    group.add(shelf);
  }

  for (const side of [-1, 1]) {
    const sideBoard = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.32, 0.36), shelfMaterial);
    sideBoard.position.set(side * 0.88, 0.84, 0);
    group.add(sideBoard);
  }

  const toyColors = [0xffc0da, 0xffe58f, 0xa9e8ff, 0xc5e7a6, 0xd5c0ff];
  for (let i = 0; i < 10; i += 1) {
    const toy = new THREE.Mesh(
      i % 3 === 0
        ? new THREE.SphereGeometry(0.12, 10, 8)
        : new THREE.BoxGeometry(0.16, 0.22, 0.12),
      new THREE.MeshStandardMaterial({ color: toyColors[i % toyColors.length], roughness: 0.72 }),
    );
    toy.position.set(-0.64 + (i % 5) * 0.32, 0.61 + Math.floor(i / 5) * 0.52, 0.02);
    group.add(toy);
  }

  return group;
}

function createDollhouseTable(material) {
  const group = new THREE.Group();
  const top = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.72, 0.12, 22), material);
  top.position.y = 0.82;
  group.add(top);

  const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.76, 12), material);
  leg.position.y = 0.42;
  group.add(leg);

  const teaMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.38,
    metalness: 0.02,
  });
  for (let i = 0; i < 3; i += 1) {
    const angle = i * Math.PI * 2 / 3;
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.075, 0.12, 12), teaMaterial);
    cup.position.set(Math.cos(angle) * 0.34, 0.94, Math.sin(angle) * 0.34);
    group.add(cup);
  }

  return group;
}

function createDollhouseWardrobe(material) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.55, 2.05, 0.52), material);
  body.position.y = 1.08;
  group.add(body);

  const seam = new THREE.Mesh(new THREE.BoxGeometry(0.035, 1.72, 0.54), new THREE.MeshStandardMaterial({
    color: 0xf0d5c4,
    roughness: 0.52,
  }));
  seam.position.set(0, 1.08, 0.03);
  group.add(seam);

  for (const side of [-1, 1]) {
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), new THREE.MeshStandardMaterial({
      color: 0xe8a84e,
      metalness: 0.38,
      roughness: 0.28,
    }));
    knob.position.set(side * 0.13, 1.05, 0.31);
    group.add(knob);
  }

  const crown = new THREE.Mesh(new THREE.BoxGeometry(1.82, 0.18, 0.64), material);
  crown.position.y = 2.18;
  group.add(crown);

  return group;
}

function addDollhouseWallFrames(room) {
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0xf1c06f,
    metalness: 0.18,
    roughness: 0.34,
  });
  const artMaterials = [
    createDollhouseArtMaterial(0),
    createDollhouseArtMaterial(1),
    createDollhouseArtMaterial(2),
  ];
  const placements = [
    { x: -ROOM_WIDTH / 2 + 0.08, y: 3.25, z: 2.9, rotationY: Math.PI / 2, material: artMaterials[0] },
    { x: ROOM_WIDTH / 2 - 0.08, y: 3.4, z: -4.1, rotationY: -Math.PI / 2, material: artMaterials[1] },
  ];

  placements.forEach((placement) => {
    const group = new THREE.Group();
    group.position.set(placement.x, placement.y, placement.z);
    group.rotation.y = placement.rotationY;

    const art = new THREE.Mesh(new THREE.PlaneGeometry(1.04, 0.78), placement.material);
    art.position.z = 0.012;
    group.add(art);

    const top = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.07, 0.05), frameMaterial);
    top.position.set(0, 0.43, 0.03);
    group.add(top);
    const bottom = top.clone();
    bottom.position.y = -0.43;
    group.add(bottom);

    for (const x of [-0.59, 0.59]) {
      const side = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.88, 0.05), frameMaterial);
      side.position.set(x, 0, 0.03);
      group.add(side);
    }

    room.add(group);
  });
}

function createDollhouseArtMaterial(index) {
  const canvas = document.createElement("canvas");
  canvas.width = 180;
  canvas.height = 132;
  const ctx = canvas.getContext("2d");
  const backgrounds = ["#fff2ad", "#cbefff", "#ffd7ec"];
  ctx.fillStyle = backgrounds[index % backgrounds.length];
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = index === 1 ? "#84bd8b" : "#eb78a4";
  ctx.beginPath();
  ctx.arc(90, 62, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = index === 2 ? "#8bc7d9" : "#f4b75e";
  ctx.beginPath();
  ctx.arc(65, 78, 16, 0, Math.PI * 2);
  ctx.arc(113, 78, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(110, 70, 90, 0.28)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(34, 104);
  ctx.quadraticCurveTo(90, 86, 146, 104);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
}

function addThirdRoomRomanticDecor(room) {
  const silkMaterial = new THREE.MeshBasicMaterial({
    color: 0xff8fbf,
    transparent: true,
    opacity: 0.34,
    depthWrite: false,
    side: THREE.DoubleSide,
    toneMapped: false,
  });

  for (const z of [-7.6, -2.4, 2.8, 7.8]) {
    const ribbon = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_WIDTH - 2.6, 0.22), silkMaterial.clone());
    ribbon.position.set(0, WALL_HEIGHT - 0.75, z);
    ribbon.rotation.x = -0.03;
    room.add(ribbon);
  }

  const candleMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd4a1,
    emissive: 0xff7a3d,
    emissiveIntensity: 0.45,
    roughness: 0.46,
  });
  const wickMaterial = new THREE.MeshBasicMaterial({ color: 0xfff0b8, toneMapped: false });

  for (const [x, z] of [[-7.85, -8.8], [7.85, -8.8], [-7.85, 6.8], [7.85, 6.8]]) {
    const candle = new THREE.Group();
    candle.position.set(x, 1.28, z);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.42, 12), candleMaterial);
    body.castShadow = true;
    candle.add(body);

    const flame = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 8), wickMaterial);
    flame.position.y = 0.28;
    flame.scale.y = 1.45;
    candle.add(flame);
    room.add(candle);
  }

  addThirdRoomFloatingCandles(room);
  addThirdRoomBooksAndPlush(room);
  addThirdRoomLamps(room);
}

function addThirdRoomFloatingCandles(room) {
  const candleMaterial = new THREE.MeshStandardMaterial({
    color: 0xffead0,
    emissive: 0xffb26d,
    emissiveIntensity: 0.28,
    roughness: 0.56,
  });
  const flameMaterial = new THREE.MeshBasicMaterial({
    color: 0xfff0a8,
    transparent: true,
    opacity: 0.94,
    toneMapped: false,
  });
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffbe7a,
    transparent: true,
    opacity: 0.2,
    depthWrite: false,
    toneMapped: false,
  });
  const placements = [
    [-6.9, 3.65, -7.8],
    [-1.65, 3.92, -7.65],
    [-4.8, 4.12, -4.5],
    [-7.05, 3.18, -1.1],
    [-5.6, 4.36, 3.0],
    [-7.15, 3.85, 7.2],
    [-2.55, 4.3, 8.85],
    [2.35, 3.92, 8.3],
    [6.8, 4.22, 5.5],
    [7.05, 3.34, 1.3],
    [3.45, 4.18, -3.6],
    [5.15, 4.46, -2.7],
    [7.0, 3.76, -6.2],
    [2.1, 4.12, -9.2],
  ];

  placements.forEach(([x, y, z], index) => {
    const candle = createFloatingCandle(candleMaterial, flameMaterial, glowMaterial, index);
    candle.position.set(x, y, z);
    candle.rotation.y = (index % 4) * 0.28;
    room.add(candle);
  });
}

function createFloatingCandle(candleMaterial, flameMaterial, glowMaterial, index) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.085, 0.1, 0.42, PERFORMANCE_MODE ? 8 : 12),
    candleMaterial,
  );
  body.castShadow = true;
  group.add(body);

  const wax = new THREE.Mesh(
    new THREE.CylinderGeometry(0.088, 0.088, 0.018, PERFORMANCE_MODE ? 8 : 12),
    new THREE.MeshBasicMaterial({ color: 0xfff8e8, toneMapped: false }),
  );
  wax.position.y = 0.22;
  group.add(wax);

  const flame = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, PERFORMANCE_MODE ? 8 : 12, PERFORMANCE_MODE ? 6 : 8),
    flameMaterial,
  );
  flame.position.y = 0.34;
  flame.scale.set(0.74, 1.38, 0.74);
  group.add(flame);

  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(0.34, PERFORMANCE_MODE ? 8 : 14, PERFORMANCE_MODE ? 6 : 10),
    glowMaterial,
  );
  glow.position.y = 0.32;
  group.add(glow);

  if (!PERFORMANCE_MODE && index % 4 === 0) {
    const light = new THREE.PointLight(0xffb06a, 0.72, 4.2, 2);
    light.position.y = 0.34;
    light.castShadow = false;
    light.userData.baseIntensity = 0.55;
    light.userData.flicker = 0.12;
    light.userData.phase = index * 1.6;
    roomLights.push(light);
    group.add(light);
  }

  return group;
}

function addThirdRoomBooksAndPlush(room) {
  const bookColors = [0x6b3554, 0x315b6b, 0x735c2e, 0x49376f, 0x446b50, 0x8a4659];
  const pageMaterial = new THREE.MeshStandardMaterial({
    color: 0xf2dcc2,
    roughness: 0.72,
  });
  const bookPlacements = [
    { x: -7.25, z: -6.1, count: 4, rotationY: 0.24 },
    { x: -4.25, z: -5.55, count: 3, rotationY: -0.18 },
    { x: -6.85, z: 1.3, count: 3, rotationY: -0.42 },
    { x: -7.15, z: 8.15, count: 5, rotationY: 0.16 },
    { x: 4.15, z: -5.95, count: 3, rotationY: 0.28 },
    { x: 7.2, z: -5.65, count: 4, rotationY: -0.26 },
    { x: 7.05, z: 4.35, count: 3, rotationY: 0.34 },
  ];

  bookPlacements.forEach((placement, placementIndex) => {
    const stack = createBookStack(placement.count, bookColors, pageMaterial, placementIndex);
    stack.position.set(placement.x, 0.02, placement.z);
    stack.rotation.y = placement.rotationY;
    room.add(stack);
  });

  const openBooks = [
    { x: -4.2, z: 9.2, rotationY: -0.32 },
    { x: 4.85, z: 8.65, rotationY: 0.38 },
    { x: -7.05, z: -3.25, rotationY: 0.78 },
  ];
  openBooks.forEach((placement) => {
    const book = createOpenBook(pageMaterial);
    book.position.set(placement.x, 0.035, placement.z);
    book.rotation.y = placement.rotationY;
    room.add(book);
  });

  const plushPlacements = [
    { x: -6.85, z: -8.2, scale: 0.88, color: 0xd8a889, accent: 0xffd3c5, rotationY: 0.62 },
    { x: -4.85, z: -6.45, scale: 0.7, color: 0xf0b9c8, accent: 0xffe1e9, rotationY: 0.34 },
    { x: 4.75, z: -6.45, scale: 0.68, color: 0xc4d5ff, accent: 0xe7edff, rotationY: -0.42 },
    { x: 6.95, z: -7.0, scale: 0.78, color: 0xc7b7ff, accent: 0xf4d6ff, rotationY: -0.58 },
    { x: -7.0, z: 4.85, scale: 0.72, color: 0xf2c9a2, accent: 0xffecce, rotationY: 1.05 },
    { x: 7.08, z: 8.2, scale: 0.82, color: 0xa8d8d2, accent: 0xd7fff9, rotationY: -0.92 },
  ];
  plushPlacements.forEach((placement, index) => {
    const plush = createPlushToy(placement, index);
    plush.position.set(placement.x, 0.08, placement.z);
    plush.rotation.y = placement.rotationY;
    plush.scale.setScalar(placement.scale);
    room.add(plush);
  });
}

function createBookStack(count, colors, pageMaterial, seed) {
  const group = new THREE.Group();

  for (let i = 0; i < count; i += 1) {
    const coverMaterial = new THREE.MeshStandardMaterial({
      color: colors[(seed + i) % colors.length],
      roughness: 0.62,
      metalness: 0.02,
    });
    const width = 0.76 + (i % 2) * 0.12;
    const depth = 0.46 + (i % 3) * 0.045;
    const height = 0.08;
    const book = new THREE.Group();
    const pages = new THREE.Mesh(new THREE.BoxGeometry(width * 0.92, height * 0.72, depth * 0.86), pageMaterial);
    pages.position.y = height / 2;
    book.add(pages);

    const cover = new THREE.Mesh(new THREE.BoxGeometry(width, height * 0.36, depth), coverMaterial);
    cover.position.y = height * 0.88;
    cover.castShadow = true;
    book.add(cover);

    const spine = new THREE.Mesh(
      new THREE.BoxGeometry(0.055, height * 0.5, depth * 1.02),
      coverMaterial,
    );
    spine.position.set(-width / 2 + 0.02, height * 0.9, 0);
    book.add(spine);

    book.position.set((i % 2) * 0.045, i * 0.078, (i % 3 - 1) * 0.022);
    book.rotation.y = (i - count / 2) * 0.055;
    group.add(book);
  }

  return group;
}

function createOpenBook(pageMaterial) {
  const group = new THREE.Group();
  const coverMaterial = new THREE.MeshStandardMaterial({
    color: 0x59385e,
    roughness: 0.6,
  });
  const leftCover = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.026, 0.74), coverMaterial);
  leftCover.position.set(-0.26, 0.015, 0);
  leftCover.rotation.z = -0.06;
  group.add(leftCover);

  const rightCover = leftCover.clone();
  rightCover.position.x = 0.26;
  rightCover.rotation.z = 0.06;
  group.add(rightCover);

  const leftPage = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.018, 0.66), pageMaterial);
  leftPage.position.set(-0.24, 0.04, 0);
  leftPage.rotation.z = -0.05;
  group.add(leftPage);

  const rightPage = leftPage.clone();
  rightPage.position.x = 0.24;
  rightPage.rotation.z = 0.05;
  group.add(rightPage);

  const lineMaterial = new THREE.MeshBasicMaterial({
    color: 0x8f6f62,
    transparent: true,
    opacity: 0.34,
  });
  for (let i = 0; i < 4; i += 1) {
    for (const side of [-1, 1]) {
      const line = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.006, 0.012), lineMaterial);
      line.position.set(side * 0.24, 0.055, -0.2 + i * 0.12);
      group.add(line);
    }
  }

  return group;
}

function createPlushToy(options, index) {
  const group = new THREE.Group();
  const plushMaterial = new THREE.MeshStandardMaterial({
    color: options.color,
    roughness: 0.92,
    metalness: 0,
  });
  const accentMaterial = new THREE.MeshStandardMaterial({
    color: options.accent,
    roughness: 0.94,
  });
  const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x19131c });

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.34, PERFORMANCE_MODE ? 12 : 20, PERFORMANCE_MODE ? 8 : 14), plushMaterial);
  body.position.y = 0.34;
  body.scale.set(0.92, 1.08, 0.72);
  group.add(body);

  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.2, PERFORMANCE_MODE ? 10 : 16, PERFORMANCE_MODE ? 8 : 12), accentMaterial);
  belly.position.set(0, 0.29, 0.23);
  belly.scale.set(0.9, 1.04, 0.26);
  group.add(belly);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, PERFORMANCE_MODE ? 12 : 20, PERFORMANCE_MODE ? 8 : 14), plushMaterial);
  head.position.y = 0.76;
  head.scale.set(0.94, 0.9, 0.86);
  group.add(head);

  for (const side of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.1, PERFORMANCE_MODE ? 8 : 12, PERFORMANCE_MODE ? 6 : 8), plushMaterial);
    ear.position.set(side * 0.18, 0.98, -0.02);
    ear.scale.set(index % 2 === 0 ? 0.9 : 0.66, index % 2 === 0 ? 0.9 : 1.42, 0.72);
    ear.rotation.z = side * 0.24;
    group.add(ear);

    const arm = new THREE.Mesh(new THREE.SphereGeometry(0.12, PERFORMANCE_MODE ? 8 : 12, PERFORMANCE_MODE ? 6 : 8), plushMaterial);
    arm.position.set(side * 0.31, 0.42, 0.04);
    arm.scale.set(0.72, 1.18, 0.58);
    arm.rotation.z = side * 0.62;
    group.add(arm);

    const foot = new THREE.Mesh(new THREE.SphereGeometry(0.13, PERFORMANCE_MODE ? 8 : 12, PERFORMANCE_MODE ? 6 : 8), accentMaterial);
    foot.position.set(side * 0.17, 0.08, 0.14);
    foot.scale.set(1.05, 0.46, 0.82);
    group.add(foot);

    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 6), eyeMaterial);
    eye.position.set(side * 0.08, 0.8, 0.22);
    group.add(eye);
  }

  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.034, 8, 6), eyeMaterial);
  nose.position.set(0, 0.74, 0.24);
  nose.scale.set(1.2, 0.78, 0.72);
  group.add(nose);

  return group;
}

function addThirdRoomLamps(room) {
  const lamps = [
    createFloorLamp({
      shadeColor: 0xffc27d,
      glowColor: 0xffae75,
      height: 2.75,
      shadeRadius: 0.42,
      style: "classic",
    }, 0),
    createFloorLamp({
      shadeColor: 0xf8a8d8,
      glowColor: 0xff76bd,
      height: 2.45,
      shadeRadius: 0.36,
      style: "tulip",
    }, 1),
    createNightLamp({
      shadeColor: 0xb6e3ff,
      glowColor: 0x8ad9ff,
      baseColor: 0x31465f,
      height: 0.72,
    }, 2),
    createNightLamp({
      shadeColor: 0xfff0a7,
      glowColor: 0xffd276,
      baseColor: 0x5c3644,
      height: 0.62,
    }, 3),
    createNightLamp({
      shadeColor: 0xd7b8ff,
      glowColor: 0xc184ff,
      baseColor: 0x3b315f,
      height: 0.82,
    }, 4),
  ];
  const placements = [
    { x: -3.95, y: 0, z: -9.25, rotationY: Math.PI / 10 },
    { x: 3.95, y: 0, z: -9.25, rotationY: -Math.PI / 10 },
    { x: -7.75, y: 0.72, z: 8.9, rotationY: Math.PI / 2 },
    { x: 7.75, y: 0.72, z: 0.8, rotationY: -Math.PI / 2 },
    { x: -7.75, y: 0.72, z: -1.8, rotationY: Math.PI / 2 },
  ];

  lamps.forEach((lamp, index) => {
    const placement = placements[index];
    lamp.position.set(placement.x, placement.y, placement.z);
    lamp.rotation.y = placement.rotationY;
    room.add(lamp);
  });
}

function createFloorLamp(options, index) {
  const group = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({
    color: 0x4b3840,
    roughness: 0.36,
    metalness: 0.38,
  });
  const shade = new THREE.MeshStandardMaterial({
    color: options.shadeColor,
    emissive: options.glowColor,
    emissiveIntensity: 0.42,
    roughness: 0.55,
    metalness: 0.02,
    transparent: true,
    opacity: 0.88,
  });
  const glow = new THREE.MeshBasicMaterial({
    color: options.glowColor,
    transparent: true,
    opacity: 0.42,
    depthWrite: false,
    toneMapped: false,
  });

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.36, 0.08, 18), metal);
  base.position.y = 0.04;
  group.add(base);

  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, options.height, 10), metal);
  pole.position.y = options.height / 2;
  group.add(pole);

  if (options.style === "tulip") {
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.85, 8), metal);
    arm.position.set(-0.26, options.height - 0.12, 0);
    arm.rotation.z = Math.PI / 2.7;
    group.add(arm);
  }

  const shadeGeometry = options.style === "tulip"
    ? new THREE.SphereGeometry(options.shadeRadius, PERFORMANCE_MODE ? 12 : 20, PERFORMANCE_MODE ? 8 : 14, 0, Math.PI * 2, 0, Math.PI * 0.55)
    : new THREE.CylinderGeometry(options.shadeRadius * 0.78, options.shadeRadius, 0.56, PERFORMANCE_MODE ? 14 : 24, 1, true);
  const shadeMesh = new THREE.Mesh(shadeGeometry, shade);
  shadeMesh.position.set(options.style === "tulip" ? -0.52 : 0, options.height + 0.04, 0);
  if (options.style !== "tulip") {
    shadeMesh.rotation.y = Math.PI / 6;
  }
  group.add(shadeMesh);

  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 10), glow);
  bulb.position.copy(shadeMesh.position);
  bulb.position.y -= 0.03;
  group.add(bulb);

  if (!PERFORMANCE_MODE || index === 0) {
    const light = new THREE.PointLight(options.glowColor, PERFORMANCE_MODE ? 1.2 : 1.9, 5.8, 2);
    light.position.copy(bulb.position);
    light.castShadow = false;
    light.userData.baseIntensity = PERFORMANCE_MODE ? 0.9 : 1.45;
    light.userData.flicker = 0.08;
    light.userData.phase = index * 1.9;
    roomLights.push(light);
    group.add(light);
  }

  return group;
}

function createNightLamp(options, index) {
  const group = new THREE.Group();
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.24, 0.16, 14),
    new THREE.MeshStandardMaterial({
      color: options.baseColor,
      roughness: 0.42,
      metalness: 0.18,
    }),
  );
  base.position.y = options.height * 0.18;
  group.add(base);

  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.026, 0.032, options.height * 0.52, 8),
    new THREE.MeshStandardMaterial({
      color: 0x5e4350,
      roughness: 0.36,
      metalness: 0.32,
    }),
  );
  stem.position.y = options.height * 0.48;
  group.add(stem);

  const shadeMaterial = new THREE.MeshStandardMaterial({
    color: options.shadeColor,
    emissive: options.glowColor,
    emissiveIntensity: 0.58,
    roughness: 0.5,
    transparent: true,
    opacity: 0.86,
  });
  const shade = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.43, options.height * 0.38, PERFORMANCE_MODE ? 14 : 24, 1, true),
    shadeMaterial,
  );
  shade.position.y = options.height * 0.78;
  group.add(shade);

  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(0.36, PERFORMANCE_MODE ? 10 : 18, PERFORMANCE_MODE ? 8 : 12),
    new THREE.MeshBasicMaterial({
      color: options.glowColor,
      transparent: true,
      opacity: 0.26,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  halo.position.copy(shade.position);
  group.add(halo);

  if (!PERFORMANCE_MODE || index < 3) {
    const light = new THREE.PointLight(options.glowColor, PERFORMANCE_MODE ? 0.85 : 1.35, 4.2, 2);
    light.position.copy(shade.position);
    light.castShadow = false;
    light.userData.baseIntensity = PERFORMANCE_MODE ? 0.68 : 1.05;
    light.userData.flicker = 0.06;
    light.userData.phase = index * 2.2;
    roomLights.push(light);
    group.add(light);
  }

  return group;
}

function addThirdRoomRomanticLighting(centerZ) {
  const warm = new THREE.PointLight(0xffb38a, PERFORMANCE_MODE ? 2.2 : 3.1, 15, 2);
  warm.position.set(-4.2, 3.05, centerZ - 2.6);
  warm.castShadow = false;
  warm.userData.baseIntensity = PERFORMANCE_MODE ? 1.85 : 2.65;
  warm.userData.flicker = 0.18;
  warm.userData.phase = 1.2;
  roomLights.push(warm);
  scene.add(warm);

  const rose = new THREE.PointLight(0xff73b4, PERFORMANCE_MODE ? 1.35 : 2.15, 12, 2);
  rose.position.set(4.8, 3.35, centerZ + 4.1);
  rose.castShadow = false;
  rose.userData.baseIntensity = PERFORMANCE_MODE ? 1.1 : 1.75;
  rose.userData.flicker = 0.14;
  rose.userData.phase = 4.4;
  roomLights.push(rose);
  scene.add(rose);
}

function addFourthRoomDollhouseLighting(centerZ) {
  const lights = [
    { color: 0xff8ec8, x: -5.6, y: 3.1, z: centerZ + 6.4, intensity: 1.95, distance: 12, phase: 0.6 },
    { color: 0xffb0dc, x: 4.9, y: 3.35, z: centerZ + 1.0, intensity: 1.78, distance: 11, phase: 2.2 },
    { color: 0xffd3ec, x: -3.2, y: 3.5, z: centerZ - 6.8, intensity: 1.48, distance: 10, phase: 4.1 },
  ];

  lights.forEach((config) => {
    const light = new THREE.PointLight(
      config.color,
      PERFORMANCE_MODE ? config.intensity * 0.72 : config.intensity,
      config.distance,
      2,
    );
    light.position.set(config.x, config.y, config.z);
    light.castShadow = false;
    light.userData.baseIntensity = PERFORMANCE_MODE ? config.intensity * 0.58 : config.intensity * 0.86;
    light.userData.flicker = 0.08;
    light.userData.phase = config.phase;
    roomLights.push(light);
    scene.add(light);
  });
}

function addFloorRunes(room, index) {
  const runeMaterial = new THREE.MeshStandardMaterial({
    color: index % 2 === 0 ? 0xbdd9a6 : 0xe7c27d,
    emissive: index % 2 === 0 ? 0x254f46 : 0x5b3d21,
    emissiveIntensity: 0.65,
    roughness: 0.5,
  });

  for (let lane = -1; lane <= 1; lane += 2) {
    const path = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.025, ROOM_LENGTH - 5), runeMaterial);
    path.position.set(lane * 3.6, 0.02, 0);
    room.add(path);
  }

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.55, 0.045, 8, 48),
    runeMaterial,
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(0, 0.06, 0);
  room.add(ring);
}

function addCeilingBeams(room, material) {
  for (let i = -1; i <= 1; i += 1) {
    const beam = new THREE.Mesh(
      new THREE.BoxGeometry(ROOM_WIDTH + 1.4, 0.24, 0.38),
      material,
    );
    beam.position.set(0, WALL_HEIGHT - 0.15, i * 7.2);
    beam.castShadow = true;
    room.add(beam);
  }
}

function addRoomObjects(room, index) {
  const crystalColors = [0x79ffe1, 0xffd779, 0xbad7ff, 0xe8f18e];
  const crystalMaterial = new THREE.MeshStandardMaterial({
    color: crystalColors[index % crystalColors.length],
    emissive: crystalColors[index % crystalColors.length],
    emissiveIntensity: 1.15,
    roughness: 0.35,
    metalness: 0.08,
  });
  const stoneMaterial = new THREE.MeshStandardMaterial({
    color: 0x606a65,
    roughness: 0.88,
  });

  const positions = [
    [-6.6, -7.5],
    [6.6, -7.5],
    [-6.6, 7.5],
    [6.6, 7.5],
  ];

  positions.forEach(([x, z], objectIndex) => {
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.86, 0.48, 10), stoneMaterial);
    plinth.position.set(x, 0.24, z);
    plinth.castShadow = true;
    plinth.receiveShadow = true;
    room.add(plinth);

    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.58, 0), crystalMaterial);
    crystal.position.set(x, 1.08 + (objectIndex % 2) * 0.12, z);
    crystal.rotation.set(0.2, objectIndex * 0.8, 0.4);
    crystal.castShadow = true;
    room.add(crystal);
  });

  const pillarMaterial = new THREE.MeshStandardMaterial({
    color: index % 2 === 0 ? 0x73816c : 0x667b7a,
    roughness: 0.84,
  });
  for (let i = -1; i <= 1; i += 2) {
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.46, 3.5, 14), pillarMaterial);
    pillar.position.set(i * 7.35, 1.75, 0);
    pillar.castShadow = true;
    pillar.receiveShadow = true;
    room.add(pillar);
  }
}

function addSecondRoomBirthdayDecor(room) {
  addWallBirthdayRibbons(room);
  addCeilingBirthdayStreamers(room);
  addBirthdayPennantGarlands(room);
  addSecondRoomPhotoGallery(room);
}

function addSecondRoomPhotoGallery(room) {
  const sideX = ROOM_WIDTH / 2 - 0.045;
  const frontZ = ROOM_LENGTH / 2 - WALL_THICKNESS * 0.5 - 0.055;
  const placements = [
    { photoIndex: 0, x: -sideX, y: 2.75, z: 8.55, rotationY: Math.PI / 2 },
    { photoIndex: 1, x: sideX, y: 2.75, z: 8.2, rotationY: -Math.PI / 2 },
    { photoIndex: 2, x: -sideX, y: 2.78, z: 3.5, rotationY: Math.PI / 2 },
    { photoIndex: 3, x: sideX, y: 2.78, z: 3.1, rotationY: -Math.PI / 2 },
    { photoIndex: 4, x: -sideX, y: 2.86, z: -1.65, rotationY: Math.PI / 2, width: 1.7, height: 2.2 },
    { photoIndex: 5, x: sideX, y: 2.86, z: -1.95, rotationY: -Math.PI / 2 },
    { photoIndex: 6, x: -sideX, y: 2.78, z: -6.95, rotationY: Math.PI / 2 },
    { photoIndex: 7, x: sideX, y: 2.78, z: -7.15, rotationY: -Math.PI / 2, width: 2.35, height: 1.42 },
    { photoIndex: 8, x: -5.75, y: 2.9, z: frontZ, rotationY: Math.PI },
    { photoIndex: 9, x: 5.75, y: 2.9, z: frontZ, rotationY: Math.PI },
  ];

  placements.forEach((placement) => {
    const frame = createRoom2PhotoFrame(
      ROOM2_GALLERY_PHOTO_URLS[placement.photoIndex],
      placement.width ?? 1.5,
      placement.height ?? 1.95,
    );
    frame.position.set(placement.x, placement.y, placement.z);
    frame.rotation.y = placement.rotationY;
    room.add(frame);
  });
}

function createRoom2PhotoFrame(photoUrl, width, height) {
  const rail = 0.09;
  const texture = loader.load(photoUrl);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = PERFORMANCE_MODE ? 1 : 4;

  const group = new THREE.Group();
  group.name = "room2GalleryPhotoFrame";

  const backing = new THREE.Mesh(
    new THREE.BoxGeometry(width + rail * 2.25, height + rail * 2.25, 0.07),
    new THREE.MeshStandardMaterial({
      color: 0x17334a,
      emissive: 0x143e68,
      emissiveIntensity: 0.28,
      roughness: 0.44,
      metalness: 0.18,
    }),
  );
  backing.position.z = -0.04;
  group.add(backing);

  const photo = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.FrontSide,
      toneMapped: false,
    }),
  );
  photo.position.z = 0.012;
  group.add(photo);

  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({
      color: 0xbef5ff,
      transparent: true,
      opacity: 0.1,
      depthWrite: false,
      side: THREE.FrontSide,
      toneMapped: false,
    }),
  );
  glass.position.z = 0.018;
  group.add(glass);

  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x9beeff,
    emissive: 0x2fb8ff,
    emissiveIntensity: 0.38,
    roughness: 0.26,
    metalness: 0.16,
  });
  const horizontal = new THREE.BoxGeometry(width + rail * 2.2, rail, 0.12);
  const vertical = new THREE.BoxGeometry(rail, height + rail * 2.2, 0.12);
  for (const y of [-height / 2 - rail * 0.55, height / 2 + rail * 0.55]) {
    const bar = new THREE.Mesh(horizontal, frameMaterial);
    bar.position.set(0, y, 0.035);
    group.add(bar);
  }
  for (const x of [-width / 2 - rail * 0.55, width / 2 + rail * 0.55]) {
    const bar = new THREE.Mesh(vertical, frameMaterial);
    bar.position.set(x, 0, 0.035);
    group.add(bar);
  }

  return group;
}

function addWallBirthdayRibbons(room) {
  const sideRibbonRows = PERFORMANCE_MODE ? 3 : 4;
  const hangingCount = PERFORMANCE_MODE ? 5 : 9;
  const backRibbonCount = PERFORMANCE_MODE ? 5 : 8;

  for (const side of [-1, 1]) {
    const x = side * (ROOM_WIDTH / 2 - 0.08);

    for (let i = 0; i < sideRibbonRows; i += 1) {
      const color = PARTY_LIGHT_COLORS[(i + (side > 0 ? 1 : 4)) % PARTY_LIGHT_COLORS.length];
      const ribbon = new THREE.Mesh(
        new THREE.BoxGeometry(0.045, 0.075, ROOM_LENGTH - 2.4),
        createPartyRibbonMaterial(color),
      );
      ribbon.position.set(x, 3.15 + i * 0.42, 0);
      ribbon.rotation.x = side * (0.04 + i * 0.015);
      room.add(ribbon);
    }

    for (let i = 0; i < hangingCount; i += 1) {
      const color = PARTY_LIGHT_COLORS[(i * 2 + (side > 0 ? 0 : 3)) % PARTY_LIGHT_COLORS.length];
      const hanging = new THREE.Mesh(
        new THREE.BoxGeometry(0.052, THREE.MathUtils.randFloat(0.86, 1.45), 0.105),
        createPartyRibbonMaterial(color),
      );
      hanging.position.set(
        x - side * 0.02,
        3.25 - (i % 3) * 0.16,
        THREE.MathUtils.mapLinear(i, 0, hangingCount - 1, -9.4, 9.4),
      );
      hanging.rotation.z = side * THREE.MathUtils.randFloat(0.05, 0.18);
      hanging.rotation.y = side * Math.PI * 0.5;
      room.add(hanging);
    }
  }

  for (let i = 0; i < backRibbonCount; i += 1) {
    const x = THREE.MathUtils.mapLinear(i, 0, backRibbonCount - 1, -7.2, 7.2);
    if (Math.abs(x) < PHOTO_GATE_WIDTH / 2 + 0.45) {
      continue;
    }

    const color = PARTY_LIGHT_COLORS[(i + 2) % PARTY_LIGHT_COLORS.length];
    const backRibbon = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, THREE.MathUtils.randFloat(0.75, 1.25), 0.045),
      createPartyRibbonMaterial(color),
    );
    backRibbon.position.set(x, 3.7, -ROOM_LENGTH / 2 + 0.15);
    backRibbon.rotation.z = THREE.MathUtils.randFloat(-0.14, 0.14);
    room.add(backRibbon);
  }
}

function addCeilingBirthdayStreamers(room) {
  const streamerZ = PERFORMANCE_MODE ? [-3.7, 1.2, 6.4] : [-4.9, -1.3, 2.3, 5.9, 9.1];

  streamerZ.forEach((z, index) => {
    const points = [];
    const pointCount = PERFORMANCE_MODE ? 6 : 8;

    for (let i = 0; i <= pointCount; i += 1) {
      const x = THREE.MathUtils.mapLinear(i, 0, pointCount, -ROOM_WIDTH / 2 + 1.2, ROOM_WIDTH / 2 - 1.2);
      const y = WALL_HEIGHT - 0.24 - Math.sin((i / pointCount) * Math.PI) * 0.16;
      points.push(new THREE.Vector3(x, y, z + Math.sin(i * 1.7 + index) * 0.18));
    }

    const streamer = new THREE.Mesh(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(points),
        PERFORMANCE_MODE ? 24 : 56,
        0.025,
        PERFORMANCE_MODE ? 4 : 7,
        false,
      ),
      createPartyRibbonMaterial(PARTY_LIGHT_COLORS[index % PARTY_LIGHT_COLORS.length]),
    );
    streamer.castShadow = false;
    room.add(streamer);

    for (let i = 1; i < points.length - 1; i += 2) {
      if (Math.abs(points[i].x) < 1.35) {
        continue;
      }

      const drop = new THREE.Mesh(
        new THREE.BoxGeometry(0.07, 0.34 + (i % 3) * 0.1, 0.03),
        createPartyRibbonMaterial(PARTY_LIGHT_COLORS[(index + i) % PARTY_LIGHT_COLORS.length]),
      );
      drop.position.copy(points[i]).add(new THREE.Vector3(0, -0.24, 0));
      drop.rotation.y = Math.PI / 2;
      drop.rotation.z = Math.sin(i + index) * 0.22;
      room.add(drop);
    }
  });
}

function addBirthdayPennantGarlands(room) {
  const garlands = [
    { z: 7.4, y: 4.62, width: 13.4 },
  ];

  garlands.forEach((garland, garlandIndex) => {
    const cord = new THREE.Mesh(
      new THREE.BoxGeometry(garland.width, 0.035, 0.035),
      new THREE.MeshBasicMaterial({ color: 0xf8df80, toneMapped: false }),
    );
    cord.position.set(0, garland.y, garland.z);
    room.add(cord);

    const pennantCount = PERFORMANCE_MODE
      ? (garlandIndex === 0 ? 7 : 5)
      : (garlandIndex === 0 ? 11 : 8);
    for (let i = 0; i < pennantCount; i += 1) {
      const pennant = new THREE.Mesh(
        createPennantGeometry(0.42, 0.52),
        createPartyRibbonMaterial(PARTY_LIGHT_COLORS[(i + garlandIndex * 2) % PARTY_LIGHT_COLORS.length]),
      );
      pennant.position.set(
        THREE.MathUtils.mapLinear(i, 0, pennantCount - 1, -garland.width / 2 + 0.45, garland.width / 2 - 0.45),
        garland.y - 0.36 - Math.sin(i * 0.75) * 0.08,
        garland.z,
      );
      pennant.rotation.z = Math.sin(i * 0.8 + garlandIndex) * 0.1;
      room.add(pennant);
    }
  });
}

function createPennantGeometry(width, height) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute([
    -width / 2, 0, 0,
    width / 2, 0, 0,
    0, -height, 0,
  ], 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute([
    0, 1,
    1, 1,
    0.5, 0,
  ], 2));
  geometry.setIndex([0, 1, 2]);
  geometry.computeVertexNormals();
  return geometry;
}

function createPartyRibbonMaterial(color) {
  const key = `${PERFORMANCE_MODE ? "basic" : "standard"}-${color.toString(16)}`;

  if (!partyRibbonMaterialCache.has(key)) {
    const material = PERFORMANCE_MODE
      ? new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        toneMapped: false,
      })
      : new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.28,
        roughness: 0.38,
        metalness: 0.04,
        side: THREE.DoubleSide,
      });

    partyRibbonMaterialCache.set(key, material);
  }

  return partyRibbonMaterialCache.get(key);
}

function createCaveRockMaterial(baseColor, crackColor) {
  const canvas = document.createElement("canvas");
  const textureSize = PERFORMANCE_MODE ? 256 : 512;
  canvas.width = textureSize;
  canvas.height = textureSize;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const grainCount = PERFORMANCE_MODE ? 850 : 2200;
  for (let i = 0; i < grainCount; i += 1) {
    const shade = THREE.MathUtils.randInt(-22, 26);
    const value = THREE.MathUtils.clamp(78 + shade, 32, 120);
    ctx.fillStyle = `rgba(${value}, ${value}, ${Math.max(34, value - 8)}, ${THREE.MathUtils.randFloat(0.035, 0.11)})`;
    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1 + Math.random() * 3, 1 + Math.random() * 3);
  }

  ctx.strokeStyle = crackColor;
  ctx.lineWidth = 2;
  const crackCount = PERFORMANCE_MODE ? 12 : 28;
  for (let i = 0; i < crackCount; i += 1) {
    ctx.beginPath();
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    ctx.moveTo(x, y);
    for (let j = 0; j < 5; j += 1) {
      x += THREE.MathUtils.randFloat(-42, 42);
      y += THREE.MathUtils.randFloat(-42, 42);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3.5, 4.5);

  return new THREE.MeshStandardMaterial({
    map: texture,
    color: 0x8a8775,
    roughness: 0.96,
    metalness: 0,
  });
}

function createCaveFloorMaterial() {
  const canvas = document.createElement("canvas");
  const textureSize = PERFORMANCE_MODE ? 256 : 512;
  canvas.width = textureSize;
  canvas.height = textureSize;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#8d7b58";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const grainCount = PERFORMANCE_MODE ? 1600 : 5200;
  for (let i = 0; i < grainCount; i += 1) {
    const sand = THREE.MathUtils.randInt(105, 178);
    ctx.fillStyle = `rgba(${sand}, ${Math.max(88, sand - 20)}, ${Math.max(58, sand - 56)}, ${THREE.MathUtils.randFloat(0.05, 0.18)})`;
    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1 + Math.random() * 2, 1 + Math.random() * 2);
  }

  const stoneCount = PERFORMANCE_MODE ? 24 : 46;
  for (let i = 0; i < stoneCount; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const rx = THREE.MathUtils.randFloat(12, 46);
    const ry = THREE.MathUtils.randFloat(7, 28);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.random() * Math.PI);
    ctx.fillStyle = i % 2 === 0 ? "rgba(88, 88, 78, 0.42)" : "rgba(178, 155, 104, 0.34)";
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.strokeStyle = "rgba(74, 66, 50, 0.28)";
  ctx.lineWidth = 2;
  const crackCount = PERFORMANCE_MODE ? 18 : 34;
  for (let i = 0; i < crackCount; i += 1) {
    ctx.beginPath();
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.moveTo(x, y);
    ctx.lineTo(x + THREE.MathUtils.randFloat(-28, 28), y + THREE.MathUtils.randFloat(-18, 18));
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(ROOM_WIDTH / 5, ROOM_LENGTH / 5);

  return new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.94,
    metalness: 0,
  });
}

function createThirdRoomFloorMaterial() {
  const canvas = document.createElement("canvas");
  const textureSize = PERFORMANCE_MODE ? 128 : 256;
  canvas.width = textureSize;
  canvas.height = textureSize;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#3b2736");
  gradient.addColorStop(0.55, "#231e2e");
  gradient.addColorStop(1, "#4a2f35");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(255, 197, 171, 0.18)";
  ctx.lineWidth = 2;
  const grid = textureSize / 4;
  for (let x = 0; x <= textureSize; x += grid) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, textureSize);
    ctx.stroke();
  }
  for (let y = 0; y <= textureSize; y += grid) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(textureSize, y);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255, 206, 188, 0.12)";
  for (let i = 0; i < (PERFORMANCE_MODE ? 28 : 64); i += 1) {
    ctx.beginPath();
    ctx.arc(Math.random() * textureSize, Math.random() * textureSize, THREE.MathUtils.randFloat(1, 4), 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(ROOM_WIDTH / 5, ROOM_LENGTH / 5);

  return new THREE.MeshStandardMaterial({
    map: texture,
    color: 0xe6c0b6,
    roughness: 0.78,
    metalness: 0.02,
    emissive: 0x1d121b,
    emissiveIntensity: 0.18,
  });
}

function createDollhouseFloorMaterial() {
  const canvas = document.createElement("canvas");
  const textureSize = PERFORMANCE_MODE ? 128 : 256;
  canvas.width = textureSize;
  canvas.height = textureSize;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#ffc3df";
  ctx.fillRect(0, 0, textureSize, textureSize);
  const plankHeight = textureSize / 7;
  for (let y = 0; y < textureSize; y += plankHeight) {
    ctx.fillStyle = y / plankHeight % 2 === 0 ? "rgba(255, 240, 249, 0.42)" : "rgba(255, 106, 171, 0.16)";
    ctx.fillRect(0, y, textureSize, plankHeight);
    ctx.strokeStyle = "rgba(179, 62, 121, 0.24)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(textureSize, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(255, 255, 255, 0.36)";
  ctx.lineWidth = 1;
  for (let x = textureSize / 5; x < textureSize; x += textureSize / 5) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + Math.sin(x) * 8, textureSize);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(ROOM_WIDTH / 4.5, ROOM_LENGTH / 5.5);

  return new THREE.MeshStandardMaterial({
    map: texture,
    color: 0xffc1dc,
    roughness: 0.7,
    metalness: 0.02,
    emissive: 0x3b1027,
    emissiveIntensity: 0.12,
  });
}

function createJungleFloorMaterial() {
  const canvas = document.createElement("canvas");
  const textureSize = PERFORMANCE_MODE ? 256 : 512;
  canvas.width = textureSize;
  canvas.height = textureSize;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createRadialGradient(textureSize * 0.48, textureSize * 0.42, 12, textureSize / 2, textureSize / 2, textureSize * 0.78);
  gradient.addColorStop(0, "#4fa648");
  gradient.addColorStop(0.36, "#2f7d3f");
  gradient.addColorStop(0.72, "#1d5733");
  gradient.addColorStop(1, "#103323");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, textureSize, textureSize);

  const bladeCount = PERFORMANCE_MODE ? 1300 : 3600;
  for (let i = 0; i < bladeCount; i += 1) {
    const x = Math.random() * textureSize;
    const y = Math.random() * textureSize;
    const length = THREE.MathUtils.randFloat(4, 16);
    const angle = THREE.MathUtils.randFloat(-1.2, 1.2) - Math.PI / 2;
    const green = THREE.MathUtils.randInt(72, 190);
    ctx.strokeStyle = `rgba(${Math.max(16, green - 72)}, ${green}, ${Math.max(24, green - 58)}, ${THREE.MathUtils.randFloat(0.18, 0.48)})`;
    ctx.lineWidth = THREE.MathUtils.randFloat(0.65, 1.7);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    ctx.stroke();
  }

  const cloverCount = PERFORMANCE_MODE ? 42 : 110;
  for (let i = 0; i < cloverCount; i += 1) {
    const x = Math.random() * textureSize;
    const y = Math.random() * textureSize;
    const radius = THREE.MathUtils.randFloat(3, 8);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(THREE.MathUtils.randFloat(0, Math.PI));
    ctx.fillStyle = `rgba(86, ${THREE.MathUtils.randInt(148, 220)}, 74, ${THREE.MathUtils.randFloat(0.12, 0.28)})`;
    for (let j = 0; j < 3; j += 1) {
      const angle = (j / 3) * Math.PI * 2;
      ctx.beginPath();
      ctx.ellipse(Math.cos(angle) * radius * 0.7, Math.sin(angle) * radius * 0.7, radius, radius * 0.58, angle, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(ROOM_WIDTH / 6.2, ROOM_LENGTH / 6.6);
  texture.anisotropy = PERFORMANCE_MODE ? 1 : 4;

  return new THREE.MeshStandardMaterial({
    map: texture,
    color: 0xb7e58b,
    roughness: 0.88,
    metalness: 0,
    emissive: 0x0b321f,
    emissiveIntensity: 0.12,
  });
}

function createGraveyardFloorMaterial() {
  const canvas = document.createElement("canvas");
  const textureSize = PERFORMANCE_MODE ? 256 : 512;
  canvas.width = textureSize;
  canvas.height = textureSize;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createRadialGradient(
    textureSize * 0.48,
    textureSize * 0.45,
    textureSize * 0.08,
    textureSize * 0.5,
    textureSize * 0.5,
    textureSize * 0.75,
  );
  gradient.addColorStop(0, "#354038");
  gradient.addColorStop(0.45, "#252f2a");
  gradient.addColorStop(1, "#151b1a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, textureSize, textureSize);

  const speckCount = PERFORMANCE_MODE ? 1050 : 2800;
  for (let i = 0; i < speckCount; i += 1) {
    const green = THREE.MathUtils.randInt(35, 78);
    ctx.fillStyle = `rgba(${THREE.MathUtils.randInt(25, 55)}, ${green}, ${THREE.MathUtils.randInt(30, 55)}, ${THREE.MathUtils.randFloat(0.12, 0.34)})`;
    const radius = THREE.MathUtils.randFloat(0.6, 2.4);
    ctx.beginPath();
    ctx.arc(Math.random() * textureSize, Math.random() * textureSize, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = "rgba(122, 139, 126, 0.13)";
  ctx.lineWidth = 2;
  for (let y = 20; y < textureSize; y += 46) {
    ctx.beginPath();
    for (let x = 0; x <= textureSize; x += 18) {
      const offset = Math.sin(x * 0.045 + y * 0.02) * 5;
      if (x === 0) ctx.moveTo(x, y + offset);
      else ctx.lineTo(x, y + offset);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(ROOM_WIDTH / 5.2, ROOM_LENGTH / 5.8);
  texture.anisotropy = PERFORMANCE_MODE ? 1 : 4;

  return new THREE.MeshStandardMaterial({
    map: texture,
    color: 0x879287,
    roughness: 0.98,
    metalness: 0,
    emissive: 0x0b1210,
    emissiveIntensity: 0.18,
  });
}

function createBeachFloorMaterial() {
  const canvas = document.createElement("canvas");
  const textureSize = PERFORMANCE_MODE ? 256 : 512;
  canvas.width = textureSize;
  canvas.height = textureSize;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, textureSize, textureSize);
  gradient.addColorStop(0, "#e9d79b");
  gradient.addColorStop(0.45, "#d8b86f");
  gradient.addColorStop(1, "#f3dfaa");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, textureSize, textureSize);

  const grainCount = PERFORMANCE_MODE ? 1600 : 4300;
  for (let i = 0; i < grainCount; i += 1) {
    const warm = THREE.MathUtils.randInt(180, 248);
    const alpha = THREE.MathUtils.randFloat(0.08, 0.28);
    ctx.fillStyle = `rgba(${warm}, ${THREE.MathUtils.randInt(145, 205)}, ${THREE.MathUtils.randInt(82, 132)}, ${alpha})`;
    ctx.fillRect(Math.random() * textureSize, Math.random() * textureSize, 1.2, 1.2);
  }

  ctx.strokeStyle = "rgba(126, 93, 42, 0.13)";
  ctx.lineWidth = 2;
  for (let y = 24; y < textureSize; y += 34) {
    ctx.beginPath();
    for (let x = 0; x <= textureSize; x += 16) {
      const wave = y + Math.sin(x * 0.035 + y * 0.05) * 4;
      if (x === 0) {
        ctx.moveTo(x, wave);
      } else {
        ctx.lineTo(x, wave);
      }
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(ROOM_WIDTH / 5.8, ROOM_LENGTH / 5.8);
  texture.anisotropy = PERFORMANCE_MODE ? 1 : 4;

  return new THREE.MeshStandardMaterial({
    map: texture,
    color: 0xf0d58d,
    roughness: 0.92,
    metalness: 0,
    emissive: 0x3b2612,
    emissiveIntensity: 0.08,
  });
}

function createSoccerStadiumFloorMaterial() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  const stripeCount = 10;
  for (let i = 0; i < stripeCount; i += 1) {
    const y = i * canvas.height / stripeCount;
    const gradient = ctx.createLinearGradient(0, y, canvas.width, y + canvas.height / stripeCount);
    gradient.addColorStop(0, i % 2 === 0 ? "#245f35" : "#2f7a42");
    gradient.addColorStop(0.55, i % 2 === 0 ? "#2f7a42" : "#3d8b4d");
    gradient.addColorStop(1, i % 2 === 0 ? "#235932" : "#347c45");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, y, canvas.width, canvas.height / stripeCount + 2);
  }

  ctx.globalAlpha = 0.16;
  ctx.strokeStyle = "#93d79e";
  ctx.lineWidth = 2;
  const grassCount = PERFORMANCE_MODE ? 180 : 420;
  for (let i = 0; i < grassCount; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + THREE.MathUtils.randFloat(-8, 8), y + THREE.MathUtils.randFloat(3, 12));
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  ctx.strokeStyle = "rgba(244, 255, 236, 0.92)";
  ctx.lineWidth = 18;
  ctx.lineCap = "round";
  ctx.strokeRect(80, 70, 864, 884);
  ctx.beginPath();
  ctx.moveTo(80, 512);
  ctx.lineTo(944, 512);
  ctx.stroke();

  ctx.lineWidth = 15;
  ctx.beginPath();
  ctx.arc(512, 512, 116, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "rgba(244, 255, 236, 0.92)";
  ctx.beginPath();
  ctx.arc(512, 512, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineWidth = 14;
  ctx.strokeRect(286, 70, 452, 118);
  ctx.strokeRect(372, 70, 280, 56);
  ctx.strokeRect(286, 836, 452, 118);
  ctx.strokeRect(372, 898, 280, 56);

  ctx.setLineDash([26, 20]);
  ctx.lineWidth = 8;
  ctx.strokeStyle = "rgba(244, 255, 236, 0.42)";
  ctx.beginPath();
  ctx.arc(512, 164, 88, 0.08 * Math.PI, 0.92 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(512, 860, 88, 1.08 * Math.PI, 1.92 * Math.PI);
  ctx.stroke();
  ctx.setLineDash([]);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = PERFORMANCE_MODE ? 1 : 4;

  return new THREE.MeshStandardMaterial({
    map: texture,
    color: 0xe8ffe0,
    roughness: 0.94,
    metalness: 0,
    emissive: 0x0f3a22,
    emissiveIntensity: 0.08,
  });
}

function createFloorMaterial(colorA, colorB) {
  const canvas = document.createElement("canvas");
  const textureSize = PERFORMANCE_MODE ? 128 : 256;
  canvas.width = textureSize;
  canvas.height = textureSize;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = colorA;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = colorB;
  ctx.lineWidth = 3;

  const tileStep = textureSize / 4;
  for (let x = 0; x <= canvas.width; x += tileStep) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y <= canvas.height; y += tileStep) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(255, 244, 190, 0.22)";
  ctx.lineWidth = 2;
  const runeCount = PERFORMANCE_MODE ? 8 : 18;
  for (let i = 0; i < runeCount; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.beginPath();
    ctx.arc(x, y, 1.8 + Math.random() * 4, 0, Math.PI * 2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(ROOM_WIDTH / 6, ROOM_LENGTH / 6);

  return new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.86,
    metalness: 0,
  });
}

function createSparkles(centerZ, roomIndex) {
  const count = SPARKLE_COUNT;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const phases = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = THREE.MathUtils.randFloatSpread(ROOM_WIDTH - 2);
    positions[i * 3 + 1] = THREE.MathUtils.randFloat(0.65, WALL_HEIGHT - 0.7);
    positions[i * 3 + 2] = centerZ + THREE.MathUtils.randFloatSpread(ROOM_LENGTH - 3);
    phases[i] = Math.random() * Math.PI * 2;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: roomIndex % 2 === 0 ? 0xb5ffe9 : 0xffe2a3,
    size: 0.085,
    transparent: true,
    opacity: 0.74,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  return {
    points: new THREE.Points(geometry, material),
    phases,
    base: positions.slice(),
  };
}

function createPortalGlow() {
  const group = new THREE.Group();
  group.position.set(0, 1.8, getRoomBackZ(ROOM_COUNT - 1) + 0.08);

  const material = new THREE.MeshStandardMaterial({
    color: 0xc6f7d1,
    emissive: 0x5af1bb,
    emissiveIntensity: 1.5,
    transparent: true,
    opacity: 0.8,
    roughness: 0.35,
  });

  const disc = new THREE.Mesh(new THREE.CircleGeometry(2.55, PERFORMANCE_MODE ? 28 : 56), material);
  disc.rotation.y = Math.PI;
  group.add(disc);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.72, 0.08, PERFORMANCE_MODE ? 6 : 10, PERFORMANCE_MODE ? 32 : 64),
    new THREE.MeshStandardMaterial({
      color: 0xe4ffca,
      emissive: 0x8affb5,
      emissiveIntensity: 1.8,
      roughness: 0.35,
    }),
  );
  ring.rotation.y = Math.PI;
  group.add(ring);

  return group;
}

function buildSecondRoomPuzzle() {
  const photoGate = createPhotoGate();
  secondRoomPuzzle.photoGate = photoGate;
  scene.add(photoGate);

  buildSecondRoomMaze();

  const ball = createFootball();
  ball.position.set(0, FOOTBALL_RADIUS, FOOTBALL_START_Z);
  secondRoomPuzzle.ball = ball;
  scene.add(ball);
}

function buildThirdRoomPuzzle() {
  thirdRoomPuzzle.tiles.length = 0;

  const door = createThirdRoomMelodyDoor();
  scene.add(door);

  THIRD_ROOM_MELODY.forEach((note, sequenceIndex) => {
    const layout = THIRD_ROOM_TILE_LAYOUT[sequenceIndex];
    const tile = createMelodyTile(note, sequenceIndex);
    tile.group.position.set(layout.x, 0.08, THIRD_ROOM_CENTER_Z + layout.z);
    tile.baseY = tile.group.position.y;
    thirdRoomPuzzle.tiles.push(tile);
    scene.add(tile.group);
  });
}

function buildFourthRoomPuzzle() {
  fourthRoomPuzzle.bubbles.length = 0;
  fourthRoomPuzzle.rewardParticles.length = 0;

  const door = createFourthRoomBubbleDoor();
  scene.add(door);

  const bubbleLayouts = createFourthRoomBubbleLayouts();

  bubbleLayouts.forEach((layout, index) => {
    const bubble = createFourthRoomBubble(layout, index);
    bubble.group.position.set(layout.x, layout.y, FOURTH_ROOM_CENTER_Z + layout.z);
    fourthRoomPuzzle.bubbles.push(bubble);
    scene.add(bubble.group);
  });

  fourthRoomPuzzle.popTool = createNeedlePopTool();
  fourthRoomPuzzle.popTool.visible = false;
  scene.add(fourthRoomPuzzle.popTool);
}

function buildFifthRoomPuzzle() {
  fifthRoomPuzzle.plants.length = 0;
  fifthRoomPuzzle.particles.length = 0;

  const door = createFifthRoomPlantDoor();
  scene.add(door);

  FIFTH_ROOM_PLANT_LAYOUT.forEach((layout, index) => {
    const plant = createWaterablePlant(layout, index);
    plant.group.position.set(layout.x, 0, FIFTH_ROOM_CENTER_Z + layout.z);
    fifthRoomPuzzle.plants.push(plant);
    scene.add(plant.group);
  });

  fifthRoomPuzzle.wateringCan = createWateringCanTool();
  fifthRoomPuzzle.wateringCan.visible = false;
  scene.add(fifthRoomPuzzle.wateringCan);
}

function buildGraveyardPuzzle() {
  graveyardPuzzle.graves.length = 0;
  graveyardPuzzle.particles.length = 0;
  graveyardPuzzle.hedgehogs.length = 0;

  const gate = createGraveyardExitGate();
  scene.add(gate);

  GRAVEYARD_GRAVE_LAYOUT.forEach((layout, index) => {
    const grave = createGraveyardGrave(layout, index);
    grave.group.position.set(layout.x, 0, GRAVEYARD_ROOM_CENTER_Z + layout.z);
    grave.group.rotation.y = layout.rotation;
    graveyardPuzzle.graves.push(grave);
    scene.add(grave.group);
  });

  const hedgehogRoutes = [
    { centerX: -3.9, centerZ: 4.2, radiusX: 2.0, radiusZ: 1.45, speed: 0.52 },
    { centerX: 3.9, centerZ: 3.7, radiusX: 1.75, radiusZ: 1.65, speed: 0.46 },
    { centerX: -3.6, centerZ: -5.4, radiusX: 2.1, radiusZ: 1.25, speed: 0.58 },
    { centerX: 3.8, centerZ: -6.5, radiusX: 1.65, radiusZ: 1.5, speed: 0.49 },
  ];
  hedgehogRoutes.forEach((route, index) => {
    const hedgehog = createGraveyardHedgehog(index);
    hedgehog.route = route;
    hedgehog.phase = index * 1.63;
    hedgehog.group.position.set(route.centerX, 0.25, GRAVEYARD_ROOM_CENTER_Z + route.centerZ);
    graveyardPuzzle.hedgehogs.push(hedgehog);
    scene.add(hedgehog.group);
  });

  graveyardPuzzle.wateringCan = createWateringCanTool();
  graveyardPuzzle.wateringCan.visible = false;
  scene.add(graveyardPuzzle.wateringCan);
}

function createGraveyardGrave(layout, index) {
  const group = new THREE.Group();
  const stoneMaterials = [0x34443a, 0x2a3931, 0x3b493e].map((color) => new THREE.MeshStandardMaterial({
    color,
    roughness: 0.96,
    metalness: 0.02,
    emissive: 0x090b0d,
    emissiveIntensity: 0.04,
  }));
  const cleanStoneColors = [0xa4aaa8, 0x929a9b, 0xb0aaa2];
  stoneMaterials.forEach((material, materialIndex) => {
    material.userData.dirtyColor = material.color.clone();
    material.userData.cleanColor = new THREE.Color(cleanStoneColors[materialIndex]);
  });
  const dirtMaterial = new THREE.MeshStandardMaterial({ color: 0x211d1a, roughness: 1 });
  const mossMaterial = new THREE.MeshBasicMaterial({
    color: 0x263d2c,
    transparent: true,
    opacity: 0.88,
    depthWrite: false,
    side: THREE.DoubleSide,
    toneMapped: false,
  });

  const mound = new THREE.Mesh(new THREE.SphereGeometry(0.82, 14, 7), dirtMaterial);
  mound.scale.set(1.18, 0.18, 1.72);
  mound.position.set(0, 0.1, 0.45);
  group.add(mound);

  const base = new THREE.Mesh(new THREE.BoxGeometry(1.28, 0.22, 0.52), stoneMaterials[0]);
  base.position.set(0, 0.2, -0.48);
  base.rotation.y = (index % 3 - 1) * 0.018;
  group.add(base);

  const bodyWidth = 0.88 + (index % 3) * 0.08;
  const bodyHeight = 1.18 + (index % 4) * 0.11;
  const body = new THREE.Mesh(new THREE.BoxGeometry(bodyWidth, bodyHeight, 0.28), stoneMaterials[1]);
  body.position.set(0, 0.32 + bodyHeight / 2, -0.49);
  body.rotation.z = (index % 2 === 0 ? 1 : -1) * 0.018;
  group.add(body);

  const crown = new THREE.Mesh(
    index % 3 === 0
      ? new THREE.SphereGeometry(bodyWidth * 0.5, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2)
      : new THREE.BoxGeometry(bodyWidth * 0.92, 0.22, 0.31),
    stoneMaterials[2],
  );
  crown.position.set(0, 0.32 + bodyHeight, -0.49);
  if (index % 3 !== 0) {
    crown.rotation.z = Math.PI / 4;
    crown.scale.set(0.76, 0.76, 1);
  }
  group.add(crown);

  const inscriptionMaterial = new THREE.MeshStandardMaterial({
    color: 0x1b1d1e,
    roughness: 0.9,
  });
  for (let line = 0; line < 3; line += 1) {
    const inscription = new THREE.Mesh(
      new THREE.BoxGeometry(bodyWidth * (0.48 - line * 0.05), 0.026, 0.018),
      inscriptionMaterial,
    );
    inscription.position.set(0, 0.65 + bodyHeight * 0.34 - line * 0.13, -0.333);
    group.add(inscription);
  }

  const mossPatches = [];
  for (let patchIndex = 0; patchIndex < 13; patchIndex += 1) {
    const patch = new THREE.Mesh(
      new THREE.CircleGeometry(0.12 + (patchIndex % 4) * 0.045, 10),
      mossMaterial.clone(),
    );
    patch.scale.set(1.25 + (patchIndex % 3) * 0.18, 0.48 + (patchIndex % 4) * 0.11, 1);
    patch.position.set(
      THREE.MathUtils.randFloat(-bodyWidth * 0.34, bodyWidth * 0.34),
      0.43 + (patchIndex % 7) * bodyHeight * 0.125,
      -0.326,
    );
    patch.rotation.z = patchIndex * 0.91;
    group.add(patch);
    mossPatches.push(patch);
  }

  const flowers = createGraveyardFlowerCluster(layout.flowerColor, index);
  flowers.position.set(0.56 * (index % 2 === 0 ? 1 : -1), 0.12, -0.02);
  flowers.scale.setScalar(0.01);
  flowers.visible = false;
  group.add(flowers);

  return {
    group,
    stoneMaterials,
    mossPatches,
    flowers,
    watered: false,
    cleaning: false,
    cleanProgress: 0,
    phase: index * 0.71,
    flowerColor: layout.flowerColor,
  };
}

function createGraveyardFlowerCluster(color, index) {
  const group = new THREE.Group();
  const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x3e7a49, roughness: 0.78 });
  const petalMaterial = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.96,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  const centerMaterial = new THREE.MeshBasicMaterial({ color: 0xffdf6d, toneMapped: false });
  const flowerCount = 5 + (index % 3);

  for (let flowerIndex = 0; flowerIndex < flowerCount; flowerIndex += 1) {
    const angle = (flowerIndex / flowerCount) * Math.PI * 2 + index * 0.4;
    const radius = 0.12 + (flowerIndex % 3) * 0.07;
    const height = 0.48 + (flowerIndex % 4) * 0.12;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.018, height, 5), stemMaterial);
    stem.position.set(Math.cos(angle) * radius, height / 2, Math.sin(angle) * radius);
    stem.rotation.z = Math.cos(angle) * 0.12;
    group.add(stem);

    const blossom = new THREE.Group();
    blossom.position.set(Math.cos(angle) * radius * 1.25, height, Math.sin(angle) * radius * 1.25);
    for (let petalIndex = 0; petalIndex < 5; petalIndex += 1) {
      const petalAngle = (petalIndex / 5) * Math.PI * 2;
      const petal = new THREE.Mesh(new THREE.CircleGeometry(0.095, 9), petalMaterial);
      petal.scale.set(1, 0.58, 1);
      petal.position.set(Math.cos(petalAngle) * 0.085, Math.sin(petalAngle) * 0.085, 0);
      petal.rotation.z = petalAngle;
      blossom.add(petal);
    }
    const center = new THREE.Mesh(new THREE.CircleGeometry(0.052, 9), centerMaterial);
    center.position.z = 0.006;
    blossom.add(center);
    blossom.rotation.x = -0.22;
    blossom.rotation.y = angle;
    group.add(blossom);
  }

  return group;
}

function createGraveyardHedgehog(index) {
  const group = new THREE.Group();
  const furMaterial = new THREE.MeshStandardMaterial({ color: 0x76503b, roughness: 0.94 });
  const faceMaterial = new THREE.MeshStandardMaterial({ color: 0xb9825f, roughness: 0.88 });
  const spineMaterial = new THREE.MeshStandardMaterial({ color: 0x3d302a, roughness: 0.98 });
  const spineHighlightMaterial = new THREE.MeshStandardMaterial({ color: 0x574238, roughness: 0.96 });
  const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x151414, roughness: 0.72 });
  const eyeShineMaterial = new THREE.MeshBasicMaterial({ color: 0xfff7df, toneMapped: false });
  const cheekMaterial = new THREE.MeshBasicMaterial({ color: 0xd9877c, transparent: true, opacity: 0.72, toneMapped: false });

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.38, PERFORMANCE_MODE ? 10 : 16, 10), furMaterial);
  body.scale.set(1, 0.72, 1.35);
  body.position.y = 0.34;
  group.add(body);

  const face = new THREE.Mesh(new THREE.ConeGeometry(0.29, 0.58, 12), faceMaterial);
  face.rotation.x = Math.PI / 2;
  face.position.set(0, 0.31, 0.52);
  group.add(face);

  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.065, 9, 7), darkMaterial);
  nose.position.set(0, 0.31, 0.83);
  group.add(nose);
  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.046, 9, 7), darkMaterial);
    eye.position.set(side * 0.13, 0.42, 0.59);
    group.add(eye);
    const eyeShine = new THREE.Mesh(new THREE.SphereGeometry(0.012, 6, 5), eyeShineMaterial);
    eyeShine.position.set(side * 0.143, 0.435, 0.626);
    group.add(eyeShine);
    const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.052, 8, 6), cheekMaterial);
    cheek.scale.set(1, 0.52, 0.28);
    cheek.position.set(side * 0.205, 0.34, 0.575);
    group.add(cheek);
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), faceMaterial);
    ear.scale.set(0.75, 1, 0.45);
    ear.position.set(side * 0.25, 0.54, 0.34);
    group.add(ear);
  }

  const spineGeometry = new THREE.ConeGeometry(0.042, 0.29, 5);
  const spineRows = PERFORMANCE_MODE ? 6 : 8;
  const spineColumns = PERFORMANCE_MODE ? 12 : 15;
  const spineTransforms = [[], []];
  const up = new THREE.Vector3(0, 1, 0);
  for (let row = 0; row < spineRows; row += 1) {
    const rowProgress = row / (spineRows - 1);
    const z = THREE.MathUtils.lerp(-0.48, 0.22, rowProgress);
    const crossSection = 0.78 + Math.sin(rowProgress * Math.PI) * 0.22;
    for (let column = 0; column < spineColumns; column += 1) {
      const columnProgress = column / (spineColumns - 1);
      const angle = THREE.MathUtils.lerp(Math.PI * 0.04, Math.PI * 0.96, columnProgress);
      const radialX = Math.cos(angle);
      const radialY = Math.sin(angle);
      const position = new THREE.Vector3(
        radialX * 0.37 * crossSection,
        0.34 + radialY * 0.3 * crossSection,
        z,
      );
      const normal = new THREE.Vector3(
        radialX,
        radialY * 1.22,
        THREE.MathUtils.lerp(-0.34, 0.16, rowProgress),
      ).normalize();
      const lengthScale = 0.82 + ((row * 5 + column * 3) % 7) * 0.055;
      spineTransforms[(row + column) % 2].push({ position, normal, lengthScale });
    }
  }

  const spineHelper = new THREE.Object3D();
  spineTransforms.forEach((transforms, materialIndex) => {
    const spines = new THREE.InstancedMesh(
      spineGeometry,
      materialIndex === 0 ? spineMaterial : spineHighlightMaterial,
      transforms.length,
    );
    transforms.forEach((transform, spineIndex) => {
      spineHelper.position.copy(transform.position).addScaledVector(transform.normal, 0.08);
      spineHelper.quaternion.setFromUnitVectors(up, transform.normal);
      spineHelper.scale.set(1, transform.lengthScale, 1);
      spineHelper.updateMatrix();
      spines.setMatrixAt(spineIndex, spineHelper.matrix);
    });
    spines.instanceMatrix.needsUpdate = true;
    group.add(spines);
  });

  const legs = [];
  for (const side of [-1, 1]) {
    for (const z of [-0.22, 0.27]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.22, 6), darkMaterial);
      leg.position.set(side * 0.23, 0.1, z);
      group.add(leg);
      legs.push(leg);
    }
  }

  const apple = createHedgehogApple();
  apple.position.set(index % 2 === 0 ? -0.13 : 0.14, 0.98, -0.08);
  apple.scale.setScalar(0.8 + (index % 2) * 0.12);
  group.add(apple);

  const mushroom = createHedgehogMushroom(index);
  mushroom.position.set(index % 2 === 0 ? 0.18 : -0.16, 0.98, -0.27);
  mushroom.rotation.z = index % 2 === 0 ? 0.14 : -0.16;
  group.add(mushroom);

  group.scale.setScalar(0.94 + (index % 3) * 0.07);
  return { group, legs, route: null, phase: 0 };
}

function createHedgehogApple() {
  const group = new THREE.Group();
  const apple = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 10, 8),
    new THREE.MeshStandardMaterial({ color: 0xc83f3b, roughness: 0.58 }),
  );
  apple.scale.set(1, 0.9, 1);
  group.add(apple);
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.016, 0.12, 5),
    new THREE.MeshStandardMaterial({ color: 0x4b3423, roughness: 0.9 }),
  );
  stem.position.y = 0.14;
  stem.rotation.z = 0.22;
  group.add(stem);
  const leaf = new THREE.Mesh(
    new THREE.CircleGeometry(0.055, 7),
    new THREE.MeshBasicMaterial({ color: 0x4e8d4e, side: THREE.DoubleSide, toneMapped: false }),
  );
  leaf.position.set(0.045, 0.15, 0);
  leaf.scale.set(1.35, 0.55, 1);
  leaf.rotation.z = 0.42;
  group.add(leaf);
  return group;
}

function createHedgehogMushroom(index) {
  const group = new THREE.Group();
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.05, 0.2, 7),
    new THREE.MeshStandardMaterial({ color: 0xe8dec5, roughness: 0.9 }),
  );
  stem.position.y = 0.08;
  group.add(stem);
  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: index % 2 === 0 ? 0xb84943 : 0xd68b43, roughness: 0.72 }),
  );
  cap.scale.set(1.25, 0.7, 1.25);
  cap.position.y = 0.19;
  group.add(cap);
  return group;
}

function createGraveyardExitGate() {
  const group = new THREE.Group();
  group.position.set(0, 0, GRAVEYARD_TO_FINALE_BOUNDARY_Z + 0.76);
  const ironMaterial = new THREE.MeshStandardMaterial({
    color: 0x171a1d,
    roughness: 0.38,
    metalness: 0.78,
  });
  const accentMaterial = new THREE.MeshStandardMaterial({
    color: 0x6f6758,
    emissive: 0x221b13,
    emissiveIntensity: 0.18,
    roughness: 0.5,
    metalness: 0.55,
  });
  const panelWidth = DOOR_HALF_WIDTH;

  const createPanel = (side) => {
    const panel = new THREE.Group();
    const edge = side * panelWidth / 2;
    const barCount = 7;
    for (let barIndex = 0; barIndex < barCount; barIndex += 1) {
      const x = -panelWidth / 2 + 0.22 + barIndex * ((panelWidth - 0.44) / (barCount - 1));
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 4.15, 7), ironMaterial);
      bar.position.set(x, 2.15, 0);
      panel.add(bar);
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.32, 7), accentMaterial);
      spike.position.set(x, 4.38, 0);
      panel.add(spike);
    }
    for (const y of [0.5, 2.15, 3.8]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(panelWidth, 0.09, 0.12), ironMaterial);
      rail.position.set(0, y, 0);
      panel.add(rail);
    }
    const diagonal = new THREE.Mesh(new THREE.BoxGeometry(panelWidth * 1.08, 0.09, 0.1), accentMaterial);
    diagonal.position.set(0, 2.15, 0.02);
    diagonal.rotation.z = side * 0.52;
    panel.add(diagonal);
    panel.position.x = edge;
    panel.userData.closedX = edge;
    return panel;
  };

  const leftGate = createPanel(-1);
  const rightGate = createPanel(1);
  group.add(leftGate, rightGate);
  graveyardPuzzle.leftGate = leftGate;
  graveyardPuzzle.rightGate = rightGate;
  return group;
}

function buildSixthRoomFinale() {
  sixthRoomFinale.bouquets.length = 0;
  sixthRoomFinale.confetti.length = 0;

  const title = createFinaleBirthdayTitle();
  title.group.position.set(0, title.baseY, SIXTH_ROOM_CENTER_Z - 3.9);
  title.group.visible = false;
  sixthRoomFinale.title = title.group;
  sixthRoomFinale.titleMaterial = title.material;
  scene.add(title.group);

  SIXTH_ROOM_BOUQUET_LAYOUT.forEach((layout, index) => {
    const bouquet = createFinaleBouquet(layout, index);
    bouquet.group.position.set(layout.x, 0.04, SIXTH_ROOM_CENTER_Z + layout.z);
    bouquet.group.scale.setScalar(0.01);
    bouquet.group.visible = false;
    sixthRoomFinale.bouquets.push(bouquet);
    scene.add(bouquet.group);
  });
}

function createFinaleBirthdayTitle() {
  const canvas = document.createElement("canvas");
  canvas.width = 1400;
  canvas.height = 420;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const glow = ctx.createRadialGradient(700, 190, 40, 700, 210, 620);
  glow.addColorStop(0, "rgba(255, 230, 160, 0.32)");
  glow.addColorStop(0.46, "rgba(255, 122, 172, 0.16)");
  glow.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const text = "Happy Birthday Marfa!";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 108px Georgia, 'Times New Roman', serif";
  ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
  ctx.shadowBlur = 18;
  ctx.lineWidth = 16;
  ctx.strokeStyle = "rgba(0, 0, 0, 0.86)";
  ctx.strokeText(text, 700, 186);
  const gradient = ctx.createLinearGradient(0, 98, 0, 250);
  gradient.addColorStop(0, "#fff7c8");
  gradient.addColorStop(0.42, "#ffd56d");
  gradient.addColorStop(1, "#ff94c7");
  ctx.fillStyle = gradient;
  ctx.fillText(text, 700, 186);

  ctx.font = "500 34px 'Helvetica Neue', Arial, sans-serif";
  ctx.lineWidth = 7;
  ctx.strokeStyle = "rgba(0, 0, 0, 0.58)";
  ctx.strokeText("with love, Mika", 700, 286);
  ctx.fillStyle = "rgba(255, 246, 224, 0.94)";
  ctx.fillText("with love, Mika", 700, 286);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = PERFORMANCE_MODE ? 1 : 4;
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0,
    depthTest: false,
    depthWrite: false,
    side: THREE.FrontSide,
    toneMapped: false,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(9.2, 2.76), material);
  mesh.renderOrder = 30;
  const group = new THREE.Group();
  group.add(mesh);
  return { group, material, baseY: 4.7 };
}

function createFinaleBouquet(layout, index) {
  const group = new THREE.Group();
  const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x347343, roughness: 0.72 });
  const leafMaterial = new THREE.MeshBasicMaterial({
    color: layout.leafColor,
    transparent: true,
    opacity: 0.88,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  const flowerMaterial = new THREE.MeshBasicMaterial({
    color: layout.flowerColor,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  const flowers = [];
  const leaves = [];
  const stems = [];
  const stemCount = 8 + (index % 4);

  for (let i = 0; i < stemCount; i += 1) {
    const angle = (i / stemCount) * Math.PI * 2 + index * 0.33;
    const height = THREE.MathUtils.randFloat(0.78, 1.45);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.026, height, 6), stemMaterial);
    stem.position.set(Math.cos(angle) * 0.12, height / 2, Math.sin(angle) * 0.12);
    stem.rotation.z = Math.cos(angle) * 0.22;
    stem.rotation.x = -Math.sin(angle) * 0.22;
    group.add(stem);
    stems.push(stem);

    const leaf = new THREE.Mesh(new THREE.CircleGeometry(0.17, PERFORMANCE_MODE ? 8 : 12), leafMaterial.clone());
    leaf.position.set(Math.cos(angle) * 0.25, height * 0.54, Math.sin(angle) * 0.25);
    leaf.scale.set(1.28, 0.56, 1);
    leaf.rotation.set(0.38, angle, Math.sin(angle) * 0.7);
    group.add(leaf);
    leaves.push(leaf);

    const flower = new THREE.Mesh(new THREE.CircleGeometry(0.16, PERFORMANCE_MODE ? 10 : 14), flowerMaterial.clone());
    flower.position.set(Math.cos(angle) * 0.32, height + 0.04, Math.sin(angle) * 0.32);
    flower.scale.setScalar(0.1);
    flower.rotation.set(0.15, angle, Math.PI / 4);
    group.add(flower);
    flowers.push(flower);
  }

  return {
    group,
    flowers,
    leaves,
    stems,
    bloomProgress: 0,
    delay: index * 0.09,
    phase: index * 0.73,
  };
}

function createFifthRoomPlantDoor() {
  const group = new THREE.Group();
  group.position.set(0, 0, FIFTH_ROOM_DOOR_Z);

  const panelWidth = FIFTH_ROOM_DOOR_WIDTH / 2;
  const panelHeight = FIFTH_ROOM_DOOR_HEIGHT;
  const centerY = panelHeight / 2 + 0.12;
  const leftDoor = createFifthRoomDoorPanel(FIFTH_ROOM_DOOR_PHOTO_URLS[0], panelWidth, panelHeight);
  const rightDoor = createFifthRoomDoorPanel(FIFTH_ROOM_DOOR_PHOTO_URLS[1], panelWidth, panelHeight);
  leftDoor.position.set(-panelWidth / 2, centerY, 0.08);
  rightDoor.position.set(panelWidth / 2, centerY, 0.08);
  leftDoor.userData.closedX = leftDoor.position.x;
  rightDoor.userData.closedX = rightDoor.position.x;
  fifthRoomPuzzle.leftDoor = leftDoor;
  fifthRoomPuzzle.rightDoor = rightDoor;
  group.add(leftDoor, rightDoor);

  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0xb7df7d,
    emissive: 0x5cc05e,
    emissiveIntensity: 0.32,
    roughness: 0.42,
    metalness: 0.08,
  });
  const top = new THREE.Mesh(new THREE.BoxGeometry(FIFTH_ROOM_DOOR_WIDTH + 0.34, 0.12, 0.16), frameMaterial);
  top.position.set(0, centerY + panelHeight / 2 + 0.08, 0.11);
  group.add(top);
  const bottom = top.clone();
  bottom.position.y = centerY - panelHeight / 2 - 0.08;
  group.add(bottom);

  for (const x of [-FIFTH_ROOM_DOOR_WIDTH / 2 - 0.09, FIFTH_ROOM_DOOR_WIDTH / 2 + 0.09]) {
    const side = new THREE.Mesh(new THREE.BoxGeometry(0.13, panelHeight + 0.36, 0.16), frameMaterial);
    side.position.set(x, centerY, 0.11);
    group.add(side);
  }

  const vineMaterial = new THREE.MeshStandardMaterial({
    color: 0x317d45,
    emissive: 0x1a5f31,
    emissiveIntensity: 0.18,
    roughness: 0.72,
  });
  for (const side of [-1, 1]) {
    const vine = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, panelHeight + 0.42, 7), vineMaterial);
    vine.position.set(side * (FIFTH_ROOM_DOOR_WIDTH / 2 + 0.2), centerY, 0.2);
    group.add(vine);
  }

  return group;
}

function createFifthRoomDoorPanel(photoUrl, width, height) {
  const texture = loader.load(photoUrl);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = PERFORMANCE_MODE ? 1 : 4;

  const group = new THREE.Group();
  const photo = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.FrontSide,
      toneMapped: false,
    }),
  );
  photo.position.z = 0.034;
  group.add(photo);

  const backing = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, 0.08),
    new THREE.MeshStandardMaterial({
      color: 0x153c2b,
      roughness: 0.72,
      metalness: 0.02,
    }),
  );
  backing.position.z = -0.03;
  backing.castShadow = true;
  backing.receiveShadow = true;
  group.add(backing);

  const trimMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4ec8d,
    emissive: 0x76c95a,
    emissiveIntensity: 0.24,
    roughness: 0.4,
    metalness: 0.08,
  });
  for (const x of [-width / 2 + 0.04, width / 2 - 0.04]) {
    const trim = new THREE.Mesh(new THREE.BoxGeometry(0.08, height, 0.1), trimMaterial);
    trim.position.set(x, 0, 0.06);
    group.add(trim);
  }

  return group;
}

function createWaterablePlant(layout, index) {
  const group = new THREE.Group();
  const potColor = [0x9b5a3f, 0xd08a55, 0x79523f, 0xb97046][index % 4];
  const potMaterial = new THREE.MeshStandardMaterial({
    color: potColor,
    roughness: 0.72,
    metalness: 0.04,
  });
  const soilMaterial = new THREE.MeshStandardMaterial({
    color: 0x3c2418,
    roughness: 0.92,
  });
  const leafMaterial = new THREE.MeshStandardMaterial({
    color: layout.leafColor,
    emissive: layout.leafColor,
    emissiveIntensity: 0.08,
    roughness: 0.58,
    side: THREE.DoubleSide,
  });
  const flowerMaterial = new THREE.MeshBasicMaterial({
    color: layout.flowerColor,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    toneMapped: false,
  });

  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.42, 0.72, PERFORMANCE_MODE ? 12 : 18), potMaterial);
  pot.position.y = 0.36;
  pot.castShadow = true;
  pot.receiveShadow = true;
  group.add(pot);

  const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.04, PERFORMANCE_MODE ? 12 : 18), soilMaterial);
  soil.position.y = 0.74;
  group.add(soil);

  const plantGroup = new THREE.Group();
  plantGroup.position.y = 0.76;
  plantGroup.scale.setScalar(0.68);
  group.add(plantGroup);

  const stems = [];
  const leaves = [];
  const flowers = [];
  const stemCount = layout.kind === 0 ? 5 : (layout.kind === 1 ? 7 : 6);
  for (let i = 0; i < stemCount; i += 1) {
    const angle = (i / stemCount) * Math.PI * 2 + index * 0.27;
    const height = THREE.MathUtils.randFloat(0.8, 1.45) + layout.kind * 0.12;
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.028, height, 6),
      new THREE.MeshStandardMaterial({ color: 0x2f7039, roughness: 0.78 }),
    );
    stem.position.set(Math.cos(angle) * 0.14, height / 2, Math.sin(angle) * 0.14);
    stem.rotation.z = Math.cos(angle) * 0.24;
    stem.rotation.x = -Math.sin(angle) * 0.24;
    plantGroup.add(stem);
    stems.push(stem);

    const leaf = new THREE.Mesh(new THREE.CircleGeometry(0.19 + layout.kind * 0.03, PERFORMANCE_MODE ? 8 : 12), leafMaterial);
    leaf.position.set(Math.cos(angle) * 0.28, height * 0.68, Math.sin(angle) * 0.28);
    leaf.scale.set(1.35, 0.62, 1);
    leaf.rotation.set(0.4, angle, Math.sin(angle) * 0.7);
    plantGroup.add(leaf);
    leaves.push(leaf);

    const flower = new THREE.Mesh(new THREE.CircleGeometry(0.14, 10), flowerMaterial.clone());
    flower.visible = false;
    flower.position.set(Math.cos(angle) * 0.34, height + 0.05, Math.sin(angle) * 0.34);
    flower.scale.setScalar(0.12);
    flower.rotation.set(0.1, angle, Math.PI / 4);
    plantGroup.add(flower);
    flowers.push(flower);
  }

  return {
    group,
    plantGroup,
    pot,
    leaves,
    flowers,
    watered: false,
    watering: false,
    bloomProgress: 0,
    baseScale: 0.68,
    targetScale: 1.18 + layout.kind * 0.11,
    phase: index * 0.83,
    flowerColor: layout.flowerColor,
  };
}

function createWateringCanTool() {
  const group = new THREE.Group();
  const canMaterial = new THREE.MeshStandardMaterial({
    color: 0x8bd6ff,
    emissive: 0x1e80b8,
    emissiveIntensity: 0.18,
    roughness: 0.34,
    metalness: 0.28,
  });
  const waterMaterial = new THREE.MeshBasicMaterial({
    color: 0x8fe9ff,
    transparent: true,
    opacity: 0.66,
    toneMapped: false,
  });

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.42, PERFORMANCE_MODE ? 12 : 18), canMaterial);
  body.rotation.z = Math.PI / 2;
  group.add(body);

  const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.065, 0.66, 8), canMaterial);
  spout.position.set(0.46, 0.12, 0);
  spout.rotation.z = Math.PI / 2 - 0.28;
  group.add(spout);

  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.025, 6, PERFORMANCE_MODE ? 18 : 28, Math.PI * 1.25), canMaterial);
  handle.position.set(-0.19, 0.03, 0);
  handle.rotation.y = Math.PI / 2;
  handle.rotation.z = -0.6;
  group.add(handle);

  for (let i = 0; i < 8; i += 1) {
    const drop = new THREE.Mesh(new THREE.SphereGeometry(0.035, 7, 5), waterMaterial.clone());
    drop.position.set(0.72 + i * 0.08, -0.02 - i * 0.045, THREE.MathUtils.randFloatSpread(0.14));
    drop.userData.base = drop.position.clone();
    group.add(drop);
  }

  return group;
}

function createFourthRoomBubbleLayouts() {
  const layers = [
    { dx: 0, dz: 0, dy: 0, scale: 1 },
    { dx: 1.12, dz: -0.86, dy: 0.62, scale: 0.84 },
    { dx: -1.04, dz: 0.92, dy: 1.08, scale: 0.76 },
  ];
  const layouts = [];

  FOURTH_ROOM_BUBBLE_LAYOUT.forEach((bubble, index) => {
    layers.forEach((layer, layerIndex) => {
      const direction = index % 2 === 0 ? 1 : -1;
      const wave = Math.sin(index * 1.7 + layerIndex) * 0.34;
      layouts.push({
        x: THREE.MathUtils.clamp(bubble.x + layer.dx * direction + wave, -7.55, 7.55),
        z: THREE.MathUtils.clamp(bubble.z + layer.dz * -direction + Math.cos(index * 1.3 + layerIndex) * 0.42, -10.4, 10.4),
        y: THREE.MathUtils.clamp(bubble.y + layer.dy + (index % 3) * 0.08, 1.85, 4.5),
        radius: Math.max(0.72, bubble.radius * layer.scale),
      });
    });
  });

  return layouts;
}

function createFourthRoomBubbleDoor() {
  const group = new THREE.Group();
  group.position.set(0, 0, FOURTH_ROOM_DOOR_Z);

  const panelWidth = FOURTH_ROOM_DOOR_WIDTH / 2;
  const panelHeight = FOURTH_ROOM_DOOR_HEIGHT;
  const centerY = panelHeight / 2 + 0.12;
  const leftPanel = createPhotoDoorPanel(panelWidth, panelHeight, 0);
  const rightPanel = createPhotoDoorPanel(panelWidth, panelHeight, 0.5);
  leftPanel.position.set(-panelWidth / 2, centerY, 0.08);
  rightPanel.position.set(panelWidth / 2, centerY, 0.08);
  leftPanel.userData.closedX = leftPanel.position.x;
  rightPanel.userData.closedX = rightPanel.position.x;
  fourthRoomPuzzle.leftDoor = leftPanel;
  fourthRoomPuzzle.rightDoor = rightPanel;
  group.add(leftPanel, rightPanel);

  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd983,
    emissive: 0xff9f58,
    emissiveIntensity: 0.32,
    roughness: 0.34,
    metalness: 0.18,
  });
  const top = new THREE.Mesh(new THREE.BoxGeometry(FOURTH_ROOM_DOOR_WIDTH + 0.34, 0.12, 0.16), frameMaterial);
  top.position.set(0, centerY + panelHeight / 2 + 0.08, 0.11);
  group.add(top);
  const bottom = top.clone();
  bottom.position.y = centerY - panelHeight / 2 - 0.08;
  group.add(bottom);

  for (const x of [-FOURTH_ROOM_DOOR_WIDTH / 2 - 0.09, FOURTH_ROOM_DOOR_WIDTH / 2 + 0.09]) {
    const side = new THREE.Mesh(new THREE.BoxGeometry(0.13, panelHeight + 0.36, 0.16), frameMaterial);
    side.position.set(x, centerY, 0.11);
    group.add(side);
  }

  const scallopMaterial = new THREE.MeshBasicMaterial({
    color: 0xfff0bc,
    transparent: true,
    opacity: 0.86,
    toneMapped: false,
  });
  for (let i = 0; i < 9; i += 1) {
    const scallop = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), scallopMaterial);
    scallop.position.set(
      THREE.MathUtils.mapLinear(i, 0, 8, -FOURTH_ROOM_DOOR_WIDTH / 2 + 0.38, FOURTH_ROOM_DOOR_WIDTH / 2 - 0.38),
      centerY + panelHeight / 2 + 0.22,
      0.18,
    );
    scallop.scale.set(1, 0.5, 0.28);
    group.add(scallop);
  }

  return group;
}

function createPhotoDoorPanel(width, height, offsetX) {
  const texture = loader.load(FOURTH_ROOM_DOOR_IMAGE_URL);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(0.5, 1);
  texture.offset.set(offsetX, 0);
  texture.anisotropy = PERFORMANCE_MODE ? 1 : 4;

  const group = new THREE.Group();
  const photo = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.FrontSide,
      toneMapped: false,
    }),
  );
  photo.position.z = 0.03;
  group.add(photo);

  const backing = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, 0.08),
    new THREE.MeshStandardMaterial({
      color: 0x805174,
      roughness: 0.66,
      metalness: 0.04,
    }),
  );
  backing.position.z = -0.03;
  backing.castShadow = true;
  backing.receiveShadow = true;
  group.add(backing);

  const trimMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd983,
    emissive: 0xffb05f,
    emissiveIntensity: 0.24,
    roughness: 0.38,
    metalness: 0.12,
  });
  for (const x of [-width / 2 + 0.035, width / 2 - 0.035]) {
    const trim = new THREE.Mesh(new THREE.BoxGeometry(0.07, height, 0.1), trimMaterial);
    trim.position.set(x, 0, 0.06);
    group.add(trim);
  }

  return group;
}

function createFourthRoomBubble(layout, index) {
  const group = new THREE.Group();
  const color = [0xbdefff, 0xffc7f1, 0xd9ffb7, 0xffecad][index % 4];
  const shellMaterial = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.22,
    roughness: 0.08,
    metalness: 0.02,
    transparent: true,
    opacity: 0.34,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(layout.radius, PERFORMANCE_MODE ? 18 : 30, PERFORMANCE_MODE ? 12 : 20),
    shellMaterial,
  );
  group.add(shell);

  const outline = new THREE.Mesh(
    new THREE.TorusGeometry(layout.radius * 0.96, 0.022, 5, PERFORMANCE_MODE ? 28 : 42),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.26,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  outline.rotation.set(Math.PI / 2.6, Math.PI / 2, index * 0.19);
  group.add(outline);

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(layout.radius * 0.72, 0.018, 6, PERFORMANCE_MODE ? 32 : 54),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.48,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  rim.rotation.set(Math.PI / 2.8, 0.28, index * 0.37);
  group.add(rim);

  const highlight = new THREE.Mesh(
    new THREE.SphereGeometry(layout.radius * 0.16, PERFORMANCE_MODE ? 8 : 12, PERFORMANCE_MODE ? 6 : 8),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  highlight.position.set(-layout.radius * 0.34, layout.radius * 0.33, layout.radius * 0.42);
  highlight.scale.set(1, 0.72, 0.36);
  group.add(highlight);

  return {
    group,
    shell,
    outline,
    rim,
    highlight,
    baseY: layout.y,
    baseScale: 1,
    phase: index * 0.72,
    radius: layout.radius,
    popped: false,
    popping: false,
    popProgress: 0,
  };
}

function createNeedlePopTool() {
  const group = new THREE.Group();
  group.position.set(0, -10, 0);
  group.rotation.set(-0.24, 0.24, -0.16);
  group.scale.setScalar(1.55);

  const sleeve = new THREE.Mesh(
    new THREE.CylinderGeometry(0.095, 0.112, 0.84, 12),
    new THREE.MeshStandardMaterial({
      color: 0xeaf8ef,
      emissive: 0x2c8b58,
      emissiveIntensity: 0.16,
      roughness: 0.76,
    }),
  );
  sleeve.position.set(0, 0, -0.22);
  sleeve.rotation.x = Math.PI / 2;
  group.add(sleeve);

  const hand = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 14, 10),
    new THREE.MeshStandardMaterial({
      color: 0xf1c4a8,
      roughness: 0.58,
    }),
  );
  hand.position.set(0, -0.01, -0.62);
  hand.scale.set(1, 0.82, 1.16);
  group.add(hand);

  const needle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.014, 0.021, 1.02, 8),
    new THREE.MeshStandardMaterial({
      color: 0x556978,
      emissive: 0xb8f2ff,
      emissiveIntensity: 0.18,
      roughness: 0.22,
      metalness: 0.76,
    }),
  );
  needle.position.set(-0.12, 0, -1.16);
  needle.rotation.set(Math.PI / 2, 0.32, 0);
  group.add(needle);

  const sideNeedle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.011, 0.016, 0.72, 8),
    needle.material,
  );
  sideNeedle.position.set(0.28, 0, -0.63);
  sideNeedle.rotation.z = Math.PI / 2;
  group.add(sideNeedle);

  const tip = new THREE.Mesh(
    new THREE.ConeGeometry(0.034, 0.16, 10),
    new THREE.MeshStandardMaterial({
      color: 0xf7fcff,
      emissive: 0xcff7ff,
      emissiveIntensity: 0.16,
      roughness: 0.2,
      metalness: 0.62,
    }),
  );
  tip.position.set(-0.28, 0, -1.74);
  tip.rotation.set(-Math.PI / 2, 0.32, 0);
  group.add(tip);

  const sideTip = tip.clone();
  sideTip.position.set(0.72, 0, -0.63);
  sideTip.rotation.set(0, 0, -Math.PI / 2);
  group.add(sideTip);

  return group;
}

function createThirdRoomMelodyDoor() {
  const group = new THREE.Group();
  group.position.set(0, 0, THIRD_ROOM_DOOR_Z);

  const panelWidth = THIRD_ROOM_DOOR_WIDTH / 2;
  const panelHeight = THIRD_ROOM_DOOR_HEIGHT;
  const centerY = panelHeight / 2 + 0.12;
  const doorMaterial = new THREE.MeshStandardMaterial({
    color: 0x6c315f,
    emissive: 0x35122e,
    emissiveIntensity: 0.56,
    roughness: 0.58,
    metalness: 0.04,
    transparent: true,
    opacity: 0.92,
  });
  const trimMaterial = new THREE.MeshStandardMaterial({
    color: 0xf2bd73,
    emissive: 0x7c4824,
    emissiveIntensity: 0.36,
    roughness: 0.42,
    metalness: 0.12,
  });

  const leftDoor = createThirdRoomDoorPanel(panelWidth, panelHeight, doorMaterial, trimMaterial);
  const rightDoor = createThirdRoomDoorPanel(panelWidth, panelHeight, doorMaterial, trimMaterial);
  leftDoor.position.set(-panelWidth / 2, 0, 0);
  rightDoor.position.set(panelWidth / 2, 0, 0);
  leftDoor.userData.closedX = leftDoor.position.x;
  rightDoor.userData.closedX = rightDoor.position.x;
  thirdRoomPuzzle.leftDoor = leftDoor;
  thirdRoomPuzzle.rightDoor = rightDoor;
  group.add(leftDoor, rightDoor);

  const top = new THREE.Mesh(new THREE.BoxGeometry(THIRD_ROOM_DOOR_WIDTH + 0.36, 0.1, 0.12), trimMaterial);
  top.position.set(0, centerY + panelHeight / 2 + 0.05, 0.02);
  top.castShadow = true;
  group.add(top);

  for (const x of [-THIRD_ROOM_DOOR_WIDTH / 2 - 0.08, THIRD_ROOM_DOOR_WIDTH / 2 + 0.08]) {
    const side = new THREE.Mesh(new THREE.BoxGeometry(0.11, panelHeight + 0.18, 0.12), trimMaterial);
    side.position.set(x, centerY, 0.02);
    side.castShadow = true;
    group.add(side);
  }

  return group;
}

function createThirdRoomDoorPanel(width, height, doorMaterial, trimMaterial) {
  const group = new THREE.Group();
  const centerY = height / 2 + 0.12;
  const panel = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.12), doorMaterial);
  panel.position.set(0, centerY, 0);
  panel.castShadow = true;
  panel.receiveShadow = true;
  group.add(panel);

  const verticalTrim = new THREE.BoxGeometry(0.055, height - 0.28, 0.15);
  for (const x of [-width / 2 + 0.16, width / 2 - 0.16]) {
    const trim = new THREE.Mesh(verticalTrim, trimMaterial);
    trim.position.set(x, centerY, 0.08);
    group.add(trim);
  }

  const noteRing = new THREE.Mesh(
    new THREE.TorusGeometry(width * 0.23, 0.024, 6, PERFORMANCE_MODE ? 24 : 40),
    new THREE.MeshBasicMaterial({
      color: 0xffdca5,
      transparent: true,
      opacity: 0.72,
      toneMapped: false,
    }),
  );
  noteRing.position.set(0, centerY + 0.2, 0.09);
  group.add(noteRing);

  return group;
}

function createMelodyTile(note, sequenceIndex) {
  const group = new THREE.Group();
  const color = PARTY_LIGHT_COLORS[(sequenceIndex * 2 + 1) % PARTY_LIGHT_COLORS.length];
  const material = createMelodyTileMaterial(color);
  const pad = new THREE.Mesh(
    new THREE.BoxGeometry(THIRD_ROOM_TILE_SIZE, 0.12, THIRD_ROOM_TILE_SIZE),
    material,
  );
  pad.castShadow = true;
  pad.receiveShadow = true;
  group.add(pad);

  const top = new THREE.Mesh(
    new THREE.PlaneGeometry(THIRD_ROOM_TILE_SIZE * 0.84, THIRD_ROOM_TILE_SIZE * 0.84),
    createMelodyTileTopMaterial(color),
  );
  top.position.y = 0.067;
  top.rotation.x = -Math.PI / 2;
  group.add(top);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(THIRD_ROOM_TILE_SIZE * 0.46, 0.035, 6, PERFORMANCE_MODE ? 32 : 48),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  ring.position.y = 0.09;
  ring.rotation.x = -Math.PI / 2;
  group.add(ring);

  return {
    group,
    pad,
    ring,
    note,
    sequenceIndex,
    played: false,
    baseY: group.position.y,
  };
}

function createMelodyTileMaterial(color) {
  return new THREE.MeshStandardMaterial({
    color: 0x251b31,
    emissive: color,
    emissiveIntensity: 0.14,
    roughness: 0.4,
    metalness: 0.18,
  });
}

function createMelodyTileTopMaterial(color) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(128, 116, 10, 128, 128, 140);
  gradient.addColorStop(0, "rgba(255, 255, 238, 0.9)");
  gradient.addColorStop(0.32, `#${color.toString(16).padStart(6, "0")}`);
  gradient.addColorStop(1, "rgba(32, 21, 43, 0.95)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(255, 238, 202, 0.45)";
  ctx.lineWidth = 5;
  for (let y = 84; y <= 156; y += 18) {
    ctx.beginPath();
    ctx.moveTo(42, y);
    ctx.lineTo(214, y);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255, 246, 215, 0.86)";
  ctx.beginPath();
  ctx.ellipse(108, 132, 18, 13, -0.38, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(151, 112, 18, 13, -0.38, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(124, 58, 6, 72);
  ctx.fillRect(167, 42, 6, 68);
  ctx.beginPath();
  ctx.moveTo(128, 58);
  ctx.quadraticCurveTo(148, 75, 171, 42);
  ctx.lineTo(171, 58);
  ctx.quadraticCurveTo(149, 91, 128, 74);
  ctx.closePath();
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = PERFORMANCE_MODE ? 1 : 4;

  return new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    toneMapped: false,
  });
}

function buildSecondRoomMaze() {
  secondRoomPuzzle.obstacles.length = 0;
  secondRoomPuzzle.fishes.length = 0;

  SECOND_ROOM_MAZE_OBSTACLES.forEach((obstacle, index) => {
    const bounds = createObstacleBounds(obstacle);
    secondRoomPuzzle.obstacles.push(bounds);
    scene.add(createSecondRoomObstacle(obstacle, index));
  });
}

function createObstacleBounds(obstacle) {
  return {
    minX: obstacle.x - obstacle.width / 2,
    maxX: obstacle.x + obstacle.width / 2,
    minZ: obstacle.z - obstacle.depth / 2,
    maxZ: obstacle.z + obstacle.depth / 2,
  };
}

function createSecondRoomObstacle(obstacle, index) {
  const group = new THREE.Group();
  group.position.set(obstacle.x, 0, obstacle.z);

  const axis = obstacle.width >= obstacle.depth ? "x" : "z";
  const length = axis === "x" ? obstacle.width : obstacle.depth;
  const pipeRadius = 0.24;
  const pipeYs = [0.32, 0.66, 1.0];
  const pipeMaterial = new THREE.MeshPhysicalMaterial({
    color: index % 2 === 0 ? 0x9ef8ff : 0xb8efff,
    emissive: 0x1aa9d4,
    emissiveIntensity: 0.14,
    transparent: true,
    opacity: 0.34,
    roughness: 0.05,
    metalness: 0.02,
    clearcoat: 0.85,
    clearcoatRoughness: 0.08,
    transmission: PERFORMANCE_MODE ? 0 : 0.35,
    depthWrite: false,
  });
  const waterMaterial = new THREE.MeshBasicMaterial({
    color: 0x4ed4ff,
    transparent: true,
    opacity: 0.12,
    depthWrite: false,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0xd7fbff,
    emissive: 0x47dfff,
    emissiveIntensity: 0.32,
    roughness: 0.22,
    metalness: 0.12,
  });

  pipeYs.forEach((y, pipeIndex) => {
    const pipe = new THREE.Mesh(
      new THREE.CylinderGeometry(pipeRadius, pipeRadius, length, PERFORMANCE_MODE ? 16 : 28, 1, true),
      pipeMaterial.clone(),
    );
    alignPipeMesh(pipe, axis);
    pipe.position.y = y;
    pipe.castShadow = !PERFORMANCE_MODE;
    group.add(pipe);

    const water = new THREE.Mesh(
      new THREE.CylinderGeometry(pipeRadius * 0.72, pipeRadius * 0.72, length - 0.34, PERFORMANCE_MODE ? 12 : 20),
      waterMaterial.clone(),
    );
    alignPipeMesh(water, axis);
    water.position.y = y;
    group.add(water);

    for (const end of [-1, 1]) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(pipeRadius * 1.03, 0.032, PERFORMANCE_MODE ? 6 : 8, PERFORMANCE_MODE ? 18 : 28),
        ringMaterial,
      );
      alignPipeEndRing(ring, axis);
      if (axis === "x") {
        ring.position.set(end * length / 2, y, 0);
      } else {
        ring.position.set(0, y, end * length / 2);
      }
      group.add(ring);
    }

    const segmentCount = Math.max(3, Math.floor(length / 2.5));
    for (let segment = 1; segment < segmentCount; segment += 1) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(pipeRadius * 1.02, 0.018, PERFORMANCE_MODE ? 5 : 7, PERFORMANCE_MODE ? 14 : 20),
        ringMaterial,
      );
      alignPipeEndRing(ring, axis);
      const offset = THREE.MathUtils.mapLinear(segment, 0, segmentCount, -length / 2, length / 2);
      if (axis === "x") {
        ring.position.set(offset, y, 0);
      } else {
        ring.position.set(0, y, offset);
      }
      group.add(ring);
    }

    const fishCount = PERFORMANCE_MODE ? 2 : 3;
    for (let fishIndex = 0; fishIndex < fishCount; fishIndex += 1) {
      const fish = createAquariumFish(PARTY_LIGHT_COLORS[(index + pipeIndex + fishIndex * 2) % PARTY_LIGHT_COLORS.length]);
      const offsetAlongPipe = THREE.MathUtils.mapLinear(fishIndex + 1, 1, fishCount, -length * 0.32, length * 0.32);
      const sideWiggle = THREE.MathUtils.randFloat(-pipeRadius * 0.28, pipeRadius * 0.28);
      const base = new THREE.Vector3(
        axis === "x" ? offsetAlongPipe : sideWiggle,
        y,
        axis === "z" ? offsetAlongPipe : sideWiggle,
      );
      fish.position.copy(base);
      fish.scale.setScalar(0.9 + (fishIndex % 2) * 0.14);
      group.add(fish);
      secondRoomPuzzle.fishes.push({
        fish,
        axis,
        base,
        range: Math.max(0.28, length * THREE.MathUtils.randFloat(0.06, 0.11)),
        speed: THREE.MathUtils.randFloat(0.7, 1.18),
        phase: index * 0.85 + pipeIndex * 1.4 + fishIndex * 2.1,
      });
    }
  });

  const glow = new THREE.PointLight(
    0x79f1ff,
    PERFORMANCE_MODE ? 0.25 : 0.5,
    Math.min(8, length * 0.72),
    2,
  );
  glow.position.set(0, 0.88, 0);
  group.add(glow);

  return group;
}

function alignPipeMesh(mesh, axis) {
  if (axis === "x") {
    mesh.rotation.z = Math.PI / 2;
  } else {
    mesh.rotation.x = Math.PI / 2;
  }
}

function alignPipeEndRing(mesh, axis) {
  if (axis === "x") {
    mesh.rotation.y = Math.PI / 2;
  }
}

function createAquariumFish(color) {
  const group = new THREE.Group();
  const bodyMaterial = new THREE.MeshBasicMaterial({ color, toneMapped: false });
  const finMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.72,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x111418, toneMapped: false });

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.105, PERFORMANCE_MODE ? 8 : 12, PERFORMANCE_MODE ? 6 : 8), bodyMaterial);
  body.scale.set(1.45, 0.72, 0.72);
  group.add(body);

  const tail = new THREE.Mesh(new THREE.CircleGeometry(0.09, 3), finMaterial.clone());
  tail.position.x = -0.15;
  tail.rotation.set(0, Math.PI / 2, Math.PI / 6);
  tail.scale.set(0.9, 0.7, 1);
  group.add(tail);

  const topFin = new THREE.Mesh(new THREE.CircleGeometry(0.055, 3), finMaterial.clone());
  topFin.position.set(-0.02, 0.075, 0);
  topFin.rotation.set(Math.PI / 2, 0, Math.PI / 5);
  topFin.scale.set(1.2, 0.52, 1);
  group.add(topFin);

  for (const z of [-0.052, 0.052]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.014, 6, 4), eyeMaterial);
    eye.position.set(0.105, 0.022, z);
    group.add(eye);
  }

  return group;
}

function createPhotoGate() {
  const group = new THREE.Group();
  group.position.set(0, 0, PHOTO_GATE_Z);

  const panelWidth = PHOTO_GATE_WIDTH / 2;
  const panelHeight = PHOTO_GATE_HEIGHT;
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0xd8a94d,
    emissive: 0x6c3514,
    emissiveIntensity: 0.42,
    roughness: 0.34,
    metalness: 0.18,
  });
  const backMaterial = new THREE.MeshStandardMaterial({
    color: 0x1d1717,
    roughness: 0.72,
  });

  const leftPanel = createPhotoGatePanel(panelWidth, panelHeight, 0, backMaterial);
  const rightPanel = createPhotoGatePanel(panelWidth, panelHeight, 0.5, backMaterial);
  leftPanel.position.x = -panelWidth / 2;
  rightPanel.position.x = panelWidth / 2;
  leftPanel.userData.closedX = leftPanel.position.x;
  rightPanel.userData.closedX = rightPanel.position.x;
  secondRoomPuzzle.leftPanel = leftPanel;
  secondRoomPuzzle.rightPanel = rightPanel;
  group.add(leftPanel, rightPanel);

  const photoCover = createPhotoGateCover(PHOTO_GATE_WIDTH, panelHeight);
  photoCover.position.set(0, panelHeight / 2 + 0.1, 0.07);
  secondRoomPuzzle.photoCover = photoCover;
  group.add(photoCover);

  const outerFrameWidth = PHOTO_GATE_WIDTH + 0.18;
  const outerFrameHeight = PHOTO_GATE_HEIGHT + 0.18;
  const frameCenterY = PHOTO_GATE_HEIGHT / 2 + 0.1;
  const frameTopY = frameCenterY + outerFrameHeight / 2;
  const frameBottomY = frameCenterY - outerFrameHeight / 2;
  for (const y of [frameBottomY, frameTopY]) {
    const frame = new THREE.Mesh(new THREE.BoxGeometry(outerFrameWidth, 0.08, 0.1), frameMaterial);
    frame.position.set(0, y, -0.03);
    frame.castShadow = true;
    group.add(frame);
  }

  for (const x of [-outerFrameWidth / 2, outerFrameWidth / 2]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.1, outerFrameHeight, 0.12), frameMaterial);
    post.position.set(x, frameCenterY, -0.03);
    post.castShadow = true;
    post.receiveShadow = true;
    group.add(post);
  }

  if (!PERFORMANCE_MODE) {
    const glow = new THREE.PointLight(0xffd28a, 2.6, 10, 2);
    glow.position.set(0, 2.9, 1.2);
    glow.userData.baseIntensity = 2.2;
    glow.userData.flicker = 0.32;
    glow.userData.phase = 5.1;
    roomLights.push(glow);
    group.add(glow);
  }

  return group;
}

function createPhotoGateCover(width, height) {
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 1,
    depthWrite: true,
    side: THREE.DoubleSide,
    toneMapped: false,
  });

  loader.load(PHOTO_GATE_IMAGE_URL, (texture) => {
    material.map = createSeamlessPhotoGateTexture(texture.image);
    material.needsUpdate = true;
  });

  return new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
}

function createSeamlessPhotoGateTexture(image) {
  const canvas = document.createElement("canvas");
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, width, height);

  const seamCenter = Math.floor(width / 2);
  const seamWidth = Math.max(12, Math.round(width * 0.008));
  const sampleOffset = seamWidth * 3;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y += 1) {
    const leftX = Math.max(0, seamCenter - sampleOffset);
    const rightX = Math.min(width - 1, seamCenter + sampleOffset);
    const leftIndex = (y * width + leftX) * 4;
    const rightIndex = (y * width + rightX) * 4;

    for (let x = seamCenter - seamWidth; x <= seamCenter + seamWidth; x += 1) {
      if (x < 0 || x >= width) {
        continue;
      }
      const t = (x - (seamCenter - seamWidth)) / (seamWidth * 2);
      const index = (y * width + x) * 4;
      data[index] = data[leftIndex] * (1 - t) + data[rightIndex] * t;
      data[index + 1] = data[leftIndex + 1] * (1 - t) + data[rightIndex + 1] * t;
      data[index + 2] = data[leftIndex + 2] * (1 - t) + data[rightIndex + 2] * t;
      data[index + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = PERFORMANCE_MODE ? 1 : 4;
  return texture;
}

function createPhotoGatePanel(width, height, textureOffsetX, backMaterial) {
  const group = new THREE.Group();
  const centerY = height / 2 + 0.1;

  const back = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.06), backMaterial);
  back.position.set(0, centerY, -0.04);
  back.castShadow = true;
  back.receiveShadow = true;
  group.add(back);

  const photo = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    createPhotoPanelMaterial(textureOffsetX),
  );
  photo.position.set(0, centerY, 0.045);
  group.add(photo);

  return group;
}

function createPhotoPanelMaterial(textureOffsetX) {
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    toneMapped: false,
  });

  loader.load(PHOTO_GATE_IMAGE_URL, (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.repeat.set(0.5, 1);
    texture.offset.set(textureOffsetX, 0);
    texture.needsUpdate = true;
    material.map = texture;
    material.needsUpdate = true;
  });

  return material;
}

function createFootball() {
  const group = new THREE.Group();
  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(FOOTBALL_RADIUS, PERFORMANCE_MODE ? 24 : 40, PERFORMANCE_MODE ? 16 : 24),
    createFootballMaterial(),
  );
  ball.castShadow = true;
  ball.receiveShadow = true;
  group.add(ball);

  const contactShadow = new THREE.Mesh(
    new THREE.CircleGeometry(FOOTBALL_RADIUS * 0.92, PERFORMANCE_MODE ? 16 : 24),
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    }),
  );
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.y = -FOOTBALL_RADIUS + 0.012;
  group.add(contactShadow);

  return group;
}

function createFootballMaterial() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#f4f4ed";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(25, 25, 25, 0.38)";
  ctx.lineWidth = 3;

  for (let x = 0; x <= canvas.width; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 32, canvas.height);
    ctx.stroke();
  }

  for (let y = 32; y < canvas.height; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y + 18);
    ctx.stroke();
  }

  ctx.fillStyle = "#151515";
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const x = col * 64 + (row % 2) * 32 + 28;
      const y = row * 74 + 42;
      drawFootballPatch(ctx, x, y, 18);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  return new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.42,
    metalness: 0.02,
  });
}

function drawFootballPatch(ctx, x, y, radius) {
  ctx.beginPath();
  for (let i = 0; i < 5; i += 1) {
    const angle = -Math.PI / 2 + i * (Math.PI * 2 / 5);
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.closePath();
  ctx.fill();
}

function createPlayer() {
  const group = new THREE.Group();

  if (!shouldAttemptDetailedCharacter()) {
    attachProceduralCharacter(group);
  }

  return group;
}

function attachProceduralCharacter(parent) {
  if (parent.userData.proceduralChildren?.length) {
    return;
  }

  const character = createProceduralCharacter();
  parent.userData.parts = character.userData.parts;
  parent.userData.proceduralChildren = [character];
  parent.add(character);
}

function createProceduralCharacter() {
  const group = new THREE.Group();

  const skin = new THREE.MeshStandardMaterial({
    color: 0xdfb283,
    roughness: 0.64,
  });
  const shirt = new THREE.MeshStandardMaterial({
    color: 0xf6f7ef,
    roughness: 0.7,
  });
  const shorts = new THREE.MeshStandardMaterial({
    color: 0x2f8953,
    roughness: 0.78,
  });
  const hair = new THREE.MeshStandardMaterial({
    color: 0x120f10,
    roughness: 0.92,
  });
  const eye = new THREE.MeshStandardMaterial({
    color: 0x020202,
    roughness: 0.36,
  });
  const eyeWhite = new THREE.MeshStandardMaterial({
    color: 0xf5efe3,
    roughness: 0.48,
  });
  const glasses = new THREE.MeshStandardMaterial({
    color: 0xd4cbb8,
    roughness: 0.32,
    metalness: 0.72,
  });
  const earring = new THREE.MeshStandardMaterial({
    color: 0xcfc6a5,
    roughness: 0.34,
    metalness: 0.78,
  });
  const lip = new THREE.MeshStandardMaterial({
    color: 0x8d4a43,
    roughness: 0.66,
  });
  const shoe = new THREE.MeshStandardMaterial({
    color: 0xf5f6ef,
    roughness: 0.58,
  });
  const shoeTrim = new THREE.MeshStandardMaterial({
    color: 0x2f8d58,
    roughness: 0.64,
  });

  const add = (parent, mesh) => {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };

  const torso = new THREE.Group();
  const chest = add(torso, new THREE.Mesh(new THREE.SphereGeometry(0.55, 32, 18), shirt));
  chest.position.set(0, 1.25, -0.01);
  chest.scale.set(0.72, 0.88, 0.46);

  const waist = add(torso, new THREE.Mesh(new THREE.SphereGeometry(0.43, 28, 16), shirt));
  waist.position.set(0, 0.96, 0);
  waist.scale.set(0.86, 0.6, 0.48);

  const shirtHem = add(torso, new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.018, 8, 36), shirt));
  shirtHem.position.set(0, 0.75, 0);
  shirtHem.scale.set(1.18, 1, 0.7);
  shirtHem.rotation.x = Math.PI / 2;
  group.add(torso);

  const collar = add(group, new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.021, 8, 32), shirt));
  collar.position.set(0, 1.58, -0.05);
  collar.scale.set(1.05, 0.72, 1);
  collar.rotation.x = Math.PI / 2;

  const neckline = add(group, new THREE.Mesh(new THREE.SphereGeometry(0.23, 18, 10), skin));
  neckline.position.set(0, 1.55, -0.02);
  neckline.scale.set(0.62, 0.35, 0.45);

  const hips = add(group, new THREE.Mesh(new THREE.SphereGeometry(0.48, 28, 16), shorts));
  hips.position.set(0, 0.7, 0);
  hips.scale.set(0.92, 0.42, 0.58);

  const leftShortLeg = add(group, new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.2, 6, 18), shorts));
  leftShortLeg.position.set(-0.17, 0.55, -0.01);
  leftShortLeg.scale.set(1.05, 0.88, 0.82);

  const rightShortLeg = leftShortLeg.clone();
  rightShortLeg.position.x = 0.17;
  group.add(rightShortLeg);

  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.81, -0.02);

  const head = add(headGroup, new THREE.Mesh(new THREE.SphereGeometry(0.34, 32, 22), skin));
  head.scale.set(0.78, 1.18, 0.74);

  const face = add(headGroup, new THREE.Mesh(new THREE.SphereGeometry(0.31, 28, 18), skin));
  face.position.set(0, -0.06, -0.09);
  face.scale.set(0.78, 1.06, 0.6);

  const hairCap = add(
    headGroup,
    new THREE.Mesh(new THREE.SphereGeometry(0.35, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.44), hair),
  );
  hairCap.position.set(0, 0.2, 0.08);
  hairCap.scale.set(0.92, 0.72, 1.08);

  const backHair = add(headGroup, new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.56, 9, 20), hair));
  backHair.position.set(0, -0.25, 0.24);
  backHair.scale.set(1.22, 1.05, 0.48);
  backHair.rotation.x = -0.08;

  const leftSideHair = createHairPanel(hair, -1);
  leftSideHair.position.set(-0.27, -0.12, 0.03);
  headGroup.add(leftSideHair);

  const rightSideHair = createHairPanel(hair, 1);
  rightSideHair.position.set(0.27, -0.12, 0.03);
  headGroup.add(rightSideHair);

  const sweptHair = [];
  for (let i = 0; i < 7; i += 1) {
    const strand = add(
      headGroup,
      new THREE.Mesh(new THREE.CapsuleGeometry(0.014, 0.2 + Math.abs(i - 3) * 0.01, 5, 10), hair),
    );
    strand.position.set((i - 3) * 0.048, 0.22 - Math.abs(i - 3) * 0.004, -0.03);
    strand.rotation.set(1.42, 0, (i - 3) * 0.07);
    sweptHair.push(strand);
  }

  const partLine = add(headGroup, new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.16, 0.006), skin));
  partLine.position.set(0, 0.22, -0.09);
  partLine.rotation.x = 1.28;

  const leftBrow = add(headGroup, new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.014, 0.014), hair));
  leftBrow.position.set(-0.098, 0.065, -0.296);
  leftBrow.rotation.z = -0.16;

  const rightBrow = leftBrow.clone();
  rightBrow.position.x = 0.098;
  rightBrow.rotation.z = 0.16;
  headGroup.add(rightBrow);

  const leftEyeBase = add(headGroup, new THREE.Mesh(new THREE.SphereGeometry(0.049, 16, 10), eyeWhite));
  leftEyeBase.position.set(-0.095, 0.006, -0.308);
  leftEyeBase.scale.set(1.22, 0.72, 0.32);

  const rightEyeBase = leftEyeBase.clone();
  rightEyeBase.position.x = 0.095;
  headGroup.add(rightEyeBase);

  const leftEye = add(headGroup, new THREE.Mesh(new THREE.SphereGeometry(0.028, 12, 8), eye));
  leftEye.position.set(-0.095, 0.004, -0.331);
  leftEye.scale.set(0.92, 1.04, 0.34);

  const rightEye = leftEye.clone();
  rightEye.position.x = 0.095;
  headGroup.add(rightEye);

  const eyeShineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const leftShine = new THREE.Mesh(new THREE.SphereGeometry(0.01, 8, 6), eyeShineMaterial);
  leftShine.position.set(-0.105, 0.016, -0.344);
  headGroup.add(leftShine);

  const rightShine = leftShine.clone();
  rightShine.position.x = 0.085;
  headGroup.add(rightShine);

  const nose = add(headGroup, new THREE.Mesh(new THREE.ConeGeometry(0.026, 0.12, 12), skin));
  nose.position.set(0, -0.048, -0.314);
  nose.rotation.x = -Math.PI / 2;
  nose.scale.set(0.62, 1, 1.34);

  const mouth = add(headGroup, new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.014, 0.012), lip));
  mouth.position.set(0, -0.15, -0.306);
  mouth.rotation.x = 0.04;

  const leftEar = add(headGroup, new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 8), skin));
  leftEar.position.set(-0.25, -0.025, -0.01);
  leftEar.scale.set(0.45, 1, 0.32);

  const rightEar = leftEar.clone();
  rightEar.position.x = 0.25;
  headGroup.add(rightEar);

  const leftEarring = add(headGroup, new THREE.Mesh(new THREE.TorusGeometry(0.026, 0.0038, 6, 24), earring));
  leftEarring.position.set(-0.258, -0.08, -0.015);
  leftEarring.rotation.y = Math.PI / 2;

  const rightEarring = leftEarring.clone();
  rightEarring.position.x = 0.258;
  headGroup.add(rightEarring);

  const glassesFrame = createGlasses(glasses);
  glassesFrame.position.set(0, 0.01, -0.35);
  headGroup.add(glassesFrame);
  group.add(headGroup);

  const leftArm = createArm(skin, shirt, -1);
  leftArm.position.set(-0.43, 1.34, 0);
  leftArm.rotation.z = 0.16;
  group.add(leftArm);

  const rightArm = createArm(skin, shirt, 1);
  rightArm.position.set(0.43, 1.34, 0);
  rightArm.rotation.z = -0.16;
  group.add(rightArm);

  const leftLeg = createLeg(skin, shorts, shoe, shoeTrim, -1);
  leftLeg.position.set(-0.18, 0.64, 0);
  group.add(leftLeg);

  const rightLeg = createLeg(skin, shorts, shoe, shoeTrim, 1);
  rightLeg.position.set(0.18, 0.64, 0);
  group.add(rightLeg);

  group.userData.parts = {
    torso,
    headGroup,
    leftLeg,
    rightLeg,
    leftArm,
    rightArm,
    leftShoe: leftLeg.userData.shoe,
    rightShoe: rightLeg.userData.shoe,
    backHair,
    leftSideHair,
    rightSideHair,
    bangs: sweptHair,
  };
  return group;
}

function createHairPanel(material, side) {
  const group = new THREE.Group();
  for (let i = 0; i < 4; i += 1) {
    const strand = new THREE.Mesh(new THREE.CapsuleGeometry(0.034, 0.38 + i * 0.035, 5, 10), material);
    strand.position.set(side * (i * 0.014), -0.04 - i * 0.038, 0.02 + i * 0.018);
    strand.rotation.set(-0.03, side * -0.22, side * (0.08 + i * 0.03));
    strand.castShadow = true;
    group.add(strand);
  }

  const flippedEnd = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.18, 5, 10), material);
  flippedEnd.position.set(side * 0.08, -0.34, 0.09);
  flippedEnd.rotation.set(Math.PI / 2, side * 0.2, side * 0.85);
  flippedEnd.castShadow = true;
  group.add(flippedEnd);

  return group;
}

function createGlasses(material) {
  const group = new THREE.Group();
  const lensGeometry = new THREE.TorusGeometry(0.067, 0.006, 6, 36);
  const leftLens = new THREE.Mesh(lensGeometry, material);
  leftLens.position.x = -0.088;
  leftLens.scale.set(1.34, 0.7, 1);
  group.add(leftLens);

  const rightLens = leftLens.clone();
  rightLens.position.x = 0.086;
  group.add(rightLens);

  const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.056, 0.007, 0.007), material);
  bridge.position.set(0, 0.002, 0.002);
  group.add(bridge);

  const leftTemple = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.006, 0.007), material);
  leftTemple.position.set(-0.17, 0.005, 0.045);
  leftTemple.rotation.y = -0.38;
  group.add(leftTemple);

  const rightTemple = leftTemple.clone();
  rightTemple.position.x = 0.17;
  rightTemple.rotation.y = 0.38;
  group.add(rightTemple);

  return group;
}

function createArm(skinMaterial, shirtMaterial, side) {
  const group = new THREE.Group();

  const sleeve = new THREE.Mesh(new THREE.CapsuleGeometry(0.115, 0.18, 7, 18), shirtMaterial);
  sleeve.position.set(side * 0.04, -0.13, 0);
  sleeve.rotation.z = side * 0.06;
  sleeve.castShadow = true;
  group.add(sleeve);

  const forearm = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.42, 8, 18), skinMaterial);
  forearm.position.set(side * 0.1, -0.42, 0.01);
  forearm.rotation.z = side * -0.09;
  forearm.castShadow = true;
  group.add(forearm);

  const hand = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 10), skinMaterial);
  hand.position.set(side * 0.14, -0.68, 0.02);
  hand.scale.set(0.85, 1, 0.72);
  hand.castShadow = true;
  group.add(hand);

  return group;
}

function createLeg(skinMaterial, shortsMaterial, shoeMaterial, trimMaterial, side) {
  const group = new THREE.Group();

  const shortsCuff = new THREE.Mesh(new THREE.CapsuleGeometry(0.115, 0.11, 6, 16), shortsMaterial);
  shortsCuff.position.set(0, -0.08, 0);
  shortsCuff.scale.set(1.08, 0.86, 0.9);
  shortsCuff.castShadow = true;
  group.add(shortsCuff);

  const thigh = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.22, 8, 18), skinMaterial);
  thigh.position.set(0, -0.24, 0.005);
  thigh.castShadow = true;
  group.add(thigh);

  const shin = new THREE.Mesh(new THREE.CapsuleGeometry(0.073, 0.34, 8, 18), skinMaterial);
  shin.position.set(0, -0.54, 0);
  shin.scale.set(0.86, 1, 0.86);
  shin.castShadow = true;
  group.add(shin);

  const shoe = createShoe(shoeMaterial, trimMaterial, side);
  shoe.position.set(0, -0.79, -0.08);
  group.add(shoe);
  group.userData.shoe = shoe;

  return group;
}

function createShoe(shoeMaterial, trimMaterial, side = 1) {
  const group = new THREE.Group();

  const upper = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.24, 8, 20), shoeMaterial);
  upper.position.set(0, 0.08, -0.02);
  upper.rotation.x = Math.PI / 2;
  upper.scale.set(1.08, 1, 0.72);
  upper.castShadow = true;
  group.add(upper);

  const toe = new THREE.Mesh(new THREE.SphereGeometry(0.115, 16, 10), shoeMaterial);
  toe.position.set(0, 0.085, -0.2);
  toe.scale.set(1.1, 0.56, 0.86);
  toe.castShadow = true;
  group.add(toe);

  const sole = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.045, 0.42), trimMaterial);
  sole.position.set(0, -0.012, -0.035);
  sole.castShadow = true;
  group.add(sole);

  const sideStripe = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.048, 0.22), trimMaterial);
  sideStripe.position.set(side * -0.12, 0.095, -0.07);
  sideStripe.rotation.y = side * 0.04;
  group.add(sideStripe);

  const laceMaterial = new THREE.MeshStandardMaterial({
    color: 0xdfe9db,
    roughness: 0.68,
  });
  for (let i = 0; i < 2; i += 1) {
    const lace = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.012, 0.018), laceMaterial);
    lace.position.set(0, 0.17, -0.08 - i * 0.045);
    lace.rotation.z = (i === 0 ? 1 : -1) * 0.16;
    group.add(lace);
  }

  return group;
}

async function loadDetailedCharacter() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("character") === "procedural") {
    setProceduralCharacterVisible(true);
    updateCharacterTools(false);
    return;
  }

  setProceduralCharacterVisible(false);

  if (!params.get("model")) {
    const storedFile = await getStoredCharacterFile();
    if (storedFile && (await loadCharacterFile(storedFile))) {
      return;
    }
  }

  const modelUrl = await resolveCharacterModelUrl(params);
  if (!modelUrl) {
    setProceduralCharacterVisible(true);
    updateCharacterTools(false);
    return;
  }

  if (!(await loadCharacterFromSource(modelUrl, modelUrl))) {
    setProceduralCharacterVisible(true);
  }
}

async function loadCharacterFile(file, options = {}) {
  if (!isSupportedCharacterModel(file.name)) {
    setModelStatus("Нужен файл .vrm или .glb");
    return false;
  }

  const objectUrl = URL.createObjectURL(file);
  const loaded = await loadCharacterFromSource(objectUrl, file.name, { objectUrl });

  if (!loaded) {
    return false;
  }

  if (options.persist) {
    try {
      await saveStoredCharacterFile(file);
      setModelStatus(`Готово: ${getDisplayModelName(file.name)}`);
    } catch (error) {
      console.warn("Could not save character model locally.", error);
      setModelStatus(`Загружено: ${getDisplayModelName(file.name)}`);
    }
  }

  return true;
}

async function loadCharacterFromSource(sourceUrl, sourceName, options = {}) {
  try {
    const params = new URLSearchParams(window.location.search);
    const isVrm = sourceName.toLowerCase().endsWith(".vrm");
    const loader = await getGltfLoader({ vrm: isVrm });
    const gltf = await loader.loadAsync(sourceUrl);
    const vrm = isVrm ? gltf.userData.vrm : null;
    const model = vrm?.scene || gltf.scene;

    if (vrm) {
      const { VRMUtils } = await import("@pixiv/three-vrm");
      VRMUtils.removeUnnecessaryVertices(model);
      VRMUtils.combineSkeletons(model);
      VRMUtils.rotateVRM0(vrm);
    }

    const characterOptions = getDetailedCharacterOptions(params, { isVrm });

    prepareDetailedCharacterModel(model);
    fitDetailedCharacterModel(model, characterOptions);

    const state = createDetailedCharacterState(model, gltf.animations, vrm, {
      objectUrl: options.objectUrl || null,
      sourceName,
      rotationDegrees: characterOptions.rotationDegrees,
    });

    clearDetailedCharacter({ showProcedural: false });
    setProceduralCharacterVisible(false);
    player.add(model);
    player.userData.detailedCharacter = state;
    updateCharacterTools(true);
    setModelStatus(getDisplayModelName(sourceName));
    return true;
  } catch (error) {
    console.warn("Could not load detailed character model.", error);
    if (options.objectUrl) {
      URL.revokeObjectURL(options.objectUrl);
    }
    setModelStatus("Модель не загрузилась");
    return false;
  }
}

async function resolveCharacterModelUrl(params) {
  const explicitModel = params.get("model");
  if (explicitModel) {
    return (await canLoadModel(explicitModel)) ? explicitModel : null;
  }

  if (await canLoadModel(DEFAULT_CHARACTER_VRM_URL)) {
    return DEFAULT_CHARACTER_VRM_URL;
  }

  if (await canLoadModel(DEFAULT_CHARACTER_GLB_URL)) {
    return DEFAULT_CHARACTER_GLB_URL;
  }

  return null;
}

async function getGltfLoader(options = {}) {
  if (options.vrm) {
    if (!vrmLoader) {
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
      const { VRMLoaderPlugin } = await import("@pixiv/three-vrm");
      vrmLoader = new GLTFLoader();
      vrmLoader.register((parser) => new VRMLoaderPlugin(parser));
    }
    return vrmLoader;
  }

  if (!gltfLoader) {
    const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
    gltfLoader = new GLTFLoader();
  }
  return gltfLoader;
}

async function canLoadModel(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    if (!response.ok) {
      return false;
    }

    const contentType = response.headers.get("content-type") || "";
    return !contentType.toLowerCase().includes("text/html");
  } catch {
    return false;
  }
}

async function onModelInputChange() {
  const file = modelInput.files?.[0];
  modelInput.value = "";

  if (!file) {
    return;
  }

  setModelStatus("Загрузка...");
  await loadCharacterFile(file, { persist: true });
}

async function resetDetailedCharacter() {
  clearDetailedCharacter();
  try {
    await deleteStoredCharacterFile();
  } catch (error) {
    console.warn("Could not delete saved character model.", error);
  }
  setModelStatus("");
}

function rotateDetailedCharacter() {
  characterRotationOffset = normalizeDegrees(characterRotationOffset + 180);
  storeCharacterRotation(characterRotationOffset);

  const state = player.userData.detailedCharacter;
  if (state?.model) {
    const rotationDegrees = normalizeDegrees((state.rotationDegrees ?? 0) + 180);
    state.rotationDegrees = rotationDegrees;
    state.model.rotation.y = THREE.MathUtils.degToRad(rotationDegrees);
  }
}

function clearDetailedCharacter(options = {}) {
  const showProcedural = options.showProcedural ?? true;
  const state = player.userData.detailedCharacter;

  if (state) {
    state.mixer?.stopAllAction();
    if (state.model) {
      player.remove(state.model);
      disposeObject3D(state.model);
    }
    if (state.objectUrl) {
      URL.revokeObjectURL(state.objectUrl);
    }
  }

  setProceduralCharacterVisible(showProcedural);
  delete player.userData.detailedCharacter;
  updateCharacterTools(false);
}

function disposeObject3D(root) {
  root.traverse((child) => {
    if (child.geometry) {
      child.geometry.dispose();
    }

    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.filter(Boolean).forEach(disposeMaterial);
  });
}

function disposeMaterial(material) {
  Object.values(material).forEach((value) => {
    if (value?.isTexture) {
      value.dispose();
    }
  });
  material.dispose?.();
}

function getDetailedCharacterOptions(params, options = {}) {
  const urlRotationValue = params.get("modelRotation");
  const urlRotation = urlRotationValue === null ? NaN : Number(urlRotationValue);
  const baseRotation = options.isVrm ? 180 : 0;
  const rotationDegrees = normalizeDegrees(
    Number.isFinite(urlRotation) ? urlRotation : baseRotation + characterRotationOffset,
  );

  return {
    height: Number(params.get("modelHeight")) || PLAYER_HEIGHT,
    rotation: THREE.MathUtils.degToRad(rotationDegrees),
    rotationDegrees,
  };
}

function shouldAttemptDetailedCharacter() {
  return new URLSearchParams(window.location.search).get("character") !== "procedural";
}

function setProceduralCharacterVisible(visible) {
  if (visible) {
    attachProceduralCharacter(player);
  }

  player.userData.proceduralChildren?.forEach((child) => {
    child.visible = visible;
  });
}

function normalizeDegrees(degrees) {
  return ((degrees % 360) + 360) % 360;
}

function isSupportedCharacterModel(name) {
  const lowerName = name.toLowerCase();
  return lowerName.endsWith(".vrm") || lowerName.endsWith(".glb");
}

function updateCharacterTools(hasDetailedCharacter) {
  rotateModelButton.hidden = !hasDetailedCharacter;
  resetModelButton.hidden = !hasDetailedCharacter;
}

function setModelStatus(message) {
  modelStatus.textContent = message;
  modelStatus.hidden = !message;
}

function getDisplayModelName(sourceName) {
  const cleanName = sourceName.split("?")[0].split("#")[0].split("/").pop() || sourceName;
  try {
    return decodeURIComponent(cleanName);
  } catch {
    return cleanName;
  }
}

function readStoredCharacterRotation() {
  try {
    const rotation = Number(window.localStorage.getItem(CHARACTER_ROTATION_KEY));
    return Number.isFinite(rotation) ? rotation : 0;
  } catch {
    return 0;
  }
}

function storeCharacterRotation(rotation) {
  try {
    window.localStorage.setItem(CHARACTER_ROTATION_KEY, String(rotation));
  } catch {
    // The rotation is a convenience; the model still works without storage.
  }
}

async function getStoredCharacterFile() {
  const record = await readCharacterRecord();
  if (!record?.data || !record?.name) {
    return null;
  }

  return new File([record.data], record.name, {
    type: record.type || guessCharacterMimeType(record.name),
    lastModified: record.lastModified || Date.now(),
  });
}

async function saveStoredCharacterFile(file) {
  const record = {
    name: file.name,
    type: file.type || guessCharacterMimeType(file.name),
    lastModified: file.lastModified || Date.now(),
    data: await file.arrayBuffer(),
  };
  await writeCharacterRecord(record);
}

async function deleteStoredCharacterFile() {
  const db = await openCharacterDb();
  await new Promise((resolve, reject) => {
    const transaction = db.transaction(CHARACTER_STORE_NAME, "readwrite");
    const request = transaction.objectStore(CHARACTER_STORE_NAME).delete(CHARACTER_RECORD_KEY);

    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  db.close();
}

async function readCharacterRecord() {
  try {
    const db = await openCharacterDb();
    const record = await new Promise((resolve, reject) => {
      const transaction = db.transaction(CHARACTER_STORE_NAME, "readonly");
      const request = transaction.objectStore(CHARACTER_STORE_NAME).get(CHARACTER_RECORD_KEY);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
      transaction.onerror = () => reject(transaction.error);
    });
    db.close();
    return record;
  } catch (error) {
    console.warn("Could not read saved character model.", error);
    return null;
  }
}

async function writeCharacterRecord(record) {
  const db = await openCharacterDb();
  await new Promise((resolve, reject) => {
    const transaction = db.transaction(CHARACTER_STORE_NAME, "readwrite");
    const request = transaction.objectStore(CHARACTER_STORE_NAME).put(record, CHARACTER_RECORD_KEY);

    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  db.close();
}

function openCharacterDb() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(CHARACTER_DB_NAME, 1);

    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(CHARACTER_STORE_NAME)) {
        request.result.createObjectStore(CHARACTER_STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function guessCharacterMimeType(name) {
  return name.toLowerCase().endsWith(".vrm") ? "model/gltf-binary" : "model/gltf-binary";
}

function prepareDetailedCharacterModel(model) {
  model.traverse((child) => {
    if (!child.isMesh) {
      return;
    }
    child.castShadow = true;
    child.receiveShadow = true;
    child.frustumCulled = false;
  });
}

function fitDetailedCharacterModel(model, options) {
  const box = new THREE.Box3().setFromObject(model);
  const size = new THREE.Vector3();
  box.getSize(size);
  const scale = options.height / Math.max(size.y, 0.001);
  model.scale.multiplyScalar(scale);
  model.rotation.y = options.rotation;

  const fittedBox = new THREE.Box3().setFromObject(model);
  const center = new THREE.Vector3();
  fittedBox.getCenter(center);
  model.position.set(-center.x, -fittedBox.min.y, -center.z);
}

function createDetailedCharacterState(model, clips, vrm = null, options = {}) {
  const mixer = clips.length > 0 ? new THREE.AnimationMixer(model) : null;
  const idleClip = findCharacterClip(clips, ["idle", "stand", "breath"]);
  const walkClip = findCharacterClip(clips, ["walk", "run", "move"]);
  const idleAction = mixer && idleClip ? mixer.clipAction(idleClip) : null;
  const walkAction = mixer && walkClip ? mixer.clipAction(walkClip) : null;
  const initialAction = idleAction || walkAction;

  if (initialAction) {
    initialAction.play();
  }

  return {
    vrm,
    model,
    objectUrl: options.objectUrl || null,
    sourceName: options.sourceName || "",
    mixer,
    idleAction,
    walkAction,
    activeAction: initialAction,
    poseTime: 0,
  };
}

function findCharacterClip(clips, names) {
  return clips.find((clip) => {
    const clipName = clip.name.toLowerCase();
    return names.some((name) => clipName.includes(name));
  });
}

function updateDetailedCharacterAnimation(moving, delta) {
  const state = player.userData.detailedCharacter;
  if (!state) {
    return;
  }

  const nextAction = moving
    ? state.walkAction || state.idleAction
    : state.idleAction || state.walkAction;

  if (nextAction && nextAction !== state.activeAction) {
    state.activeAction?.fadeOut(0.18);
    nextAction.reset().fadeIn(0.18).play();
    state.activeAction = nextAction;
  }

  updateVrmProceduralPose(state, moving, delta);
  state.mixer?.update(delta);
  state.vrm?.update(delta);
}

function updateVrmProceduralPose(state, moving, delta) {
  if (!state.vrm?.humanoid || state.mixer) {
    return;
  }

  state.poseTime += delta * (moving ? 1 : 0.35);
  const stride = moving ? Math.sin(state.poseTime * 8.5) : 0;
  const counterStride = -stride;
  const settle = moving ? 1 : 0;
  const breathe = Math.sin(state.poseTime * 1.8) * 0.025;
  const kick = getKickAnimationAmount();

  state.vrm.humanoid.setNormalizedPose({
    chest: {
      rotation: eulerToQuaternionArray(breathe - kick * 0.08, stride * 0.025, kick * 0.03),
    },
    upperChest: {
      rotation: eulerToQuaternionArray(breathe * 0.5 - kick * 0.05, stride * 0.018, kick * 0.025),
    },
    leftUpperArm: {
      rotation: eulerToQuaternionArray(-kick * 0.14, 0, -1.22 + counterStride * 0.16 * settle),
    },
    rightUpperArm: {
      rotation: eulerToQuaternionArray(kick * 0.18, 0, 1.22 + counterStride * 0.16 * settle),
    },
    leftLowerArm: {
      rotation: eulerToQuaternionArray(0, 0, -0.24 + Math.max(stride, 0) * -0.12 * settle),
    },
    rightLowerArm: {
      rotation: eulerToQuaternionArray(0, 0, 0.24 + Math.max(counterStride, 0) * 0.12 * settle),
    },
    leftUpperLeg: {
      rotation: eulerToQuaternionArray(stride * 0.36 * settle + kick * 0.16, 0, 0),
    },
    rightUpperLeg: {
      rotation: eulerToQuaternionArray(counterStride * 0.36 * settle - kick * 1.02, 0, 0),
    },
    leftLowerLeg: {
      rotation: eulerToQuaternionArray(Math.max(counterStride, 0) * 0.45 * settle, 0, 0),
    },
    rightLowerLeg: {
      rotation: eulerToQuaternionArray(Math.max(stride, 0) * 0.45 * settle + kick * 1.08, 0, 0),
    },
  });
}

function eulerToQuaternionArray(x, y, z) {
  return new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z)).toArray();
}

function animate() {
  const delta = Math.min(clock.getDelta(), 0.033);
  const elapsed = clock.elapsedTime;

  if (gameStarted) {
    updatePlayer(delta, elapsed);
    updateSecondRoomPuzzle(delta, elapsed);
    updateThirdRoomPuzzle(delta, elapsed);
    updateFourthRoomPuzzle(delta, elapsed);
    updateFifthRoomPuzzle(delta, elapsed);
    if (GRAVEYARD_VARIANT) {
      updateGraveyardPuzzle(delta, elapsed);
    }
    updateSixthRoomFinale(delta, elapsed);
  }

  updateCamera(delta);
  updateCameraFadeMeshes(delta);
  updateSparkles(elapsed);
  updateRoomLights(elapsed);
  if (gameStarted) {
    updateAmbientMusicForRoom();
    updateRoomEntryInstructions(delta, elapsed);
  }
  updateHud();

  portalGlow.visible = getCurrentRoomIndex() < SIXTH_ROOM_INDEX;
  if (portalGlow.visible) {
    portalGlow.rotation.z = Math.sin(elapsed * 0.7) * 0.04;
  }
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function updatePlayer(delta, elapsed) {
  const drive = getDriveInput();
  const moving = Math.abs(drive.move) > 0.001;
  const turning = Math.abs(drive.turn) > 0.001;

  if (turning) {
    turnPlayer(-drive.turn * TURN_SPEED * delta);
  }

  if (moving) {
    const speed = drive.move < 0 ? WALK_SPEED * BACKPEDAL_SPEED_MULTIPLIER : WALK_SPEED;
    const proposed = player.position.clone().addScaledVector(getPlayerForwardVector(), drive.move * speed * delta);
    constrainToRooms(proposed, player.position);
    player.position.copy(proposed);
  }

  const parts = player.userData.parts;
  const stride = moving ? Math.sin(elapsed * 10.8) : 0;
  const settle = moving ? 1 : 0.24;
  const kick = getKickAnimationAmount();

  if (player.userData.detailedCharacter) {
    updateDetailedCharacterAnimation(moving, delta);
    player.position.y = 0;
    return;
  }

  if (!parts) {
    player.position.y = 0;
    return;
  }

  parts.leftLeg.rotation.x = stride * 0.44 * settle + kick * 0.16;
  parts.rightLeg.rotation.x = -stride * 0.44 * settle - kick * 1.08;
  parts.leftArm.rotation.x = -stride * 0.34 * settle - kick * 0.18;
  parts.rightArm.rotation.x = stride * 0.34 * settle + kick * 0.22;
  parts.leftShoe.rotation.x = Math.max(stride, 0) * 0.12 * settle;
  parts.rightShoe.rotation.x = Math.max(-stride, 0) * 0.12 * settle + kick * 0.68;
  parts.torso.rotation.x = -kick * 0.1;
  parts.torso.rotation.z = stride * 0.025 * settle + kick * 0.035;
  parts.headGroup.rotation.z = -stride * 0.012 * settle - kick * 0.02;
  parts.backHair.rotation.x = -0.05 + Math.sin(elapsed * (moving ? 6.5 : 1.8)) * (moving ? 0.045 : 0.016);
  parts.leftSideHair.rotation.z = -0.025 + Math.sin(elapsed * 2.1) * 0.018;
  parts.rightSideHair.rotation.z = 0.025 - Math.sin(elapsed * 2.1) * 0.018;
  parts.bangs.forEach((bang, index) => {
    bang.rotation.z = (index - 2) * 0.14 + Math.sin(elapsed * 2 + index) * 0.012;
  });
  player.position.y = Math.max(0, Math.sin(elapsed * 12.2) * (moving ? 0.045 : 0.012));
}

function updateSecondRoomPuzzle(delta, elapsed) {
  updateKickAnimationTimer(delta);
  updatePhotoGate(delta);
  updateFootball(delta);
  updateSecondRoomFish(elapsed);
}

function updateSecondRoomFish(elapsed) {
  secondRoomPuzzle.fishes.forEach((entry) => {
    const swim = Math.sin(elapsed * entry.speed + entry.phase) * entry.range;
    const direction = Math.cos(elapsed * entry.speed + entry.phase) >= 0 ? 1 : -1;
    const wiggle = Math.sin(elapsed * entry.speed * 2.4 + entry.phase) * 0.045;
    entry.fish.position.copy(entry.base);
    if (entry.axis === "x") {
      entry.fish.position.x += swim;
      entry.fish.position.z += wiggle;
      entry.fish.rotation.y = direction > 0 ? 0 : Math.PI;
    } else {
      entry.fish.position.z += swim;
      entry.fish.position.x += wiggle;
      entry.fish.rotation.y = direction > 0 ? -Math.PI / 2 : Math.PI / 2;
    }
    entry.fish.rotation.z = Math.sin(elapsed * entry.speed * 3.1 + entry.phase) * 0.16;
  });
}

function updateThirdRoomPuzzle(delta, elapsed) {
  updateThirdRoomTileVisuals(elapsed);
  updateThirdRoomTileTriggers();
  updateThirdRoomDoor(delta);
}

function updateThirdRoomTileVisuals(elapsed) {
  thirdRoomPuzzle.tiles.forEach((tile) => {
    const isCurrent = tile.sequenceIndex === thirdRoomPuzzle.currentStep && !thirdRoomPuzzle.completed;
    const isPlayed = tile.played || tile.sequenceIndex < thirdRoomPuzzle.currentStep;
    const pulse = Math.sin(elapsed * 3.4 + tile.sequenceIndex * 0.6) * 0.5 + 0.5;

    tile.pad.material.emissiveIntensity = isCurrent
      ? 0.62 + pulse * 0.22
      : (isPlayed ? 0.42 : 0.13);
    tile.ring.material.opacity = isCurrent
      ? 0.38 + pulse * 0.22
      : (isPlayed ? 0.3 : 0.08);
    tile.group.position.y = tile.baseY + (isCurrent ? pulse * 0.025 : 0);
    tile.ring.rotation.z = elapsed * (isCurrent ? 0.85 : 0.2);
  });
}

function updateThirdRoomTileTriggers() {
  if (thirdRoomPuzzle.completed || !isPlayerInThirdRoom()) {
    thirdRoomPuzzle.activeTileIndex = null;
    return;
  }

  const tile = getPlayerMelodyTile();
  if (!tile) {
    thirdRoomPuzzle.activeTileIndex = null;
    return;
  }

  if (thirdRoomPuzzle.activeTileIndex === tile.sequenceIndex) {
    return;
  }

  thirdRoomPuzzle.activeTileIndex = tile.sequenceIndex;
  if (tile.sequenceIndex !== thirdRoomPuzzle.currentStep) {
    return;
  }

  playMelodyNote(tile.note.frequency, 0, 0.46, 0.16);
  tile.played = true;
  thirdRoomPuzzle.currentStep += 1;

  if (thirdRoomPuzzle.currentStep >= THIRD_ROOM_MELODY.length) {
    completeThirdRoomMelody();
  }
}

function getPlayerMelodyTile() {
  return thirdRoomPuzzle.tiles.find((tile) => {
    const dx = player.position.x - tile.group.position.x;
    const dz = player.position.z - tile.group.position.z;
    return Math.abs(dx) <= THIRD_ROOM_TILE_TRIGGER_RADIUS
      && Math.abs(dz) <= THIRD_ROOM_TILE_TRIGGER_RADIUS;
  }) || null;
}

function updateThirdRoomDoor(delta) {
  if (!thirdRoomPuzzle.leftDoor || !thirdRoomPuzzle.rightDoor) {
    return;
  }

  if (thirdRoomPuzzle.completed && !thirdRoomPuzzle.opened) {
    thirdRoomPuzzle.openDelay = Math.max(0, thirdRoomPuzzle.openDelay - delta);
    if (thirdRoomPuzzle.openDelay <= 0) {
      thirdRoomPuzzle.opened = true;
    }
  }

  if (thirdRoomPuzzle.opened) {
    thirdRoomPuzzle.opening = Math.min(1, thirdRoomPuzzle.opening + delta * 0.86);
  }

  const eased = easeOutCubic(thirdRoomPuzzle.opening);
  const slideDistance = DOOR_HALF_WIDTH + 1.05;
  thirdRoomPuzzle.leftDoor.position.x = thirdRoomPuzzle.leftDoor.userData.closedX - slideDistance * eased;
  thirdRoomPuzzle.rightDoor.position.x = thirdRoomPuzzle.rightDoor.userData.closedX + slideDistance * eased;
}

function updateFourthRoomPuzzle(delta, elapsed) {
  updateFourthRoomBubbles(delta, elapsed);
  updateFourthRoomRewards(delta);
  updateFourthRoomPopTool(delta);
  updateFourthRoomDoor(delta);
}

function updateFourthRoomBubbles(delta, elapsed) {
  const targetBubble = getFourthRoomTargetBubble();

  fourthRoomPuzzle.bubbles.forEach((bubble) => {
    if (bubble.popped) {
      bubble.group.visible = false;
      return;
    }

    if (bubble.popping) {
      bubble.popProgress = Math.min(1, bubble.popProgress + delta * 4.8);
      const burst = 1 + Math.sin(bubble.popProgress * Math.PI) * 0.24;
      const shrink = 1 - easeOutCubic(bubble.popProgress);
      bubble.group.scale.setScalar(Math.max(0.01, shrink * burst));
      bubble.shell.material.opacity = 0.34 * (1 - bubble.popProgress);
      bubble.outline.material.opacity = 0.22 * (1 - bubble.popProgress);
      bubble.rim.material.opacity = 0.48 * (1 - bubble.popProgress);
      bubble.highlight.material.opacity = 0.7 * (1 - bubble.popProgress);
      if (bubble.popProgress >= 1) {
        bubble.popped = true;
        bubble.group.visible = false;
      }
      return;
    }

    const hover = Math.sin(elapsed * 1.35 + bubble.phase) * 0.18;
    const pulse = Math.sin(elapsed * 2.2 + bubble.phase) * 0.5 + 0.5;
    const isTarget = targetBubble === bubble;
    bubble.group.position.y = bubble.baseY + hover;
    bubble.group.scale.setScalar(1 + (isTarget ? 0.05 : 0.018) * pulse);
    bubble.group.rotation.y += delta * (0.18 + bubble.radius * 0.04);
    bubble.rim.rotation.z += delta * (0.25 + bubble.phase * 0.02);
    bubble.outline.rotation.y -= delta * 0.16;
    bubble.shell.material.opacity = isTarget ? 0.46 : 0.34;
    bubble.outline.material.opacity = isTarget ? 0.36 : 0.22;
    bubble.rim.material.opacity = isTarget ? 0.66 : 0.48;
  });
}

function updateFourthRoomRewards(delta) {
  for (let i = fourthRoomPuzzle.rewardParticles.length - 1; i >= 0; i -= 1) {
    const particle = fourthRoomPuzzle.rewardParticles[i];
    particle.age += delta;
    particle.velocity.y -= FOURTH_ROOM_REWARD_GRAVITY * delta;
    particle.mesh.position.addScaledVector(particle.velocity, delta);
    particle.mesh.rotation.x += particle.angularVelocity.x * delta;
    particle.mesh.rotation.y += particle.angularVelocity.y * delta;
    particle.mesh.rotation.z += particle.angularVelocity.z * delta;

    const fadeStart = particle.lifetime * 0.62;
    if (particle.age > fadeStart && particle.mesh.material.transparent) {
      const fade = 1 - (particle.age - fadeStart) / (particle.lifetime - fadeStart);
      particle.mesh.material.opacity = Math.max(0, fade * particle.baseOpacity);
    }

    if (particle.mesh.position.y < 0.04) {
      particle.velocity.y = Math.abs(particle.velocity.y) * 0.22;
      particle.velocity.x *= 0.74;
      particle.velocity.z *= 0.74;
      particle.mesh.position.y = 0.04;
    }

    if (particle.age >= particle.lifetime) {
      scene.remove(particle.mesh);
      fourthRoomPuzzle.rewardParticles.splice(i, 1);
    }
  }
}

function updateFourthRoomPopTool(delta) {
  const tool = fourthRoomPuzzle.popTool;
  if (!tool) {
    return;
  }

  fourthRoomPuzzle.popTimer = Math.max(0, fourthRoomPuzzle.popTimer - delta);
  if (fourthRoomPuzzle.popTimer <= 0 || !isPlayerInFourthRoom()) {
    tool.visible = false;
    return;
  }

  const progress = 1 - fourthRoomPuzzle.popTimer / FOURTH_ROOM_POP_ANIMATION_DURATION;
  const thrust = Math.sin(THREE.MathUtils.clamp(progress, 0, 1) * Math.PI);
  const forward = getPlayerForwardVector();
  const right = new THREE.Vector3(-forward.z, 0, forward.x);
  tool.visible = true;
  tool.position.copy(player.position)
    .addScaledVector(right, 1.18)
    .addScaledVector(forward, 0.08 + thrust * 1.02);
  tool.position.y = player.position.y + 1.26 + thrust * 0.08;
  tool.rotation.set(-0.12 - thrust * 0.42, player.rotation.y + 0.58, -0.32 + thrust * 0.08);
}

function updateFourthRoomDoor(delta) {
  if (!fourthRoomPuzzle.leftDoor || !fourthRoomPuzzle.rightDoor) {
    return;
  }

  if (fourthRoomPuzzle.completed && !fourthRoomPuzzle.opened) {
    fourthRoomPuzzle.opened = true;
  }

  if (fourthRoomPuzzle.opened) {
    fourthRoomPuzzle.opening = Math.min(1, fourthRoomPuzzle.opening + delta * 0.86);
  }

  const eased = easeOutCubic(fourthRoomPuzzle.opening);
  const slideDistance = DOOR_HALF_WIDTH + 1.12;
  fourthRoomPuzzle.leftDoor.position.x = fourthRoomPuzzle.leftDoor.userData.closedX - slideDistance * eased;
  fourthRoomPuzzle.rightDoor.position.x = fourthRoomPuzzle.rightDoor.userData.closedX + slideDistance * eased;
}

function updateFifthRoomPuzzle(delta, elapsed) {
  updateFifthRoomPlants(delta, elapsed);
  updateFifthRoomParticles(delta, elapsed);
  updateFifthRoomWateringCan(delta);
  updateFifthRoomDoor(delta);
}

function updateFifthRoomPlants(delta, elapsed) {
  const targetPlant = getFifthRoomTargetPlant();

  fifthRoomPuzzle.plants.forEach((plant) => {
    const targetGlow = targetPlant === plant && !plant.watered ? 1 : 0;
    const idlePulse = Math.sin(elapsed * 2.2 + plant.phase) * 0.5 + 0.5;

    if (plant.watered || plant.watering) {
      plant.bloomProgress = Math.min(1, plant.bloomProgress + delta * 0.72);
    }

    const bloom = easeOutCubic(plant.bloomProgress);
    const scale = THREE.MathUtils.lerp(plant.baseScale, plant.targetScale, bloom);
    plant.plantGroup.scale.setScalar(scale + targetGlow * idlePulse * 0.05);
    plant.plantGroup.rotation.y = Math.sin(elapsed * 0.85 + plant.phase) * 0.045 * (0.3 + bloom);

    plant.leaves.forEach((leaf, index) => {
      leaf.rotation.z += delta * (0.12 + index * 0.01);
      leaf.material.emissiveIntensity = 0.08 + bloom * 0.22 + targetGlow * 0.18;
      leaf.scale.x = 1.35 + bloom * 0.32 + Math.sin(elapsed * 1.5 + index) * 0.04;
    });

    plant.flowers.forEach((flower, index) => {
      if (bloom > 0.02) {
        flower.visible = true;
      }
      flower.material.opacity = Math.min(0.96, bloom * 1.1);
      flower.scale.setScalar(THREE.MathUtils.lerp(0.12, 1.0 + (index % 2) * 0.18, bloom));
      flower.rotation.z += delta * (0.35 + index * 0.03);
    });

    if (plant.bloomProgress >= 1) {
      plant.watering = false;
    }
  });
}

function updateFifthRoomParticles(delta, elapsed) {
  for (let i = fifthRoomPuzzle.particles.length - 1; i >= 0; i -= 1) {
    const particle = fifthRoomPuzzle.particles[i];
    particle.age += delta;
    const progress = particle.age / particle.lifetime;
    particle.mesh.position.addScaledVector(particle.velocity, delta);
    particle.mesh.position.y += Math.sin(elapsed * particle.floatSpeed + particle.phase) * delta * particle.floatAmount;
    particle.mesh.rotation.y += particle.spin * delta;
    particle.mesh.rotation.z += particle.spin * 0.62 * delta;

    if (particle.kind === "butterfly") {
      const wing = Math.sin(elapsed * 12 + particle.phase) * 0.42;
      particle.mesh.children.forEach((child, childIndex) => {
        if (child.userData.isWing) {
          child.rotation.y = (childIndex === 1 ? -0.55 : 0.55) + wing * (childIndex === 1 ? -1 : 1);
        }
      });
    }

    if (progress > 0.62) {
      const fade = 1 - (progress - 0.62) / 0.38;
      particle.mesh.traverse((child) => {
        if (child.material?.transparent) {
          child.material.opacity = Math.max(0, fade * child.userData.baseOpacity);
        }
      });
    }

    if (particle.age >= particle.lifetime) {
      scene.remove(particle.mesh);
      fifthRoomPuzzle.particles.splice(i, 1);
    }
  }
}

function updateFifthRoomWateringCan(delta) {
  const tool = fifthRoomPuzzle.wateringCan;
  if (!tool) {
    return;
  }

  fifthRoomPuzzle.wateringTimer = Math.max(0, fifthRoomPuzzle.wateringTimer - delta);
  if (fifthRoomPuzzle.wateringTimer <= 0 || !isPlayerInFifthRoom()) {
    tool.visible = false;
    return;
  }

  const progress = 1 - fifthRoomPuzzle.wateringTimer / FIFTH_ROOM_WATER_ANIMATION_DURATION;
  const pour = Math.sin(THREE.MathUtils.clamp(progress, 0, 1) * Math.PI);
  const forward = getPlayerForwardVector();
  const right = new THREE.Vector3(-forward.z, 0, forward.x);
  tool.visible = true;
  tool.position.copy(player.position)
    .addScaledVector(right, 0.86)
    .addScaledVector(forward, 0.86 + pour * 0.34);
  tool.position.y = player.position.y + 1.08 + pour * 0.06;
  tool.rotation.set(-0.18 - pour * 0.55, player.rotation.y + 1.08, -0.38 - pour * 0.28);

  tool.children.forEach((child) => {
    if (child.userData.base) {
      child.position.copy(child.userData.base);
      child.position.x += pour * THREE.MathUtils.randFloat(0.04, 0.12);
      child.position.y -= pour * THREE.MathUtils.randFloat(0.02, 0.18);
      child.visible = pour > 0.08;
    }
  });
}

function updateFifthRoomDoor(delta) {
  if (!fifthRoomPuzzle.leftDoor || !fifthRoomPuzzle.rightDoor) {
    return;
  }

  if (fifthRoomPuzzle.completed && !fifthRoomPuzzle.opened) {
    fifthRoomPuzzle.opened = true;
  }

  if (fifthRoomPuzzle.opened) {
    fifthRoomPuzzle.opening = Math.min(1, fifthRoomPuzzle.opening + delta * 0.78);
  }

  const eased = easeOutCubic(fifthRoomPuzzle.opening);
  const slideDistance = DOOR_HALF_WIDTH + 1.08;
  fifthRoomPuzzle.leftDoor.position.x = fifthRoomPuzzle.leftDoor.userData.closedX - slideDistance * eased;
  fifthRoomPuzzle.rightDoor.position.x = fifthRoomPuzzle.rightDoor.userData.closedX + slideDistance * eased;
}

function updateGraveyardPuzzle(delta, elapsed) {
  const targetGrave = getGraveyardTargetGrave();

  graveyardPuzzle.graves.forEach((grave) => {
    const targetGlow = targetGrave === grave && !grave.watered ? 1 : 0;
    if (grave.watered || grave.cleaning) {
      grave.cleanProgress = Math.min(1, grave.cleanProgress + delta * 0.72);
    }

    const clean = easeOutCubic(grave.cleanProgress);
    grave.stoneMaterials.forEach((material, materialIndex) => {
      const dirtyColor = material.userData.dirtyColor;
      const cleanColor = material.userData.cleanColor;
      if (dirtyColor && cleanColor) {
        material.color.copy(dirtyColor).lerp(cleanColor, clean);
      }
      material.roughness = THREE.MathUtils.lerp(0.96, 0.62, clean);
      material.emissiveIntensity = 0.04 + clean * 0.08 + targetGlow * (0.08 + materialIndex * 0.015);
    });

    grave.mossPatches.forEach((patch) => {
      patch.material.opacity = Math.max(0, 0.88 * (1 - clean * 1.18));
      patch.visible = patch.material.opacity > 0.02;
    });

    const bloom = easeOutCubic(THREE.MathUtils.clamp((grave.cleanProgress - 0.16) / 0.84, 0, 1));
    grave.flowers.visible = bloom > 0.01;
    grave.flowers.scale.setScalar(Math.max(0.01, bloom));
    grave.flowers.rotation.y = Math.sin(elapsed * 0.9 + grave.phase) * 0.08 * bloom;
    grave.flowers.position.y = 0.12 + Math.sin(elapsed * 1.6 + grave.phase) * 0.015 * bloom;

    if (grave.cleanProgress >= 1) {
      grave.cleaning = false;
    }
  });

  updateGraveyardParticles(delta, elapsed);
  updateGraveyardHedgehogs(elapsed);
  updateGraveyardSunlight(delta, elapsed);
  updateGraveyardWateringCan(delta);
  updateGraveyardGate(delta);
}

function updateGraveyardHedgehogs(elapsed) {
  graveyardPuzzle.hedgehogs.forEach((hedgehog, index) => {
    const route = hedgehog.route;
    const angle = elapsed * route.speed + hedgehog.phase;
    const x = route.centerX + Math.cos(angle) * route.radiusX;
    const localZ = route.centerZ + Math.sin(angle) * route.radiusZ;
    const dx = -Math.sin(angle) * route.radiusX * route.speed;
    const dz = Math.cos(angle) * route.radiusZ * route.speed;
    hedgehog.group.position.set(
      x,
      0.24 + Math.abs(Math.sin(elapsed * 8.5 + index)) * 0.035,
      GRAVEYARD_ROOM_CENTER_Z + localZ,
    );
    hedgehog.group.rotation.y = Math.atan2(dx, dz);
    hedgehog.group.rotation.z = Math.sin(elapsed * 5.5 + index) * 0.025;
    hedgehog.legs.forEach((leg, legIndex) => {
      leg.rotation.x = Math.sin(elapsed * 10 + legIndex * Math.PI) * 0.42;
    });
  });
}

function updateGraveyardSunlight(delta, elapsed) {
  const targetProgress = graveyardPuzzle.completed ? 1 : 0;
  graveyardPuzzle.lightingProgress = THREE.MathUtils.damp(
    graveyardPuzzle.lightingProgress,
    targetProgress,
    targetProgress > 0 ? 1.25 : 2.4,
    delta,
  );
  const lightProgress = easeOutCubic(graveyardPuzzle.lightingProgress);
  graveyardPuzzle.sunLights.forEach((light, index) => {
    const pulse = 1 + Math.sin(elapsed * 1.15 + index * 1.8) * 0.045;
    light.intensity = light.userData.targetIntensity * lightProgress * pulse;
  });
  graveyardPuzzle.sunBeams.forEach((beam, index) => {
    beam.material.opacity = lightProgress * (0.045 + Math.sin(elapsed * 0.85 + beam.userData.phase) * 0.008);
    beam.rotation.y = Math.sin(elapsed * 0.16 + index) * 0.08;
    beam.visible = beam.material.opacity > 0.004;
  });
}

function updateGraveyardParticles(delta, elapsed) {
  for (let i = graveyardPuzzle.particles.length - 1; i >= 0; i -= 1) {
    const particle = graveyardPuzzle.particles[i];
    particle.age += delta;
    particle.mesh.position.addScaledVector(particle.velocity, delta);
    particle.mesh.position.x += Math.sin(elapsed * 2.4 + particle.phase) * delta * 0.12;
    particle.mesh.rotation.y += particle.spin * delta;
    const progress = particle.age / particle.lifetime;
    if (particle.mesh.material?.transparent) {
      particle.mesh.material.opacity = Math.max(0, particle.baseOpacity * (1 - progress));
    }
    if (particle.age >= particle.lifetime) {
      scene.remove(particle.mesh);
      graveyardPuzzle.particles.splice(i, 1);
    }
  }
}

function updateGraveyardWateringCan(delta) {
  const tool = graveyardPuzzle.wateringCan;
  if (!tool) {
    return;
  }

  graveyardPuzzle.wateringTimer = Math.max(0, graveyardPuzzle.wateringTimer - delta);
  if (graveyardPuzzle.wateringTimer <= 0 || !isPlayerInGraveyardRoom()) {
    tool.visible = false;
    return;
  }

  const progress = 1 - graveyardPuzzle.wateringTimer / GRAVEYARD_WATER_ANIMATION_DURATION;
  const pour = Math.sin(THREE.MathUtils.clamp(progress, 0, 1) * Math.PI);
  const forward = getPlayerForwardVector();
  const right = new THREE.Vector3(-forward.z, 0, forward.x);
  tool.visible = true;
  tool.position.copy(player.position)
    .addScaledVector(right, 0.86)
    .addScaledVector(forward, 0.9 + pour * 0.38);
  tool.position.y = player.position.y + 1.08 + pour * 0.06;
  tool.rotation.set(-0.18 - pour * 0.58, player.rotation.y + 1.08, -0.38 - pour * 0.3);

  tool.children.forEach((child) => {
    if (child.userData.base) {
      child.position.copy(child.userData.base);
      child.position.x += pour * THREE.MathUtils.randFloat(0.04, 0.12);
      child.position.y -= pour * THREE.MathUtils.randFloat(0.02, 0.18);
      child.visible = pour > 0.08;
    }
  });
}

function updateGraveyardGate(delta) {
  if (!graveyardPuzzle.leftGate || !graveyardPuzzle.rightGate) {
    return;
  }
  if (graveyardPuzzle.completed && !graveyardPuzzle.opened) {
    graveyardPuzzle.opened = true;
  }
  if (graveyardPuzzle.opened) {
    graveyardPuzzle.opening = Math.min(1, graveyardPuzzle.opening + delta * 0.7);
  }
  const eased = easeOutCubic(graveyardPuzzle.opening);
  const slideDistance = DOOR_HALF_WIDTH + 1.15;
  graveyardPuzzle.leftGate.position.x = graveyardPuzzle.leftGate.userData.closedX - slideDistance * eased;
  graveyardPuzzle.rightGate.position.x = graveyardPuzzle.rightGate.userData.closedX + slideDistance * eased;
}

function updateSixthRoomFinale(delta, elapsed) {
  updateSixthRoomSeaside(elapsed);

  if (!sixthRoomFinale.started && isPlayerInSixthRoom()) {
    startSixthRoomFinale();
  }

  if (!sixthRoomFinale.started) {
    return;
  }

  sixthRoomFinale.timer = Math.max(0, sixthRoomFinale.timer - delta);
  updateSixthRoomFinaleTitle(delta, elapsed);
  updateSixthRoomBouquets(delta, elapsed);
  updateSixthRoomConfetti(delta);
}

function updateSixthRoomSeaside(elapsed) {
  const sea = sixthRoomFinale.sea;
  if (sea && elapsed >= sea.nextUpdateAt) {
    drawSunsetSeaTexture(sea.ctx, sea.canvas, elapsed);
    sea.texture.needsUpdate = true;
    sea.nextUpdateAt = elapsed + (PERFORMANCE_MODE ? 0.08 : 0.045);
  }

  sixthRoomFinale.seagulls.forEach((bird) => {
    const flight = elapsed * bird.speed + bird.phase;
    const flap = Math.sin(elapsed * 4.8 + bird.phase) * 0.24;
    bird.group.position.x = bird.baseX + Math.sin(flight) * bird.radiusX;
    bird.group.position.y = bird.baseY + Math.cos(flight * 1.4) * bird.radiusY;
    bird.group.scale.setScalar(bird.baseScale * (1 + Math.sin(flight * 1.8) * 0.04));
    bird.leftWing.rotation.z = flap;
    bird.rightWing.rotation.z = -flap;
  });
}

function startSixthRoomFinale() {
  sixthRoomFinale.started = true;
  sixthRoomFinale.timer = SIXTH_ROOM_FINALE_DURATION;
  sixthRoomFinale.confettiTimer = 0;

  if (sixthRoomFinale.title) {
    sixthRoomFinale.title.visible = true;
    sixthRoomFinale.titleMaterial.opacity = 0;
    sixthRoomFinale.title.scale.setScalar(0.86);
    faceInstructionToCamera(sixthRoomFinale.title);
  }

  sixthRoomFinale.bouquets.forEach((bouquet) => {
    bouquet.bloomProgress = 0;
    bouquet.group.visible = true;
    bouquet.group.scale.setScalar(0.01);
    bouquet.flowers.forEach((flower) => {
      flower.material.opacity = 0;
      flower.scale.setScalar(0.1);
    });
  });

  playFinaleBirthdayMelody();
}

function updateSixthRoomFinaleTitle(delta, elapsed) {
  if (!sixthRoomFinale.title || !sixthRoomFinale.titleMaterial) {
    return;
  }

  const visibleElapsed = SIXTH_ROOM_FINALE_DURATION - sixthRoomFinale.timer;
  const fadeIn = easeOutCubic(THREE.MathUtils.clamp(visibleElapsed / 1.2, 0, 1));
  const fadeOut = THREE.MathUtils.clamp(sixthRoomFinale.timer / 2.4, 0, 1);
  const opacity = Math.min(fadeIn, fadeOut);
  sixthRoomFinale.titleMaterial.opacity = opacity;
  sixthRoomFinale.title.visible = opacity > 0.01;
  sixthRoomFinale.title.position.y = 4.7 + Math.sin(elapsed * 1.15) * 0.06;
  sixthRoomFinale.title.scale.setScalar(0.86 + fadeIn * 0.14 + Math.sin(elapsed * 1.8) * 0.012);
  faceInstructionToCamera(sixthRoomFinale.title);
}

function updateSixthRoomBouquets(delta, elapsed) {
  sixthRoomFinale.bouquets.forEach((bouquet) => {
    bouquet.bloomProgress = Math.min(1, bouquet.bloomProgress + Math.max(0, delta * 0.5 - bouquet.delay * 0.001));
    const bloom = easeOutCubic(THREE.MathUtils.clamp((bouquet.bloomProgress - bouquet.delay * 0.08) * 1.25, 0, 1));
    bouquet.group.scale.setScalar(THREE.MathUtils.lerp(0.01, 2.0, bloom));
    bouquet.group.rotation.y = Math.sin(elapsed * 0.9 + bouquet.phase) * 0.07 * bloom;
    bouquet.flowers.forEach((flower, index) => {
      flower.material.opacity = Math.min(0.98, bloom * 1.2);
      flower.scale.setScalar(THREE.MathUtils.lerp(0.1, 1.0 + (index % 3) * 0.14, bloom));
      flower.rotation.z += delta * (0.42 + index * 0.025);
    });
    bouquet.leaves.forEach((leaf, index) => {
      leaf.rotation.z += delta * (0.09 + index * 0.01) * bloom;
    });
  });
}

function updateSixthRoomConfetti(delta) {
  if (sixthRoomFinale.timer > 0) {
    sixthRoomFinale.confettiTimer -= delta;
    while (sixthRoomFinale.confettiTimer <= 0) {
      spawnSixthRoomConfettiBurst(PERFORMANCE_MODE ? 4 : 7);
      sixthRoomFinale.confettiTimer += PERFORMANCE_MODE ? 0.16 : 0.1;
    }
  }

  for (let i = sixthRoomFinale.confetti.length - 1; i >= 0; i -= 1) {
    const particle = sixthRoomFinale.confetti[i];
    particle.age += delta;
    particle.velocity.y -= SIXTH_ROOM_CONFETTI_GRAVITY * delta;
    particle.mesh.position.addScaledVector(particle.velocity, delta);
    particle.mesh.rotation.x += particle.angularVelocity.x * delta;
    particle.mesh.rotation.y += particle.angularVelocity.y * delta;
    particle.mesh.rotation.z += particle.angularVelocity.z * delta;

    if (particle.mesh.material?.transparent) {
      const fade = 1 - Math.max(0, particle.age - particle.lifetime * 0.7) / (particle.lifetime * 0.3);
      particle.mesh.material.opacity = Math.max(0, particle.baseOpacity * Math.min(1, fade));
    }

    if (particle.mesh.position.y < 0.08) {
      particle.velocity.y = Math.abs(particle.velocity.y) * 0.12;
      particle.velocity.x *= 0.6;
      particle.velocity.z *= 0.6;
      particle.mesh.position.y = 0.08;
    }

    if (particle.age >= particle.lifetime) {
      scene.remove(particle.mesh);
      sixthRoomFinale.confetti.splice(i, 1);
    }
  }
}

function spawnSixthRoomConfettiBurst(count) {
  const maxConfetti = PERFORMANCE_MODE ? 180 : 360;
  while (sixthRoomFinale.confetti.length > maxConfetti - count) {
    const oldest = sixthRoomFinale.confetti.shift();
    if (oldest) {
      scene.remove(oldest.mesh);
    }
  }

  for (let i = 0; i < count; i += 1) {
    const mesh = createRewardConfetti();
    mesh.position.set(
      THREE.MathUtils.randFloatSpread(ROOM_WIDTH - 1.6),
      THREE.MathUtils.randFloat(5.8, 7.8),
      SIXTH_ROOM_CENTER_Z + THREE.MathUtils.randFloatSpread(ROOM_LENGTH - 1.6),
    );
    scene.add(mesh);
    sixthRoomFinale.confetti.push({
      mesh,
      velocity: new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(0.9),
        THREE.MathUtils.randFloat(-0.2, -1.0),
        THREE.MathUtils.randFloatSpread(0.9),
      ),
      angularVelocity: new THREE.Vector3(
        THREE.MathUtils.randFloat(-4.5, 4.5),
        THREE.MathUtils.randFloat(-5.4, 5.4),
        THREE.MathUtils.randFloat(-4.5, 4.5),
      ),
      age: 0,
      lifetime: THREE.MathUtils.randFloat(4.2, 6.8),
      baseOpacity: mesh.material.opacity ?? 0.95,
    });
  }
}

function playFinaleBirthdayMelody() {
  FINALE_BIRTHDAY_MELODY.forEach((note) => {
    playMelodyNote(note.frequency, note.time, note.duration, note.volume);
    if (note.time % 4.3 < 0.05) {
      playMelodyNote(note.frequency * 0.5, note.time + 0.02, note.duration + 0.35, note.volume * 0.38);
    }
  });
}

function updateKickAnimationTimer(delta) {
  secondRoomPuzzle.kickTimer = Math.max(0, secondRoomPuzzle.kickTimer - delta);
}

function startKickAnimation() {
  secondRoomPuzzle.kickTimer = KICK_ANIMATION_DURATION;
}

function getKickAnimationAmount() {
  if (secondRoomPuzzle.kickTimer <= 0) {
    return 0;
  }

  const progress = 1 - secondRoomPuzzle.kickTimer / KICK_ANIMATION_DURATION;
  return Math.sin(THREE.MathUtils.clamp(progress, 0, 1) * Math.PI);
}

function updatePhotoGate(delta) {
  if (!secondRoomPuzzle.leftPanel || !secondRoomPuzzle.rightPanel) {
    return;
  }

  if (secondRoomPuzzle.opened) {
    secondRoomPuzzle.opening = Math.min(1, secondRoomPuzzle.opening + delta * 0.95);
  }

  const eased = easeOutCubic(secondRoomPuzzle.opening);
  const slideDistance = DOOR_HALF_WIDTH + 1.18;
  secondRoomPuzzle.leftPanel.position.x = secondRoomPuzzle.leftPanel.userData.closedX - slideDistance * eased;
  secondRoomPuzzle.rightPanel.position.x = secondRoomPuzzle.rightPanel.userData.closedX + slideDistance * eased;

  if (secondRoomPuzzle.photoCover) {
    const coverOpacity = secondRoomPuzzle.opened ? 1 - easeOutCubic(THREE.MathUtils.clamp(secondRoomPuzzle.opening / 0.18, 0, 1)) : 1;
    secondRoomPuzzle.photoCover.material.opacity = coverOpacity;
    secondRoomPuzzle.photoCover.material.depthWrite = coverOpacity > 0.85;
    secondRoomPuzzle.photoCover.visible = coverOpacity > 0.01;
  }
}

function updateFootball(delta) {
  const ball = secondRoomPuzzle.ball;
  const velocity = secondRoomPuzzle.ballVelocity;
  if (!ball || velocity.lengthSq() < 0.0001) {
    velocity.set(0, 0, 0);
    return;
  }

  const steps = Math.max(1, Math.ceil((velocity.length() * delta) / (FOOTBALL_RADIUS * 0.72)));
  const stepDelta = delta / steps;

  for (let i = 0; i < steps; i += 1) {
    const previous = ball.position.clone();
    const proposed = previous.clone().addScaledVector(velocity, stepDelta);
    resolveFootballPhotoHit(previous, proposed, velocity);
    resolveFootballRoomCollision(proposed, velocity);
    resolveFootballObstacleCollisions(proposed, velocity);

    const displacement = proposed.clone().sub(previous);
    ball.position.copy(proposed);
    rollFootball(ball, displacement);
  }

  velocity.multiplyScalar(Math.pow(FOOTBALL_FRICTION_PER_SECOND, delta));
  if (velocity.length() < 0.16) {
    velocity.set(0, 0, 0);
  }
}

function resolveFootballPhotoHit(previous, proposed, velocity) {
  if (secondRoomPuzzle.opened) {
    return;
  }

  const gateFrontZ = PHOTO_GATE_Z + FOOTBALL_RADIUS + 0.08;
  const crossesPhoto = previous.z > gateFrontZ && proposed.z <= gateFrontZ;
  const insidePhoto = Math.abs(proposed.x) <= PHOTO_GATE_WIDTH / 2 + FOOTBALL_RADIUS * 0.35;

  if (crossesPhoto && insidePhoto) {
    openSecondRoomPhotoGate();
    proposed.z = gateFrontZ;
    velocity.z = Math.abs(velocity.z) * FOOTBALL_WALL_RESTITUTION * 0.5;
    velocity.x *= 0.68;
  }
}

function resolveFootballRoomCollision(proposed, velocity) {
  const minX = -ROOM_WIDTH / 2 + FOOTBALL_RADIUS;
  const maxX = ROOM_WIDTH / 2 - FOOTBALL_RADIUS;
  const minZ = SECOND_ROOM_CENTER_Z - ROOM_LENGTH / 2 + FOOTBALL_RADIUS;
  const maxZ = SECOND_ROOM_CENTER_Z + ROOM_LENGTH / 2 - FOOTBALL_RADIUS;

  if (proposed.x < minX) {
    proposed.x = minX;
    velocity.x = Math.abs(velocity.x) * FOOTBALL_WALL_RESTITUTION;
  } else if (proposed.x > maxX) {
    proposed.x = maxX;
    velocity.x = -Math.abs(velocity.x) * FOOTBALL_WALL_RESTITUTION;
  }

  if (proposed.z < minZ) {
    proposed.z = minZ;
    velocity.z = Math.abs(velocity.z) * FOOTBALL_WALL_RESTITUTION;
  } else if (proposed.z > maxZ) {
    proposed.z = maxZ;
    velocity.z = -Math.abs(velocity.z) * FOOTBALL_WALL_RESTITUTION;
  }
}

function resolveFootballObstacleCollisions(proposed, velocity) {
  secondRoomPuzzle.obstacles.forEach((obstacle) => {
    const normal = resolveCircleAabbCollision(proposed, FOOTBALL_RADIUS, obstacle);
    if (!normal) {
      return;
    }

    reflectVelocity(velocity, normal, FOOTBALL_WALL_RESTITUTION);
  });
}

function reflectVelocity(velocity, normal, restitution) {
  const incoming = velocity.dot(normal);
  if (incoming < 0) {
    velocity.addScaledVector(normal, -(1 + restitution) * incoming);
  } else {
    velocity.multiplyScalar(0.86);
  }
}

function resolveCircleAabbCollision(position, radius, bounds) {
  const closestX = THREE.MathUtils.clamp(position.x, bounds.minX, bounds.maxX);
  const closestZ = THREE.MathUtils.clamp(position.z, bounds.minZ, bounds.maxZ);
  let dx = position.x - closestX;
  let dz = position.z - closestZ;
  let distanceSq = dx * dx + dz * dz;

  if (distanceSq > radius * radius) {
    return null;
  }

  if (distanceSq > 0.000001) {
    const distance = Math.sqrt(distanceSq);
    const normal = new THREE.Vector3(dx / distance, 0, dz / distance);
    const push = radius - distance;
    position.x += normal.x * push;
    position.z += normal.z * push;
    return normal;
  }

  const pushes = [
    { normal: new THREE.Vector3(-1, 0, 0), distance: Math.abs(position.x - bounds.minX) },
    { normal: new THREE.Vector3(1, 0, 0), distance: Math.abs(bounds.maxX - position.x) },
    { normal: new THREE.Vector3(0, 0, -1), distance: Math.abs(position.z - bounds.minZ) },
    { normal: new THREE.Vector3(0, 0, 1), distance: Math.abs(bounds.maxZ - position.z) },
  ];
  pushes.sort((a, b) => a.distance - b.distance);
  const chosen = pushes[0];
  position.x += chosen.normal.x * (chosen.distance + radius);
  position.z += chosen.normal.z * (chosen.distance + radius);
  return chosen.normal;
}

function rollFootball(ball, displacement) {
  const distance = Math.hypot(displacement.x, displacement.z);
  const visual = ball.children[0];
  if (!visual || distance < 0.0001) {
    return;
  }

  const axis = new THREE.Vector3(displacement.z, 0, -displacement.x).normalize();
  const rotation = new THREE.Quaternion().setFromAxisAngle(axis, distance / FOOTBALL_RADIUS);
  visual.quaternion.premultiply(rotation);
}

function kickFootball() {
  const ball = secondRoomPuzzle.ball;
  if (!ball || !isPlayerInSecondRoom()) {
    return false;
  }

  const distanceToBall = Math.hypot(player.position.x - ball.position.x, player.position.z - ball.position.z);
  if (distanceToBall > FOOTBALL_KICK_RANGE) {
    return false;
  }

  const direction = getPlayerForwardVector().normalize();
  const toBall = new THREE.Vector3(ball.position.x - player.position.x, 0, ball.position.z - player.position.z).normalize();
  if (direction.dot(toBall) < 0.05) {
    return false;
  }

  secondRoomPuzzle.ballVelocity.copy(direction.multiplyScalar(FOOTBALL_KICK_SPEED));
  startKickAnimation();
  playFootballKickSound();
  return true;
}

function handlePrimaryAction() {
  if (GRAVEYARD_VARIANT && isPlayerInGraveyardRoom() && waterGraveyardGrave()) {
    return true;
  }

  if (isPlayerInFifthRoom() && waterFifthRoomPlant()) {
    return true;
  }

  if (isPlayerInFourthRoom() && popFourthRoomBubble()) {
    return true;
  }

  return kickFootball();
}

function waterFifthRoomPlant() {
  if (!isPlayerInFifthRoom() || fifthRoomPuzzle.completed) {
    return false;
  }

  const plant = getFifthRoomTargetPlant();
  fifthRoomPuzzle.wateringTimer = FIFTH_ROOM_WATER_ANIMATION_DURATION;
  fifthRoomPuzzle.wateringTarget = plant;
  if (!plant || plant.watered || plant.watering) {
    return Boolean(plant);
  }

  plant.watered = true;
  plant.watering = true;
  plant.bloomProgress = Math.max(plant.bloomProgress, 0.04);
  fifthRoomPuzzle.wateredCount += 1;
  spawnFifthRoomBloomEffects(plant);
  playWateringSound();

  if (fifthRoomPuzzle.wateredCount >= fifthRoomPuzzle.plants.length) {
    completeFifthRoomPlants();
  }

  return true;
}

function getFifthRoomTargetPlant() {
  if (!isPlayerInFifthRoom()) {
    return null;
  }

  const forward = getPlayerForwardVector();
  let best = null;
  let bestScore = Infinity;

  fifthRoomPuzzle.plants.forEach((plant) => {
    if (plant.watered || plant.watering) {
      return;
    }

    const dx = plant.group.position.x - player.position.x;
    const dz = plant.group.position.z - player.position.z;
    const distance = Math.hypot(dx, dz);
    if (distance > FIFTH_ROOM_WATER_RANGE) {
      return;
    }

    const directionDot = distance > 0.001
      ? (dx * forward.x + dz * forward.z) / distance
      : 1;
    if (directionDot < -0.12 && distance > 1.2) {
      return;
    }

    const score = distance - directionDot * 0.72;
    if (score < bestScore) {
      bestScore = score;
      best = plant;
    }
  });

  return best;
}

function waterGraveyardGrave() {
  if (!GRAVEYARD_VARIANT || !isPlayerInGraveyardRoom() || graveyardPuzzle.completed) {
    return false;
  }

  const grave = getGraveyardTargetGrave();
  graveyardPuzzle.wateringTimer = GRAVEYARD_WATER_ANIMATION_DURATION;
  graveyardPuzzle.wateringTarget = grave;
  if (!grave || grave.watered || grave.cleaning) {
    return Boolean(grave);
  }

  grave.watered = true;
  grave.cleaning = true;
  grave.cleanProgress = Math.max(grave.cleanProgress, 0.035);
  graveyardPuzzle.wateredCount += 1;
  spawnGraveyardCleaningEffects(grave);
  playWateringSound();

  if (graveyardPuzzle.wateredCount >= graveyardPuzzle.graves.length) {
    completeGraveyardPuzzle();
  }
  return true;
}

function getGraveyardTargetGrave() {
  if (!GRAVEYARD_VARIANT || !isPlayerInGraveyardRoom()) {
    return null;
  }

  const forward = getPlayerForwardVector();
  let best = null;
  let bestScore = Infinity;
  graveyardPuzzle.graves.forEach((grave) => {
    if (grave.watered || grave.cleaning) {
      return;
    }
    const dx = grave.group.position.x - player.position.x;
    const dz = grave.group.position.z - player.position.z;
    const distance = Math.hypot(dx, dz);
    if (distance > GRAVEYARD_WATER_RANGE) {
      return;
    }
    const directionDot = distance > 0.001
      ? (dx * forward.x + dz * forward.z) / distance
      : 1;
    if (directionDot < -0.16 && distance > 1.25) {
      return;
    }
    const score = distance - directionDot * 0.78;
    if (score < bestScore) {
      bestScore = score;
      best = grave;
    }
  });
  return best;
}

function spawnGraveyardCleaningEffects(grave) {
  const count = PERFORMANCE_MODE ? 10 : 18;
  const maxParticles = PERFORMANCE_MODE ? 70 : 120;
  while (graveyardPuzzle.particles.length > maxParticles - count) {
    const oldest = graveyardPuzzle.particles.shift();
    if (oldest) scene.remove(oldest.mesh);
  }

  for (let i = 0; i < count; i += 1) {
    const isWater = i % 3 !== 0;
    const material = new THREE.MeshBasicMaterial({
      color: isWater ? 0x8fe9ff : grave.flowerColor,
      transparent: true,
      opacity: isWater ? 0.68 : 0.86,
      depthWrite: false,
      toneMapped: false,
    });
    const mesh = new THREE.Mesh(
      isWater
        ? new THREE.SphereGeometry(0.035 + (i % 2) * 0.018, 7, 5)
        : new THREE.CircleGeometry(0.055 + (i % 3) * 0.014, 8),
      material,
    );
    mesh.position.copy(grave.group.position).add(new THREE.Vector3(
      THREE.MathUtils.randFloatSpread(0.72),
      THREE.MathUtils.randFloat(0.55, 1.75),
      THREE.MathUtils.randFloatSpread(0.45) - 0.42,
    ));
    scene.add(mesh);
    graveyardPuzzle.particles.push({
      mesh,
      velocity: new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(0.55),
        THREE.MathUtils.randFloat(0.18, 0.85),
        THREE.MathUtils.randFloatSpread(0.45),
      ),
      spin: THREE.MathUtils.randFloat(-2.2, 2.2),
      phase: Math.random() * Math.PI * 2,
      age: 0,
      lifetime: THREE.MathUtils.randFloat(1.25, 2.2),
      baseOpacity: material.opacity,
    });
  }
}

function completeGraveyardPuzzle() {
  if (!GRAVEYARD_VARIANT || graveyardPuzzle.completed) {
    return;
  }
  graveyardPuzzle.completed = true;
  graveyardPuzzle.wateredCount = graveyardPuzzle.graves.length;
  graveyardPuzzle.graves.forEach((grave) => {
    grave.watered = true;
    grave.cleaning = true;
    grave.cleanProgress = Math.max(grave.cleanProgress, 0.12);
  });
  playRoomEntryInstructionSound(GRAVEYARD_ROOM_INDEX);
}

function spawnFifthRoomBloomEffects(plant) {
  const count = PERFORMANCE_MODE ? 12 : 22;
  const maxParticles = PERFORMANCE_MODE ? 90 : 150;
  const origin = plant.group.position.clone().add(new THREE.Vector3(0, 1.25, 0));

  while (fifthRoomPuzzle.particles.length > maxParticles - count) {
    const oldest = fifthRoomPuzzle.particles.shift();
    if (oldest) {
      scene.remove(oldest.mesh);
    }
  }

  for (let i = 0; i < count; i += 1) {
    const color = i % 3 === 0
      ? plant.flowerColor
      : PARTY_LIGHT_COLORS[(i + fifthRoomPuzzle.wateredCount) % PARTY_LIGHT_COLORS.length];
    const isButterfly = i % 3 !== 1;
    const mesh = isButterfly ? createBloomButterfly(color) : createBloomLight(color);
    mesh.position.copy(origin).add(new THREE.Vector3(
      THREE.MathUtils.randFloatSpread(0.45),
      THREE.MathUtils.randFloat(0.05, 0.55),
      THREE.MathUtils.randFloatSpread(0.45),
    ));
    scene.add(mesh);
    fifthRoomPuzzle.particles.push({
      mesh,
      kind: isButterfly ? "butterfly" : "light",
      velocity: new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(1.45),
        THREE.MathUtils.randFloat(0.35, 1.25),
        THREE.MathUtils.randFloatSpread(1.45),
      ),
      spin: THREE.MathUtils.randFloat(-1.8, 1.8),
      floatSpeed: THREE.MathUtils.randFloat(2.2, 4.2),
      floatAmount: THREE.MathUtils.randFloat(0.3, 0.8),
      phase: Math.random() * Math.PI * 2,
      age: 0,
      lifetime: THREE.MathUtils.randFloat(3.2, 5.8),
    });
  }
}

function createBloomButterfly(color) {
  const group = new THREE.Group();
  const wingMaterial = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.88,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  const bodyMaterial = new THREE.MeshBasicMaterial({
    color: 0x2b1c34,
    transparent: true,
    opacity: 0.95,
    toneMapped: false,
  });

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 0.18, 6), bodyMaterial);
  body.rotation.x = Math.PI / 2;
  body.userData.baseOpacity = 0.95;
  group.add(body);

  for (const side of [-1, 1]) {
    const wing = new THREE.Mesh(new THREE.CircleGeometry(0.13, 10), wingMaterial.clone());
    wing.userData.isWing = true;
    wing.userData.baseOpacity = 0.88;
    wing.position.set(side * 0.09, 0.03, 0);
    wing.scale.set(1.0, 0.62, 1);
    wing.rotation.y = side * 0.55;
    group.add(wing);
  }

  group.scale.setScalar(THREE.MathUtils.randFloat(0.9, 1.35));
  group.rotation.set(THREE.MathUtils.randFloat(-0.22, 0.22), THREE.MathUtils.randFloat(0, Math.PI * 2), 0);
  return group;
}

function createBloomLight(color) {
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.92,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.075, PERFORMANCE_MODE ? 8 : 12, PERFORMANCE_MODE ? 6 : 8), material);
  mesh.userData.baseOpacity = 0.92;
  return mesh;
}

function playWateringSound() {
  const context = unlockMelodyAudio();
  if (!context) {
    return;
  }

  const start = context.currentTime;
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.07, start + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.34);
  gain.connect(context.destination);

  const pour = context.createOscillator();
  pour.type = "triangle";
  pour.frequency.setValueAtTime(420, start);
  pour.frequency.linearRampToValueAtTime(720, start + 0.18);
  pour.connect(gain);
  pour.start(start);
  pour.stop(start + 0.36);

  const sparkle = context.createOscillator();
  sparkle.type = "sine";
  sparkle.frequency.setValueAtTime(980, start + 0.08);
  sparkle.frequency.exponentialRampToValueAtTime(1320, start + 0.28);
  sparkle.connect(gain);
  sparkle.start(start + 0.08);
  sparkle.stop(start + 0.32);
}

function playFootballKickSound() {
  const context = unlockMelodyAudio();
  if (!context) {
    return;
  }

  const start = context.currentTime;
  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, start);
  master.gain.exponentialRampToValueAtTime(0.13, start + 0.012);
  master.gain.exponentialRampToValueAtTime(0.0001, start + 0.24);
  master.connect(context.destination);

  const body = context.createOscillator();
  body.type = "sine";
  body.frequency.setValueAtTime(108, start);
  body.frequency.exponentialRampToValueAtTime(58, start + 0.18);
  body.connect(master);
  body.start(start);
  body.stop(start + 0.26);

  const contactGain = context.createGain();
  contactGain.gain.setValueAtTime(0.0001, start);
  contactGain.gain.exponentialRampToValueAtTime(0.035, start + 0.006);
  contactGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.065);
  contactGain.connect(context.destination);

  const contact = context.createOscillator();
  contact.type = "triangle";
  contact.frequency.setValueAtTime(360, start);
  contact.frequency.exponentialRampToValueAtTime(190, start + 0.05);
  contact.connect(contactGain);
  contact.start(start);
  contact.stop(start + 0.08);
}

function playRoomEntryInstructionSound(roomIndex) {
  const context = unlockMelodyAudio();
  if (!context) {
    return;
  }

  const now = context.currentTime;
  if (now - roomEntryInstructionState.lastSoundAt < ROOM_ENTRY_SOUND_COOLDOWN) {
    return;
  }

  roomEntryInstructionState.lastSoundAt = now;
  const sequences = [
    [392, 554.37, 659.25, 987.77],
    [440, 587.33, 698.46, 1046.5],
    [349.23, 523.25, 659.25, 880],
    [415.3, 554.37, 739.99, 987.77],
  ];
  const notes = sequences[Math.max(0, roomIndex - SECOND_ROOM_INDEX) % sequences.length];

  const delay = context.createDelay(1.2);
  delay.delayTime.setValueAtTime(0.19, now);
  const echoGain = context.createGain();
  echoGain.gain.setValueAtTime(0.18, now);
  echoGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
  delay.connect(echoGain);
  echoGain.connect(context.destination);

  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(2600, now);
  filter.frequency.exponentialRampToValueAtTime(1250, now + 1.1);
  filter.Q.setValueAtTime(0.72, now);
  filter.connect(context.destination);
  filter.connect(delay);

  notes.forEach((frequency, index) => {
    const start = now + index * 0.115;
    const end = start + 0.78 + index * 0.04;
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(index === notes.length - 1 ? 0.062 : 0.045, start + 0.034);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);
    gain.connect(filter);

    const main = context.createOscillator();
    main.type = index % 2 === 0 ? "sine" : "triangle";
    main.frequency.setValueAtTime(frequency, start);
    main.frequency.setTargetAtTime(frequency * 1.006, start + 0.08, 0.32);
    main.connect(gain);
    main.start(start);
    main.stop(end + 0.06);

    const overtone = context.createOscillator();
    const overtoneGain = context.createGain();
    overtone.type = "sine";
    overtone.frequency.setValueAtTime(frequency * 2.01, start + 0.012);
    overtoneGain.gain.setValueAtTime(0.0001, start);
    overtoneGain.gain.exponentialRampToValueAtTime(0.012, start + 0.04);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.34);
    overtone.connect(overtoneGain);
    overtoneGain.connect(filter);
    overtone.start(start + 0.012);
    overtone.stop(start + 0.4);
  });
}

function completeFifthRoomPlants() {
  if (fifthRoomPuzzle.completed) {
    return;
  }

  fifthRoomPuzzle.completed = true;
  fifthRoomPuzzle.wateredCount = fifthRoomPuzzle.plants.length;
  fifthRoomPuzzle.plants.forEach((plant) => {
    plant.watered = true;
    plant.watering = true;
    plant.bloomProgress = Math.max(plant.bloomProgress, 0.18);
  });
}

function popFourthRoomBubble() {
  if (!isPlayerInFourthRoom() || fourthRoomPuzzle.completed) {
    return false;
  }

  const bubble = getFourthRoomTargetBubble();
  if (!bubble) {
    fourthRoomPuzzle.popTimer = FOURTH_ROOM_POP_ANIMATION_DURATION * 0.68;
    return false;
  }

  bubble.popping = true;
  bubble.popProgress = 0;
  fourthRoomPuzzle.popTarget = bubble;
  fourthRoomPuzzle.popTimer = FOURTH_ROOM_POP_ANIMATION_DURATION;
  fourthRoomPuzzle.poppedCount += 1;
  spawnFourthRoomRewards(bubble.group.position);
  playBubblePopSound();

  if (fourthRoomPuzzle.poppedCount >= fourthRoomPuzzle.bubbles.length) {
    completeFourthRoomBubbles();
  }

  return true;
}

function getFourthRoomTargetBubble() {
  if (!isPlayerInFourthRoom()) {
    return null;
  }

  const forward = getPlayerForwardVector();
  let best = null;
  let bestScore = Infinity;

  fourthRoomPuzzle.bubbles.forEach((bubble) => {
    if (bubble.popped || bubble.popping) {
      return;
    }

    const dx = bubble.group.position.x - player.position.x;
    const dz = bubble.group.position.z - player.position.z;
    const horizontalDistance = Math.hypot(dx, dz);
    if (horizontalDistance > FOURTH_ROOM_BUBBLE_POP_RANGE + bubble.radius * 0.35) {
      return;
    }

    const directionDot = horizontalDistance > 0.001
      ? (dx * forward.x + dz * forward.z) / horizontalDistance
      : 1;
    if (directionDot < -0.08 && horizontalDistance > 1.35) {
      return;
    }

    const heightBias = Math.abs((bubble.group.position.y - player.position.y) - 2.1) * 0.12;
    const score = horizontalDistance - directionDot * 0.72 + heightBias;
    if (score < bestScore) {
      bestScore = score;
      best = bubble;
    }
  });

  return best;
}

function spawnFourthRoomRewards(origin) {
  const count = PERFORMANCE_MODE ? 22 : 42;
  const maxParticles = PERFORMANCE_MODE ? 160 : 280;

  while (fourthRoomPuzzle.rewardParticles.length > maxParticles - count) {
    const oldest = fourthRoomPuzzle.rewardParticles.shift();
    if (oldest) {
      scene.remove(oldest.mesh);
    }
  }

  for (let i = 0; i < count; i += 1) {
    const kind = i % 5;
    const mesh = kind === 0
      ? createRewardCandy()
      : (kind <= 2 ? createRewardCoin() : createRewardConfetti());
    mesh.position.set(
      player.position.x + THREE.MathUtils.randFloatSpread(1.15),
      Math.max(origin.y + 0.55, player.position.y + 3.0) + THREE.MathUtils.randFloat(0, 0.9),
      player.position.z + THREE.MathUtils.randFloatSpread(1.05),
    );
    const out = new THREE.Vector3(
      THREE.MathUtils.randFloatSpread(1.65),
      THREE.MathUtils.randFloat(1.8, 4.4),
      THREE.MathUtils.randFloatSpread(1.65),
    );
    scene.add(mesh);
    fourthRoomPuzzle.rewardParticles.push({
      mesh,
      velocity: out,
      angularVelocity: new THREE.Vector3(
        THREE.MathUtils.randFloat(-5.6, 5.6),
        THREE.MathUtils.randFloat(-6.2, 6.2),
        THREE.MathUtils.randFloat(-5.6, 5.6),
      ),
      age: 0,
      lifetime: THREE.MathUtils.randFloat(1.9, 3.1),
      baseOpacity: mesh.material.opacity ?? 1,
    });
  }
}

function createRewardCoin() {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13, 0.13, 0.032, PERFORMANCE_MODE ? 16 : 24),
    new THREE.MeshStandardMaterial({
      color: 0xffd34d,
      emissive: 0xe99519,
      emissiveIntensity: 0.34,
      roughness: 0.26,
      metalness: 0.62,
      transparent: true,
      opacity: 1,
    }),
  );
  mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  return mesh;
}

function createRewardCandy() {
  const group = new THREE.Group();
  const wrapperColor = PARTY_LIGHT_COLORS[THREE.MathUtils.randInt(0, PARTY_LIGHT_COLORS.length - 1)];
  const wrapperMaterial = new THREE.MeshStandardMaterial({
    color: wrapperColor,
    emissive: wrapperColor,
    emissiveIntensity: 0.18,
    roughness: 0.38,
    metalness: 0.08,
    transparent: true,
    opacity: 1,
  });
  const chocolateMaterial = new THREE.MeshStandardMaterial({
    color: 0x6c3524,
    roughness: 0.48,
    metalness: 0.03,
    transparent: true,
    opacity: 1,
  });
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.13, 0.18), chocolateMaterial);
  group.add(body);
  for (const side of [-1, 1]) {
    const wrapper = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.16, 8), wrapperMaterial);
    wrapper.position.x = side * 0.19;
    wrapper.rotation.z = side > 0 ? -Math.PI / 2 : Math.PI / 2;
    group.add(wrapper);
  }

  group.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = false;
    }
  });

  group.material = wrapperMaterial;
  return group;
}

function createRewardConfetti() {
  const color = PARTY_LIGHT_COLORS[THREE.MathUtils.randInt(0, PARTY_LIGHT_COLORS.length - 1)];
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.16, 0.06),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
      toneMapped: false,
    }),
  );
  mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  return mesh;
}

function playBubblePopSound() {
  const context = unlockMelodyAudio();
  if (!context) {
    return;
  }

  const start = context.currentTime;
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.11, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);
  gain.connect(context.destination);

  const pop = context.createOscillator();
  pop.type = "triangle";
  pop.frequency.setValueAtTime(760, start);
  pop.frequency.exponentialRampToValueAtTime(190, start + 0.12);
  pop.connect(gain);
  pop.start(start);
  pop.stop(start + 0.18);
}

function completeFourthRoomBubbles() {
  if (fourthRoomPuzzle.completed) {
    return;
  }

  fourthRoomPuzzle.completed = true;
  fourthRoomPuzzle.bubbles.forEach((bubble) => {
    if (!bubble.popped && !bubble.popping) {
      bubble.popping = true;
      bubble.popProgress = 0.22;
    }
  });
}

function isPlayerInSecondRoom() {
  return isPositionInSecondRoom(player.position.z);
}

function isPlayerInThirdRoom() {
  return player.position.z <= getRoomFrontZ(THIRD_ROOM_INDEX)
    && player.position.z >= getRoomBackZ(THIRD_ROOM_INDEX);
}

function isPlayerInFourthRoom() {
  return isPositionInFourthRoom(player.position.z);
}

function isPlayerInFifthRoom() {
  return isPositionInFifthRoom(player.position.z);
}

function isPlayerInGraveyardRoom() {
  return GRAVEYARD_VARIANT
    && player.position.z <= getRoomFrontZ(GRAVEYARD_ROOM_INDEX)
    && player.position.z >= getRoomBackZ(GRAVEYARD_ROOM_INDEX);
}

function isPlayerInSixthRoom() {
  return player.position.z <= getRoomFrontZ(SIXTH_ROOM_INDEX)
    && player.position.z >= getRoomBackZ(SIXTH_ROOM_INDEX);
}

function openSecondRoomPhotoGate() {
  secondRoomPuzzle.opened = true;
}

function completeThirdRoomMelody() {
  if (thirdRoomPuzzle.completed) {
    return;
  }

  thirdRoomPuzzle.completed = true;
  thirdRoomPuzzle.currentStep = THIRD_ROOM_MELODY.length;
  thirdRoomPuzzle.tiles.forEach((tile) => {
    tile.played = true;
  });
  playThirdRoomFullMelody();
  thirdRoomPuzzle.openDelay = THIRD_ROOM_FINAL_MELODY.length * 0.31 + 0.52;
}

function playThirdRoomFullMelody() {
  THIRD_ROOM_FINAL_MELODY.forEach((note, index) => {
    const delay = index * 0.31;
    playMelodyNote(note.frequency, delay, 0.4, 0.13);
    if (index % 4 === 3) {
      playMelodyNote(note.frequency * 0.5, delay + 0.035, 0.56, 0.055);
    }
  });
}

function unlockMelodyAudio() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return null;
  }

  if (!melodyAudioContext) {
    melodyAudioContext = new AudioContextClass();
  }

  if (melodyAudioContext.state === "suspended") {
    melodyAudioContext.resume();
  }

  startAmbientMusic(melodyAudioContext);
  return melodyAudioContext;
}

function startAmbientMusic(context) {
  if (!context || ambientAudioState.started) {
    return;
  }

  ambientAudioState.started = true;
  const now = context.currentTime;
  ambientAudioState.mutedForRoom = isAmbientMusicMutedInCurrentRoom();
  const masterGain = context.createGain();
  masterGain.gain.setValueAtTime(0.0001, now);
  masterGain.gain.exponentialRampToValueAtTime(getAmbientMusicTargetVolume(), now + 1.8);

  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1850, now);
  filter.Q.setValueAtTime(0.28, now);
  filter.connect(masterGain);
  masterGain.connect(context.destination);

  ambientAudioState.masterGain = masterGain;
  ambientAudioState.filter = filter;
  scheduleAmbientPianoLoop(context, now + 0.12);
  ambientAudioState.intervalId = window.setInterval(() => {
    if (!ambientAudioState.started || context.state === "closed") {
      return;
    }

    scheduleAmbientPianoLoop(context, context.currentTime + 0.28);
  }, AMBIENT_PIANO_LOOP_DURATION * 1000);
}

function scheduleAmbientPianoLoop(context, startAt) {
  AMBIENT_PIANO_BASS.forEach((note) => {
    playSoftPianoNote(context, note.frequency, startAt + note.time, note.duration, note.velocity * 0.72);
  });
  AMBIENT_PIANO_PHRASE.forEach((note) => {
    playSoftPianoNote(context, note.frequency, startAt + note.time, note.duration, note.velocity);
  });
}

function updateAmbientMusicForRoom() {
  if (!melodyAudioContext || !ambientAudioState.masterGain) {
    return;
  }

  const shouldMute = isAmbientMusicMutedInCurrentRoom();
  if (shouldMute === ambientAudioState.mutedForRoom) {
    return;
  }

  ambientAudioState.mutedForRoom = shouldMute;
  const now = melodyAudioContext.currentTime;
  const target = getAmbientMusicTargetVolume();
  ambientAudioState.masterGain.gain.cancelScheduledValues(now);
  ambientAudioState.masterGain.gain.setTargetAtTime(target, now, shouldMute ? 0.55 : 1.4);
}

function isAmbientMusicMutedInCurrentRoom() {
  const roomIndex = getRoomIndexAtZ(player.position.z);
  return roomIndex === THIRD_ROOM_INDEX || roomIndex === SIXTH_ROOM_INDEX;
}

function getAmbientMusicTargetVolume() {
  return ambientAudioState.mutedForRoom ? AMBIENT_PIANO_ROOM3_VOLUME : AMBIENT_PIANO_VOLUME;
}

function playSoftPianoNote(context, frequency, start, duration, velocity) {
  const output = ambientAudioState.filter || context.destination;
  const gain = context.createGain();
  const peak = Math.max(0.001, velocity * 0.16);
  const end = start + duration;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.018);
  gain.gain.exponentialRampToValueAtTime(peak * 0.42, start + 0.16);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);
  gain.connect(output);

  const body = context.createOscillator();
  body.type = "triangle";
  body.frequency.setValueAtTime(frequency, start);
  body.connect(gain);
  body.start(start);
  body.stop(end + 0.05);

  const colorGain = context.createGain();
  colorGain.gain.setValueAtTime(0.0001, start);
  colorGain.gain.exponentialRampToValueAtTime(peak * 0.18, start + 0.012);
  colorGain.gain.exponentialRampToValueAtTime(0.0001, start + Math.min(0.42, duration * 0.46));
  colorGain.connect(output);

  const color = context.createOscillator();
  color.type = "sine";
  color.frequency.setValueAtTime(frequency * 2.002, start);
  color.connect(colorGain);
  color.start(start);
  color.stop(start + Math.min(0.5, duration * 0.52));
}

function playMelodyNote(frequency, delay = 0, duration = 0.42, volume = 0.14) {
  const context = unlockMelodyAudio();
  if (!context) {
    return;
  }

  const start = context.currentTime + delay;
  const end = start + duration;
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.035);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);
  gain.connect(context.destination);

  const main = context.createOscillator();
  main.type = "sine";
  main.frequency.setValueAtTime(frequency, start);
  main.connect(gain);
  main.start(start);
  main.stop(end + 0.05);

  const shimmer = context.createOscillator();
  shimmer.type = "triangle";
  shimmer.frequency.setValueAtTime(frequency * 2.01, start);
  const shimmerGain = context.createGain();
  shimmerGain.gain.setValueAtTime(0.0001, start);
  shimmerGain.gain.exponentialRampToValueAtTime(volume * 0.32, start + 0.05);
  shimmerGain.gain.exponentialRampToValueAtTime(0.0001, end + 0.08);
  shimmer.connect(shimmerGain);
  shimmerGain.connect(context.destination);
  shimmer.start(start);
  shimmer.stop(end + 0.12);
}

function easeOutCubic(value) {
  return 1 - Math.pow(1 - THREE.MathUtils.clamp(value, 0, 1), 3);
}

function getDriveInput() {
  const keyboardMove = (input.forward ? 1 : 0) - (input.backward ? 1 : 0);
  const keyboardTurn = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  const stickMove = Math.abs(input.joystick.y) > 0.08 ? input.joystick.y : 0;

  return {
    move: THREE.MathUtils.clamp(stickMove || keyboardMove, -1, 1),
    turn: THREE.MathUtils.clamp(keyboardTurn, -1, 1),
  };
}

function getPlayerForwardVector() {
  return getForwardVectorFromYaw(player.rotation.y);
}

function getForwardVectorFromYaw(yaw) {
  return new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
}

function constrainToRooms(proposed, previous) {
  const roomMinX = -ROOM_WIDTH / 2 + PLAYER_RADIUS;
  const roomMaxX = ROOM_WIDTH / 2 - PLAYER_RADIUS;
  const firstZ = getRoomFrontZ(0) - PLAYER_RADIUS;
  const lastZ = getRoomBackZ(ROOM_COUNT - 1) + PLAYER_RADIUS;

  proposed.x = THREE.MathUtils.clamp(proposed.x, roomMinX, roomMaxX);
  proposed.z = THREE.MathUtils.clamp(proposed.z, lastZ, firstZ);
  resolvePlayerObstacleCollisions(proposed);
  proposed.x = THREE.MathUtils.clamp(proposed.x, roomMinX, roomMaxX);
  proposed.z = THREE.MathUtils.clamp(proposed.z, lastZ, firstZ);

  for (const lineZ of boundaryZ) {
    const crossedForward = previous.z > lineZ && proposed.z <= lineZ;
    const crossedBackward = previous.z < lineZ && proposed.z >= lineZ;
    if ((crossedForward || crossedBackward) && isSecondRoomPhotoBoundary(lineZ) && !secondRoomPuzzle.opened) {
      proposed.z = previous.z;
      continue;
    }

    if ((crossedForward || crossedBackward) && isThirdRoomMelodyBoundary(lineZ) && !thirdRoomPuzzle.opened) {
      proposed.z = previous.z;
      continue;
    }

    if ((crossedForward || crossedBackward) && isFourthRoomBubbleBoundary(lineZ) && !fourthRoomPuzzle.opened) {
      proposed.z = previous.z;
      continue;
    }

    if ((crossedForward || crossedBackward) && isFifthRoomPlantBoundary(lineZ) && !fifthRoomPuzzle.opened) {
      proposed.z = previous.z;
      continue;
    }

    if ((crossedForward || crossedBackward) && isGraveyardExitBoundary(lineZ) && !graveyardPuzzle.opened) {
      proposed.z = previous.z;
      continue;
    }

    if ((crossedForward || crossedBackward) && Math.abs(proposed.x) > DOOR_HALF_WIDTH - PLAYER_RADIUS) {
      proposed.z = previous.z;
    }
  }

  const allowedHalfWidth = getAllowedHalfWidthAtZ(proposed.z);
  proposed.x = THREE.MathUtils.clamp(
    proposed.x,
    -allowedHalfWidth + PLAYER_RADIUS,
    allowedHalfWidth - PLAYER_RADIUS,
  );
}

function resolvePlayerObstacleCollisions(proposed) {
  if (!isPositionInSecondRoom(proposed.z)) {
    return;
  }

  secondRoomPuzzle.obstacles.forEach((obstacle) => {
    resolveCircleAabbCollision(proposed, PLAYER_RADIUS, obstacle);
  });
}

function isPositionInSecondRoom(z) {
  return z <= getRoomFrontZ(SECOND_ROOM_INDEX)
    && z >= getRoomBackZ(SECOND_ROOM_INDEX);
}

function isPositionInFourthRoom(z) {
  return z <= getRoomFrontZ(FOURTH_ROOM_INDEX)
    && z >= getRoomBackZ(FOURTH_ROOM_INDEX);
}

function isPositionInFifthRoom(z) {
  return z <= getRoomFrontZ(FIFTH_ROOM_INDEX)
    && z >= getRoomBackZ(FIFTH_ROOM_INDEX);
}

function getAllowedHalfWidthAtZ(z) {
  return isPositionInCorridor(z) ? CORRIDOR_HALF_WIDTH : ROOM_WIDTH / 2;
}

function isPositionInCorridor(z) {
  for (let i = 0; i < ROOM_COUNT - 1; i += 1) {
    if (z <= getRoomBackZ(i) && z >= getRoomFrontZ(i + 1)) {
      return true;
    }
  }

  return false;
}

function isSecondRoomPhotoBoundary(lineZ) {
  return Math.abs(lineZ - SECOND_TO_THIRD_BOUNDARY_Z) < 0.001;
}

function isThirdRoomMelodyBoundary(lineZ) {
  return Math.abs(lineZ - THIRD_TO_FOURTH_BOUNDARY_Z) < 0.001;
}

function isFourthRoomBubbleBoundary(lineZ) {
  return Math.abs(lineZ - FOURTH_TO_FIFTH_BOUNDARY_Z) < 0.001;
}

function isFifthRoomPlantBoundary(lineZ) {
  return Math.abs(lineZ - FIFTH_TO_SIXTH_BOUNDARY_Z) < 0.001;
}

function isGraveyardExitBoundary(lineZ) {
  return GRAVEYARD_VARIANT && Math.abs(lineZ - GRAVEYARD_TO_FINALE_BOUNDARY_Z) < 0.001;
}

function updateCamera(delta) {
  cameraState.yaw = smoothAngle(cameraState.yaw, player.rotation.y, CAMERA_TURN_FOLLOW_SPEED * delta);
  const cameraForward = getForwardVectorFromYaw(cameraState.yaw);
  const playerForward = getPlayerForwardVector();
  const desired = player.position
    .clone()
    .addScaledVector(cameraForward, -CAMERA_DISTANCE)
    .add(new THREE.Vector3(0, CAMERA_HEIGHT + cameraState.pitch * 5, 0));

  camera.position.lerp(desired, 1 - Math.pow(0.002, delta));
  const lookTarget = player.position
    .clone()
    .addScaledVector(playerForward, CAMERA_LOOK_AHEAD)
    .add(new THREE.Vector3(0, PLAYER_HEIGHT * 0.68, 0));
  camera.lookAt(lookTarget);
}

function updateCameraFadeMeshes(delta) {
  if (cameraFadeMeshes.length === 0) {
    return;
  }

  const shouldTrace = cameraFadeFrame % CAMERA_FADE_TRACE_INTERVAL === 0;
  cameraFadeFrame += 1;

  if (shouldTrace) {
    const target = player.position.clone().add(new THREE.Vector3(0, PLAYER_HEIGHT * 0.7, 0));
    const direction = target.sub(camera.position);
    const distance = direction.length();

    if (distance < 0.001) {
      cameraFadeTargets = new Set();
    } else {
      cameraFadeRaycaster.set(camera.position, direction.normalize());
      cameraFadeRaycaster.far = Math.max(0.1, distance - 0.3);
      cameraFadeTargets = new Set(
        cameraFadeRaycaster.intersectObjects(cameraFadeMeshes, false).map((hit) => hit.object),
      );
    }
  }

  const blend = 1 - Math.pow(0.001, delta);
  const graveyardCameraOutside = GRAVEYARD_VARIANT && (
    Math.abs(camera.position.x) > ROOM_WIDTH / 2 - WALL_THICKNESS * 0.35
    || camera.position.z > getRoomFrontZ(GRAVEYARD_ROOM_INDEX) - WALL_THICKNESS * 0.35
    || camera.position.z < getRoomBackZ(GRAVEYARD_ROOM_INDEX) + WALL_THICKNESS * 0.35
  );

  cameraFadeMeshes.forEach((mesh) => {
    const forceGraveyardFade = graveyardCameraOutside && mesh.userData.graveyardCameraFade;
    const targetOpacity = forceGraveyardFade
      ? 0
      : (cameraFadeTargets.has(mesh)
        ? mesh.userData.cameraFadeOpacity
        : mesh.userData.cameraFadeBaseOpacity);
    mesh.material.opacity = THREE.MathUtils.lerp(mesh.material.opacity, targetOpacity, blend);
    mesh.material.depthWrite = mesh.userData.cameraFadeBaseDepthWrite && mesh.material.opacity > 0.42;
    mesh.visible = mesh.material.opacity > 0.035;
  });
}

function updateSparkles(elapsed) {
  if (PERFORMANCE_MODE && sparkleFrame % 2 !== 0) {
    sparkleFrame += 1;
    return;
  }

  sparkleFrame += 1;
  sparkleSystems.forEach((system, systemIndex) => {
    const positions = system.points.geometry.attributes.position.array;
    for (let i = 0; i < system.phases.length; i += 1) {
      const baseIndex = i * 3;
      positions[baseIndex + 1] =
        system.base[baseIndex + 1] + Math.sin(elapsed * 1.5 + system.phases[i]) * 0.2;
      positions[baseIndex] =
        system.base[baseIndex] + Math.sin(elapsed * 0.8 + system.phases[i] + systemIndex) * 0.035;
    }
    system.points.geometry.attributes.position.needsUpdate = true;
    system.points.material.opacity = 0.62 + Math.sin(elapsed * 1.4 + systemIndex) * 0.16;
  });
}

function updateRoomLights(elapsed) {
  if (PERFORMANCE_MODE && lightFrame % 2 !== 0) {
    lightFrame += 1;
    return;
  }

  lightFrame += 1;
  roomLights.forEach((light, index) => {
    const baseIntensity = light.userData.baseIntensity ?? 3.4;
    const flicker = light.userData.flicker ?? 0.45;
    const phase = light.userData.phase ?? index * 0.8;
    light.intensity = baseIntensity
      + Math.sin(elapsed * 5.2 + phase) * flicker
      + Math.sin(elapsed * 11.7 + phase * 0.7) * flicker * 0.28;
  });
}

function updateRoomEntryInstructions(delta, elapsed) {
  const roomIndex = getRoomIndexAtZ(player.position.z);
  if (roomIndex !== null && roomIndex !== roomEntryInstructionState.lastRoomIndex) {
    roomEntryInstructionState.lastRoomIndex = roomIndex;
    triggerRoomEntryInstruction(roomIndex);
  }

  roomEntryInstructionGroups.forEach((entry, index) => {
    if (entry.timer <= 0) {
      entry.material.opacity = 0;
      entry.group.visible = false;
      return;
    }

    entry.timer = Math.max(0, entry.timer - delta);
    const visibleTime = ROOM_ENTRY_INSTRUCTION_DURATION - entry.timer;
    const fadeIn = easeOutCubic(THREE.MathUtils.clamp(visibleTime / 0.5, 0, 1));
    const fadeOut = THREE.MathUtils.clamp(entry.timer / ROOM_ENTRY_INSTRUCTION_FADE_DURATION, 0, 1);
    const opacity = Math.min(fadeIn, fadeOut);
    entry.material.opacity = opacity;
    entry.group.visible = opacity > 0.01;
    entry.group.position.y = entry.baseY + Math.sin(elapsed * 1.35 + index) * 0.04;
    entry.group.scale.setScalar(0.94 + fadeIn * 0.06);
    faceInstructionToCamera(entry.group);
  });
}

function triggerRoomEntryInstruction(roomIndex) {
  roomEntryInstructionGroups.forEach((entry, index) => {
    if (index !== roomIndex) {
      entry.timer = 0;
      entry.material.opacity = 0;
      entry.group.visible = false;
    }
  });

  const entry = roomEntryInstructionGroups.get(roomIndex);
  if (!entry) {
    return;
  }

  entry.timer = ROOM_ENTRY_INSTRUCTION_DURATION;
  entry.group.visible = true;
  entry.material.opacity = 0;
  entry.group.scale.setScalar(0.94);
  placeInstructionInFrontOfPlayer(entry, roomIndex);
  faceInstructionToCamera(entry.group);
  playRoomEntryInstructionSound(roomIndex);
}

function placeInstructionInFrontOfPlayer(entry, roomIndex) {
  const forward = getPlayerForwardVector();
  const marginX = 3.5;
  const marginZ = 3.4;
  const x = THREE.MathUtils.clamp(
    player.position.x + forward.x * 4.4,
    -ROOM_WIDTH / 2 + marginX,
    ROOM_WIDTH / 2 - marginX,
  );
  const z = THREE.MathUtils.clamp(
    player.position.z + forward.z * 7.8,
    getRoomBackZ(roomIndex) + marginZ,
    getRoomFrontZ(roomIndex) - marginZ,
  );
  entry.group.position.set(x, entry.baseY, z);
}

function faceInstructionToCamera(group) {
  const dx = camera.position.x - group.position.x;
  const dz = camera.position.z - group.position.z;
  if (Math.abs(dx) + Math.abs(dz) < 0.0001) {
    return;
  }

  group.rotation.set(0, Math.atan2(dx, dz), 0);
}

function getCurrentRoomIndex() {
  const rawIndex = Math.round(-player.position.z / ROOM_STEP);
  return THREE.MathUtils.clamp(rawIndex, 0, ROOM_COUNT - 1);
}

function getRoomIndexAtZ(z) {
  for (let index = 0; index < ROOM_COUNT; index += 1) {
    if (z <= getRoomFrontZ(index) + 0.05 && z >= getRoomBackZ(index) - 0.05) {
      return index;
    }
  }

  return null;
}

function updateHud() {
  const roomIndex = getCurrentRoomIndex();
  const startZ = 0;
  const endZ = getRoomBackZ(ROOM_COUNT - 1) + PLAYER_RADIUS;
  const progress = THREE.MathUtils.clamp((startZ - player.position.z) / (startZ - endZ), 0, 1);

  roomLabel.textContent = `Комната ${roomIndex + 1} / ${ROOM_COUNT}`;
  distanceLabel.textContent = `${Math.round(progress * 100)}%`;
  updateRoomJumpActive(roomIndex + 1);
}

function onRoomJumpClick(event) {
  const button = event.target.closest("[data-room-jump]");
  if (!button) {
    return;
  }

  unlockMelodyAudio();
  event.preventDefault();
  event.stopPropagation();
  jumpToRoom(Number(button.dataset.roomJump));
}

function jumpToRoom(roomNumber) {
  const roomIndex = THREE.MathUtils.clamp(Math.round(roomNumber) - 1, 0, ROOM_COUNT - 1);
  input.forward = false;
  input.backward = false;
  input.left = false;
  input.right = false;
  input.joystick.set(0, 0);
  moveKnob.style.transform = "translate(-50%, -50%)";
  secondRoomPuzzle.ballVelocity.set(0, 0, 0);
  player.position.set(0, 0, getRoomCenterZ(roomIndex));
  player.rotation.set(0, 0, 0);
  snapCameraToPlayer();
  roomEntryInstructionState.lastRoomIndex = roomIndex;
  triggerRoomEntryInstruction(roomIndex);
  updateHud();
  return roomIndex + 1;
}

function snapCameraToPlayer() {
  cameraState.yaw = player.rotation.y;
  const cameraForward = getForwardVectorFromYaw(cameraState.yaw);
  const playerForward = getPlayerForwardVector();
  camera.position.copy(
    player.position
      .clone()
      .addScaledVector(cameraForward, -CAMERA_DISTANCE)
      .add(new THREE.Vector3(0, CAMERA_HEIGHT + cameraState.pitch * 5, 0)),
  );
  camera.lookAt(
    player.position
      .clone()
      .addScaledVector(playerForward, CAMERA_LOOK_AHEAD)
      .add(new THREE.Vector3(0, PLAYER_HEIGHT * 0.68, 0)),
  );
}

function updateRoomJumpActive(roomNumber) {
  roomJumpTools?.querySelectorAll("[data-room-jump]").forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.roomJump) === roomNumber);
  });
}

function startGame() {
  if (gameStarted) {
    return;
  }

  gameStarted = true;
  startOverlay?.classList.add("is-hidden");
  startOverlay?.setAttribute("aria-hidden", "true");
  unlockMelodyAudio();
  roomEntryInstructionState.lastRoomIndex = null;
}

function setKey(event, pressed) {
  if (!gameStarted) {
    return;
  }

  const key = event.key.toLowerCase();
  if (pressed) {
    unlockMelodyAudio();
  }

  if (["w", "ц", "arrowup"].includes(key)) input.forward = pressed;
  if (["s", "ы", "arrowdown"].includes(key)) input.backward = pressed;
  if (["a", "ф", "arrowleft"].includes(key)) input.left = pressed;
  if (["d", "в", "arrowright"].includes(key)) input.right = pressed;

  if (pressed && !event.repeat && isKickKey(event)) {
    handlePrimaryAction();
  }

  if (pressed && !event.repeat) {
    const tapTurn = getTapTurnDirection(key);
    if (tapTurn !== 0) {
      turnPlayer(-tapTurn * TAP_TURN_STEP);
    }
  }

  if (["w", "a", "s", "d", "ц", "ф", "ы", "в", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key) || isKickKey(event)) {
    event.preventDefault();
  }
}

function isKickKey(event) {
  return event.code === "Space" || event.key === " ";
}

function getTapTurnDirection(key) {
  if (["a", "ф", "arrowleft"].includes(key)) {
    return -1;
  }

  if (["d", "в", "arrowright"].includes(key)) {
    return 1;
  }

  return 0;
}

function onScenePointerDown(event) {
  if (!gameStarted) {
    return;
  }

  if (event.target !== renderer.domElement || cameraState.draggingPointer !== null) {
    return;
  }

  event.preventDefault();
  unlockMelodyAudio();
  cameraState.draggingPointer = event.pointerId;
  cameraState.lastX = event.clientX;
  cameraState.lastY = event.clientY;
  renderer.domElement.setPointerCapture(event.pointerId);
}

function onScenePointerMove(event) {
  if (cameraState.draggingPointer !== event.pointerId) {
    return;
  }

  event.preventDefault();
  rotateCamera(event.clientX - cameraState.lastX, event.clientY - cameraState.lastY);
  cameraState.lastX = event.clientX;
  cameraState.lastY = event.clientY;
}

function onScenePointerUp(event) {
  if (cameraState.draggingPointer === event.pointerId) {
    cameraState.draggingPointer = null;
    if (renderer.domElement.hasPointerCapture(event.pointerId)) {
      renderer.domElement.releasePointerCapture(event.pointerId);
    }
  }
}

function onStickPointerDown(event) {
  if (!gameStarted) {
    return;
  }

  unlockMelodyAudio();
  moveStick.setPointerCapture(event.pointerId);
  updateStick(event);
}

function onStickPointerMove(event) {
  if (moveStick.hasPointerCapture(event.pointerId)) {
    updateStick(event);
  }
}

function updateStick(event) {
  const rect = moveStick.getBoundingClientRect();
  const center = new THREE.Vector2(rect.left + rect.width / 2, rect.top + rect.height / 2);
  const pointer = new THREE.Vector2(event.clientX, event.clientY);
  const delta = pointer.sub(center);
  const radius = rect.height * 0.34;
  const verticalOffset = THREE.MathUtils.clamp(delta.y, -radius, radius);

  input.joystick.set(0, -verticalOffset / radius);
  moveKnob.style.transform = `translate(-50%, calc(-50% + ${verticalOffset}px))`;
}

function resetStick(event) {
  if (event && moveStick.hasPointerCapture(event.pointerId)) {
    moveStick.releasePointerCapture(event.pointerId);
  }
  input.joystick.set(0, 0);
  moveKnob.style.transform = "translate(-50%, -50%)";
}

function onActionButtonPointerDown(event) {
  event.preventDefault();
  event.stopPropagation();
  if (!gameStarted) {
    return;
  }
  unlockMelodyAudio();
  actionButton?.classList.add("is-pressed");
  actionButton?.setPointerCapture?.(event.pointerId);
  handlePrimaryAction();
}

function onActionButtonPointerUp(event) {
  actionButton?.classList.remove("is-pressed");
  if (actionButton?.hasPointerCapture?.(event.pointerId)) {
    actionButton.releasePointerCapture(event.pointerId);
  }
}

function rotateCamera(deltaX, deltaY) {
  turnPlayer(-deltaX * 0.006);
  cameraState.pitch = THREE.MathUtils.clamp(cameraState.pitch - deltaY * 0.0025, -0.35, 0.45);
}

function resizeRenderer() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_RENDER_PIXEL_RATIO));
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function turnPlayer(deltaYaw) {
  player.rotation.y = normalizeRadians(player.rotation.y + deltaYaw);
}

function smoothAngle(current, target, amount) {
  const delta = Math.atan2(Math.sin(target - current), Math.cos(target - current));
  return current + delta * Math.min(amount, 1);
}

function normalizeRadians(radians) {
  return Math.atan2(Math.sin(radians), Math.cos(radians));
}
