import { useEffect, useRef } from "react";

/* ── Vertex shader: fullscreen triangle trick ─── */
const VERT = `#version 300 es
precision highp float;
layout(location=0) in vec2 a_pos;
out vec2 v_uv;
void main(){
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

/* ── Fragment shader: radial speed-lines ─── */
const FRAG = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 fragColor;

uniform vec3  uResolution;
uniform float uTime;

float randVal(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123); }

float noise2d(vec2 p){
  vec2 i=floor(p), f=fract(p), u=f*f*(3.0-2.0*f);
  float a=randVal(i),b=randVal(i+vec2(1,0)),c=randVal(i+vec2(0,1)),d=randVal(i+vec2(1,1));
  return a+(b-a)*u.x+(c-a)*u.y+(a-b-c+d)*u.x*u.y;
}

float mirrored(float t,float shift){ t=fract(t+shift); return 2.0*abs(t-0.5); }

float radialLayer(float angle,float radius){
  const float SCALE=84.0;
  radius=pow(radius,0.01);
  float offset=-uTime*0.02;
  vec2 pos=vec2(mirrored(angle,0.1),radius+offset);
  float n1=noise2d(pos*SCALE);
  pos=2.1*vec2(mirrored(angle,0.4),radius+offset);
  float n2=noise2d(pos*SCALE);
  return pow((n1+0.5*n2)*3.6,3.0);
}

vec3 applyColor(float v){
  v=clamp(v,0.0,1.0);
  vec3 col=mix(vec3(0.0,0.0,1.1),vec3(0.0,1.0,1.0),v);
  col=mix(col,vec3(0.0,0.0,0.0),v*4.0-3.0)*v;
  col=max(col,vec3(0.0));
  col=mix(col,vec3(1.0,0.25,1.0),smoothstep(1.0,0.2,v)*smoothstep(0.15,0.9,v));
  return col;
}

void main(){
  vec2 R=uResolution.xy;
  vec2 uv=(gl_FragCoord.xy*2.0-R)/R.y*0.12;
  float dist=dot(uv,uv);
  float ang=atan(uv.y,uv.x)/6.28318530718;
  float val=radialLayer(ang,dist);
  val=val*2.5-1.4;
  val=mix(0.0,val,0.8*smoothstep(0.0,0.8,dist));
  fragColor=vec4(applyColor(val),1.0);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(sh));
    return null;
  }
  return sh;
}

function link(gl: WebGL2RenderingContext, vs: WebGLShader, fs: WebGLShader) {
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(prog));
    return null;
  }
  return prog;
}

function SpeedLinesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext("webgl2", { premultipliedAlpha: false });
    if (!gl) return;

    let disposed = false;
    let raf: number | null = null;
    let startTime = performance.now();

    // Geometry: fullscreen triangle
    const vao = gl.createVertexArray()!;
    const vbo = gl.createBuffer()!;
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const program = link(gl, vs, fs);
    gl.deleteShader(vs); gl.deleteShader(fs);
    if (!program) return;

    const uRes  = gl.getUniformLocation(program, "uResolution");
    const uTime = gl.getUniformLocation(program, "uTime");

    // Resize: always use window.innerWidth/Height for full coverage
    function resize() {
      if (disposed) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(window.innerWidth  * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width  = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    }

    const ro = new ResizeObserver(resize);
    ro.observe(document.documentElement);
    resize();

    function tick(now: number) {
      if (disposed) return;
      const t = (now - startTime) / 1000;
      gl.useProgram(program);
      gl.uniform3f(uRes, canvas.width, canvas.height, 1.0);
      gl.uniform1f(uTime, t);
      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      gl.deleteBuffer(vbo);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0, left: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}

export const SpeedLinesShader = () => (
  <div
    style={{
      position: "absolute",
      top: 0, left: 0, right: 0, bottom: 0,
      width: "100%",
      height: "100%",
      background: "#000",
      overflow: "hidden",
    }}
  >
    <SpeedLinesCanvas />
  </div>
);
