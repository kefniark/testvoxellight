import * as BABYLON from '@babylonjs/core/Legacy/legacy';

BABYLON.Mesh.prototype.increaseFacets = function (pps) { //pp, Color3s points per side        
    var _gaps = pps + 1;
    var _n = _gaps + 1;
    var _fvs = [];
    for (var _i = 0; _i < _n; _i++) {
        _fvs[_i] = [];
    }
    var _A, _B;
    var _d = { x: 0, y: 0, z: 0 };
    var _u = { x: 0, y: 0 };
    var _indices = [];
    var _vertexIndex = [];
    var _side = [];
    var _l; //holds lengths
    var _uvs = this.getVerticesData(BABYLON.VertexBuffer.UVKind);
    var _meshIndices = this.getIndices();
    var _positions = this.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    var _normals = [];

    for (var _i = 0; _i < _meshIndices.length; _i += 3) {
        _vertexIndex[0] = _meshIndices[_i];
        _vertexIndex[1] = _meshIndices[_i + 1];
        _vertexIndex[2] = _meshIndices[_i + 2];

        for (var _j = 0; _j < 3; _j++) {
            _A = _vertexIndex[_j];
            _B = _vertexIndex[(_j + 1) % 3];
            if (_side[_A] === undefined && _side[_B] === undefined) {
                _side[_A] = [];
                _side[_B] = [];
            }
            else {
                if (_side[_A] === undefined) {
                    _side[_A] = [];
                }
                if (_side[_B] === undefined) {
                    _side[_B] = [];
                }
            }
            if (_side[_A][_B] === undefined && _side[_B][_A] === undefined) {
                _side[_A][_B] = [];
                _d.x = (_positions[3 * _B] - _positions[3 * _A]) / _gaps;
                _d.y = (_positions[3 * _B + 1] - _positions[3 * _A + 1]) / _gaps;
                _d.z = (_positions[3 * _B + 2] - _positions[3 * _A + 2]) / _gaps;
                _u.x = (_uvs[2 * _B] - _uvs[2 * _A]) / _gaps;
                _u.y = (_uvs[2 * _B + 1] - _uvs[2 * _A + 1]) / _gaps;
                _side[_A][_B].push(_A);
                for (var _k = 1; _k < _gaps; _k++) {
                    _side[_A][_B].push(_positions.length / 3);
                    _positions.push(_positions[3 * _A] + _k * _d.x, _positions[3 * _A + 1] + _k * _d.y, _positions[3 * _A + 2] + _k * _d.z);
                    _uvs.push(_uvs[2 * _A] + _k * _u.x, _uvs[2 * _A + 1] + _k * _u.y);
                }
                _side[_A][_B].push(_B);
                _side[_B][_A] = [];
                _l = _side[_A][_B].length;
                for (var _a = 0; _a < _l; _a++) {
                    _side[_B][_A][_a] = _side[_A][_B][_l - 1 - _a];
                }
            }
            else {
                if (_side[_A][_B] === undefined) {
                    _side[_A][_B] = [];
                    _l = _side[_B][_A].length;
                    for (var _a = 0; _a < _l; _a++) {
                        _side[_A][_B][_a] = _side[_B][_A][_l - 1 - _a];
                    }
                }
                if (_side[_B][_A] === undefined) {
                    _side[_B][_A] = [];
                    _l = _side[_A][_B].length;
                    for (var _a = 0; _a < _l; _a++) {
                        _side[_B][_A][_a] = _side[_A][_B][_l - 1 - _a];
                    }
                }
            }
        }
        _fvs[0][0] = _meshIndices[_i];
        _fvs[1][0] = _side[_meshIndices[_i]][_meshIndices[_i + 1]][1];
        _fvs[1][1] = _side[_meshIndices[_i]][_meshIndices[_i + 2]][1];
        for (var _k = 2; _k < _gaps; _k++) {
            _fvs[_k][0] = _side[_meshIndices[_i]][_meshIndices[_i + 1]][_k];
            _fvs[_k][_k] = _side[_meshIndices[_i]][_meshIndices[_i + 2]][_k];
            _d.x = (_positions[3 * _fvs[_k][_k]] - _positions[3 * _fvs[_k][0]]) / _k;
            _d.y = (_positions[3 * _fvs[_k][_k] + 1] - _positions[3 * _fvs[_k][0] + 1]) / _k;
            _d.z = (_positions[3 * _fvs[_k][_k] + 2] - _positions[3 * _fvs[_k][0] + 2]) / _k;
            _u.x = (_uvs[2 * _fvs[_k][_k]] - _uvs[2 * _fvs[_k][0]]) / _k;
            _u.y = (_uvs[2 * _fvs[_k][_k] + 1] - _uvs[2 * _fvs[_k][0] + 1]) / _k;
            for (var _j = 1; _j < _k; _j++) {
                _fvs[_k][_j] = _positions.length / 3;
                _positions.push(_positions[3 * _fvs[_k][0]] + _j * _d.x, _positions[3 * _fvs[_k][0] + 1] + _j * _d.y, _positions[3 * _fvs[_k][0] + 2] + _j * _d.z);
                _uvs.push(_uvs[2 * _fvs[_k][0]] + _j * _u.x, _uvs[2 * _fvs[_k][0] + 1] + _j * _u.y);
            }
        }
        _fvs[_gaps] = _side[_meshIndices[_i + 1]][_meshIndices[_i + 2]];

        _indices.push(_fvs[0][0], _fvs[1][0], _fvs[1][1]);
        for (var _k = 1; _k < _gaps; _k++) {
            for (var _j = 0; _j < _k; _j++) {
                _indices.push(_fvs[_k][_j], _fvs[_k + 1][_j], _fvs[_k + 1][_j + 1]);
                _indices.push(_fvs[_k][_j], _fvs[_k + 1][_j + 1], _fvs[_k][_j + 1]);
            }
            _indices.push(_fvs[_k][_j], _fvs[_k + 1][_j], _fvs[_k + 1][_j + 1]);
        }

    }

    var vertexData = new BABYLON.VertexData();
    vertexData.positions = _positions;
    vertexData.indices = _indices;
    vertexData.uvs = _uvs;

    BABYLON.VertexData.ComputeNormals(_positions, _indices, _normals);
    vertexData.normals = _normals;

    vertexData.applyToMesh(this);
}

