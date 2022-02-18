import { cubicInOut } from "svelte/easing";

export function slideSideIn(node, { base_fl = false }){
  if(node.nodeName == "MAIN" && base_fl) return {};
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