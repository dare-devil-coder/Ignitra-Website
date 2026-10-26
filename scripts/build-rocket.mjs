import fs from 'node:fs';
import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, meshopt } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
// Independent geometry, no legacy scene code. Materials are assigned from CSS tokens at runtime.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((result) => {
      this.result = result;
      this.onloadend?.();
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((result) => {
      this.result =
        'data:application/octet-stream;base64,' +
        Buffer.from(result).toString('base64');
      this.onloadend?.();
    });
  }
};
const model = new THREE.Group();
model.name = 'IgnitraRocket';
const materials = Object.fromEntries(
  ['hull', 'graphite', 'ember', 'glass'].map((name) => {
    const m = new THREE.MeshStandardMaterial({
      metalness: name === 'hull' ? 0.75 : 0.45,
      roughness: name === 'glass' ? 0.18 : 0.32,
    });
    m.name = name;
    return [name, m];
  }),
);
function part(
  name,
  geometry,
  material,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
) {
  const mesh = new THREE.Mesh(geometry, materials[material]);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  model.add(mesh);
  return mesh;
}
part('Hull', new THREE.CylinderGeometry(0.3, 0.34, 1.6, 32), 'hull');
part(
  'Nose',
  new THREE.LatheGeometry(
    [
      new THREE.Vector2(0.3, 0),
      new THREE.Vector2(0.29, 0.15),
      new THREE.Vector2(0.23, 0.4),
      new THREE.Vector2(0.12, 0.66),
      new THREE.Vector2(0, 0.86),
    ],
    32,
  ),
  'graphite',
  [0, 0.8, 0],
);
for (const y of [-0.72, -0.52, 0.53, 0.78])
  part(
    'Seam',
    new THREE.TorusGeometry(0.314, 0.022, 8, 32),
    'ember',
    [0, y, 0],
    [Math.PI / 2, 0, 0],
  );
part(
  'EngineCollar',
  new THREE.CylinderGeometry(0.34, 0.24, 0.22, 24),
  'graphite',
  [0, -0.91, 0],
);
part(
  'Nozzle',
  new THREE.CylinderGeometry(0.14, 0.24, 0.26, 24, 1, true),
  'ember',
  [0, -1.12, 0],
);
part(
  'WindowRim',
  new THREE.TorusGeometry(0.14, 0.025, 8, 24),
  'ember',
  [0, 0.28, 0.304],
);
part(
  'Window',
  new THREE.SphereGeometry(0.125, 20, 12),
  'glass',
  [0, 0.28, 0.31],
).scale.z = 0.23;
for (let i = 0; i < 3; i++) {
  const angle = (i * Math.PI * 2) / 3;
  const shape = new THREE.Shape();
  shape.moveTo(0.26, -0.35);
  shape.lineTo(0.64, -0.88);
  shape.lineTo(0.61, -1.18);
  shape.lineTo(0.29, -0.84);
  shape.closePath();
  const fin = part(
    'Fin',
    new THREE.ExtrudeGeometry(shape, {
      depth: 0.06,
      bevelEnabled: true,
      bevelSegments: 1,
      steps: 1,
      bevelSize: 0.014,
      bevelThickness: 0.014,
    }),
    'graphite',
  );
  fin.rotation.y = angle;
  const rail = part(
    'EnergyRail',
    new THREE.BoxGeometry(0.045, 0.72, 0.035),
    'ember',
    [Math.sin(angle) * 0.335, -0.12, Math.cos(angle) * 0.335],
  );
  rail.rotation.y = angle;
}
const raw = await new GLTFExporter().parseAsync(model, { binary: true });
await MeshoptEncoder.ready;
await MeshoptDecoder.ready;
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    'meshopt.encoder': MeshoptEncoder,
    'meshopt.decoder': MeshoptDecoder,
  });
const doc = await io.readBinary(new Uint8Array(raw));
await doc.transform(
  dedup(),
  prune(),
  meshopt({ encoder: MeshoptEncoder, level: 'high' }),
);
fs.mkdirSync('public/assets/models', { recursive: true });
await io.write('public/assets/models/ignitra-rocket.glb', doc);
console.log({
  rawBytes: raw.byteLength,
  compressedBytes: fs.statSync('public/assets/models/ignitra-rocket.glb').size,
});