// Get the canvas element from the DOM.
const canvas = document.getElementById("renderCanvas");

// Associate a Babylon Engine to it.
const engine = new BABYLON.Engine(canvas);

// Create our first scene.
var scene = new BABYLON.Scene(engine);

// This creates and positions a free camera (non-mesh)
var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

// This targets the camera to scene origin
camera.setTarget(BABYLON.Vector3.Zero());

// This attaches the camera to the canvas
camera.attachControl(canvas, true);

// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(-0.25, 1, -0.25), scene);

light.intensity = 1;
light.groundColor = new BABYLON.Color3(0.75, 0.75, 0.75);
window.light = light;

const eqTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("https://www.babylonjs-playground.com/textures/environment.dds", scene);
eqTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
eqTexture.level = 0.05;

// Create a grid material
var floorMaterial = new BABYLON.StandardMaterial("floor", scene);
floorMaterial.diffuseTexture = new BABYLON.Texture("https://image.ibb.co/mAZkwy/FLAT5-5.jpg", scene);
floorMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
floorMaterial.bumpTexture = new BABYLON.Texture("http://i.imgur.com/wGyk6os.png", scene);
floorMaterial.bumpTexture.level = 0.5;
floorMaterial.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);
floorMaterial.specularPower = 8;
floorMaterial.zOffset = 1;

var grassMaterial = new BABYLON.StandardMaterial("greass", scene);
grassMaterial.diffuseTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/grass.png", scene);
grassMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
grassMaterial.bumpTexture = new BABYLON.Texture("http://i.imgur.com/wGyk6os.png", scene);
grassMaterial.bumpTexture.level = 0.5;
grassMaterial.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05)
grassMaterial.specularPower = 8;
grassMaterial.zOffset = 2;

