import { cubicInOut } from "svelte/easing";

export function slideSideIn(node, { base_fl = false }){
  if(node.children[0].nodeName == "MAIN" && base_fl) return {};
  return {
    duration: 600,
    easing: cubicInOut,
    css: (_, t) => `left: ${t*1024}px`
  };
}

export function slideSideOut(..._){
  return {
    duration: 600,
    easing: cubicInOut,
    css: (_, t) => `left: ${0-t*1024}px`
  };
}

export function slideUpIn(node){
  return {
    duration: 400,
    easing: cubicInOut,
    tick: (t) => {
      node.style.top = `${-576+t*576}px`;
    }
  };
}

export function slideUpOut(node){
  return {
    duration: 400,
    easing: cubicInOut,
    tick: (_, t) => {
      node.style.top = `${t*576}px`;
    }
  };
}

export function slideDownIn(node){
  return {
    duration: 400,
    easing: cubicInOut,
    tick: (t) => {
      node.style.top = `${576-t*576}px`;
    }
  };
}

export function slideDownOut(node){
  return {
    duration: 400,
    easing: cubicInOut,
    tick: (_, t) => {
      node.style.top = `${-t*576}px`;
    }
  };
}