var wallMaterial = new BABYLON.StandardMaterial("wall", scene);
wallMaterial.diffuseTexture = new BABYLON.Texture("http://i.imgur.com/Wk1cGEq.png", scene);
wallMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
wallMaterial.bumpTexture = new BABYLON.Texture("http://i.imgur.com/wGyk6os.png", scene);
wallMaterial.bumpTexture.level = 0.5;
wallMaterial.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);
wallMaterial.specularPower = 8;
wallMaterial.zOffset = 3;
wallMaterial.reflectionTexture = eqTexture;
wallMaterial.refractionTexture = eqTexture;
wallMaterial.reflectivityColor = BABYLON.Color3.Gray();
wallMaterial.indexOfRefraction = 0.2;


var generatedMeshes = [];

var size = 2 * 24;
var height = 6;

var posToBash = function (x, y, z) {
    return size * Math.floor(z / 12) + Math.floor(x / 12);
}

var indexToPos = function (index) {
    var y = Math.floor(i / (size * 2 * size * 2));
    var z = Math.floor(i / size / 2) % (size * 2);
    var x = i % (size * 2);
    return { x, y, z };
}

var posToIndex = function (x, y, z) {
    if (x < 0 || x >= size * 2) return -1;
    if (z < 0 || z >= size * 2) return -1;
    if (y < 0) return -1;
    var iY = y * size * 2 * size * 2;
    var iZ = z * size * 2;
    var iX = x;
    return iY + iZ + iX;
}

var average = function (arr) {
    return arr.reduce((p, c) => p + c, 0) / arr.length;
}

var updateVertexColor = function (useTorch) {
    console.time("updateVertexColor");
    for (var box of generatedMeshes) {
        var positions = box.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        var normals = box.getVerticesData(BABYLON.VertexBuffer.NormalKind);
        var colors = box.getVerticesData(BABYLON.VertexBuffer.ColorKind);
        if (!colors) colors = [];
        var indices = box.getIndices();
        for (var i = 0; i < indices.length / 3; i++) {
            var ind1 = indices[i * 3];
            var ind2 = indices[i * 3 + 1];
            var ind3 = indices[i * 3 + 2];

            var px = positions[ind1 * 3];
            var py = positions[ind1 * 3 + 1];
            var pz = positions[ind1 * 3 + 2];
            var nx = normals[ind1 * 3];
            var ny = normals[ind1 * 3 + 1];
            var nz = normals[ind1 * 3 + 2];

            var d1 = distance(positions[ind1 * 3], positions[ind1 * 3 + 1], positions[ind1 * 3 + 2], positions[ind2 * 3], positions[ind2 * 3 + 1], positions[ind2 * 3 + 2]);
            var d2 = distance(positions[ind2 * 3], positions[ind2 * 3 + 1], positions[ind2 * 3 + 2], positions[ind3 * 3], positions[ind3 * 3 + 1], positions[ind3 * 3 + 2]);
            var d3 = distance(positions[ind3 * 3], positions[ind3 * 3 + 1], positions[ind3 * 3 + 2], positions[ind1 * 3], positions[ind1 * 3 + 1], positions[ind1 * 3 + 2]);
            if (d1 > d2 && d1 > d3) {
                px = (positions[ind1 * 3] + positions[ind2 * 3]) / 2;
                py = (positions[ind1 * 3 + 1] + positions[ind2 * 3 + 1]) / 2;
                pz = (positions[ind1 * 3 + 2] + positions[ind2 * 3 + 2]) / 2;
                nx = (normals[ind1 * 3] + normals[ind2 * 3]) / 2;
                ny = (normals[ind1 * 3 + 1] + normals[ind2 * 3 + 1]) / 2;
                nz = (normals[ind1 * 3 + 2] + normals[ind2 * 3 + 2]) / 2;
            } else if (d2 > d3 && d2 > d1) {
                px = (positions[ind3 * 3] + positions[ind2 * 3]) / 2;
                py = (positions[ind3 * 3 + 1] + positions[ind2 * 3 + 1]) / 2;
                pz = (positions[ind3 * 3 + 2] + positions[ind2 * 3 + 2]) / 2;
                nx = (normals[ind3 * 3] + normals[ind2 * 3]) / 2;
                ny = (normals[ind3 * 3 + 1] + normals[ind2 * 3 + 1]) / 2;
                nz = (normals[ind3 * 3 + 2] + normals[ind2 * 3 + 2]) / 2;
            } else if (d3 > d1 && d3 > d2) {
                px = (positions[ind3 * 3] + positions[ind1 * 3]) / 2;
                py = (positions[ind3 * 3 + 1] + positions[ind1 * 3 + 1]) / 2;
                pz = (positions[ind3 * 3 + 2] + positions[ind1 * 3 + 2]) / 2;
                nx = (normals[ind3 * 3] + normals[ind1 * 3]) / 2;
                ny = (normals[ind3 * 3 + 1] + normals[ind1 * 3 + 1]) / 2;
                nz = (normals[ind3 * 3 + 2] + normals[ind1 * 3 + 2]) / 2;
            }

            for (var ind of [ind1, ind2, ind3]) {
                colors[ind * 4] = 1;
                colors[ind * 4 + 1] = 1;
                colors[ind * 4 + 2] = 1;
                colors[ind * 4 + 3] = 1;
            }

            var x = box.position.x + px + nx * 0.25;
            var y = box.position.y + py + ny * 0.25;
            var z = box.position.z + pz + nz * 0.25;

            var points = [];
            for (var mx = Math.abs(Math.floor(x * 2)); mx <= Math.abs(Math.ceil(x * 2)); mx++) {
                for (var my = Math.abs(Math.floor(y * 2)); my <= Math.abs(Math.ceil(y * 2)); my++) {
                    for (var mz = Math.abs(Math.floor(z * 2)); mz <= Math.abs(Math.ceil(z * 2)); mz++) {
                        var index = posToIndex(mx, my, mz);
                        if (index == -1) continue;
                        points.push(light[index]);
                        if (useTorch && torch[index] > 1) points.push(torch[index]);
                    }
                }
            }
            var intensity = average(points);
            intensity = 1 - ((1 - intensity / 255) * (1 - intensity / 255))

            // var p1 = BABYLON.MeshBuilder.CreateSphere("box", {diameter: 0.2}, scene);
            // p1.position.x = x;
            // p1.position.y = y;
            // p1.position.z = z;
            // p1.material = lights[Math.round(intensity / 25.5)];

            for (var ind of [ind1, ind2, ind3]) {
                colors[ind * 4] = intensity;
                colors[ind * 4 + 1] = intensity;
                colors[ind * 4 + 2] = intensity;
                if (colors[ind * 4] != 0 || colors[ind * 4] != 1) colors[ind * 4] = colors[ind * 4]; // * 0.975 + 0.025
                if (colors[ind * 4 + 1] != 0 || colors[ind * 4 + 1] != 1) colors[ind * 4 + 1] = colors[ind * 4 + 1]; // * 0.975 + 0.025
                if (colors[ind * 4 + 2] != 0 || colors[ind * 4 + 2] != 1) colors[ind * 4 + 2] = colors[ind * 4 + 2]; // * 0.975 + 0.025
            }
        }

        box.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);
    }
    console.timeEnd("updateVertexColor");
}

var buildBox = function (x, y, z, tile) {
    if (tile == 0) {
        var mat = Math.random() > 0.5 ? grassMaterial : floorMaterial;
        var box = BABYLON.MeshBuilder.CreateBox(`tile up ${y}:${x}:${z}`, { width: 2, height: 0.2, depth: 2 }, scene);
        box.material = mat;
        box.position.y = y * 2;
        box.position.x = x;
        box.position.z = z;
        box.increaseFacets(3);

        // var box1 = BABYLON.MeshBuilder.CreateGround(`tile up ${y}:${x}:${z}`, {width: 2, height: 2, subdivisions: 4}, scene);
        // box1.material = mat;
        // box1.position.y = y * 2 + 0.1;
        // box1.position.x = x;
        // box1.position.z = z;

        // var box2 = BABYLON.MeshBuilder.CreateGround(`tile down ${y}:${x}:${z}`, {width: 2, height: 2, subdivisions: 4}, scene);
        // box2.material = mat;
        // box2.rotation.x = Math.PI;
        // box2.position.y = y * 2 - 0.1;
        // box2.position.x = x;
        // box2.position.z = z;

        return [box];
    } else if (tile == 1) {
        var box = BABYLON.MeshBuilder.CreateBox(`wall hor ${y}:${x}:${z}`, { width: 0.2, height: 2, depth: 2 }, scene);
        box.material = wallMaterial;
        box.position.y = y * 2 + 1;
        box.position.x = x;
        box.position.z = z;
        box.increaseFacets(3);

        // var box1 = BABYLON.MeshBuilder.CreateGround(`tile left ${y}:${x}:${z}`, {width: 2, height: 2, subdivisions: 4}, scene);
        // box1.material = wallMaterial;
        // box1.rotation.z = Math.PI / 2;
        // box1.position.y = y * 2 + 1;
        // box1.position.x = x - 0.1;
        // box1.position.z = z;

        // var box2 = BABYLON.MeshBuilder.CreateGround(`tile right ${y}:${x}:${z}`, {width: 2, height: 2, subdivisions: 4}, scene);
        // box2.material = wallMaterial;
        // box2.rotation.z = -Math.PI / 2;
        // box2.position.y = y * 2 + 1;
        // box2.position.x = x + 0.1;
        // box2.position.z = z;

        return [box];
    } else if (tile == 2) {
        var box = BABYLON.MeshBuilder.CreateBox(`wall vert ${y}:${x}:${z}`, { width: 2, height: 2, depth: 0.2 }, scene);
        box.material = wallMaterial;
        box.position.y = y * 2 + 1;
        box.position.x = x;
        box.position.z = z;
        box.increaseFacets(3);

        // var box1 = BABYLON.MeshBuilder.CreateGround(`tile forward ${y}:${x}:${z}`, {width: 2, height: 2, subdivisions: 4}, scene);
        // box1.material = wallMaterial;
        // box1.rotation.x = Math.PI / 2;
        // box1.position.y = y * 2 + 1;
        // box1.position.x = x;
        // box1.position.z = z + 0.1;

        // var box2 = BABYLON.MeshBuilder.CreateGround(`tile back ${y}:${x}:${z}`, {width: 2, height: 2, subdivisions: 4}, scene);
        // box2.material = wallMaterial;
        // box2.rotation.x = -Math.PI / 2;
        // box2.position.y = y * 2 + 1;
        // box2.position.x = x;
        // box2.position.z = z - 0.1;

        return [box];
    }
}

var distance = function (x1, y1, z1, x2, y2, z2) {
    return Math.abs(x2 - x1) + Math.abs(y2 - y1) + Math.abs(z2 - z1)
}

// Our built-in 'sphere' shape. Params: name, subdivs, size, scene
// var sphere = Mesh.CreateSphere("sphere1", 16, 2, scene);
var grid = new Array(height * size * size);
grid.fill(0, 0, grid.length);

var probelight = BABYLON.MeshBuilder.CreateSphere("box", { diameter: 0.2 }, scene);
probelight.isVisible = false;

// Set Tiles
for (var y = 0; y < height - 1; y++) {
    for (var x = 1; x < size / 2 - 1; x++) {
        for (var z = 1; z < size / 2 - 1; z++) {
            if (Math.random() * y * y > 1) continue;
            grid[y * size * size + (z * 2 + 1) * size + (x * 2 + 1)] = 1;
            if (Math.random() > 0.9) grid[y * size * size + (z * 2 + 1) * size + (x * 2)] = 1;
            if (Math.random() > 0.9) grid[y * size * size + (z * 2) * size + (x * 2 + 1)] = 1;
        }
    }
}

var light = new Uint8Array(size * 2 * size * 2 * height * 4);
light.fill(1, 0, light.length);

var torch = new Uint8Array(size * 2 * size * 2 * height * 4);
torch.fill(1, 0, torch.length);

var merge = [];

// Create Object
for (var i = 0; i < grid.length; i++) {
    if (grid[i] === 0) continue;
    var y = Math.floor(i / (size * size));
    var z = Math.floor(i / size) % size;
    var x = i % size;
    var batchId = posToBash(x, y, z);

    if (x % 2 == 1 && z % 2 == 1) {
        var meshes = buildBox(x, y, z, 0);
        if (!merge[batchId]) merge[batchId] = [];
        merge[batchId].push(...meshes);

        for (var a = 0; a < 5; a++) {
            for (var b = 0; b < 5; b++) {
                var iY = y * 4 * size * 2 * size * 2;
                var iZ = ((z - 1) * 2 + a) * size * 2;
                var iX = (x - 1) * 2 + b;
                if (iZ >= size * 2 * size * 2) continue;
                if (iX >= size * 2) continue;
                var index = iY + iZ + iX;
                light[index] = 0;
                torch[index] = 0;
            }
        }
    } else if (x % 2 == 0 && z % 2 == 1) {
        var meshes = buildBox(x, y, z, 1);
        if (!merge[batchId]) merge[batchId] = [];
        merge[batchId].push(...meshes);

        for (var a = 0; a < 4; a++) {
            for (var b = 0; b < 5; b++) {
                var iY = (y * 4 + a) * size * 2 * size * 2;
                var iZ = ((z - 1) * 2 + b) * size * 2;
                var iX = x * 2;
                var index = iY + iZ + iX;
                light[index] = 0;
                torch[index] = 0;
            }
        }
    } else if (x % 2 == 1 && z % 2 == 0) {
        var meshes = buildBox(x, y, z, 2);
        if (!merge[batchId]) merge[batchId] = [];
        merge[batchId].push(...meshes);

        for (var a = 0; a < 4; a++) {
            for (var b = 0; b < 5; b++) {
                var iY = (y * 4 + a) * size * 2 * size * 2;
                var iZ = (z * 2) * size * 2;
                var iX = (x - 1) * 2 + b;
                var index = iY + iZ + iX;
                light[index] = 0;
                torch[index] = 0;
            }
        }
    }
}

// for (var i = 0; i < light.length; i++) {
//     var {x, y, z} = indexToPos(i);

//     // if (light[i] != 0) continue;
//     var p1 = BABYLON.MeshBuilder.CreateSphere("p", {diameter: 0.1}, scene);
//     // console.log(i, x, y, z);
//     p1.position.x = x / 2;
//     p1.position.y = y / 2;
//     p1.position.z = z / 2;
// }

// init directional environment light
for (var i = 0; i < light.length; i++) {
    var { x, y, z } = indexToPos(i);

    if (light[i] != 0) {
        if (y === height * 4 - 1) {
            light[i] = 255;
        } else if (x === 0 || x === size * 2 - 1) {
            light[i] = 255;
        } else if (z === 0 || z === size * 2 - 1) {
            light[i] = 255;
        }
    }

    if (x === size && z === size && y > 0 && y < 4) {
        torch[i] = 255;
        var p1 = BABYLON.MeshBuilder.CreateSphere("p", { diameter: 1 }, scene);
        p1.position.x = x / 2;
        p1.position.y = y / 2;
        p1.position.z = z / 2;
    }
}

// directional environment light
for (var i = 0; i < light.length; i++) {
    if (light[i] != 255) continue;
    var { x, y, z } = indexToPos(i);
    var orgX = x;
    var orgY = y;
    var orgZ = z;
    while (true) {
        // x += 0.25;
        y -= 1;
        // z += 0.5;
        var newIndex = posToIndex(Math.ceil(x), y, Math.ceil(z))
        if (newIndex === -1 || light[newIndex] === 0) {
            break;
        }
        light[newIndex] = 254;
    }
}

// light diffusion
for (var data of [light, torch]) {
    for (var n = 0; n < 32; n++) {
        for (var i = 0; i < data.length; i++) {
            if (data[i] === 0 || data[i] > 250) continue;
            var { x, y, z } = indexToPos(i);

            var values = [];
            for (var diff of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]]) {
                var newIndex = posToIndex(x + diff[0], y, z + diff[1])
                if (newIndex != -1) {
                    values.push(data[newIndex]);
                }
            }
            var val = Math.round(Math.max(...values) / 1.3);
            if (val > data[i]) {
                data[i] = val;
            }
        }
    }
}

var showTorch = true;

// Set vertex color
for (var id in merge) {
    if (!merge[id]) continue;
    var group = {};
    for (var entry of merge[id]) {
        if (!group[entry.material.name]) group[entry.material.name] = [];
        group[entry.material.name].push(entry);
    }

    for (var mat in group) {
        var box = BABYLON.Mesh.MergeMeshes(group[mat], true);
        generatedMeshes.push(box);
    }
}
updateVertexColor(showTorch);

var testSprite = BABYLON.MeshBuilder.CreatePlane("", { size: 2 }, scene);
testSprite.material = new BABYLON.StandardMaterial("", scene);
testSprite.material.diffuseTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/palm.png", scene);
testSprite.material.specularColor = new BABYLON.Color3(1, 1, 1);
testSprite.material.diffuseTexture.hasAlpha = true;
testSprite.material.backFaceCulling = false;
testSprite.billboardMode = 2;

var testSpriteBush = BABYLON.MeshBuilder.CreatePlane("", { size: 1 }, scene);
testSpriteBush.material = new BABYLON.StandardMaterial("", scene);
testSpriteBush.material.diffuseTexture = new BABYLON.Texture("https://i.ibb.co/fkppPk8/bush-1.png", scene);
testSpriteBush.material.specularColor = new BABYLON.Color3(1, 1, 1);
testSpriteBush.material.diffuseTexture.hasAlpha = true;
testSpriteBush.material.backFaceCulling = false;
testSpriteBush.billboardMode = 2;

for (var i = 0; i < 256; i++) {
    var sprite = testSprite.createInstance("stuff");
    sprite.position.x = Math.random() * size;
    sprite.position.y = Math.random() > 0.5 ? 3 : 1;
    sprite.position.z = Math.random() * size;
    var index = posToIndex(Math.round(sprite.position.x * 2), Math.round(sprite.position.y * 2), Math.round(sprite.position.z * 2));
    if (index != -1) {
        sprite.color = new BABYLON.Color4(light[index] / 255, light[index] / 255, light[index] / 255, 1);
    }
}

for (var i = 0; i < 256; i++) {
    var sprite = testSpriteBush.createInstance("stuff");
    sprite.position.x = Math.random() * size;
    sprite.position.y = 2.6;
    sprite.position.z = Math.random() * size;
    var index = posToIndex(Math.round(sprite.position.x * 2), Math.round(sprite.position.y * 2), Math.round(sprite.position.z * 2));
    if (index != -1) {
        sprite.color = new BABYLON.Color4(light[index] / 255, light[index] / 255, light[index] / 255, 1);
    }
}

document.addEventListener('keypress', (e) => {
    if (e.code === "Space") {
        console.log(e);
        showTorch = !showTorch;
        updateVertexColor(showTorch);
    }
});

// Render every frame
engine.runRenderLoop(() => {
    scene.render();
});


// window.addEventListener('load', function() {
//     const gpu = new GPU();
//     const multiplyMatrix = gpu.createKernel(function(a, b) {
//         let sum = 0;
//         for (let i = 0; i < 512; i++) {
//             sum += a[this.thread.y][i] * b[i][this.thread.x];
//         }
//         return sum;
//     }).setOutput([512, 512]);

//     const c = multiplyMatrix(a, b);
// })

// scene.debugLayer.show();